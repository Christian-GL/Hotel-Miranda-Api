
import { Request, Response } from 'express'
import Router from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { RoomService } from '../services/roomService'
import { RoomValidator } from '../validators/roomValidator'


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
        res.status(500).json({ message: "Internal server error" })
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
roomRouter.post('/', async (req: Request, res: Response) => {
    const roomValidator = new RoomValidator()
    const totalErrors = roomValidator.validateRoom(req.body)
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

/**
 * @swagger
 * /api-dashboard/v1/rooms/{id}:
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
roomRouter.put('/:id', async (req: Request, res: Response) => {
    const roomValidator = new RoomValidator()
    const totalErrors = roomValidator.validateRoom(req.body)

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