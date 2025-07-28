
import { Request, Response } from 'express'
import Router from 'express'
import { authMiddleware } from '../../middleware/authMiddleware'
import { BookingServiceMysql } from '../../services/mysql/bookingServiceMysql'
import { RoomServiceMysql } from '../../services/mysql/roomServiceMysql'
import { BookingValidator } from '../../validators/bookingValidator'
import { RoomInterfaceMysql } from '../../interfaces/mysql/roomInterfaceMysql'
import { BookingInterfaceMysqlWithRoomData } from '../../interfaces/mysql/bookingInterfaceMysql'


export const bookingRouterMysql = Router()
const bookingServiceMysql = new BookingServiceMysql()
const roomServiceMysql = new RoomServiceMysql()

bookingRouterMysql.use(authMiddleware)

/**
 * @swagger
 * components:
 *   schemas:
 *     Booking:
 *       type: object
 *       properties:
 *         photo:
 *           type: string
 *         full_name_guest:
 *           type: string
 *         order_date:
 *           type: string
 *           format: date
 *         check_in_date:
 *           type: string
 *           format: date
 *         check_out_date:
 *           type: string
 *           format: date
 *         room:
 *           type: string
 *           description: ID de la habitación asociada
 *         booking_status:
 *           type: string
 *         special_request:
 *           type: string
 *
 * /api-dashboard/v3/bookings:
 *   get:
 *     summary: Obtener todas las reservas
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Lista de reservas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Booking'
 *
 *   post:
 *     summary: Crear una nueva reserva
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Datos inválidos
 *
 * /api-dashboard/v3/bookings/{id}:
 *   get:
 *     summary: Obtener una reserva por su ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la reserva
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles de la reserva
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       404:
 *         description: Reserva no encontrada
 *
 *   put:
 *     summary: Actualizar una reserva existente
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la reserva
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: Reserva actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Booking'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Reserva no encontrada
 *
 *   delete:
 *     summary: Eliminar una reserva por ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la reserva
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reserva eliminada exitosamente
 *       404:
 *         description: Reserva no encontrada
 */

bookingRouterMysql.get('/', async (req: Request, res: Response) => {
    try {
        const bookingList = await bookingServiceMysql.fetchAll()
        const bookingListWithRoom: BookingInterfaceMysqlWithRoomData[] = []

        for (const booking of bookingList) {
            const room = await roomServiceMysql.fetchById(booking.room_id)
            if (room === null) {
                res.status(404).json({ message: `Room #${booking.room_id} not found` })
                return
            }
            const bookingWithRoomData: BookingInterfaceMysqlWithRoomData = { ...booking, room_data: room }
            bookingListWithRoom.push(bookingWithRoomData)
        }

        res.json(bookingListWithRoom)
    }
    catch (error) {
        console.error("Error in get (all) of bookingController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

bookingRouterMysql.get('/:id', async (req: Request, res: Response) => {
    try {
        const booking = await bookingServiceMysql.fetchById(parseInt(req.params.id))
        if (booking === null) {
            res.status(404).json({ message: `Booking #${req.params.id} not found` })
            return
        }

        const room = await roomServiceMysql.fetchById(booking.room_id)
        if (room === null) {
            res.status(404).json({ message: `Room #${booking.room_id} not found` })
            return
        }

        const bookingWithRoomData: BookingInterfaceMysqlWithRoomData = { ...booking, room_data: room }
        res.json(bookingWithRoomData)
    }
    catch (error) {
        console.error("Error in get (by id) of clientController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

bookingRouterMysql.post('/', async (req: Request, res: Response) => {
    const allBookings = await bookingServiceMysql.fetchAll()
    const allRooms = await roomServiceMysql.fetchAll()
    const bookingValidator = new BookingValidator()
    const totalErrors = bookingValidator.validateBooking(req.body, allBookings, allRooms)

    if (totalErrors.length === 0) {
        try {
            const roomOfBooking = await roomServiceMysql.fetchById(req.body.room_id)
            if (roomOfBooking === null) {
                res.status(404).json({ message: `Room_id #${req.body.room_id} not found` })
                return
            }

            const bookingToCreate = await bookingServiceMysql.create(req.body)

            const bookingToReturn: BookingInterfaceMysqlWithRoomData = { ...bookingToCreate, room_data: roomOfBooking }
            res.status(201).json(bookingToReturn)
        }
        catch (error) {
            console.error("Error in post of bookingController:", error)
            res.status(500).json({ message: "Internal server error" })
        }
    }
    else {
        res.status(400).json({
            message: totalErrors.join(', ')
        })
    }
})

bookingRouterMysql.put('/:id', async (req: Request, res: Response) => {
    const bookingValidator = new BookingValidator()
    const allBookings = await bookingServiceMysql.fetchAll()
    const allRooms = await roomServiceMysql.fetchAll()
    const totalErrors = bookingValidator.validateBooking(req.body, allBookings, allRooms)

    if (totalErrors.length === 0) {
        try {
            let roomToReturn: RoomInterfaceMysql

            const bookingToUpdate = await bookingServiceMysql.fetchById(parseInt(req.params.id))
            if (bookingToUpdate === null) {
                res.status(404).json({ message: `Booking update failed, booking #${req.params.id} not found` })
                return
            }

            if (bookingToUpdate.room_id !== req.body.room_id) {
                const roomOfBooking = await roomServiceMysql.fetchById(req.body.room_id)
                if (roomOfBooking === null) {
                    res.status(404).json({ message: `Booking update failed, new room #${req.body.room_id} not found` })
                    return
                }
                roomToReturn = roomOfBooking
            }
            else {
                const roomOfBooking = await roomServiceMysql.fetchById(bookingToUpdate.room_id)
                if (roomOfBooking === null) {
                    res.status(404).json({ message: `Booking update failed, old room #${bookingToUpdate.room_id} not found` })
                    return
                }
                roomToReturn = roomOfBooking
            }

            const bookingUpdated = await bookingServiceMysql.update(parseInt(req.params.id), req.body)
            if (bookingUpdated === null) {
                res.status(404).json({ message: `Booking update failed, booking #${req.params.id} not found` })
                return
            }

            const bookingToReturn: BookingInterfaceMysqlWithRoomData = { ...bookingUpdated, room_data: roomToReturn }
            res.status(200).json(bookingToReturn)
        }
        catch (error) {
            console.error("Error in put of bookingController:", error)
            res.status(500).json({ message: "Internal server error" })
        }
    }
    else {
        res.status(400).json({
            message: totalErrors.join(', ')
        })
    }
})

bookingRouterMysql.delete('/:id', async (req: Request, res: Response) => {
    try {
        const bookingToDelete = await bookingServiceMysql.fetchById(parseInt(req.params.id))

        if (bookingToDelete === null) {
            res.status(404).json({ message: `Booking to delete #${req.params.id} not found` })
            return
        }

        await bookingServiceMysql.delete(bookingToDelete._id)
        res.status(204).json()
    }
    catch (error) {
        console.error("Error in delete of bookingController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})