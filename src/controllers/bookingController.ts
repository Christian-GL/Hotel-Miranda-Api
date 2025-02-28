
import { Request, Response } from 'express'
import Router from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { BookingService } from '../services/bookingService'
import { RoomService } from '../services/roomService'
import { BookingValidator } from '../validators/bookingValidator'


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
        res.json(bookingList)
    }
    catch (error) {
        console.error("Error in get (all) of bookingController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

bookingRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const booking = await bookingService.fetchById(req.params.id)
        if (booking !== null) {
            res.json(booking)
        } else {
            res.status(404).json({ message: `Booking #${req.params.id} not found` })
        }
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
            const newBooking = await bookingService.create(req.body)
            res.status(201).json(newBooking)
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
            const updatedBooking = await bookingService.update(req.params.id, req.body)
            if (updatedBooking === null) {
                res.status(404).json({ message: `Booking #${req.params.id} not found` })
            }
            else res.status(204).json(updatedBooking)
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
        const deletedBooking = await bookingService.delete(req.params.id)
        if (deletedBooking) {
            res.status(204).json()
        } else {
            res.status(404).json({ message: `Booking #${req.params.id} not found` })
        }
    }
    catch (error) {
        console.error("Error in delete of bookingController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})