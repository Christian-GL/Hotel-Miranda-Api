
import { Request, Response, NextFunction } from 'express'
import Router from 'express'
import mongoose from 'mongoose'

import { ApiError } from '../../errors/ApiError'
import { BookingModelMongodb } from '../../models/mongodb/bookingModelMongodb'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminOnly } from '../../middleware/adminOnly'
import { RoomInterface } from '../../interfaces/mongodb/roomInterfaceMongodb'
import { RoomServiceMongodb } from '../../services/mongodb/roomServiceMongodb'
import { RoomValidator } from '../../validators/roomValidator'
import { CommonValidators } from "../../validators/commonValidators"
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
        const response = await roomServiceMongodb.fetchAll()
        res.json(response)
    }
    catch (error) {
        return next(error)
    }
})

roomRouterMongodb.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roomId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            throw new ApiError(400, 'Invalid id format')
        }
        const response = await roomServiceMongodb.fetchById(roomId)
        if (response === null) {
            throw new ApiError(404, `Room #${roomId} not found`)
        }

        res.json(response)
    }
    catch (error) {
        return next(error)
    }
})

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

        const response = await roomServiceMongodb.create(roomToValidate)
        if (!response) {
            throw new ApiError(500, 'Error creating Room')
        }

        res.status(201).json(response)
    }
    catch (error) {
        return next(error)
    }
})

roomRouterMongodb.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roomId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            throw new ApiError(400, 'Invalid id format')
        }

        // ROOM validaciones:
        const existingRoom = await roomServiceMongodb.fetchById(roomId)
        if (!existingRoom) {
            throw new ApiError(404, `Room #${roomId} not found`)
        }

        const roomToUpdate: RoomInterface = {
            photos: req.body.photos,
            number: req.body.number.trim().toLowerCase(),
            type: req.body.type.trim(),
            amenities: req.body.amenities,
            price: req.body.price,
            discount: req.body.discount,
            isActive: req.body.isActive.trim(),
            isArchived: existingRoom.isArchived,
            booking_id_list: req.body.booking_id_list
        }
        const allRoomNumbersNotArchived = await roomServiceMongodb.fetchAllNumbersNotArchived()
        const roomValidator = new RoomValidator()
        const totalErrors = roomValidator.validateExistingRoom(roomToUpdate, existingRoom.number, allRoomNumbersNotArchived)
        if (totalErrors.length > 0) {
            throw new ApiError(400, totalErrors.join(', '))
        }

        // !!!
        const oldRoomId = await roomServiceMongodb.fetchIdByNumber(existingRoom.number)
        if (oldRoomId === null) {
            throw new ApiError(400, 'Invalid room old ID format')
        }

        if (roomToUpdate.isArchived === OptionYesNo.no) {
            if (allRoomNumbersNotArchived.includes(roomToUpdate.number) && roomId !== oldRoomId) {
                throw new ApiError(400, 'A room with this number is already not archived')
            }
        }

        if (roomToUpdate.isActive === OptionYesNo.yes) {
            const allRoomIdsActived = await roomServiceMongodb.fetchAllIdsActived()
            if (allRoomIdsActived.includes(roomId) && roomId !== oldRoomId) {
                throw new ApiError(400, 'A room with this ID is already active')
            }
        }

        // BOOKINGS asociadas validación de su existencia en BD:
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

        // Si tanto la ROOM como sus BOOKINGS existen y pasan validaciones hacemos las actualizaciones correspondientes en BD:
        const response = await roomServiceMongodb.update(roomId, roomToUpdate)
        if (response === null) {
            throw new ApiError(404, `Room #${roomId} not found`)
        }

        res.status(200).json(response)
    }
    catch (error) {
        return next(error)
    }
})

roomRouterMongodb.patch('/archive/:id', adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roomId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            throw new ApiError(400, 'Invalid id format')
        }

        const newArchivedValue = req.body.isArchived
        const commonValidator = new CommonValidators()
        const totalErrorsArchived = commonValidator.validateArchivedOption(newArchivedValue)
        if (totalErrorsArchived.length > 0) {
            throw new ApiError(400, totalErrorsArchived.join(', '))
        }

        const response = await roomServiceMongodb.archive(roomId, newArchivedValue)
        if (response === null) {
            throw new ApiError(404, `Room #${roomId} not found`)
        }

        res.status(200).json(response)
    }
    catch (error) {
        return next(error)
    }
})

roomRouterMongodb.delete('/:id', adminOnly, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const roomId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(roomId)) {
            throw new ApiError(400, 'Invalid id format')
        }

        const response = await roomServiceMongodb.delete(roomId)
        if (!response) {
            throw new ApiError(404, `Room #${roomId} not found`)
        }

        res.status(200).json(response)
    }
    catch (error) {
        return next(error)
    }
})