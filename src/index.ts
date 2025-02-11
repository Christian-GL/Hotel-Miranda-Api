
import express from 'express'

import { bookingRouter } from './controllers/bookingController'
import { roomRouter } from './controllers/roomController'
import { contactRouter } from './controllers/contactController'
import { userRouter } from './controllers/userController'


// const swaggerUi = require('swagger-ui-express')
// const swaggerJsDoc = require('swagger-jsdoc')
const app = express()
const port = 3000

app.use(express.json())

app.use('/bookings', bookingRouter)
app.use('/rooms', roomRouter)
app.use('/contacts', contactRouter)
app.use('/users', userRouter)

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`)
})