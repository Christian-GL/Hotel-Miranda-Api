
import { Request, Response, NextFunction } from 'express'
import Router from 'express'
import mongoose from 'mongoose'

import { ApiError } from '../../errors/ApiError'
import { authMiddleware } from '../../middleware/authMiddleware'
import { adminOnly } from '../../middleware/adminOnly'
import { comparePasswords } from '../../utils/hashPassword'
import { UserInterface } from '../../interfaces/mongodb/userInterfaceMongodb'
import { UserModelMongodb } from '../../models/mongodb/userModelMongodb'
import { UserServiceMongodb } from '../../services/mongodb/userServiceMongodb'
import { UserValidator } from '../../validators/userValidator'
import { CommonValidators } from "../../validators/commonValidators"
import { validateNewPassword } from '../../validators/validators'
import { OptionYesNo } from '../../enums/optionYesNo'


export const userRouterMongodb = Router()
const userServiceMongodb = new UserServiceMongodb()

userRouterMongodb.use(authMiddleware)

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
 * /api-dashboard/v3/users:
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
 * /api-dashboard/v3/users/{id}:
 *   get:
 *     summary: Obtener un usuario por su ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario (Mongodb ObjectId)
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
 *         description: ID del usuario (Mongodb ObjectId)
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
 *         description: ID del usuario (Mongodb ObjectId)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */

userRouterMongodb.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userList = await userServiceMongodb.fetchAll()
        res.json(userList)
    }
    catch (error) {
        return next(error)
    }
})

userRouterMongodb.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new ApiError(400, 'Invalid id format')
        }

        const user = await userServiceMongodb.fetchById(req.params.id)
        if (user === null) {
            throw new ApiError(404, `User #${req.params.id} not found`)
        }

        res.json(user)
    }
    catch (error) {
        return next(error)
    }
})

userRouterMongodb.post('/', adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userToValidate: UserInterface = {
            photo: req.body.photo == null ? null : String(req.body.photo).trim(),
            full_name: req.body.full_name.trim(),
            email: req.body.email.trim().toLowerCase(),
            phone_number: req.body.phone_number.trim(),
            start_date: new Date(req.body.start_date),
            end_date: new Date(req.body.end_date),
            job_position: req.body.job_position.trim(),
            role: req.body.role.trim(),
            password: req.body.password,
            isArchived: OptionYesNo.no
        }
        const userValidator = new UserValidator()
        const totalErrors = userValidator.validateNewUser(userToValidate)
        if (totalErrors.length > 0) {
            throw new ApiError(400, totalErrors.join(', '))
        }

        const createdUser = await userServiceMongodb.create(userToValidate)
        if (!createdUser) {
            throw new ApiError(500, 'Error creating user')
        }

        res.status(201).json(createdUser)
    }
    catch (error) {
        return next(error)
    }
})

userRouterMongodb.put('/:id', adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, 'Invalid id format')
        }

        const existingUser = await UserModelMongodb.findById(userId).select('password')
        if (!existingUser) {
            throw new ApiError(404, `User #${userId} not found`)
        }

        const newPassword = req.body.password
        const newPasswordErrors = validateNewPassword(newPassword)
        if (newPasswordErrors.length > 0) {
            throw new ApiError(400, newPasswordErrors.join(', '))
        }

        let isPasswordChanged: boolean = false
        const isSamePassword = await comparePasswords(newPassword, existingUser.password)
        isPasswordChanged = !isSamePassword
        const userToValidate: UserInterface = {
            photo: req.body.photo === null ? null : String(req.body.photo).trim(),
            full_name: req.body.full_name.trim(),
            email: req.body.email.trim().toLowerCase(),
            phone_number: req.body.phone_number.trim(),
            start_date: new Date(req.body.start_date),
            end_date: new Date(req.body.end_date),
            job_position: req.body.job_position.trim(),
            role: req.body.role.trim(),
            password: req.body.password,
            isArchived: req.body.isArchived.trim()
        }
        const userValidator = new UserValidator()
        const totalErrors = userValidator.validateExistingUser(userToValidate, isPasswordChanged)
        if (totalErrors.length > 0) {
            throw new ApiError(400, totalErrors.join(', '))
        }

        const updatedUser = await userServiceMongodb.update(userId, userToValidate, isPasswordChanged)
        if (!updatedUser) {
            throw new ApiError(404, `User #${userId} not found`)
        }

        res.status(200).json(updatedUser)
    }
    catch (error) {
        return next(error)
    }
})

userRouterMongodb.patch('/archive/:id', adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new ApiError(400, 'Invalid id format')
        }

        const newArchivedValue: OptionYesNo = req.body.isArchived
        const commonValidator = new CommonValidators()
        const totalErrors = commonValidator.validateArchivedOption(newArchivedValue)
        if (totalErrors.length > 0) {
            throw new ApiError(400, totalErrors.join(', '))
        }

        const result = await userServiceMongodb.archive(userId, newArchivedValue)
        if (!result) {
            throw new ApiError(404, `User #${userId} not found`)
        }

        res.status(200).json(result)
    }
    catch (error) {
        return next(error)
    }
})

userRouterMongodb.delete('/:id', adminOnly, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.id
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw new ApiError(400, 'Invalid id format')
        }

        const deletedUser = await userServiceMongodb.delete(userId)
        if (!deletedUser) {
            throw new ApiError(404, `User #${userId} not found`)
        }

        res.status(204).json()
    }
    catch (error) {
        return next(error)
    }
})