
import { Request, Response } from 'express'
import Router from 'express'
import { RoomService } from '../services/roomService'
import { RoomValidator } from '../validators/roomValidator'


export const roomRouter = Router()
const roomService = new RoomService()

roomRouter.get('/', (req: Request, res: Response) => {
    const roomList = roomService.fetchAll()
    res.json(roomList)
})

roomRouter.get('/:id', (req: Request, res: Response) => {
    const room = roomService.fetchById(parseInt(req.params.id))
    if (room !== undefined) {
        res.json(room)
    } else {
        res.status(404).json({ message: `Room  #${req.params.id} not found` })
    }
})

roomRouter.post('/', (req: Request, res: Response) => {
    const roomValidator = new RoomValidator()
    const validation = roomValidator.validateRoom(req.body)
    if (validation.length === 0) {
        const newRoom = roomService.create(req.body)
        res.status(201).json(newRoom)
    }
    else {
        res.status(400).json({
            message: validation.join(', ')
        })
    }
})

roomRouter.put('/', (req: Request, res: Response) => {
    const roomValidator = new RoomValidator()
    const updatedRoom = roomService.update(req.body)
    if (updatedRoom !== undefined) {
        const validation = roomValidator.validateRoom(req.body)
        if (validation.length === 0) {
            res.status(204).json(updatedRoom)
        }
        else {
            res.status(400).json({ message: validation.join(', ') })
        }
    }
    else {
        res.status(404).json({ message: `Room #${req.params.id} not found` })
    }
})

roomRouter.delete('/:id', (req: Request, res: Response) => {
    const deletedRoom = roomService.delete(parseInt(req.params.id))
    if (deletedRoom) {
        res.status(204).json({ message: `Room #${req.params.id} deleted` })
    } else {
        res.status(404).json({ message: `Room #${req.params.id} not found` })
    }
})