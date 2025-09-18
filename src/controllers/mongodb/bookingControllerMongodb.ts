
import { Request, Response } from 'express'
import Router from 'express'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminOnly } from '../../middleware/adminOnly'
import { BookingServiceMongodb } from '../../services/mongodb/bookingServiceMongodb'
import { BookingValidator } from '../../validators/bookingValidator'
import { BookingInterfaceDTO, BookingInterfaceId } from '../../interfaces/mongodb/bookingInterfaceMongodb'
import { RoomServiceMongodb } from '../../services/mongodb/roomServiceMongodb'
import { OptionYesNo } from '../../enums/optionYesNo'


export const bookingRouterMongodb = Router()
const bookingServiceMongodb = new BookingServiceMongodb()
const roomServiceMongodb = new RoomServiceMongodb()

bookingRouterMongodb.use(authMiddleware)

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
 *         booking:
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

bookingRouterMongodb.get('/', async (req: Request, res: Response) => {
    try {
        const bookingList = await bookingServiceMongodb.fetchAll()
        res.json(bookingList)
    }
    catch (error) {
        console.error("Error in get (all) of bookingController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

bookingRouterMongodb.get('/:id', async (req: Request, res: Response) => {
    try {
        const booking = await bookingServiceMongodb.fetchById(req.params.id)
        if (booking !== null) {
            res.json(booking)
        } else {
            res.status(404).json({ message: `Booking #${req.params.id} not found` })
        }
    }
    catch (error) {
        console.error("Error in get (by id) of bookingController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

bookingRouterMongodb.post('/', async (req: Request, res: Response) => {

    const allBookings = await bookingServiceMongodb.fetchAll()
    const allRoomIDs = await roomServiceMongodb.fetchAllIds()
    const bookingToValidate: BookingInterfaceDTO = {
        order_date: new Date(req.body.order_date),
        check_in_date: new Date(req.body.check_in_date),
        check_out_date: new Date(req.body.check_out_date),
        price: req.body.price,
        special_request: req.body.special_request,
        isArchived: OptionYesNo.no,
        room_id_list: req.body.room_id_list,
        client_id: req.body.client_id
    }

    const bookingValidator = new BookingValidator()
    const totalErrors = bookingValidator.validateNewBooking(bookingToValidate, allBookings, allRoomIDs)
    if (totalErrors.length === 0) {
        try {
            const newBooking = await bookingServiceMongodb.create(bookingToValidate)
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

bookingRouterMongodb.put('/:id', async (req: Request, res: Response) => {

    const allBookings = await bookingServiceMongodb.fetchAll()
    const allRoomIDs = await roomServiceMongodb.fetchAllIds()
    const bookingToValidate: BookingInterfaceId = {
        _id: req.params.id,
        order_date: new Date(req.body.order_date),
        check_in_date: new Date(req.body.check_in_date),
        check_out_date: new Date(req.body.check_out_date),
        price: req.body.price,
        special_request: req.body.special_request,
        isArchived: req.body.isArchived,
        room_id_list: req.body.room_id_list,
        client_id: req.body.client_id
    }

    const bookingValidator = new BookingValidator()
    const totalErrors = bookingValidator.validateExistingBooking(bookingToValidate, allBookings, allRoomIDs)
    if (totalErrors.length === 0) {
        try {
            const updatedBooking = await bookingServiceMongodb.update(req.params.id, bookingToValidate)
            if (updatedBooking !== null) {
                res.status(200).json(updatedBooking)
            }
            else {
                res.status(404).json({ message: `Booking #${req.params.id} not found` })
            }
        }
        catch (error) {
            console.error("Error in put of bookingController:", error)
            res.status(500).json({ message: "Internal server error" })
        }
    }
    else {
        res.status(400).json({ message: totalErrors.join(', ') })
    }
})

bookingRouterMongodb.delete('/:id', adminOnly, async (req: Request, res: Response) => {
    try {
        const deletedBooking = await bookingServiceMongodb.delete(req.params.id)
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