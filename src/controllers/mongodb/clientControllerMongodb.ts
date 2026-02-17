
import { Request, Response, NextFunction } from 'express'
import Router from 'express'
import mongoose from 'mongoose'

import { ApiError } from '../../errors/ApiError'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminOnly } from '../../middleware/adminOnly'
import { ClientInterface } from '../../interfaces/mongodb/clientInterfaceMongodb'
import { ClientModelMongodb } from '../../models/mongodb/clientModelMongodb'
import { ClientServiceMongodb } from '../../services/mongodb/clientServiceMongodb'
import { ClientValidator } from '../../validators/clientValidator'
import { CommonValidators } from "../../validators/commonValidators"
import { OptionYesNo } from '../../enums/optionYesNo'
import { BookingModelMongodb } from '../../models/mongodb/bookingModelMongodb'


export const clientRouterMongodb = Router()
const clientServiceMongodb = new ClientServiceMongodb()

clientRouterMongodb.use(authMiddleware)


/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         publish_date:
 *           type: string
 *           format: date-time
 *         full_name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone_number:
 *           type: string
 *         comment:
 *           type: string
 *         archived:
 *           type: boolean
 * 
 * /api-dashboard/v3/clients:
 *   get:
 *     summary: Obtener todos los clientos
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Lista de clientos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 * 
 *   post:
 *     summary: Crear un nuevo cliento
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       201:
 *         description: Cliento creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *
 * /api-dashboard/v3/clients/{id}:
 *   get:
 *     summary: Obtener un cliento por su ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliento (Mongodb ObjectId)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Cliento no encontrado
 *
 *   put:
 *     summary: Actualizar un cliento existente
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliento (Mongodb ObjectId)
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Cliento actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Cliento no encontrado
 * 
 *   delete:
 *     summary: Eliminar un cliento por su ID
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del cliento (Mongodb ObjectId)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliento eliminado exitosamente
 *       404:
 *         description: Cliento no encontrado
 */

clientRouterMongodb.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await clientServiceMongodb.fetchAll()
        res.json(response)
    }
    catch (error) {
        return next(error)
    }
})

clientRouterMongodb.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clientId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            throw new ApiError(400, 'Invalid id format')
        }

        const response = await clientServiceMongodb.fetchById(clientId)
        if (response === null) {
            throw new ApiError(404, `Client #${clientId} not found`)
        }

        res.json(response)
    }
    catch (error) {
        return next(error)
    }
})

clientRouterMongodb.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clientToValidate: ClientInterface = {
            full_name: req.body.full_name.trim(),
            email: req.body.email.trim().toLowerCase(),
            phone_number: req.body.phone_number.trim(),
            isArchived: OptionYesNo.no,
            booking_id_list: []
        }
        const clientValidator = new ClientValidator()
        const totalErrors = clientValidator.validateNewClient(clientToValidate)
        if (totalErrors.length > 0) {
            throw new ApiError(400, totalErrors.join(', '))
        }

        const response = await clientServiceMongodb.create(clientToValidate)
        if (!response) {
            throw new ApiError(500, 'Error creating Client')
        }

        res.status(201).json(response)
    }
    catch (error) {
        return next(error)
    }
})

clientRouterMongodb.put('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const clientId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            throw new ApiError(400, 'Invalid id format')
        }

        const existingClient = await ClientModelMongodb.findById(clientId).select('password')
        if (!existingClient) {
            throw new ApiError(404, `Client #${clientId} not found`)
        }

        const clientToValidate: ClientInterface = {
            full_name: req.body.full_name.trim(),
            email: req.body.email.trim().toLowerCase(),
            phone_number: req.body.phone_number.trim(),
            isArchived: existingClient.isArchived,
            booking_id_list: req.body.booking_id_list
        }
        const clientValidator = new ClientValidator()
        const totalErrors = clientValidator.validateExistingClient(clientToValidate)
        if (totalErrors.length > 0) {
            throw new ApiError(400, totalErrors.join(', '))
        }

        // Validamos la existencia en BD de las bookings asociadas al cliente:
        const bookingIds = clientToValidate.booking_id_list.map(id => id.toString())
        const existingBookings = await BookingModelMongodb.find({ _id: { $in: bookingIds } }).select('_id').lean()
        if (existingBookings.length !== bookingIds.length) {
            const foundIds = existingBookings.map(booking => booking._id.toString())
            const missingIds = bookingIds.filter(id => !foundIds.includes(id))
            throw new ApiError(404, `Bookings not found: ${missingIds.join(', ')}`)
        }

        const response = await clientServiceMongodb.update(clientId, clientToValidate)
        if (!response.clientUpdated) {
            throw new ApiError(404, `Client #${clientId} not found`)
        }

        res.status(200).json(response)
    }
    catch (error) {
        return next(error)
    }
})

clientRouterMongodb.patch('/archive/:id', adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const clientId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            throw new ApiError(400, 'Invalid id format')
        }

        const newArchivedValue = req.body.isArchived
        const commonValidator = new CommonValidators()
        const totalErrorsArchived = commonValidator.validateArchivedOption(newArchivedValue)
        if (totalErrorsArchived.length > 0) {
            throw new ApiError(400, totalErrorsArchived.join(', '))
        }

        const response = await clientServiceMongodb.archive(clientId, newArchivedValue)
        if (!response) {
            throw new ApiError(404, `Client #${clientId} not found`)
        }

        res.status(200).json(response)
    }
    catch (error) {
        return next(error)
    }
})

clientRouterMongodb.delete('/:id', adminOnly, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const clientId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(clientId)) {
            throw new ApiError(400, 'Invalid id format')
        }

        const response = await clientServiceMongodb.delete(clientId)
        if (!response) {
            throw new ApiError(404, `Client #${clientId} not found`)
        }

        res.status(200).json(response)
    }
    catch (error) {
        return next(error)
    }
})