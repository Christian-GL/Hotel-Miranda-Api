
import { Request, Response, Router } from "express"
import userData from '../data/userData.json'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { AccountInterface } from "../interfaces/accountInterface"


export const loginRouter = Router()

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
 *                 example: admin
 *               password:
 *                 type: string
 *                 description: La contraseña del usuario
 *                 example: 1234
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
loginRouter.post('', (req: Request, res: Response) => {
    const { email, password } = req.body

    const user: AccountInterface[] = userData.filter(u => u.email === email)
    if (user.length === 0) {
        res.status(404).send('User not found')
    }
    if (!process.env.TOKEN_SECRET) {
        res.status(500).send('Server error: TOKEN_SECRET is not defined')
    }

    // // PARA GENERAR HASHES CON bcrypt
    // bcrypt.hash('1234', 10, (error, hashedPassword) => {
    //     if (error) {
    //         console.error('Error hashing password: ', error)
    //         return
    //     }
    //     console.log('Hashed password:', hashedPassword)
    // })

    bcrypt.compare(password, user[0].password)
        .then(result => {
            if (!result) {
                res.status(400).send({ token: 'User or password wrong' })
                return
            }
            else {
                const token = jwt.sign({ email: user[0].email }, process.env.TOKEN_SECRET as string, { expiresIn: '1w' })
                res.status(200).send({ token: token })
            }
        })
})