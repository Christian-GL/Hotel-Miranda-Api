
import { Request, Response } from 'express'
import Router from 'express'
import { BookingService } from '../services/bookingService'
import { RoomService } from '../services/roomService'
import { BookingValidator } from '../validators/bookingValidator'
import { authMiddleware } from '../middleware/authMiddleware'


export const bookingRouter = Router()
const bookingService = new BookingService()
const roomService = new RoomService()

bookingRouter.use(authMiddleware)

/**
 * @swagger
 * /api-dashboard/v1/bookings:
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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   photo:
 *                     type: string
 *                   full_name_guest:
 *                     type: string
 *                   order_date:
 *                     type: string
 *                     format: date
 *                   order_time:
 *                     type: string
 *                   check_in_date:
 *                     type: string
 *                     format: date
 *                   check_in_time:
 *                     type: string
 *                   check_out_date:
 *                     type: string
 *                     format: date
 *                   check_out_time:
 *                     type: string
 *                   room:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       type:
 *                         type: string
 *                   room_booking_status:
 *                     type: string
 *                   special_request:
 *                     type: string
 */
bookingRouter.get('/', async (req: Request, res: Response) => {
    const bookingList = await bookingService.fetchAll()
    res.json(bookingList)
})

/**
* @swagger
* /api-dashboard/v1/bookings/{id}:
*   get:
*     summary: Obtener una reserva por ID
*     tags: [Bookings]
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: ID de la reserva
*         schema:
*           type: integer
*     responses:
*       200:
*         description: Detalles de la reserva
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 id:
*                   type: integer
*                 photo:
*                   type: string
*                 full_name_guest:
*                   type: string
*                 order_date:
*                   type: string
*                   format: date
*                 order_time:
*                   type: string
*                 check_in_date:
*                   type: string
*                   format: date
*                 check_in_time:
*                   type: string
*                 check_out_date:
*                   type: string
*                   format: date
*                 check_out_time:
*                   type: string
*                 room:
*                   type: object
*                   properties:
*                     id:
*                       type: integer
*                     type:
*                       type: string
*                 room_booking_status:
*                   type: string
*                 special_request:
*                   type: string
*       404:
*         description: Reserva no encontrada
*/
bookingRouter.get('/:id', async (req: Request, res: Response) => {
    const booking = await bookingService.fetchById(parseInt(req.params.id))
    if (booking !== null) {
        res.json(booking)
    } else {
        res.status(404).json({ message: `Booking #${req.params.id} not found` })
    }
})

/**
 * @swagger
 * /api-dashboard/v1/bookings:
 *   post:
 *     summary: Crear una nueva reserva
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *               full_name_guest:
 *                 type: string
 *               order_date:
 *                 type: string
 *                 format: date
 *               order_time:
 *                 type: string
 *               check_in_date:
 *                 type: string
 *                 format: date
 *               check_in_time:
 *                 type: string
 *               check_out_date:
 *                 type: string
 *                 format: date
 *               check_out_time:
 *                 type: string
 *               room:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   type:
 *                     type: string
 *               room_booking_status:
 *                 type: string
 *               special_request:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reserva creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 photo:
 *                   type: string
 *                 full_name_guest:
 *                   type: string
 *                 order_date:
 *                   type: string
 *                   format: date
 *                 order_time:
 *                   type: string
 *                 check_in_date:
 *                   type: string
 *                   format: date
 *                 check_in_time:
 *                   type: string
 *                 check_out_date:
 *                   type: string
 *                   format: date
 *                 check_out_time:
 *                   type: string
 *                 room:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     type:
 *                       type: string
 *                 room_booking_status:
 *                   type: string
 *                 special_request:
 *                   type: string
 *       400:
 *         description: Datos inválidos
 */
bookingRouter.post('/', async (req: Request, res: Response) => {
    const bookingValidator = new BookingValidator()
    const totalErrors = bookingValidator.validateBooking(req.body)
    const roomOfBooking = await roomService.fetchById(req.body.room.id)

    if (roomOfBooking !== null) {
        if (totalErrors.length === 0) {
            const newBooking = bookingService.create(req.body)
            res.status(201).json(newBooking)
        }
        else { res.status(400).json({ message: totalErrors.join(', ') }) }
    }
    else { res.status(404).json({ message: `Room #${req.body.room.id} needed for #${req.body.id} not found` }) }

})

/**
 * @swagger
 * /api-dashboard/v1/bookings:
 *   put:
 *     summary: Actualizar una reserva existente
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               photo:
 *                 type: string
 *               full_name_guest:
 *                 type: string
 *               order_date:
 *                 type: string
 *                 format: date
 *               order_time:
 *                 type: string
 *               check_in_date:
 *                 type: string
 *                 format: date
 *               check_in_time:
 *                 type: string
 *               check_out_date:
 *                 type: string
 *                 format: date
 *               check_out_time:
 *                 type: string
 *               room:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   type:
 *                     type: string
 *               room_booking_status:
 *                 type: string
 *               special_request:
 *                 type: string
 *     responses:
 *       204:
 *         description: Reserva actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Reserva no encontrada
 */
bookingRouter.put('/', async (req: Request, res: Response) => {
    const bookingValidator = new BookingValidator()
    const updatedBooking = await bookingService.update(req.body)

    if (updatedBooking !== null) {
        if (updatedBooking.room.id) {
            const roomOfBooking = roomService.fetchById(updatedBooking.room.id)
            if (roomOfBooking !== null) {
                const totalErrors = bookingValidator.validateBooking(req.body)
                if (totalErrors.length === 0) {
                    res.status(204).json(updatedBooking)
                }
                else { res.status(400).json({ message: totalErrors.join(', ') }) }
            }
            else { res.status(404).json({ message: `Room #${updatedBooking.room.id} needed for #${req.body.id} not found` }) }
        }
    }
    else { res.status(404).json({ message: `Booking #${req.body.id} not found` }) }
})

/**
 * @swagger
 * /api-dashboard/v1/bookings/{id}:
 *   delete:
 *     summary: Eliminar una reserva por ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la reserva
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Reserva eliminada exitosamente
 *       404:
 *         description: Reserva no encontrada
 */
bookingRouter.delete('/:id', async (req: Request, res: Response) => {
    const deletedBooking = await bookingService.delete(parseInt(req.params.id))
    if (deletedBooking) {
        res.status(204).json()
    } else {
        res.status(404).json({ message: `Booking #${req.params.id} not found` })
    }
})