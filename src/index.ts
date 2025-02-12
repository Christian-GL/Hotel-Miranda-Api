
import express, { Request, Response } from 'express'

import { bookingRouter } from './controllers/bookingController'
import { roomRouter } from './controllers/roomController'
import { contactRouter } from './controllers/contactController'
import { userRouter } from './controllers/userController'


const swaggerUi = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const app = express()
const port = 3000
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Documentación de la API',
            version: '1.0.0',
            description: 'Documentación de la API para gestionar bookings, rooms, contacts y users',
        },
    },
    apis: ['./src/controllers/*.ts'],
}
const swaggerDocs = swaggerJsDoc(options)

app.use(express.json())
app.use('/api-dashboard/v1/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
app.use('/api-dashboard/v1/bookings', bookingRouter)
app.use('/api-dashboard/v1/rooms', roomRouter)
app.use('/api-dashboard/v1/contacts', contactRouter)
app.use('/api-dashboard/v1/users', userRouter)

app.get('/', (req: Request, res: Response) => {
    res.redirect('/api-dashboard/v1/swagger')
})
app.get('/live', (req: Request, res: Response) => {
    res.send(`${new Date().toISOString()}`)
})
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`)
})