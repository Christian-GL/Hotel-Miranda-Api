
import { Request, Response } from 'express'
import Router from 'express'
import mongoose from 'mongoose'
import { RoomModelMongodb } from '../../models/mongodb/roomModelMongodb'
import { BookingModelMongodb } from '../../models/mongodb/bookingModelMongodb'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminOnly } from '../../middleware/adminOnly'
import { RoomServiceMongodb } from '../../services/mongodb/roomServiceMongodb'
import { RoomValidator } from '../../validators/roomValidator'
import { RoomInterfaceDTO } from '../../interfaces/mongodb/roomInterfaceMongodb'
import { OptionYesNo } from '../../enums/optionYesNo'
import { BookingServiceMongodb } from '../../services/mongodb/bookingServiceMongodb'


export const roomRouterMongodb = Router()
const roomServiceMongodb = new RoomServiceMongodb()
const bookingServiceMongodb = new BookingServiceMongodb()

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

roomRouterMongodb.get('/', async (req: Request, res: Response) => {
    try {
        const roomList = await roomServiceMongodb.fetchAll()
        res.json(roomList)
    }
    catch (error) {
        console.error("Error in get (all) of roomController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

roomRouterMongodb.get('/:id', async (req: Request, res: Response) => {
    try {
        const room = await roomServiceMongodb.fetchById(req.params.id)
        if (room !== null) {
            res.json(room)
        } else {
            res.status(404).json({ message: `Room #${req.params.id} not found` })
        }
    }
    catch (error) {
        console.error("Error in get (by id) of roomController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

roomRouterMongodb.post('/', async (req: Request, res: Response) => {

    const allRoomNumbers = await roomServiceMongodb.fetchAllNumbersNotArchived()
    const roomToValidate: RoomInterfaceDTO = {
        photos: req.body.photos,
        number: req.body.number.trim().toLowerCase(),
        type: req.body.type.trim(),
        amenities: req.body.amenities,
        price: req.body.price,
        discount: req.body.discount,
        isActive: req.body.isActive.trim(),
        isArchived: OptionYesNo.no,
        booking_id_list: []
    }
    const roomValidator = new RoomValidator()
    const totalErrors = roomValidator.validateNewRoom(roomToValidate, allRoomNumbers)
    if (totalErrors.length === 0) {
        try {
            const newRoom = await roomServiceMongodb.create(roomToValidate)
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

// roomRouterMongodb.put('/:id', async (req: Request, res: Response) => {
//   try {
//     // === 1) datos previos y referencias (no escribimos aún) ===
//     const roomId = req.params.id

//     // traemos la room antigua (si no existe devolvemos 404 ya)
//     const oldRoomDoc = await roomServiceMongodb.fetchById(roomId)
//     if (!oldRoomDoc) {
//       res.status(404).json({ message: `Room #${roomId} not found` })
//       return
//     }
//     const oldRoomNumber = String(oldRoomDoc.number ?? '000')

//     // lista de números existentes (no archivados) para validar unicidad
//     const allRoomNumbers = await roomServiceMongodb.fetchAllNumbersNotArchived()

//     // === 2) construir DTO con normalizaciones ligeras ===
//     const roomToValidate: RoomInterfaceDTO = {
//       photos: req.body.photos,
//       number: typeof req.body.number === 'string' ? req.body.number.trim().toLowerCase() : req.body.number,
//       type: typeof req.body.type === 'string' ? req.body.type.trim() : req.body.type,
//       amenities: req.body.amenities,
//       price: req.body.price,
//       discount: req.body.discount,
//       isActive: typeof req.body.isActive === 'string' ? req.body.isActive.trim() : req.body.isActive,
//       isArchived: typeof req.body.isArchived === 'string' ? req.body.isArchived.trim() : req.body.isArchived,
//       booking_id_list: Array.isArray(req.body.booking_id_list) ? req.body.booking_id_list : []
//     }

//     // === 3) validación de la room (formato y reglas de negocio) ===
//     const roomValidator = new RoomValidator()
//     const totalErrors = roomValidator.validateExistingRoom(roomToValidate, oldRoomNumber, allRoomNumbers)
//     if (totalErrors.length > 0) {
//       res.status(400).json({ message: totalErrors.join(', ') })
//       return
//     }

//     // === 4) PRE-CHECK bookings: existen y tienen formato válido? ===
//     const bookingIDs: string[] = Array.from(new Set(roomToValidate.booking_id_list ?? []))

//     // validar formato ObjectId y recolectar invalid ids
//     const invalidFormatIds = bookingIDs.filter(id => !mongoose.Types.ObjectId.isValid(String(id)))
//     if (invalidFormatIds.length > 0) {
//       res.status(400).json({ message: `Invalid booking ID format: ${invalidFormatIds.join(', ')}` })
//       return
//     }

//     // comprobar existencia en BD (pre-check) — IMPORTANTE: antes de abrir sesión
//     if (bookingIDs.length > 0) {
//       const foundBookings = await BookingModelMongodb.find({ _id: { $in: bookingIDs } }, { _id: 1 }).lean()
//       const foundSet = new Set(foundBookings.map((b: any) => String(b._id)))
//       const missing = bookingIDs.filter(id => !foundSet.has(id))
//       if (missing.length > 0) {
//         res.status(400).json({ message: `Some booking IDs do not exist: ${missing.join(', ')}` })
//         return
//       }
//     }

//     // === 5) TODO OK: abrir sesión y ejecutar la TRANSACCIÓN ===
//     const session = await mongoose.startSession()
//     try {
//       await session.withTransaction(async () => {
//         // 5.a) actualizar la room dentro de la sesión
//         const updatedRoom = await RoomModelMongodb.findOneAndUpdate(
//           { _id: roomId },
//           roomToValidate,
//           { new: true, session }
//         )

//         // Si por alguna razón la room desapareció entre checks -> lanzar para rollback
//         if (!updatedRoom) {
//           throw new Error(`Room #${roomId} not found`)
//         }

//         // 5.b) si procede, archivar bookings (bulk) dentro de la sesión
//         if (roomToValidate.isActive === OptionYesNo.no || roomToValidate.isArchived === OptionYesNo.yes) {
//           if (bookingIDs.length > 0) {
//             await BookingModelMongodb.updateMany(
//               { _id: { $in: bookingIDs }, isArchived: OptionYesNo.no },
//               { $set: { isArchived: OptionYesNo.yes } },
//               { session }
//             )
//           }
//         }

//         // si llegamos aquí sin lanzar, la transacción hará commit automáticamente
//       }) // end withTransaction

//       // 6) después del commit: devolver la room final (lectura fuera de session)
//       const finalRoom = await RoomModelMongodb.findById(roomId).lean()
//       res.status(200).json(finalRoom)
//       return
//     } catch (txErr: any) {
//       // errores dentro de la transacción -> rollback automático
//       const msg = txErr?.message ?? 'Transaction failed'
//       // Mapear a códigos: si mensaje contiene "not found" -> 404, si transacciones no soportadas -> 500 con hint
//       if (String(msg).toLowerCase().includes('not found')) {
//         res.status(404).json({ message: msg })
//         return
//       }
//       if (String(msg).toLowerCase().includes('replica set') || String(msg).toLowerCase().includes('transactions')) {
//         res.status(500).json({ message: `Transaction error: ${msg}. Ensure MongoDB supports transactions (replica set / Atlas).` })
//         return
//       }
//       // por defecto 500
//       res.status(500).json({ message: msg })
//       return
//     } finally {
//       session.endSession()
//     }
//   } catch (error: any) {
//     console.error('Error in put of roomController:', error)
//     res.status(500).json({ message: (error && error.message) ? error.message : 'Internal server error' })
//     return
//   }
// })

roomRouterMongodb.put('/:id', async (req: Request, res: Response) => {
    try {
        // === 1) datos previos y referencias (no escribimos aún) ===
        const roomId = req.params.id

        // traemos la room antigua (si no existe devolvemos 404 ya)
        const oldRoomDoc = await roomServiceMongodb.fetchById(roomId)
        if (!oldRoomDoc) {
            res.status(404).json({ message: `Room #${roomId} not found` })
            return
        }
        const oldRoomNumber = String(oldRoomDoc.number ?? '000')

        // lista de números existentes (no archivados) para validar unicidad
        const allRoomNumbers = await roomServiceMongodb.fetchAllNumbersNotArchived()

        // === 2) construir DTO con normalizaciones ligeras ===
        const roomToValidate: RoomInterfaceDTO = {
            photos: req.body.photos,
            number: typeof req.body.number === 'string' ? req.body.number.trim().toLowerCase() : req.body.number,
            type: typeof req.body.type === 'string' ? req.body.type.trim() : req.body.type,
            amenities: req.body.amenities,
            price: req.body.price,
            discount: req.body.discount,
            isActive: typeof req.body.isActive === 'string' ? req.body.isActive.trim() : req.body.isActive,
            isArchived: typeof req.body.isArchived === 'string' ? req.body.isArchived.trim() : req.body.isArchived,
            booking_id_list: Array.isArray(req.body.booking_id_list) ? req.body.booking_id_list : []
        }

        // === 3) validación de la room (formato y reglas de negocio) ===
        const roomValidator = new RoomValidator()
        const totalErrors = roomValidator.validateExistingRoom(roomToValidate, oldRoomNumber, allRoomNumbers)
        if (totalErrors.length > 0) {
            res.status(400).json({ message: totalErrors.join(', ') })
            return
        }

        // === 4) PRE-CHECK bookings: existen y tienen formato válido? ===
        const bookingIDs: string[] = Array.from(new Set(roomToValidate.booking_id_list ?? []))

        // validar formato ObjectId y recolectar invalid ids
        const invalidFormatIds = bookingIDs.filter(id => !mongoose.Types.ObjectId.isValid(String(id)))
        if (invalidFormatIds.length > 0) {
            res.status(400).json({ message: `Invalid booking ID format: ${invalidFormatIds.join(', ')}` })
            return
        }

        // comprobar existencia en BD (pre-check) — IMPORTANTE: antes de abrir sesión
        if (bookingIDs.length > 0) {
            const foundBookings = await BookingModelMongodb.find({ _id: { $in: bookingIDs } }, { _id: 1 }).lean()
            const foundSet = new Set(foundBookings.map((b: any) => String(b._id)))
            const missing = bookingIDs.filter(id => !foundSet.has(id))
            if (missing.length > 0) {
                res.status(400).json({ message: `Some booking IDs do not exist: ${missing.join(', ')}` })
                return
            }
        }

        // === 5) TODO OK: abrir sesión y ejecutar la TRANSACCIÓN ===
        const session = await mongoose.startSession()
        try {
            await session.withTransaction(async () => {
                // 5.a) actualizar la room dentro de la sesión
                const updatedRoom = await RoomModelMongodb.findOneAndUpdate(
                    { _id: roomId },
                    roomToValidate,
                    { new: true, session }
                )

                // Si por alguna razón la room desapareció entre checks -> lanzar para rollback
                if (!updatedRoom) {
                    throw new Error(`Room #${roomId} not found`)
                }

                // 5.b) si procede, archivar bookings (bulk) dentro de la sesión
                if (roomToValidate.isActive === OptionYesNo.no || roomToValidate.isArchived === OptionYesNo.yes) {
                    if (bookingIDs.length > 0) {
                        await BookingModelMongodb.updateMany(
                            { _id: { $in: bookingIDs }, isArchived: OptionYesNo.no },
                            { $set: { isArchived: OptionYesNo.yes } },
                            { session }
                        )
                    }
                }

                // si llegamos aquí sin lanzar, la transacción hará commit automáticamente
            }) // end withTransaction

            // 6) después del commit: devolver la room final (lectura fuera de session)
            const finalRoom = await RoomModelMongodb.findById(roomId).lean()
            res.status(200).json(finalRoom)
            return
        } catch (txErr: any) {
            // errores dentro de la transacción -> rollback automático
            const msg = txErr?.message ?? 'Transaction failed'
            // Mapear a códigos: si mensaje contiene "not found" -> 404, si transacciones no soportadas -> 500 con hint
            if (String(msg).toLowerCase().includes('not found')) {
                res.status(404).json({ message: msg })
                return
            }
            if (String(msg).toLowerCase().includes('replica set') || String(msg).toLowerCase().includes('transactions')) {
                res.status(500).json({ message: `Transaction error: ${msg}. Ensure MongoDB supports transactions (replica set / Atlas).` })
                return
            }
            // por defecto 500
            res.status(500).json({ message: msg })
            return
        } finally {
            session.endSession()
        }
    } catch (error: any) {
        console.error('Error in put of roomController:', error)
        res.status(500).json({ message: (error && error.message) ? error.message : 'Internal server error' })
        return
    }
})

roomRouterMongodb.delete('/:id', adminOnly, async (req: Request, res: Response) => {
    try {
        const deletedRoom = await roomServiceMongodb.delete(req.params.id)
        if (deletedRoom) {
            res.status(204).json()
            // --> 
        }
        else {
            res.status(404).json({ message: `Room #${req.params.id} not found` })
        }
    }
    catch (error) {
        console.error("Error in delete of roomController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})
