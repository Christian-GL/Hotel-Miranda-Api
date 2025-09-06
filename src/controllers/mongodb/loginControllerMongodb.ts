
import { Request, Response, Router } from "express"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
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


loginRouterMongodb.post('/', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body
    const userService = new UserServiceMongodb()

    try {
        let user: UserInterfaceIdMongodb | null | undefined = null
        if (typeof (userService as any).fetchByEmail === 'function') {
            user = await (userService as any).fetchByEmail(email)
        }
        else {
            const all = await userService.fetchAll()
            user = all.find(u => u.email === email)
        }

        if (!user) {
            res.status(404).json({ message: 'User or password wrong' })
            return
        }

        if (!process.env.TOKEN_SECRET) {
            console.error('TOKEN_SECRET not defined')
            res.status(500).json({ message: 'Server error: TOKEN_SECRET is not defined' })
            return
        }

        const passwordMatches = await bcrypt.compare(password, user.password)
        if (!passwordMatches) {
            res.status(400).json({ message: 'User or password wrong' })
            return
        }

        const payload = {
            id: user._id.toString(),
            role: (user as any).role ?? 'user'
        }

        const token = jwt.sign(payload, process.env.TOKEN_SECRET as string, { expiresIn: '1h' })

        res.status(200).json({
            token,
            loggedUserID: user._id.toString(),
            role: payload.role
        })
        return
    }
    catch (err) {
        console.error('Login error:', err)
        res.status(500).json({ message: 'Internal server error' })
        return
    }
})