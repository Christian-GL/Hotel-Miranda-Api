
import { Request, Response } from 'express'
import Router from 'express'
import { UserService } from '../services/userService'
import { UserValidator } from '../validators/userValidator'
import { authMiddleware } from '../middleware/authMiddleware'


export const userRouter = Router()
const userService = new UserService()

userRouter.use(authMiddleware)

/**
 * @swagger
 * /api-dashboard/v1/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   full_name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   start_date:
 *                     type: string
 *                     format: date
 *                   description:
 *                     type: string
 *                   phone_number:
 *                     type: string
 *                   status_active:
 *                     type: boolean
 *                   photo:
 *                     type: string
 *                     format: uri
 */
userRouter.get('/', (req: Request, res: Response) => {
    const userList = userService.fetchAll()
    res.json(userList)
})

/**
 * @swagger
 * /api-dashboard/v1/users/{id}:
 *   get:
 *     summary: Obtener un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 full_name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 start_date:
 *                   type: string
 *                   format: date
 *                 description:
 *                   type: string
 *                 phone_number:
 *                   type: string
 *                 status_active:
 *                   type: boolean
 *                 photo:
 *                   type: string
 *                   format: uri
 *       404:
 *         description: Usuario no encontrado
 */
userRouter.get('/:id', (req: Request, res: Response) => {
    const user = userService.fetchById(parseInt(req.params.id))
    if (user !== undefined) {
        res.json(user)
    } else {
        res.status(404).json({ message: `User #${req.params.id} not found` })
    }
})

/**
 * @swagger
 * /api-dashboard/v1/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               status_active:
 *                 type: boolean
 *               photo:
 *                 type: string
 *                 format: uri
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */
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

/**
 * @swagger
 * /api-dashboard/v1/users:
 *   put:
 *     summary: Actualizar un usuario existente
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               status_active:
 *                 type: boolean
 *               photo:
 *                 type: string
 *                 format: uri
 *     responses:
 *       204:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 */
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

/**
 * @swagger
 * /api-dashboard/v1/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
userRouter.delete('/:id', (req: Request, res: Response) => {
    const deletedUser = userService.delete(parseInt(req.params.id))
    if (deletedUser) {
        res.status(204).json({ message: `User #${req.params.id} deleted` })
    } else {
        res.status(404).json({ message: `User #${req.params.id} not found` })
    }
})