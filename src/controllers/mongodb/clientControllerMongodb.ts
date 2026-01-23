
import { Request, Response } from 'express'
import Router from 'express'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminOnly } from '../../middleware/adminOnly'
import { ClientInterfaceDTO } from '../../interfaces/mongodb/clientInterfaceMongodb'
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

clientRouterMongodb.get('/', async (req: Request, res: Response) => {
    try {
        const clientList = await clientServiceMongodb.fetchAll()
        res.json(clientList)
    }
    catch (error) {
        console.error("Error in get (all) of clientController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

clientRouterMongodb.get('/:id', async (req: Request, res: Response) => {
    try {
        const client = await clientServiceMongodb.fetchById(req.params.id)
        if (client !== null) {
            res.json(client)
        } else {
            res.status(404).json({ message: `Client #${req.params.id} not found` })
        }
    }
    catch (error) {
        console.error("Error in get (by id) of clientController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

clientRouterMongodb.post('/', async (req: Request, res: Response) => {

    const clientToValidate: ClientInterfaceDTO = {
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
            console.error("Error in post of clientController:", error)
            res.status(500).json({ message: "Internal server error" })
        }
    }
    else {
        res.status(400).json({
            message: totalErrors.join(', ')
        })
    }
})

clientRouterMongodb.put('/:id', async (req: Request, res: Response): Promise<void> => {

    const clientToValidate: ClientInterfaceDTO = {
        full_name: req.body.full_name.trim(),
        email: req.body.email.trim().toLowerCase(),
        phone_number: req.body.phone_number.trim(),
        isArchived: req.body.isArchived.trim(),
        booking_id_list: req.body.booking_id_list
    }

    try {
        const bookingList = await bookingServiceMongodb.fetchAll()
        const bookingIdList = bookingList.map(b => b._id.toString())

        const clientValidator = new ClientValidator()

        // 🔴 NO validar booking_id_list si el client se está DESARCHIVANDO
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
            res.status(400).json({ message: totalErrors.join(', ') })
            return
        }

        const allNewData =
            await clientServiceMongodb.updateAndArchiveBookingsIfNeeded(
                req.params.id,
                clientToValidate
            )

        if (!allNewData.clientUpdated) {
            res.status(404).json({ message: `Client #${req.params.id} not found` })
            return
        }

        res.status(200).json(allNewData)
        return
    }
    catch (error: any) {
        const msg = String(error?.message ?? '')
        if (
            msg.toLowerCase().includes('replica set')
            || msg.toLowerCase().includes('transactions')
            || msg.toLowerCase().includes('withtransaction')
        ) {
            res.status(500).json({
                message: `Transaction error: ${msg}. Ensure MongoDB supports transactions (replica set / Atlas).`
            })
            return
        }
        res.status(500).json({ message: 'Internal server error' })
        return
    }
})


clientRouterMongodb.delete('/:id', adminOnly, async (req: Request, res: Response): Promise<void> => {
    const clientId = req.params.id

    try {
        const allNewData = await clientServiceMongodb.deleteAndArchiveBookingsIfNeeded(clientId)
        if (!allNewData) {
            res.status(404).json({ message: `Client #${clientId} not found` })
            return
        }
        res.status(200).json(allNewData)
        return
    }
    catch (error: any) {
        const msg = String(error?.message ?? '')
        if (
            msg.toLowerCase().includes('replica set') ||
            msg.toLowerCase().includes('transactions') ||
            msg.toLowerCase().includes('withtransaction')
        ) {
            res.status(500).json({
                message: `Transaction error: ${msg}. Ensure MongoDB supports transactions (replica set / Atlas).`
            })
            return
        }
        res.status(500).json({
            message: error?.message ?? 'Internal server error'
        })
        return
    }
})
