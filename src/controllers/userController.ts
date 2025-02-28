
import { Request, Response } from 'express'
import Router from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { UserModel } from '../models/userModel'
import { UserService } from '../services/userService'
import { UserValidator } from '../validators/userValidator'
import { comparePasswords } from '../utils/hashPassword'


export const userRouter = Router()
const userService = new UserService()

userRouter.use(authMiddleware)

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         full_name:
 *           type: string
 *         email:
 *           type: string
 *         start_date:
 *           type: string
 *           format: date-time
 *         description:
 *           type: string
 *         phone_number:
 *           type: string
 *         status:
 *           type: string
 *         photo:
 *           type: string
 *           format: uri
 *         password:
 *           type: string
 *           description: Contraseña encriptada del usuario
 * 
 * /api-dashboard/v2/users:
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
 *                 $ref: '#/components/schemas/User'
 * 
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *
 * /api-dashboard/v2/users/{id}:
 *   get:
 *     summary: Obtener un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario (MongoDB ObjectId)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 *
 *   put:
 *     summary: Actualizar un usuario existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario (MongoDB ObjectId)
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 * 
 *   delete:
 *     summary: Eliminar un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario (MongoDB ObjectId)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */

userRouter.get('/', async (req: Request, res: Response) => {
    try {
        const userList = await userService.fetchAll()
        res.json(userList)
    }
    catch (error) {
        console.error("Error in get (all) of userController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

userRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await userService.fetchById(req.params.id)
        if (user !== null) {
            res.json(user)
        } else {
            res.status(404).json({ message: `User #${req.params.id} not found` })
        }
    }
    catch (error) {
        console.error("Error in get (by id) of userController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})

userRouter.post('/', async (req: Request, res: Response) => {
    const userValidator = new UserValidator()
    const totalErrors = userValidator.validateUser(req.body)
    if (totalErrors.length === 0) {
        try {
            const createdUser = await userService.create(req.body)
            res.status(201).json(createdUser)
        }
        catch (error) {
            console.error("Error in post of userController:", error)
            res.status(500).json({ message: "Internal server error" })
        }
    }
    else {
        res.status(400).json({
            message: totalErrors.join(', ')
        })
    }
})

userRouter.put('/:id', async (req: Request, res: Response) => {
    const userValidator = new UserValidator()
    const existingUser = await UserModel.findById(req.body._id).select("password")

    let passwordHasChanged = false
    if (existingUser !== null) {
        if (req.body.password !== existingUser.password) passwordHasChanged = true
    }

    const totalErrors = userValidator.validateUser(req.body, passwordHasChanged)

    if (totalErrors.length === 0) {
        try {
            const updatedUser = await userService.update(req.params.id, req.body, passwordHasChanged)
            if (updatedUser !== null) {
                // res.status(204).json(updatedUser)
                res.status(200).json(updatedUser)
            }
            else {
                res.status(404).json({ message: `User #${req.params.id} not found` })
            }
        }
        catch (error) {
            console.error("Error in put of userController:", error)
            res.status(500).json({ message: "Internal server error" })
        }
    }
    else {
        console.error(totalErrors.join(', '))
        res.status(400).json({ message: totalErrors.join(', ') })
    }
})

userRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deletedUser = await userService.delete(req.params.id)
        if (deletedUser) {
            res.status(204).json()
        } else {
            res.status(404).json({ message: `User #${req.params.id} not found` })
        }
    }
    catch (error) {
        console.error("Error in delete of userController:", error)
        res.status(500).json({ message: "Internal server error" })
    }
})