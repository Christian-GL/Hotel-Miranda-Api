
import express from "express"
import cors from "cors"

import { loginRouterMongodb } from "../controllers/mongodb/loginControllerMongodb"
import { bookingRouterMongodb } from "../controllers/mongodb/bookingControllerMongodb"
import { roomRouterMongodb } from "../controllers/mongodb/roomControllerMongodb"
import { clientRouterMongodb } from "../controllers/mongodb/clientControllerMongodb"
import { userRouterMongodb } from "../controllers/mongodb/userControllerMongodb"

import { errorMiddleware } from "../errors/errorMiddleware"


export const appForTest = express()

appForTest.use(express.json())
appForTest.use(cors())

appForTest.use('/login', loginRouterMongodb)
appForTest.use('/api-dashboard/v3/bookings', bookingRouterMongodb)
appForTest.use('/api-dashboard/v3/rooms', roomRouterMongodb)
appForTest.use('/api-dashboard/v3/clients', clientRouterMongodb)
appForTest.use('/api-dashboard/v3/users', userRouterMongodb)

appForTest.use(errorMiddleware)

appForTest.get('/live', (req, res) => {
    res.send(`${new Date().toISOString()}`)
})