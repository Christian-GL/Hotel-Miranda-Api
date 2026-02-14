
import { Request, Response, Router, NextFunction } from "express"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { ApiError } from '../../errors/ApiError'
import { UserInterfaceIdMongodb } from "../../interfaces/mongodb/userInterfaceMongodb"
import { UserServiceMongodb } from "../../services/mongodb/userServiceMongodb"


export const loginRouterMongodb = Router()

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Iniciar sesión y obtener un token JWT
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: El correo electrónico del usuario
 *                 example: christiangl1.dev@gmail.com
 *               password:
 *                 type: string
 *                 description: La contraseña del usuario
 *                 example: Abcd1234.
 *     responses:
 *       200:
 *         description: Token JWT generado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: El token JWT que se utiliza para acceder a otras rutas protegidas
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluIiwiZXhwIjoxNjMwMzg1NzQyfQ.NLwcmTdhA89rfO0"
 *       400:
 *         description: Usuario o contraseña incorrectos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor, no se ha definido TOKEN_SECRET
 */


loginRouterMongodb.post('/', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body
    const userService = new UserServiceMongodb()

    try {
        let user: UserInterfaceIdMongodb | null | undefined = null
        if (typeof (userService as any).fetchByEmail === 'function') {
            user = await (userService as any).fetchByEmail(email)
        }
        else {
            const allUsers = await userService.fetchAll()
            user = allUsers.find(user => user.email === email)
        }

        if (!user) {
            throw new ApiError(404, 'Email or password wrong')
        }
        if (!process.env.TOKEN_SECRET) {
            throw new ApiError(500, 'Server error: TOKEN_SECRET is not defined')
        }
        const now = new Date()
        if (now < new Date(user.start_date) || now > new Date(user.end_date)) {
            throw new ApiError(403, 'Access denied: The user is not active in the allowed date range, contact an administrator')
        }

        const passwordMatches = await bcrypt.compare(password, user.password)
        if (!passwordMatches) {
            throw new ApiError(400, 'Email or password wrong')
        }

        const payload = {
            id: user._id.toString(),
            role: (user as any).role ?? 'user'
        }

        // 's'(segundos) 'm'(minutos) 'h'(horas)  'd'(días) 'w'(semanas) 'y'(años)
        const token = jwt.sign(payload, process.env.TOKEN_SECRET as string, { expiresIn: '1h' })

        res.status(200).json({
            token,
            loggedUserID: user._id.toString(),
            role: payload.role
        })
        return
    }
    catch (error) {
        next(error)
    }
})