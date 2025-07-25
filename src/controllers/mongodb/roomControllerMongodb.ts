
import { Request, Response } from 'express'
import Router from 'express'
import { authMiddleware } from '../../middleware/authMiddleware'
import { RoomServiceMongodb } from '../../services/mongodb/roomServiceMongodb'
import { BookingServiceMongodb } from '../../services/mongodb/bookingServiceMongodb'
import { RoomValidator } from '../../validators/roomValidator'
import { BookingInterfaceMongodb } from '../../interfaces/mongodb/bookingInterfaceMongodbts'
import { RoomInterfaceMongodbWithBookingData } from '../../interfaces/mongodb/roomInterfaceMongodb'


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

roomRouterMongodb.get('/', async (req: Request, res: Response) => {
    try {
        const roomList = await roomServiceMongodb.fetchAll()
        const roomListWithBookingsData: RoomInterfaceMongodbWithBookingData[] = []

        for (const room of roomList) {
            const bookings: BookingInterfaceMongodb[] = []
            for (const bookingID of room.booking_id_list) {
                const booking = await bookingServiceMongodb.fetchById(bookingID)
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

roomRouterMongodb.get('/:id', async (req: Request, res: Response) => {
    try {
        const room = await roomServiceMongodb.fetchById(req.params.id)
        if (room === null) {
            res.status(404).json({ message: `Room #${req.params.id} not found` })
            return
        }

        const bookings: BookingInterfaceMongodb[] = []
        for (const bookingID of room.booking_id_list) {
            const booking = await bookingServiceMongodb.fetchById(bookingID)
            if (booking === null) {
                res.status(404).json({ message: `Booking #${bookingID} not found` })
                return
            }
            bookings.push(booking)
        }

        const roomWithBookingData: RoomInterfaceMongodbWithBookingData = { ...room.toObject(), booking_data_list: bookings }
        res.json(roomWithBookingData)
    }
    catch (error) {
        console.error("Error in get (by id) of roomController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

roomRouterMongodb.post('/', async (req: Request, res: Response) => {
    const allRooms = await roomServiceMongodb.fetchAll()
    const roomValidator = new RoomValidator()
    const newRoom = { ...req.body, booking_list: [] }
    const totalErrors = roomValidator.validateNewRoom(newRoom, allRooms)

    if (totalErrors.length === 0) {
        try {
            const roomToCreate = await roomServiceMongodb.create(newRoom)
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

roomRouterMongodb.put('/:id', async (req: Request, res: Response) => {
    const roomValidator = new RoomValidator()
    const allRooms = await roomServiceMongodb.fetchAll()
    const allBookings = await bookingServiceMongodb.fetchAll()
    const totalErrors = roomValidator.validateExistingRoom(req.body, allRooms, allBookings)

    if (totalErrors.length === 0) {
        try {
            const updatedRoom = await roomServiceMongodb.update(req.params.id, req.body)
            if (updatedRoom === null) {
                res.status(404).json({ message: `Room #${req.params.id} not found (cant be updated)` })
                return
            }

            const bookingDataList = []
            for (const bookingID of updatedRoom.booking_id_list) {
                const bookingData = await bookingServiceMongodb.fetchById(bookingID)
                if (bookingData === null) {
                    res.status(404).json({ message: `Booking #${bookingID} not found` })
                    return
                }
                bookingDataList.push(bookingData)
            }

            const roomToReturn: RoomInterfaceMongodbWithBookingData = { ...updatedRoom.toObject(), booking_data_list: bookingDataList }
            res.status(200).json(roomToReturn)
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

roomRouterMongodb.delete('/:id', async (req: Request, res: Response) => {
    try {
        const roomToDelete = await roomServiceMongodb.fetchById(req.params.id)

        if (roomToDelete === null) {
            res.status(404).json({ message: `Room #${req.params.id} not found` })
            return
        }

        const bookingsToDelete: BookingInterfaceMongodb[] = []
        for (const bookingId of roomToDelete.booking_id_list) {
            const booking = await bookingServiceMongodb.fetchById(bookingId)
            if (booking === null) {
                res.status(404).json({ message: `Booking #${bookingId} not found` })
                return
            }
            bookingsToDelete.push(booking)
        }

        for (const booking of bookingsToDelete) {
            await bookingServiceMongodb.delete(booking._id)
        }
        await roomServiceMongodb.delete(roomToDelete._id)
        res.status(200).json({
            roomId: roomToDelete._id,
            bookingsToDelete: bookingsToDelete.map(booking => booking._id)
        })

    }
    catch (error) {
        console.error("Error in delete of roomController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})
