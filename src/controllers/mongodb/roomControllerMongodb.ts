
import { Request, Response } from 'express'
import Router from 'express'
import mongoose from 'mongoose'
import { BookingModelMongodb } from '../../models/mongodb/bookingModelMongodb'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminOnly } from '../../middleware/adminOnly'
import { RoomServiceMongodb } from '../../services/mongodb/roomServiceMongodb'
import { RoomValidator } from '../../validators/roomValidator'
import { RoomInterfaceDTO } from '../../interfaces/mongodb/roomInterfaceMongodb'
import { OptionYesNo } from '../../enums/optionYesNo'
import { BookingServiceMongodb } from '../../services/mongodb/bookingServiceMongodb'


export const roomRouterMongodb = Router()
const roomServiceMongodb = new RoomServiceMongodb()
const bookingServiceMongodb = new BookingServiceMongodb()

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

    const allRoomNumbers = await roomServiceMongodb.fetchAllNumbersNotArchived()
    const roomToValidate: RoomInterfaceDTO = {
        photos: req.body.photos,
        number: req.body.number.trim().toLowerCase(),
        type: req.body.type.trim(),
        amenities: req.body.amenities,
        price: req.body.price,
        discount: req.body.discount,
        isActive: req.body.isActive.trim(),
        isArchived: OptionYesNo.no,
        booking_id_list: []
    }
    const roomValidator = new RoomValidator()
    const totalErrors = roomValidator.validateNewRoom(roomToValidate, allRoomNumbers)
    if (totalErrors.length === 0) {
        try {
            const newRoom = await roomServiceMongodb.create(roomToValidate)
            res.status(201).json(newRoom)
        }
        catch (error) {
            console.error("Error in post of roomController:", error)
            res.status(500).json({ message: "Internal server error" })
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
        const allRoomNumbers = await roomServiceMongodb.fetchAllNumbersNotArchived()
        const actualRoomNumber = req.body.number.trim().toLowerCase()
        const roomToValidate: RoomInterfaceDTO = {
            photos: req.body.photos,
            number: actualRoomNumber,
            type: req.body.type.trim(),
            amenities: req.body.amenities,
            price: req.body.price,
            discount: req.body.discount,
            isActive: req.body.isActive.trim(),
            isArchived: req.body.isArchived.trim(),
            booking_id_list: req.body.booking_id_list
        }
        const roomValidator = new RoomValidator()
        const totalErrors = roomValidator.validateExistingRoom(roomToValidate, actualRoomNumber, allRoomNumbers)
        if (totalErrors.length > 0) {
            res.status(400).json({ message: totalErrors.join(', ') })
            return
        }

        // BOOKING asociadas a la room validaciones
        const bookingIDs: string[] = Array.from(new Set(roomToValidate.booking_id_list ?? []))
        const invalidFormatIDs = bookingIDs.filter(id => !mongoose.Types.ObjectId.isValid(String(id)))
        if (invalidFormatIDs.length > 0) {
            res.status(400).json({ message: `Invalid booking ID format: ${invalidFormatIDs.join(', ')}` })
            return
        }
        if (bookingIDs.length > 0) {
            const foundBookings = await BookingModelMongodb.find({ _id: { $in: bookingIDs } }, { _id: 1 }).lean()
            const foundSet = new Set(foundBookings.map((booking: any) => String(booking._id)))
            const missing = bookingIDs.filter(id => !foundSet.has(id))
            if (missing.length > 0) {
                res.status(400).json({ message: `Some booking IDs do not exist: ${missing.join(', ')}` })
                return
            }
        }

        // Si tanto la ROOM como sus BOOKINGS existen y pasan validaciones hacemos las actualizaciones correspondientes en BD
        try {
            const finalRoom = await roomServiceMongodb.updateRoomAndArchiveBookings(roomID, roomToValidate, bookingIDs)
            if (!finalRoom) {
                res.status(404).json({ message: `Room #${roomID} not found` })
                return
            }
            res.status(200).json(finalRoom)
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

roomRouterMongodb.delete('/:id', adminOnly, async (req: Request, res: Response) => {
    try {
        const deletedRoom = await roomServiceMongodb.delete(req.params.id)
        if (deletedRoom) {
            res.status(204).json()
            // --> 
        }
        else {
            res.status(404).json({ message: `Room #${req.params.id} not found` })
        }
    }
    catch (error) {
        console.error("Error in delete of roomController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})
