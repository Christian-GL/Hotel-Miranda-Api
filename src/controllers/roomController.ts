
import { Request, Response } from 'express'
import Router from 'express'
import { RoomService } from '../services/roomService'
import { RoomValidator } from '../validators/roomValidator'
import { authMiddleware } from '../middleware/authMiddleware'


export const roomRouter = Router()
const roomService = new RoomService()

roomRouter.use(authMiddleware)

/**
 * @swagger
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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   photos:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: uri
 *                   type:
 *                     type: string
 *                   amenities:
 *                     type: array
 *                     items:
 *                       type: string
 *                   price:
 *                     type: number
 *                     format: float
 *                   discount:
 *                     type: number
 *                     format: float
 *                   booking_list:
 *                     type: array
 *                     items:
 *                       type: integer
 */
roomRouter.get('/', (req: Request, res: Response) => {
    const roomList = roomService.fetchAll()
    res.json(roomList)
})

/**
 * @swagger
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
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 photos:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: uri
 *                 type:
 *                   type: string
 *                 amenities:
 *                   type: array
 *                   items:
 *                     type: string
 *                 price:
 *                   type: number
 *                   format: float
 *                 discount:
 *                   type: number
 *                   format: float
 *                 booking_list:
 *                   type: array
 *                   items:
 *                     type: integer
 *       404:
 *         description: Habitación no encontrada
 */
roomRouter.get('/:id', (req: Request, res: Response) => {
    const room = roomService.fetchById(parseInt(req.params.id))
    if (room !== null) {
        res.json(room)
    } else {
        res.status(404).json({ message: `Room  #${req.params.id} not found` })
    }
})

/**
 * @swagger
 * /api-dashboard/v1/rooms:
 *   post:
 *     summary: Crear una nueva habitación
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *               type:
 *                 type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: number
 *                 format: float
 *               discount:
 *                 type: number
 *                 format: float
 *               booking_list:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Habitación creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 photos:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: uri
 *                 type:
 *                   type: string
 *                 amenities:
 *                   type: array
 *                   items:
 *                     type: string
 *                 price:
 *                   type: number
 *                   format: float
 *                 discount:
 *                   type: number
 *                   format: float
 *                 booking_list:
 *                   type: array
 *                   items:
 *                     type: integer
 *       400:
 *         description: Datos inválidos
 */
roomRouter.post('/', (req: Request, res: Response) => {
    const roomValidator = new RoomValidator()
    const totalErrors = roomValidator.validateRoom(req.body)
    if (totalErrors.length === 0) {
        const newRoom = roomService.create(req.body)
        res.status(201).json(newRoom)
    }
    else {
        res.status(400).json({
            message: totalErrors.join(', ')
        })
    }
})

/**
 * @swagger
 * /api-dashboard/v1/rooms:
 *   put:
 *     summary: Actualizar una habitación existente
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *               type:
 *                 type: string
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               price:
 *                 type: number
 *                 format: float
 *               discount:
 *                 type: number
 *                 format: float
 *               booking_list:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       204:
 *         description: Habitación actualizada exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Habitación no encontrada
 */
roomRouter.put('/', (req: Request, res: Response) => {
    const roomValidator = new RoomValidator()
    const updatedRoom = roomService.update(req.body)
    if (updatedRoom !== null) {
        const totalErrors = roomValidator.validateRoom(req.body)
        if (totalErrors.length === 0) {
            res.status(204).json(updatedRoom)
        }
        else {
            res.status(400).json({ message: totalErrors.join(', ') })
        }
    }
    else {
        res.status(404).json({ message: `Room #${req.body.id} not found` })
    }
})

/**
 * @swagger
 * /api-dashboard/v1/rooms/{id}:
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
 *       204:
 *         description: Habitación eliminada exitosamente
 *       404:
 *         description: Habitación no encontrada
 */
roomRouter.delete('/:id', (req: Request, res: Response) => {
    const deletedRoom = roomService.delete(parseInt(req.params.id))
    if (deletedRoom) {
        res.status(204).json()
    } else {
        res.status(404).json({ message: `Room #${req.params.id} not found` })
    }
})