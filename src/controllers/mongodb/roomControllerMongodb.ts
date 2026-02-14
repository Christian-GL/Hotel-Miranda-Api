
import { Request, Response, NextFunction } from 'express'
import Router from 'express'
import mongoose from 'mongoose'


import { ApiError } from '../../errors/ApiError'
import { BookingModelMongodb } from '../../models/mongodb/bookingModelMongodb'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminOnly } from '../../middleware/adminOnly'
import { RoomServiceMongodb } from '../../services/mongodb/roomServiceMongodb'
import { RoomValidator } from '../../validators/roomValidator'
import { RoomInterface } from '../../interfaces/mongodb/roomInterfaceMongodb'
import { OptionYesNo } from '../../enums/optionYesNo'


export const roomRouterMongodb = Router()
const roomServiceMongodb = new RoomServiceMongodb()

roomRouterMongodb.use(authMiddleware)

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
 * /api-dashboard/v3/rooms:
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
 * /api-dashboard/v3/rooms/{id}:
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

roomRouterMongodb.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roomList = await roomServiceMongodb.fetchAll()
        res.json(roomList)
    }
    catch (error) {
        next(error)
    }
})

roomRouterMongodb.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const room = await roomServiceMongodb.fetchById(req.params.id)
        if (room !== null) {
            res.json(room)
        }
        else {
            throw new ApiError(404, `Room #${req.params.id} not found`)
        }
    }
    catch (error) {
        next(error)
    }
})

// roomRouterMongodb.get('/:id', (req: Request, res: Response, next: NextFunction) => {
//     next(new ApiError(400, 'Test error with next'))
// })


roomRouterMongodb.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allRoomNumbersNotArchived = await roomServiceMongodb.fetchAllNumbersNotArchived()
        const roomToValidate: RoomInterface = {
            photos: req.body.photos,
            number: req.body.number?.trim(),
            type: req.body.type?.trim(),
            amenities: req.body.amenities,
            price: req.body.price,
            discount: req.body.discount,
            isActive: req.body.isActive?.trim(),
            isArchived: OptionYesNo.no,
            booking_id_list: []
        }
        const roomValidator = new RoomValidator()
        const totalErrors = roomValidator.validateNewRoom(roomToValidate, allRoomNumbersNotArchived)
        if (totalErrors.length > 0) {
            throw new ApiError(400, totalErrors.join(', '))
        }

        try {
            const newRoom = await roomServiceMongodb.create(roomToValidate)
            res.status(201).json(newRoom)
            return
        }
        catch (error: any) {
            // Key duplicada (número de habitación)
            if (error?.code === 11000) {
                throw new ApiError(409, `Room number "${roomToValidate.number}" already exists`)
            }
            next(error)
        }
    }
    catch (error) {
        next(error)
    }
})

roomRouterMongodb.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // ROOM validaciones
        const roomID = req.params.id
        const actualRoom = await roomServiceMongodb.fetchById(roomID)
        if (!actualRoom) {
            throw new ApiError(404, `Room #${roomID} not found`)
        }
        const allRoomNumbersNotArchived = await roomServiceMongodb.fetchAllNumbersNotArchived()
        const oldRoomNumber = actualRoom.number
        const newRoomNumber = req.body.number.trim().toLowerCase()
        const roomToUpdate: RoomInterface = {
            photos: req.body.photos,
            number: newRoomNumber,
            type: req.body.type.trim(),
            amenities: req.body.amenities,
            price: req.body.price,
            discount: req.body.discount,
            isActive: req.body.isActive.trim(),
            isArchived: req.body.isArchived.trim(),
            booking_id_list: req.body.booking_id_list
        }

        const roomValidator = new RoomValidator()
        const totalErrors = roomValidator.validateExistingRoom(roomToUpdate, oldRoomNumber, allRoomNumbersNotArchived)
        if (totalErrors.length > 0) {
            throw new ApiError(400, totalErrors.join(', '))
        }
        const oldRoomId = await roomServiceMongodb.fetchIdByNumber(oldRoomNumber)
        if (oldRoomId === null) {
            throw new ApiError(400, 'Invalid room old ID format')
        }
        if (roomToUpdate.isArchived === OptionYesNo.no) {
            if (allRoomNumbersNotArchived.includes(roomToUpdate.number) && roomID !== oldRoomId) {
                throw new ApiError(400, 'A room with this number is already not archived')
            }
        }
        if (roomToUpdate.isActive === OptionYesNo.yes) {
            const allRoomIdsActived = await roomServiceMongodb.fetchAllIdsActived()
            if (allRoomIdsActived.includes(roomID) && roomID !== oldRoomId) {
                throw new ApiError(400, 'A room with this ID is already active')
            }
        }

        // BOOKINGS asociadas validación de su existencia en BD
        const bookingIds: string[] = Array.from(new Set(roomToUpdate.booking_id_list ?? []))
        const invalidFormatIds = bookingIds.filter(id => !mongoose.Types.ObjectId.isValid(String(id)))
        if (invalidFormatIds.length > 0) {
            throw new ApiError(400, `Invalid booking ID format: ${invalidFormatIds.join(', ')}`)
        }
        if (bookingIds.length > 0) {
            const foundBookings = await BookingModelMongodb.find({ _id: { $in: bookingIds } }, { _id: 1 }).lean()
            const foundSet = new Set(foundBookings.map((booking: any) => String(booking._id)))
            const missing = bookingIds.filter(id => !foundSet.has(id))
            if (missing.length > 0) {
                throw new ApiError(400, `Some booking IDs do not exist: ${missing.join(', ')}`)
            }
        }

        // Si tanto la ROOM como sus BOOKINGS existen y pasan validaciones hacemos las actualizaciones correspondientes en BD
        try {
            const allNewData = await roomServiceMongodb.update(roomID, roomToUpdate)
            if (!allNewData) {
                throw new ApiError(404, `Room #${roomID} not found`)
            }
            const { roomUpdated: room, updatedBookings, updatedClients } = allNewData
            res.status(200).json({
                roomUpdated: room,
                updatedBookings,
                updatedClients
            })
            return
        }
        catch (error: any) {
            const message = error?.message ?? 'Transaction failed'
            if (String(message).toLowerCase().includes('not found')) {
                throw new ApiError(404, message)
            }
            if (String(message).toLowerCase().includes('replica set') || String(message).toLowerCase().includes('transactions')) {
                throw new ApiError(500, `Transaction error: ${message}. Ensure MongoDB supports transactions (replica set / Atlas).`)
            }
            throw new ApiError(500, message)
        }
    }
    catch (error: any) {
        next(error)
    }
})

roomRouterMongodb.delete('/:id', adminOnly, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const roomId = req.params.id
    try {
        const allNewData = await roomServiceMongodb.delete(roomId)
        if (!allNewData) {
            throw new ApiError(404, `Room #${roomId} not found`)
        }
        res.status(200).json(allNewData)
        return
    }
    catch (error: any) {
        const msg = String(error?.message ?? '')
        if (msg.toLowerCase().includes('replica set') ||
            msg.toLowerCase().includes('transactions') ||
            msg.toLowerCase().includes('withtransaction')) {
            return next(new ApiError(500, `Transaction error: ${msg}. Ensure MongoDB supports transactions (replica set / Atlas).`))
        }
        return next(new ApiError(500, msg || 'Internal unknow server error'))
    }
})