
import { Request, Response } from 'express'
import Router from 'express'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminOnly } from '../../middleware/adminOnly'
import { BookingServiceMongodb } from '../../services/mongodb/bookingServiceMongodb'
import { BookingValidator } from '../../validators/bookingValidator'
import { BookingInterfaceDTO, BookingInterfaceId } from '../../interfaces/mongodb/bookingInterfaceMongodb'
import { RoomServiceMongodb } from '../../services/mongodb/roomServiceMongodb'
import { OptionYesNo } from '../../enums/optionYesNo'
import { ClientServiceMongodb } from '../../services/mongodb/clientServiceMongodb'


export const bookingRouterMongodb = Router()
const bookingServiceMongodb = new BookingServiceMongodb()
const roomServiceMongodb = new RoomServiceMongodb()
const clientServiceMongodb = new ClientServiceMongodb()

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
        }
        else {
            res.status(404).json({ message: `Booking #${req.params.id} not found` })
        }
    }
    catch (error) {
        console.error("Error in get (by id) of bookingController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

bookingRouterMongodb.post('/', async (req: Request, res: Response) => {

    const bookingToValidate: BookingInterfaceDTO = {
        order_date: new Date(req.body.order_date),
        check_in_date: new Date(req.body.check_in_date),
        check_out_date: new Date(req.body.check_out_date),
        price: req.body.price,
        special_request: req.body.special_request.trim(),
        isArchived: OptionYesNo.no,
        room_id_list: req.body.room_id_list,
        client_id: req.body.client_id.trim()
    }
    const allBookingDatesNotArchived = await bookingServiceMongodb.fetchAllDatesNotArchived()
    const allRoomIdsNotArchived = await roomServiceMongodb.fetchAllIdsNotArchived()
    const allClientIdsNotArchived = await clientServiceMongodb.fetchAllIdsNotArchived()
    const client = await clientServiceMongodb.fetchById(bookingToValidate.client_id)
    const clientID: string = client ? String(client._id) : ''

    const bookingValidator = new BookingValidator()
    const totalErrors = bookingValidator.validateNewBooking(
        bookingToValidate,
        allBookingDatesNotArchived,
        allRoomIdsNotArchived,
        clientID,
        allClientIdsNotArchived)
    if (totalErrors.length > 0) {
        res.status(400).json({ message: totalErrors.join(', ') })
        return
    }
    try {
        const createdBooking = await bookingServiceMongodb.createAndLinkRooms(bookingToValidate)
        res.status(201).json(createdBooking)
        return
    }
    catch (error: any) {
        const msg = String(error?.message ?? '')
        if (msg.toLowerCase().includes('some room ids do not exist')) {
            res.status(400).json({ message: msg })
            return
        }
        if (msg.toLowerCase().includes('replica set') || msg.toLowerCase().includes('transactions')) {
            res.status(500).json({ message: `Transaction error: ${msg}. Ensure MongoDB supports transactions (replica set / Atlas).` })
            return
        }
        console.error('Error creating booking:', error)
        res.status(500).json({ message: (error && error.message) ? error.message : 'Internal server error' })
        return
    }
})

bookingRouterMongodb.put('/:id', async (req: Request, res: Response) => {

    const bookingId = req.params.id
    const bookingToValidate: BookingInterfaceDTO = {
        order_date: new Date(req.body.order_date),
        check_in_date: new Date(req.body.check_in_date),
        check_out_date: new Date(req.body.check_out_date),
        price: req.body.price,
        special_request: String(req.body.special_request ?? '').trim(),
        isArchived: req.body.isArchived ?? OptionYesNo.no,
        room_id_list: Array.isArray(req.body.room_id_list) ? req.body.room_id_list : [],
        client_id: String(req.body.client_id ?? '').trim()
    }

    // BOOKING validaciones
    const allBookingDatesAndIdNotArchived = await bookingServiceMongodb.fetchAllDatesAndIdNotArchived()
    const allRoomIdsNotArchived = await roomServiceMongodb.fetchAllIdsNotArchived()
    const allClientIdsNotArchived = await clientServiceMongodb.fetchAllIdsNotArchived()
    const client = await clientServiceMongodb.fetchById(bookingToValidate.client_id)
    const clientID: string = client ? String(client._id) : ''

    const bookingValidator = new BookingValidator()
    const totalErrors = bookingValidator.validateExistingBooking(
        { _id: bookingId, ...bookingToValidate } as any,
        allBookingDatesAndIdNotArchived,
        allRoomIdsNotArchived,
        clientID,
        allClientIdsNotArchived
    )
    if (totalErrors.length > 0) {
        res.status(400).json({ message: totalErrors.join(', ') })
        return
    }

    // Si se pasan las validaciones de la booking
    try {
        const updatedBooking = await bookingServiceMongodb.updateAndLinkRooms(bookingId, bookingToValidate)
        if (!updatedBooking) {
            res.status(404).json({ message: `Booking #${bookingId} not found` })
            return
        }
        res.status(200).json(updatedBooking)
        return
    }
    catch (error: any) {
        const msg = String(error?.message ?? '')
        if (msg.toLowerCase().includes('some room ids do not exist')) {
            res.status(400).json({ message: msg })
            return
        }
        if (msg.toLowerCase().includes('replica set') || msg.toLowerCase().includes('transactions')) {
            res.status(500).json({ message: `Transaction error: ${msg}. Ensure MongoDB supports transactions (replica set / Atlas).` })
            return
        }
        console.error('Error updating booking:', error)
        res.status(500).json({ message: msg || 'Internal server error' })
        return
    }
})

bookingRouterMongodb.delete('/:id', adminOnly, async (req: Request, res: Response) => {
    const id = req.params.id
    try {
        const deleted = await bookingServiceMongodb.delete(id)
        if (deleted) {
            res.status(204).send()
            return
        }
        res.status(404).json({ message: `Booking #${id} not found` })
        return
    }
    catch (error: any) {
        const msg = String(error?.message ?? '')
        if (msg.toLowerCase().includes('replica set') || msg.toLowerCase().includes('transactions') || msg.toLowerCase().includes('withtransaction')) {
            res.status(500).json({ message: `Transaction error: ${msg}. Ensure MongoDB supports transactions (replica set / Atlas).` })
            return
        }
        console.error('Error in delete of bookingController:', error)
        res.status(500).json({ message: (error && error.message) ? error.message : 'Internal server error' })
        return
    }
})
