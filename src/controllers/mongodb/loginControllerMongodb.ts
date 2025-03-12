
import { Request, Response, Router } from "express"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserInterfaceMongodb } from "../../interfaces/mongodb/userInterfaceMongodb"
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

loginRouterMongodb.post('', async (req: Request, res: Response) => {
    const { email, password } = req.body
    const userService = new UserServiceMongodb()
    const userData = await userService.fetchAll()
    const user: UserInterfaceMongodb[] = userData.filter(u => u.email === email)

    if (user.length === 0) {
        res.status(404).send({ message: 'User or password wrong' })
        return
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server error: TOKEN_SECRET is not defined')
        return
    }

    bcrypt.compare(password, user[0].password)
        .then(result => {
            if (!result) {
                res.status(400).send({ message: 'User or password wrong' })
                return
            }
            else {
                const token = jwt.sign(
                    { id: user[0]._id },
                    process.env.TOKEN_SECRET as string,
                    { expiresIn: '1y' }
                )
                res.status(200).send({
                    token: token,
                    loggedUserID: user[0]._id
                })
                return
            }
        })
})