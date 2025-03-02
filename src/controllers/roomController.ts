
import { Request, Response } from 'express'
import Router from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { RoomService } from '../services/roomService'
import { BookingService } from '../services/bookingService'
import { RoomValidator } from '../validators/roomValidator'
import { BookingInterface } from '../interfaces/bookingInterface'
import { RoomInterfaceWithBookingData } from '../interfaces/roomInterface'


export const roomRouter = Router()
const roomService = new RoomService()
const bookingService = new BookingService()

roomRouter.use(authMiddleware)

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
 * /api-dashboard/v2/rooms:
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
 * /api-dashboard/v2/rooms/{id}:
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

roomRouter.get('/', async (req: Request, res: Response) => {
    try {
        const roomList = await roomService.fetchAll()
        const roomListWithBookingsData: RoomInterfaceWithBookingData[] = []

        for (const room of roomList) {
            const bookings: BookingInterface[] = []
            for (const bookingID of room.booking_list) {
                const booking = await bookingService.fetchById(bookingID)
                if (booking === null) {
                    res.status(404).json({ message: `Booking #${bookingID} not found` })
                    return
                }
                bookings.push(booking)
            }
            roomListWithBookingsData.push({ ...room.toObject(), booking_data_list: bookings })
        }

        res.json(roomListWithBookingsData)
    }
    catch (error) {
        console.error("Error in get (all) of roomController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

roomRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const room = await roomService.fetchById(req.params.id)
        if (room === null) {
            res.status(404).json({ message: `Room #${req.params.id} not found` })
            return
        }

        const bookings: BookingInterface[] = []
        for (const bookingID of room.booking_list) {
            const booking = await bookingService.fetchById(bookingID)
            if (booking === null) {
                res.status(404).json({ message: `Booking #${bookingID} not found` })
                return
            }
            bookings.push(booking)
        }

        const roomWithBookingData: RoomInterfaceWithBookingData = { ...room.toObject(), booking_data_list: bookings }
        res.json(roomWithBookingData)
    }
    catch (error) {
        console.error("Error in get (by id) of roomController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

roomRouter.post('/', async (req: Request, res: Response) => {
    const allRooms = await roomService.fetchAll()
    const roomValidator = new RoomValidator()
    const newRoom = { ...req.body, booking_list: [] }
    const totalErrors = roomValidator.validateNewRoom(newRoom, allRooms)

    if (totalErrors.length === 0) {
        try {
            const roomToCreate = await roomService.create(newRoom)
            res.status(201).json(roomToCreate)
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

roomRouter.put('/:id', async (req: Request, res: Response) => {
    const roomValidator = new RoomValidator()
    const allRooms = await roomService.fetchAll()
    const allBookings = await bookingService.fetchAll()
    const totalErrors = roomValidator.validateExistingRoom(req.body, allRooms, allBookings)

    if (totalErrors.length === 0) {
        try {
            const updatedRoom = await roomService.update(req.params.id, req.body)
            if (updatedRoom === null) {
                res.status(404).json({ message: `Room #${req.params.id} not found (cant be updated)` })
                return
            }

            res.status(200).json(updatedRoom)
        }
        catch (error) {
            console.error("Error in put of roomController:", error)
            res.status(500).json({ message: "Internal server error" })
        }
    }
    else {
        res.status(400).json({ message: totalErrors.join(', ') })
    }
})

roomRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const roomToDelete = await roomService.fetchById(req.params.id)

        if (roomToDelete === null) {
            res.status(404).json({ message: `Room #${req.params.id} not found` })
            return
        }

        const bookingsToDelete: BookingInterface[] = []
        for (const bookingId of roomToDelete.booking_list) {
            const booking = await bookingService.fetchById(bookingId)
            if (booking === null) {
                res.status(404).json({ message: `Booking #${bookingId} not found` })
                return
            }
            bookingsToDelete.push(booking)
        }

        for (const booking of bookingsToDelete) {
            await bookingService.delete(booking._id)
        }
        await roomService.delete(roomToDelete._id)
        res.status(204).json()

    }
    catch (error) {
        console.error("Error in delete of roomController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})