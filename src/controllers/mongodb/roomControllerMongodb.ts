
import { Request, Response } from 'express'
import Router from 'express'
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

roomRouterMongodb.put('/:id', async (req: Request, res: Response) => {
    try {
        const oldRoomDoc = await roomServiceMongodb.fetchById(req.params.id)
        const oldRoomNumber = String(oldRoomDoc?.number ?? '000')
        const allRoomNumbers = await roomServiceMongodb.fetchAllNumbersNotArchived()
        const roomToValidate: RoomInterfaceDTO = {
            photos: req.body.photos,
            number: typeof req.body.number === 'string' ? req.body.number.trim().toLowerCase() : req.body.number,
            type: typeof req.body.type === 'string' ? req.body.type.trim() : req.body.type,
            amenities: req.body.amenities,
            price: req.body.price,
            discount: req.body.discount,
            isActive: typeof req.body.isActive === 'string' ? req.body.isActive.trim() : req.body.isActive,
            isArchived: typeof req.body.isArchived === 'string' ? req.body.isArchived.trim() : req.body.isArchived,
            booking_id_list: Array.isArray(req.body.booking_id_list) ? req.body.booking_id_list : [] // <--
        }

        const roomValidator = new RoomValidator()
        const totalErrors = roomValidator.validateExistingRoom(roomToValidate, oldRoomNumber, allRoomNumbers)
        if (totalErrors.length > 0) {
            res.status(400).json({ message: totalErrors.join(', ') })
            return
        }

        const updatedRoom = await roomServiceMongodb.update(req.params.id, roomToValidate)
        if (!updatedRoom) {
            res.status(404).json({ message: `Room #${req.params.id} not found` })
            return
        }

        // Si la habitación queda inactiva/archivada archivamos sus bookings activas.
        if (roomToValidate.isActive === OptionYesNo.no || roomToValidate.isArchived === OptionYesNo.yes) {
            const bookingIds: string[] = Array.from(new Set(roomToValidate.booking_id_list ?? []))
            const results = await Promise.all(bookingIds.map(async (idBooking) => {
                try {
                    const booking = await bookingServiceMongodb.fetchById(idBooking)
                    if (!booking) return { id: idBooking, status: 'not found' }

                    if (booking.isArchived === OptionYesNo.no) {
                        booking.isArchived = OptionYesNo.yes
                        const updatedBooking = await bookingServiceMongodb.update(idBooking, booking)
                        return updatedBooking ? { id: idBooking, status: 'archived' } : { id: idBooking, status: 'update failed' }
                    }
                    else {
                        return { id: idBooking, status: 'already archived' }
                    }
                }
                catch (err) {
                    console.error(`Error archiving booking ${idBooking}:`, err)
                    return { id: idBooking, status: 'error', error: String(err) }
                }
            }))
            const problems = results.filter(r => r.status !== 'archived' && r.status !== 'already archived')
            if (problems.length > 0) {
                // Aquí optamos por devolver 200 con el detalle de qué pasó.
                // Alternativa: devolver 207 (Multi-Status) o 500 si quieres hacer la operación estricta.
                res.status(200).json({ room: updatedRoom, bookingArchiveResults: results })
                return
            }
        }

        res.status(200).json(updatedRoom)
        return
    }
    catch (error) {
        console.error("Error in put of roomController: ", error)
        res.status(500).json({ message: "Internal server error" })
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
