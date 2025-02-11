
import { Request, Response } from 'express'
import Router from 'express'
import { UserService } from '../services/userService'
import { UserValidator } from '../validators/userValidator'


export const userRouter = Router()
const userService = new UserService()

userRouter.get('/', (req: Request, res: Response) => {
    const userList = userService.fetchAll()
    res.json(userList)
})

userRouter.get('/:id', (req: Request, res: Response) => {
    const user = userService.fetchById(parseInt(req.params.id))
    if (user !== undefined) {
        res.json(user)
    } else {
        res.status(404).json({ message: `User #${req.params.id} not found` })
    }
})

userRouter.post('/', (req: Request, res: Response) => {
    const userValidator = new UserValidator()
    const validation = userValidator.validateUser(req.body)
    if (validation.length === 0) {
        const newUser = userService.create(req.body)
        res.status(201).json(newUser)
    }
    else {
        res.status(400).json({
            message: validation.join(', ')
        })
    }
})

userRouter.put('/', (req: Request, res: Response) => {
    const userValidator = new UserValidator()
    const updatedUser = userService.update(req.body)
    if (updatedUser !== undefined) {
        const validation = userValidator.validateUser(req.body)
        if (validation.length === 0) {
            res.status(204).json(updatedUser)
        }
        else {
            res.status(400).json({ message: validation.join(', ') })
        }
    }
    else {
        res.status(404).json({ message: `User #${req.params.id} not found` })
    }
})

userRouter.delete('/:id', (req: Request, res: Response) => {
    const deletedUser = userService.delete(parseInt(req.params.id))
    if (deletedUser) {
        res.status(204).json({ message: `User #${req.params.id} deleted` })
    } else {
        res.status(404).json({ message: `User #${req.params.id} not found` })
    }
})