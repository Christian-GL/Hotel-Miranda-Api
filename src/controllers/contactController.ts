
import { Request, Response } from 'express'
import Router from 'express'
import { ContactService } from '../services/contactService'
import { ContactValidator } from '../validators/contactValidator'


export const contactRouter = Router()
const contactService = new ContactService()

contactRouter.get('/', (req: Request, res: Response) => {
    const contactList = contactService.fetchAll()
    res.json(contactList)
})

contactRouter.get('/:id', (req: Request, res: Response) => {
    const contact = contactService.fetchById(parseInt(req.params.id))
    if (contact !== undefined) {
        res.json(contact)
    } else {
        res.status(404).json({ message: `Contact #${req.params.id} not found` })
    }
})

contactRouter.post('/', (req: Request, res: Response) => {
    const contactValidator = new ContactValidator()
    const validation = contactValidator.validateContact(req.body)
    if (validation.length === 0) {
        const newContact = contactService.create(req.body)
        res.status(201).json(newContact)
    }
    else {
        res.status(400).json({
            message: validation.join(', ')
        })
    }
})

contactRouter.put('/', (req: Request, res: Response) => {
    const contactValidator = new ContactValidator()
    const updatedContact = contactService.update(req.body)
    if (updatedContact !== undefined) {
        const validation = contactValidator.validateContact(req.body)
        if (validation.length === 0) {
            res.status(204).json(updatedContact)
        }
        else {
            res.status(400).json({ message: validation.join(', ') })
        }
    }
    else {
        res.status(404).json({ message: `Contact #${req.params.id} not found` })
    }
})

contactRouter.delete('/:id', (req: Request, res: Response) => {
    const deletedContact = contactService.delete(parseInt(req.params.id))
    if (deletedContact) {
        res.status(204).json({ message: `Contact #${req.params.id} deleted` })
    } else {
        res.status(404).json({ message: `Contact #${req.params.id} not found` })
    }
})