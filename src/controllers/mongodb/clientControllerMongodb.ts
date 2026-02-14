
import { Request, Response, NextFunction } from 'express'
import Router from 'express'
import mongoose from 'mongoose'

import { ApiError } from '../../errors/ApiError'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminOnly } from '../../middleware/adminOnly'
import { ClientInterface } from '../../interfaces/mongodb/clientInterfaceMongodb'
import { ClientServiceMongodb } from '../../services/mongodb/clientServiceMongodb'
import { ClientValidator } from '../../validators/clientValidator'
import { BookingServiceMongodb } from '../../services/mongodb/bookingServiceMongodb'
import { OptionYesNo } from '../../enums/optionYesNo'


export const clientRouterMongodb = Router()
const clientServiceMongodb = new ClientServiceMongodb()
const bookingServiceMongodb = new BookingServiceMongodb()

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
        const clientList = await clientServiceMongodb.fetchAll()
        res.json(clientList)
    }
    catch (error) {
        next(error)
    }
})

clientRouterMongodb.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const client = await clientServiceMongodb.fetchById(req.params.id)
        if (client !== null) {
            res.json(client)
        }
        else {
            throw new ApiError(404, `Client #${req.params.id} not found`)
        }
    }
    catch (error) {
        next(error)
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
        if (totalErrors.length === 0) {
            try {
                const newClient = await clientServiceMongodb.create(clientToValidate)
                res.status(201).json(newClient)
            }
            catch (error) {
                next(error)
            }
        }
        else {
            throw new ApiError(400, totalErrors.join(', '))
        }
    }
    catch (error) {
        next(error)
    }
})

clientRouterMongodb.put('/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const clientToValidate: ClientInterface = {
            full_name: req.body.full_name.trim(),
            email: req.body.email.trim().toLowerCase(),
            phone_number: req.body.phone_number.trim(),
            isArchived: req.body.isArchived.trim(),
            booking_id_list: req.body.booking_id_list
        }
        const bookingList = await bookingServiceMongodb.fetchAll()
        const bookingIdList = bookingList.map(b => b._id.toString())
        const clientValidator = new ClientValidator()
        // NO validar booking_id_list si el client se está DESARCHIVANDO
        const totalErrors =
            req.body.isArchived === OptionYesNo.no
                ? clientValidator.validateExistingClient(
                    { ...clientToValidate, booking_id_list: [] },
                    bookingIdList
                )
                : clientValidator.validateExistingClient(
                    clientToValidate,
                    bookingIdList
                )

        if (totalErrors.length > 0) {
            throw new ApiError(400, totalErrors.join(', '))
        }
        const allNewData =
            await clientServiceMongodb.update(
                req.params.id,
                clientToValidate
            )
        if (!allNewData.clientUpdated) {
            throw new ApiError(404, `Client #${req.params.id} not found`)
        }

        res.status(200).json(allNewData)
    }
    catch (error) {
        next(error)
    }
})

clientRouterMongodb.delete('/:id', adminOnly, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const clientId = req.params.id
        const allNewData = await clientServiceMongodb.delete(clientId)
        if (!allNewData) {
            throw new ApiError(404, `Client #${clientId} not found`)
        }

        res.status(200).json(allNewData)
    }
    catch (error) {
        next(error)
    }
})