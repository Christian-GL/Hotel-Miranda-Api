
import { Request, Response } from 'express'
import Router from 'express'
import { BookingService } from '../services/bookingService'
import { BookingValidator } from '../validators/bookingValidator'


export const bookingRouter = Router()
const bookingService = new BookingService()

bookingRouter.get('/', (req: Request, res: Response) => {
    const bookingList = bookingService.fetchAll()
    res.json(bookingList)
})

bookingRouter.get('/:id', (req: Request, res: Response) => {
    const booking = bookingService.fetchById(parseInt(req.params.id))
    if (booking !== undefined) {
        res.json(booking)
    } else {
        res.status(404).json({ message: `Booking #${req.params.id} not found` })
    }
})

bookingRouter.post('/', (req: Request, res: Response) => {
    const bookingValidator = new BookingValidator()
    const validation = bookingValidator.validateBooking(req.body)
    if (validation.length === 0) {
        const newBooking = bookingService.create(req.body)
        res.status(201).json(newBooking)
    }
    else {
        res.status(400).json({
            message: validation.join(', ')
        })
    }
})

bookingRouter.put('/', (req: Request, res: Response) => {
    const bookingValidator = new BookingValidator()
    const updatedBooking = bookingService.update(req.body)
    if (updatedBooking !== undefined) {
        const validation = bookingValidator.validateBooking(req.body)
        if (validation.length === 0) {
            res.status(204).json(updatedBooking)
        }
        else {
            res.status(400).json({ message: validation.join(', ') })
        }
    }
    else {
        res.status(404).json({ message: `Booking #${req.params.id} not found` })
    }
})

bookingRouter.delete('/:id', (req: Request, res: Response) => {
    const deletedBooking = bookingService.delete(parseInt(req.params.id))
    if (deletedBooking) {
        res.status(204).json({ message: `Booking #${req.params.id} deleted` })
    } else {
        res.status(404).json({ message: `Booking #${req.params.id} not found` })
    }
})