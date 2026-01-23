
import { Request, Response } from 'express'
import Router from 'express'
import mongoose from 'mongoose'
import { BookingModelMongodb } from '../../models/mongodb/bookingModelMongodb'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminOnly } from '../../middleware/adminOnly'
import { RoomServiceMongodb } from '../../services/mongodb/roomServiceMongodb'
import { RoomValidator } from '../../validators/roomValidator'
import { RoomInterface } from '../../interfaces/mongodb/roomInterfaceMongodb'
import { OptionYesNo } from '../../enums/optionYesNo'
import { RoomModelMongodb } from '../../models/mongodb/roomModelMongodb'


export const roomRouterMongodb = Router()
const roomServiceMongodb = new RoomServiceMongodb()

roomRouterMongodb.use(authMiddleware)

/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *         number:
 *           type: string
 *         type:
 *           type: string
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 *         price:
 *           type: number
 *           format: float
 *         discount:
 *           type: number
 *           format: float
 *         booking_list:
 *           type: array
 *           items:
 *             type: integer
 *
 * /api-dashboard/v3/rooms:
 *   get:
 *     summary: Obtener todas las habitaciones
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Lista de habitaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Room'
 *
 *   post:
 *     summary: Crear una nueva habitación
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: Habitación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Datos inválidos
 *
 * /api-dashboard/v3/rooms/{id}:
 *   get:
 *     summary: Obtener una habitación por ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la habitación
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la habitación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       404:
 *         description: Habitación no encontrada
 *
 *   put:
 *     summary: Actualizar una habitación existente
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la habitación
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       200:
 *         description: Habitación actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Habitación no encontrada
 *
 *   delete:
 *     summary: Eliminar una habitación por ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la habitación
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Habitación eliminada exitosamente
 *       404:
 *         description: Habitación no encontrada
 */

