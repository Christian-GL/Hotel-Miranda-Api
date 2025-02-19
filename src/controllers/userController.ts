
import { Request, Response } from 'express'
import Router from 'express'
import { authMiddleware } from '../middleware/authMiddleware'
import { UserService } from '../services/userService'
import { UserValidator } from '../validators/userValidator'


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
 *                   status:
 *                     type: string
 *                   photo:
 *                     type: string
 *                     format: uri
 *                   password:
 *                     type: string
 *                     description: Contraseña encriptada del usuario
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
 *                 status:
 *                   type: string
 *                 photo:
 *                   type: string
 *                   format: uri
 *                 password:
 *                   type: string
 *                   description: Contraseña encriptada del usuario
 *       404:
 *         description: Usuario no encontrado
 */
userRouter.get('/:id', async (req: Request, res: Response) => {
    try {
        const user = await userService.fetchById(parseInt(req.params.id))
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
 *               status:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: uri
 *               password:
 *                 type: string
 *                 description: Contraseña encriptada del usuario
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */
userRouter.post('/', async (req: Request, res: Response) => {
    const userValidator = new UserValidator()
    const totalErrors = userValidator.validateUser(req.body)
    if (totalErrors.length === 0) {
        try {
            const newUser = req.body
            const createdUser = await userService.create(newUser)
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
 *               status:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: uri
 *               password:
 *                 type: string
 *                 description: Contraseña encriptada del usuario
 *     responses:
 *       204:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario no encontrado
 */
userRouter.put('/', async (req: Request, res: Response) => {
    const userValidator = new UserValidator()
    const totalErrors = userValidator.validateUser(req.body)

    if (totalErrors.length === 0) {
        try {
            const updatedUser = await userService.update(req.body)
            if (updatedUser !== null) {
                res.status(204).json(updatedUser)
            }
            else {
                res.status(404).json({ message: `User #${req.body.id} not found` })
            }
        }
        catch (error) {
            console.error("Error in put of userController:", error)
            res.status(500).json({ message: "Internal server error" })
        }
    }
    else {
        res.status(400).json({ message: totalErrors.join(', ') })
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
userRouter.delete('/:id', async (req: Request, res: Response) => {
    try {
        const deletedUser = await userService.delete(parseInt(req.params.id))
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