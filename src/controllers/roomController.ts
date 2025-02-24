
import { Request, Response } from 'express'
import Router from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { RoomService } from '../services/roomService'
import { BookingService } from '../services/bookingService'
import { RoomValidator } from '../validators/roomValidator'


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
 * /api-dashboard/v1/rooms:
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
 * /api-dashboard/v1/rooms/{id}:
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
    const allBookings = await bookingService.fetchAll()
    const roomValidator = new RoomValidator()
    const totalErrors = roomValidator.validateRoom(req.body, allRooms, allBookings)

    if (totalErrors.length === 0) {
        try {
            const newRoom = await roomService.create(req.body)
            res.status(201).json(newRoom)
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
    const totalErrors = roomValidator.validateRoom(req.body, allRooms, allBookings)

    if (totalErrors.length === 0) {
        try {
            const updatedRoom = await roomService.update(req.params.id, req.body)
            if (updatedRoom !== null) {
                res.status(204).json(updatedRoom)
            }
            else {
                res.status(404).json({ message: `Room #${req.body.id} not found` })
            }
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
        const deletedRoom = await roomService.delete(req.params.id)
        if (deletedRoom) {
            res.status(204).json()
        } else {
            res.status(404).json({ message: `Room #${req.params.id} not found` })
        }
    }
    catch (error) {
        console.error("Error in delete of roomController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})