roomRouterMongodb.get('/', async (req: Request, res: Response) => {
    try {
        const roomList = await roomServiceMongodb.fetchAll()
        res.json(roomList)
    }
    catch (error) {
        console.error("Error in get (all) of roomController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

roomRouterMongodb.get('/:id', async (req: Request, res: Response) => {
    try {
        const room = await roomServiceMongodb.fetchById(req.params.id)
        if (room !== null) {
            res.json(room)
        } else {
            res.status(404).json({ message: `Room #${req.params.id} not found` })
        }
    }
    catch (error) {
        console.error("Error in get (by id) of roomController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

roomRouterMongodb.post('/', async (req: Request, res: Response) => {

    const allRoomNumbersNotArchived = await roomServiceMongodb.fetchAllNumbersNotArchived()
    const roomToValidate: RoomInterface = {
        photos: req.body.photos,
        number: req.body.number.trim(),
        type: req.body.type.trim(),
        amenities: req.body.amenities,
        price: req.body.price,
        discount: req.body.discount,
        isActive: req.body.isActive.trim(),
        isArchived: OptionYesNo.no,
        booking_id_list: []
    }
    const roomValidator = new RoomValidator()
    const totalErrors = roomValidator.validateNewRoom(roomToValidate, allRoomNumbersNotArchived)
    if (totalErrors.length === 0) {
        try {
            const newRoom = await roomServiceMongodb.create(roomToValidate)
            res.status(201).json(newRoom)
        }
        catch (error: any) {
            // KEY duplicada (propiedad number)
            if (error?.code === 11000) {
                res.status(409).json({
                    message: `Room number "${roomToValidate.number}" already exists`
                })
                return
            }
            console.error('Error in post of roomController:', error)
            res.status(500).json({
                message: 'Internal server error'
            })
        }
    }
    else {
        res.status(400).json({
            message: totalErrors.join(', ')
        })
    }
})

roomRouterMongodb.put('/:id', async (req: Request, res: Response) => {
    try {
        // ROOM validaciones
        const roomID = req.params.id
        const actualRoom = await roomServiceMongodb.fetchById(roomID)
        if (!actualRoom) {
            res.status(404).json({ message: `Room #${roomID} not found` })
            return
        }
        const allRoomNumbersNotArchived = await roomServiceMongodb.fetchAllNumbersNotArchived()
        const oldRoomNumber = actualRoom.number
        const newRoomNumber = req.body.number.trim().toLowerCase()
        const roomToUpdate: RoomInterface = {
            photos: req.body.photos,
            number: newRoomNumber,
            type: req.body.type.trim(),
            amenities: req.body.amenities,
            price: req.body.price,
            discount: req.body.discount,
            isActive: req.body.isActive.trim(),
            isArchived: req.body.isArchived.trim(),
            booking_id_list: req.body.booking_id_list
        }
        const roomValidator = new RoomValidator()
        const totalErrors = roomValidator.validateExistingRoom(roomToUpdate, oldRoomNumber, allRoomNumbersNotArchived)
        if (totalErrors.length > 0) {
            res.status(400).json({ message: totalErrors.join(', ') })
            return
        }
        const oldRoomId = await roomServiceMongodb.fetchIdByNumber(roomToUpdate.number)
        if (oldRoomId === null) return
        if (roomToUpdate.isArchived === OptionYesNo.no) {
            if (allRoomNumbersNotArchived.includes(roomToUpdate.number) && roomID !== oldRoomId) {
                res.status(400).json('A room with this number is already not archived')
                return
            }
        }
        if (roomToUpdate.isActive === OptionYesNo.yes) {
            const allRoomIdsActived = await roomServiceMongodb.fetchAllIdsActived()
            if (allRoomIdsActived.includes(roomID) && roomID !== oldRoomId) {
                res.status(400).json('A room with this ID is already active')
                return
            }
        }

        // BOOKINGS asociadas validación de su existencia en BD
        const bookingIds: string[] = Array.from(new Set(roomToUpdate.booking_id_list ?? []))
        const invalidFormatIds = bookingIds.filter(id => !mongoose.Types.ObjectId.isValid(String(id)))
        if (invalidFormatIds.length > 0) {
            res.status(400).json({ message: `Invalid booking ID format: ${invalidFormatIds.join(', ')}` })
            return
        }
        if (bookingIds.length > 0) {
            const foundBookings = await BookingModelMongodb.find({ _id: { $in: bookingIds } }, { _id: 1 }).lean()
            const foundSet = new Set(foundBookings.map((booking: any) => String(booking._id)))
            const missing = bookingIds.filter(id => !foundSet.has(id))
            if (missing.length > 0) {
                res.status(400).json({ message: `Some booking IDs do not exist: ${missing.join(', ')}` })
                return
            }
        }

        // Si tanto la ROOM como sus BOOKINGS existen y pasan validaciones hacemos las actualizaciones correspondientes en BD
        try {
            const allNewData = await roomServiceMongodb.updateAndArchiveBookingsAndClientsIfNeeded(roomID, roomToUpdate)
            if (!allNewData) {
                res.status(404).json({ message: `Room #${roomID} not found` })
                return
            }
            const { roomUpdated: room, updatedBookings, updatedClients } = allNewData
            res.status(200).json({
                roomUpdated: room,
                updatedBookings,
                updatedClients
            })
            return
        }
        catch (error: any) {
            const message = error?.message ?? 'Transaction failed'
            if (String(message).toLowerCase().includes('not found')) {
                res.status(404).json({ message })
                return
            }
            if (String(message).toLowerCase().includes('replica set') || String(message).toLowerCase().includes('transactions')) {
                res.status(500).json({ message: `Transaction error: ${message}. Ensure MongoDB supports transactions (replica set / Atlas).` })
                return
            }
            res.status(500).json({ message })
            return
        }
    }
    catch (error: any) {
        console.error('Error in put of roomController:', error)
        res.status(500).json({ message: (error && error.message) ? error.message : 'Internal server error' })
        return
    }
})

roomRouterMongodb.delete('/:id', adminOnly, async (req: Request, res: Response): Promise<void> => {
    const roomId = req.params.id
    try {
        const allNewData = await roomServiceMongodb.deleteAndArchiveBookingsAndClientsIfNeeded(roomId)
        if (!allNewData) {
            res.status(404).json({ message: `Room #${roomId} not found` })
            return
        }
        res.status(200).json(allNewData)
        return
    }
    catch (error: any) {
        const msg = String(error?.message ?? '')
        if (msg.toLowerCase().includes('replica set') || msg.toLowerCase().includes('transactions') || msg.toLowerCase().includes('withtransaction')) {
            res.status(500).json({
                message: `Transaction error: ${msg}. Ensure MongoDB supports transactions (replica set / Atlas).`
            })
            return
        }
        console.error('Error in delete of roomController:', error)
        res.status(500).json({ message: (error && error.message) ? error.message : 'Internal server error' })
        return
    }
})