
import { Request, Response } from 'express'
import Router from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { BookingService } from '../services/bookingService'
import { RoomService } from '../services/roomService'
import { BookingValidator } from '../validators/bookingValidator'
import { RoomInterface } from '../interfaces/roomInterface'
import { BookingInterfaceWithRoomData } from '../interfaces/bookingInterface'


export const bookingRouter = Router()
const bookingService = new BookingService()
const roomService = new RoomService()

bookingRouter.use(authMiddleware)

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
 * /api-dashboard/v2/bookings:
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
 * /api-dashboard/v2/bookings/{id}:
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

bookingRouter.get('/', async (req: Request, res: Response) => {
    try {
        const bookingList = await bookingService.fetchAll()
        const bookingListWithRoom: BookingInterfaceWithRoomData[] = []

        for (const booking of bookingList) {
            const room = await roomService.fetchById(booking.room_id)
            if (room === null) {
                res.status(404).json({ message: `Room #${booking.room_id} not found` })
                return
            }
            const bookingWithRoomData: BookingInterfaceWithRoomData = { ...booking.toObject(), room_data: room }
            bookingListWithRoom.push(bookingWithRoomData)
        }

        res.json(bookingListWithRoom)
    }
    catch (error) {
        console.error("Error in get (all) of bookingController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

bookingRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const booking = await bookingService.fetchById(req.params.id)
        if (booking === null) {
            res.status(404).json({ message: `Booking #${req.params.id} not found` })
            return
        }

        const room = await roomService.fetchById(booking.room_id)
        if (room === null) {
            res.status(404).json({ message: `Room #${booking.room_id} not found` })
            return
        }

        const bookingWithRoomData: BookingInterfaceWithRoomData = { ...booking.toObject(), room_data: room }
        res.json(bookingWithRoomData)
    }
    catch (error) {
        console.error("Error in get (by id) of contactController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

bookingRouter.post('/', async (req: Request, res: Response) => {
    const allBookings = await bookingService.fetchAll()
    const allRooms = await roomService.fetchAll()
    const bookingValidator = new BookingValidator()
    const totalErrors = bookingValidator.validateBooking(req.body, allBookings, allRooms)

    if (totalErrors.length === 0) {
        try {
            const roomOfBooking = await roomService.fetchById(req.body.room_id)
            if (roomOfBooking === null) {
                res.status(404).json({ message: `Room_id #${req.body.room_id} not found` })
                return
            }

            const newBooking = await bookingService.create(req.body)

            roomOfBooking.booking_list.push(newBooking._id)
            const roomUpdated = await roomService.update(roomOfBooking._id, roomOfBooking)
            if (roomUpdated === null) {
                await bookingService.delete(newBooking._id)
                res.status(404).json({ message: `Room update failed, deleting booking)` })
                return
            }

            const bookingToReturn: BookingInterfaceWithRoomData = { ...newBooking.toObject(), room_data: roomOfBooking }
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

bookingRouter.put('/:id', async (req: Request, res: Response) => {
    const bookingValidator = new BookingValidator()
    const allBookings = await bookingService.fetchAll()
    const allRooms = await roomService.fetchAll()
    const totalErrors = bookingValidator.validateBooking(req.body, allBookings, allRooms)

    if (totalErrors.length === 0) {
        try {
            let roomToReturn: RoomInterface

            const bookingToUpdate = await bookingService.fetchById(req.params.id)
            if (bookingToUpdate === null) {
                res.status(404).json({ message: `Booking update failed, booking #${req.params.id} not found` })
                return
            }

            // Si la booking tiene diferente room_id
            if (bookingToUpdate.room_id !== req.body.room_id) {
                // Le quida el id del booking al room viejo
                const oldRoomOfBooking = await roomService.fetchById(bookingToUpdate.room_id)
                if (oldRoomOfBooking === null) {
                    res.status(404).json({ message: `Booking update failed, old room #${bookingToUpdate.room_id} not found` })
                    return
                }
                oldRoomOfBooking.booking_list = oldRoomOfBooking.booking_list.filter(bookingID => bookingID.toString() !== bookingToUpdate._id.toString())
                const oldRoomOfBookingUpdated = await roomService.update(oldRoomOfBooking._id, oldRoomOfBooking)
                if (oldRoomOfBookingUpdated === null) {
                    res.status(404).json({ message: `Old room #${req.params.id} not found (cant be updated)` })
                    return
                }

                // Le añade el id del booking al room nuevo
                const newRoomOfBooking = await roomService.fetchById(req.body.room_id)
                if (newRoomOfBooking === null) {
                    res.status(404).json({ message: `Booking update failed, new room #${req.body.room_id} not found` })
                    return
                }
                newRoomOfBooking.booking_list.push(bookingToUpdate._id)
                const newRoomOfBookingUpdated = await roomService.update(newRoomOfBooking._id, newRoomOfBooking)
                if (newRoomOfBookingUpdated === null) {
                    res.status(404).json({ message: `New room #${req.body.room_id} not found (cant be updated)` })
                    return
                }
                roomToReturn = newRoomOfBookingUpdated

                // Actualiza la booking
                // bookingToUpdate.room_id = req.body.room_id
                // const newBookingUpdated = await bookingService.update(bookingToUpdate._id, bookingToUpdate)
                // if (newBookingUpdated === null) {
                //     res.status(404).json({ message: `New booking #${bookingToUpdate._id} not found (cant be updated)` })
                //     return
                // }

            }
            else {
                const oldRoomOfBooking = await roomService.fetchById(bookingToUpdate.room_id)
                if (oldRoomOfBooking === null) {
                    res.status(404).json({ message: `Booking update failed, old room #${bookingToUpdate.room_id} not found` })
                    return
                }
                roomToReturn = oldRoomOfBooking
            }

            const bookingUpdated = await bookingService.update(req.params.id, req.body)
            if (bookingUpdated === null) {
                res.status(404).json({ message: `Booking update failed, booking #${req.params.id} not found` })
                return
            }

            const bookingToReturn: BookingInterfaceWithRoomData = { ...bookingUpdated.toObject(), room_data: roomToReturn }
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

bookingRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const bookingToDelete = await bookingService.fetchById(req.params.id)

        if (bookingToDelete === null) {
            res.status(404).json({ message: `Booking to delete #${req.params.id} not found` })
            return
        }

        const roomToUpdate = await roomService.fetchById(bookingToDelete.room_id)
        if (roomToUpdate === null) {
            res.status(404).json({ message: `Room to update #${bookingToDelete.room_id} not found` })
            return
        }
        roomToUpdate.booking_list = roomToUpdate.booking_list.filter(bookingID => bookingID.toString() !== bookingToDelete._id.toString())
        const roomUpdated = await roomService.update(roomToUpdate._id, roomToUpdate)
        if (roomUpdated === null) {
            res.status(404).json({ message: `Room to update #${roomToUpdate._id} not found (cant be updated)` })
            return
        }

        await bookingService.delete(bookingToDelete._id)
        res.status(204).json()
    }
    catch (error) {
        console.error("Error in delete of bookingController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})