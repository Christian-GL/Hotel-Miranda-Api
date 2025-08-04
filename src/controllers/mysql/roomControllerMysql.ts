
import { Request, Response } from 'express'
import Router from 'express'
import { authMiddleware } from '../../middleware/authMiddleware'
import { RoomServiceMysql } from '../../services/mysql/roomServiceMysql'
import { BookingServiceMysql } from '../../services/mysql/bookingServiceMysql'
import { RoomValidator } from '../../validators/roomValidator'
import { BookingInterfaceMysql } from '../../interfaces/mysql/bookingInterfaceMysql'
import { RoomInterfaceMysqlWithBookingData } from '../../interfaces/mysql/roomInterfaceMysql'


export const roomRouterMysql = Router()
const roomServiceMysql = new RoomServiceMysql()
const bookingServiceMysql = new BookingServiceMysql()

roomRouterMysql.use(authMiddleware)

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

roomRouterMysql.get('/', async (req: Request, res: Response) => {
    try {
        const roomList = await roomServiceMysql.fetchAll()

        const roomListWithBookingsData: RoomInterfaceMysqlWithBookingData[] = await Promise.all(
            roomList.map(async (room) => {
                const bookings: BookingInterfaceMysql[] = await bookingServiceMysql.fetchAllByRoomId(room._id)
                return { ...room, booking_data_list: bookings }
            })
        )

        res.json(roomListWithBookingsData)
    }
    catch (error) {
        console.error("Error in get (all) of roomController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

roomRouterMysql.get('/:id', async (req: Request, res: Response) => {
    try {
        const room = await roomServiceMysql.fetchById(parseInt(req.params.id))
        if (room === null) {
            res.status(404).json({ message: `Room #${req.params.id} not found` })
            return
        }

        const bookings: BookingInterfaceMysql[] = await bookingServiceMysql.fetchAllByRoomId(room._id)
        const roomWithBookingData: RoomInterfaceMysqlWithBookingData = { ...room, booking_data_list: bookings }

        res.json(roomWithBookingData)
    }
    catch (error) {
        console.error("Error in get (by id) of roomController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

roomRouterMysql.post('/', async (req: Request, res: Response) => {
    const allRooms = await roomServiceMysql.fetchAll()
    const roomValidator = new RoomValidator()
    const newRoom = { ...req.body, booking_list: [] }
    const totalErrors = roomValidator.validateRoom(newRoom, allRooms)

    if (totalErrors.length === 0) {
        try {
            const roomToCreate = await roomServiceMysql.create(newRoom)
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

roomRouterMysql.put('/:id', async (req: Request, res: Response) => {
    const roomValidator = new RoomValidator()
    const allRooms = await roomServiceMysql.fetchAll()
    const allBookings = await bookingServiceMysql.fetchAll()
    const totalErrors = roomValidator.validateExistingRoom(req.body, allRooms, allBookings)

    if (totalErrors.length === 0) {
        try {
            const updatedRoom = await roomServiceMysql.update(parseInt(req.params.id), req.body)
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

roomRouterMysql.delete('/:id', async (req: Request, res: Response) => {
    try {
        const roomToDelete = await roomServiceMysql.fetchById(parseInt(req.params.id))
        if (roomToDelete === null) {
            res.status(404).json({ message: `Room #${req.params.id} not found` })
            return
        }
        const bookingsToDelete = await bookingServiceMysql.fetchAllByRoomId(roomToDelete._id)
        
        await roomServiceMysql.delete(roomToDelete._id)
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