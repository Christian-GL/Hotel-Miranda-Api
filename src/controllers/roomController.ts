
import { Request, Response } from 'express'
import Router from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { RoomService } from '../services/roomService'
import { BookingService } from '../services/bookingService'
import { RoomValidator } from '../validators/roomValidator'
import { BookingInterface } from '../interfaces/bookingInterface'


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
        res.json(roomList)
    }
    catch (error) {
        console.error("Error in get (all) of roomController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

roomRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const room = await roomService.fetchById(req.params.id)
        if (room !== null) {
            res.json(room)
        } else {
            res.status(404).json({ message: `Room  #${req.params.id} not found` })
        }
    }
    catch (error) {
        console.error("Error in get (by id) of roomController:", error)
        // Manejar el codigo de error tambien que no sea 500 (este caso es 404)
        if (error instanceof Error) res.status(500).json({ message: error.message })
        else res.status(500).json({ message: 'Internal server error' })
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
            // SE DEBE DE PODER ACTUALIZAR LAS BOOKINGS DESDE AQUI? NO DEBERIA NO?
            // const existingRoom = await roomService.fetchById(req.params.id)
            // if (existingRoom === null) {
            //     res.status(404).json({ message: `Room #${req.params.id} not found` })
            //     return
            // }
            const updatedRoom = await roomService.update(req.params.id, req.body)
            if (updatedRoom === null) {
                res.status(404).json({ message: `Room #${req.params.id} not found (cant be updated)` })
                return
            }

            // const oldBookings = new Set(existingRoom.booking_list)
            // const newBookings = new Set(updatedRoom.booking_list)
            // const bookingsToRemove = [...oldBookings].filter(id => !newBookings.has(id))
            // const bookingsToAdd = [...newBookings].filter(id => !oldBookings.has(id))
            // const errors: string[] = []

            // for (const bookingId of bookingsToRemove) {
            //     const bookingElement = await bookingService.fetchById(bookingId)
            //     if (bookingElement === null) {
            //         errors.push(`Room.booking_list #${bookingId} not found`)
            //         continue
            //     }
            //     if (bookingElement.room_id === req.params.id) {
            //         await bookingService.delete(bookingElement._id)
            //     }
            // }

            // for (const bookingId of bookingsToAdd) {
            //     const bookingElement = await bookingService.fetchById(bookingId)
            //     if (bookingElement === null) {
            //         errors.push(`Room.booking_list #${bookingId} not found`)
            //         continue
            //     }
            //     bookingElement.room_id = req.params.id
            //     const updatedBooking = await bookingService.update(bookingElement._id, bookingElement)
            //     if (updatedBooking === null) {
            //         errors.push(`Room.booking_list #${bookingId} not found (can't be updated)`)
            //     }
            // }
            // if (errors.length > 0) {
            //     res.status(400).json({ message: errors.join(', ') })
            //     return
            // }

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