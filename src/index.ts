
import cors from 'cors'
import express, { Request, Response } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import serverless from 'serverless-http'

import { connectMongodbDB } from './utils/databaseMongodb'
import { loginRouterMongodb } from './controllers/mongodb/loginControllerMongodb'
import { bookingRouterMongodb } from './controllers/mongodb/bookingControllerMongodb'
import { roomRouterMongodb } from './controllers/mongodb/roomControllerMongodb'
import { clientRouterMongodb } from './controllers/mongodb/clientControllerMongodb'
import { userRouterMongodb } from './controllers/mongodb/userControllerMongodb'
import { errorMiddleware } from './errors/errorMiddleware'
// import { swaggerOptions } from './utils/swaggerConfig/swaggerOptions'
// import { swaggerDarkTheme } from './utils/swaggerConfig/swaggerDarkTheme'
// import { connectMysqlDB } from './utils/databaseMysql'
// import { loginRouterMysql } from './controllers/mysql/loginControllerMysql'
// import { bookingRouterMysql } from './controllers/mysql/bookingControllerMysql'
// import { roomRouterMysql } from './controllers/mysql/roomControllerMysql'
// import { contactRouterMysql } from './controllers/mysql/contactControllerMysql'
// import { userRouterMysql } from './controllers/mysql/userControllerMysql'



/* === VERSION PARA LOCAL === */
export const app = express()
const port = 3002
// const swaggerDocs = swaggerJsDoc(swaggerOptions)

app.use(express.json())
app.use(cors())
// app.use('/api-dashboard/v3/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
// app.use('/api-dashboard/v3/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
//   customCss: swaggerDarkTheme
// }))

app.use('/login', loginRouterMongodb)
app.use('/api-dashboard/v3/bookings', bookingRouterMongodb)
app.use('/api-dashboard/v3/rooms', roomRouterMongodb)
app.use('/api-dashboard/v3/clients', clientRouterMongodb)
app.use('/api-dashboard/v3/users', userRouterMongodb)
app.use(errorMiddleware)
// app.use('/login', loginRouterMysql)
// app.use('/api-dashboard/v3/bookings', bookingRouterMysql)
// app.use('/api-dashboard/v3/rooms', roomRouterMysql)
// app.use('/api-dashboard/v3/contacts', contactRouterMysql)
// app.use('/api-dashboard/v3/users', userRouterMysql)
// app.use(errorMiddleware)

// app.get('/', (req: Request, res: Response) => {
//   res.redirect('/api-dashboard/v3/swagger')
// })
app.get('/live', (req: Request, res: Response) => {
  res.send(`${new Date().toISOString()}`)
})

const runServer = async () => {
  await connectMongodbDB()
  // await connectMysqlDB()
  app.listen(port, () => {
    console.log(`===> Server is running in http://localhost:${port} <===`)
  })
}
runServer()



/* === VERSION PARA AWS (SERVERLESS) === */
// export const app = express()
// app.use(express.json())
// app.use(cors())

// app.use('/login', loginRouterMongodb)
// app.use('/api-dashboard/v3/bookings', bookingRouterMongodb)
// app.use('/api-dashboard/v3/rooms', roomRouterMongodb)
// app.use('/api-dashboard/v3/clients', clientRouterMongodb)
// app.use('/api-dashboard/v3/users', userRouterMongodb)
// app.use(errorMiddleware)
// // app.use('/login', loginRouterMysql)
// // app.use('/api-dashboard/v3/bookings', bookingRouterMysql)
// // app.use('/api-dashboard/v3/rooms', roomRouterMysql)
// // app.use('/api-dashboard/v3/contacts', contactRouterMysql)
// // app.use('/api-dashboard/v3/users', userRouterMysql)

// app.get('/live', (_req: Request, res: Response) => {
//   res.send(new Date().toISOString())
// })

// const handlerLambda = serverless(app)
// let isDbConnected = false

// export const main = async (event: any, context: any) => {
//   context.callbackWaitsForEmptyEventLoop = false
//   console.log('Handler ON')
//   if (!isDbConnected) {
//     console.log('Connecting to Mongodb Atlas…')
//     await connectMongodbDB()
//     // await connectMysqlDB()
//     console.log('Connection completed')
//     isDbConnected = true
//   }
//   return handlerLambda(event, context)
// }
// export const handler = main





/* ===== Comandos para generar carpeta de la API para subir a AmazonWebServices: ===== */
//  >> Remove-Item -Recurse -Force dist, .serverless      // Elimina el contenido generado por el "npx tsc" anterior
// 	>> npx tsc
//  >> serverless remove        // Eliminar configuración anterior (opcional pero recomendable si hay errores)
// 	>> serverless deploy
//  >> npx serverless info      // Ver info (útil para saber endpoint)serverless remove