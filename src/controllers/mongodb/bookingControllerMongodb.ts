
import { Request, Response, NextFunction } from 'express'
import Router from 'express'
import mongoose from 'mongoose'

import { ApiError } from '../../errors/ApiError'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminOnly } from '../../middleware/adminOnly'
import { BookingServiceMongodb } from '../../services/mongodb/bookingServiceMongodb'
import { BookingValidator } from '../../validators/bookingValidator'
import { BookingInterface } from '../../interfaces/mongodb/bookingInterfaceMongodb'
import { RoomServiceMongodb } from '../../services/mongodb/roomServiceMongodb'
import { ClientServiceMongodb } from '../../services/mongodb/clientServiceMongodb'
import { CommonValidators } from '../../validators/commonValidators'
import { OptionYesNo } from '../../enums/optionYesNo'


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

bookingRouterMongodb.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await bookingServiceMongodb.fetchAll()
        res.json(response)
    }
    catch (error) {
        return next(error)
    }
})

bookingRouterMongodb.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookingId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            throw new ApiError(400, 'Invalid id format')
        }

        const booking = await bookingServiceMongodb.fetchById(bookingId)
        if (booking === null) {
            throw new ApiError(404, `Booking #${req.params.id} not found`)
        }

        res.json(booking)
    }
    catch (error) {
        return next(error)
    }
})

bookingRouterMongodb.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Cálculo del precio total de la booking antes de validarla
        const roomIds: string[] = Array.isArray(req.body.room_id_list) ? req.body.room_id_list.map(String) : []
        let bookingPrice: number
        if (roomIds.length === 0) {
            throw new ApiError(404, 'Error fetching rooms for creating this booking, no rooms found')
        }

        // Si algún ID falta o archivado calcular cuáles faltan para el mensaje de error
        const prices = await roomServiceMongodb.fetchPricesAndDiscounts(roomIds)
        if (prices.length !== roomIds.length) {
            const foundSet = new Set(prices.map((r: any) => String(r._id)))
            const missing = roomIds.filter(id => !foundSet.has(id))
            throw new ApiError(400, `Some room IDs do not exist or are archived: ${missing.join(', ')}`)
        }

        // Aplicar descuento a cada habitación y sumar
        const total = prices.reduce((total: number, room: any) => {
            const price = Number(room.price ?? 0)
            const discount = Number(room.discount ?? 0)
            const effective = price * (1 - (discount / 100))
            return total + effective
        }, 0)
        bookingPrice = Number(total.toFixed(2))

        const bookingToValidate: BookingInterface = {
            order_date: new Date(req.body.order_date),
            check_in_date: new Date(req.body.check_in_date),
            check_out_date: new Date(req.body.check_out_date),
            price: bookingPrice,
            special_request: req.body.special_request.trim(),
            isArchived: OptionYesNo.no,
            room_id_list: roomIds,
            client_id: req.body.client_id.trim()
        }
        const allBookingDatesNotArchived = await bookingServiceMongodb.fetchAllDatesByRoomsNotArchived(bookingToValidate.room_id_list)
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
            throw new ApiError(400, totalErrors.join(', '))
        }

        const response = await bookingServiceMongodb.create(bookingToValidate)
        if (!response) {
            throw new ApiError(500, 'Error creating Booking')
        }

        res.status(201).json(response)
    }
    catch (error) {
        return next(error)
    }
})

bookingRouterMongodb.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookingId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            throw new ApiError(400, 'Invalid id format')
        }

        const existingBooking = await roomServiceMongodb.fetchById(bookingId)
        if (!existingBooking) {
            throw new ApiError(404, `Booking #${bookingId} not found`)
        }

        // Calculo del precio total de la booking antes de validarla
        const roomIds: string[] = Array.isArray(req.body.room_id_list) ? req.body.room_id_list.map(String) : []
        let bookingPrice: number
        if (roomIds.length === 0) {
            throw new ApiError(500, 'Error fetching rooms for creating this booking, no rooms found')
        }

        // Si algún ID falta o archivado calcular cuáles faltan para el mensaje de error
        const prices = await roomServiceMongodb.fetchPricesAndDiscounts(roomIds)
        if (prices.length !== roomIds.length) {
            const foundSet = new Set(prices.map((r: any) => String(r._id)))
            const missing = roomIds.filter(id => !foundSet.has(id))
            throw new ApiError(400, `Some room IDs do not exist or are archived: ${missing.join(', ')}`)
        }

        // Aplicar descuento a cada habitación y sumar
        const total = prices.reduce((total: number, room: any) => {
            const price = Number(room.price ?? 0)
            const discount = Number(room.discount ?? 0)
            const effective = price * (1 - (discount / 100))
            return total + effective
        }, 0)
        bookingPrice = Number(total.toFixed(2))

        const bookingToValidate: BookingInterface = {
            order_date: new Date(req.body.order_date),
            check_in_date: new Date(req.body.check_in_date),
            check_out_date: new Date(req.body.check_out_date),
            price: bookingPrice,
            special_request: req.body.special_request.trim(),
            isArchived: existingBooking.isArchived,
            room_id_list: roomIds,
            client_id: req.body.client_id.trim()
        }
        const allBookingDatesAndIdNotArchived = await bookingServiceMongodb.fetchAllDatesAndIdByRoomsNotArchived(bookingToValidate.room_id_list)
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
            throw new ApiError(400, totalErrors.join(', '))
        }

        const response = await bookingServiceMongodb.update(bookingId, bookingToValidate)
        if (response === null) {
            throw new ApiError(404, `Booking #${bookingId} not found`)
        }

        res.status(200).json(response)
    }
    catch (error) {
        next(error)
    }

})

bookingRouterMongodb.patch('/archive/:id', adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookingId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            throw new ApiError(400, 'Invalid id format')
        }

        const newArchivedValue = req.body.isArchived
        const commonValidator = new CommonValidators()
        const totalErrorsArchived = commonValidator.validateArchivedOption(newArchivedValue)
        if (totalErrorsArchived.length > 0) {
            throw new ApiError(400, totalErrorsArchived.join(', '))
        }

        const response = await bookingServiceMongodb.archive(bookingId, newArchivedValue)
        if (response === null) {
            throw new ApiError(404, `Booking #${bookingId} not found`)
        }

        res.status(200).json(response)
    }
    catch (error) {
        return next(error)
    }
})

bookingRouterMongodb.delete('/:id', adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(400, 'Invalid id format')
        }

        const response = await bookingServiceMongodb.delete(id)
        if (!response || !response.bookingIsDeleted) {
            throw new ApiError(404, `Booking #${id} not found`)
        }

        res.status(200).json(response)
    }
    catch (error) {
        return next(error)
    }
})
