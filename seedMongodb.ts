
import { allLocales, faker } from '@faker-js/faker'
import { connectMongodbDB } from './src/utils/databaseMongodb'
import { hashPassword } from './src/utils/hashPassword'

import { BookingInterfaceCheckInOut, BookingInterfaceIdMongodb } from './src/interfaces/mongodb/bookingInterfaceMongodb'
import { RoomInterface, RoomInterfaceIdMongodb } from './src/interfaces/mongodb/roomInterfaceMongodb'
import { ClientInterfaceIdMongodb } from './src/interfaces/mongodb/clientInterfaceMongodb'
import { UserInterfaceIdMongodb } from './src/interfaces/mongodb/userInterfaceMongodb'
import { BookingModelMongodb } from './src/models/mongodb/bookingModelMongodb'
import { RoomModelMongodb } from './src/models/mongodb/roomModelMongodb'
import { ClientModelMongodb } from './src/models/mongodb/clientModelMongodb'
import { UserModelMongodb } from './src/models/mongodb/userModelMongodb'
import { BookingValidator } from './src/validators/bookingValidator'
import { RoomValidator } from './src/validators/roomValidator'
import { ClientValidator } from './src/validators/clientValidator'
import { UserValidator } from './src/validators/userValidator'
import { RoomType } from './src/enums/roomType'
import { RoomAmenities } from './src/enums/roomAmenities'
import { OptionYesNo } from './src/enums/optionYesNo'
import { Role } from './src/enums/role'
import { BookingServiceMongodb } from './src/services/mongodb/bookingServiceMongodb'
import { RoomServiceMongodb } from './src//services/mongodb/roomServiceMongodb'
import { ClientServiceMongodb } from './src/services/mongodb/clientServiceMongodb'


const bookingServiceMongodb = new BookingServiceMongodb()
const roomServiceMongodb = new RoomServiceMongodb()
const clientServiceMongodb = new ClientServiceMongodb()

const createUsers = async (numberUsers: number): Promise<void> => {
    await connectMongodbDB()
    try {
        const users: InstanceType<typeof UserModelMongodb>[] = []
        const userValidator = new UserValidator()
        let totalErrors
        for (let i = 0; i < numberUsers; i++) {

            const dayMs = 24 * 60 * 60 * 1000
            const now = new Date()
            const oneYearFromNow = new Date(now.getTime() + 365 * dayMs)
            const startDate = faker.date.between({
                from: now,
                to: oneYearFromNow
            })
            const minEnd = new Date(startDate.getTime() + 30 * dayMs)
            const maxEnd = new Date(startDate.getTime() + 365 * dayMs)
            const endDate = faker.date.between({
                from: minEnd,
                to: maxEnd
            })

            const fakeUser = new UserModelMongodb({
                photo: faker.image.avatar(),
                full_name: faker.person.fullName(),
                email: faker.internet.email(),
                phone_number: faker.string.numeric(9),
                start_date: startDate,
                end_date: endDate,
                job_position: faker.lorem.paragraph(),
                role: faker.helpers.arrayElement(Object.values(Role)),
                password: 'Abcd1234.',
                isArchived: faker.helpers.arrayElement(Object.values(OptionYesNo))
            })
            totalErrors = userValidator.validateUser(fakeUser.toObject() as UserInterfaceIdMongodb, true)
            if (totalErrors.length === 0) {
                fakeUser.password = await hashPassword(fakeUser.password)
                users.push(fakeUser)
            }
            else {
                console.error(`Validación fallida en el fakeUser #${i}: ${totalErrors.join(', ')}`)
                continue
            }
        }
        console.log(`Total users válidos: [${users.length}]`)
        await UserModelMongodb.insertMany(users)
    }
    catch (error) {
        console.error('Error creating users with faker', error)
        throw error
    }
}

const createClientsNoBookings = async (numberClients: number): Promise<void> => {
    await connectMongodbDB()
    try {
        const clients: InstanceType<typeof ClientModelMongodb>[] = []
        const clientValidator = new ClientValidator()
        let totalErrors
        for (let i = 0; i < numberClients; i++) {
            const fakeClient = new ClientModelMongodb({
                full_name: faker.person.fullName(),
                email: faker.internet.email(),
                phone_number: faker.string.numeric(9),
                isArchived: faker.helpers.arrayElement(Object.values(OptionYesNo)),
                booking_id_list: []
            })
            totalErrors = clientValidator.validateNewClient(fakeClient.toObject() as ClientInterfaceIdMongodb)
            if (totalErrors.length === 0) {
                clients.push(fakeClient)
            }
            else {
                console.error(`Validación fallida en el fakeClient #${i}: ${totalErrors.join(', ')}`)
                continue
            }
        }
        console.log(`Total users válidos: [${clients.length}]`)
        await ClientModelMongodb.insertMany(clients)
    }
    catch (error) {
        console.error('Error creating clients with faker', error)
        throw error
    }
}

const createRoomsOnly = async (numberRooms: number): Promise<void> => {
    await connectMongodbDB()
    try {
        const rooms: InstanceType<typeof RoomModelMongodb>[] = []
        const roomValidator = new RoomValidator()
        // URL fotos de rooms: https://unsplash.com/es/s/fotos/hotel-room
        const hotelRoomImages = [
            "https://plus.unsplash.com/premium_photo-1661963239507-7bdf41a5e66b?q=80&w=823&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1711059985570-4c32ed12a12c?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1631048730581-96121466be1c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1631049421450-348ccd7f8949?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1631049035115-f96132761a38?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1631049307485-2bfb23080676?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1631048834949-1df85dc7b02f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1631049307485-2bfb23080676?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1631048835135-3e8ac5e99ba0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1631048835153-946fa051ceee?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1646974400439-321c4a9240b9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://plus.unsplash.com/premium_photo-1678297269904-6c46528b36a7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1698927100805-2a32718a7e05?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1664227430717-9a62112984cf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1648766426924-2f08483b30aa?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://plus.unsplash.com/premium_photo-1687995673398-bf3e55667dc5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://plus.unsplash.com/premium_photo-1670360414903-19e5832f8bc4?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1568495248636-6432b97bd949?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ]
        let totalRoomNumbers = await roomServiceMongodb.fetchAllNumbersNotArchived()
        let actualNumber = ''
        let totalErrors
        for (let i = 0; i < numberRooms; i++) {
            actualNumber = String(faker.number.int({ min: 0, max: 999 })).padStart(3, '0')
            const fakeRoom = new RoomModelMongodb({
                photos: faker.helpers.arrayElements(hotelRoomImages, faker.number.int({ min: 3, max: 5 })),
                number: actualNumber,
                type: faker.helpers.arrayElement(Object.values(RoomType)),
                amenities: faker.helpers.arrayElements(Object.values(RoomAmenities), faker.number.int({ min: 1, max: Math.max(1, Object.values(RoomAmenities).length) })) as RoomAmenities[],
                price: faker.number.float({ min: 25, max: 10000, fractionDigits: 2 }),
                discount: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
                isActive: faker.helpers.arrayElement(Object.values(OptionYesNo)),
                isArchived: faker.helpers.arrayElement(Object.values(OptionYesNo)),
                booking_id_list: []
            })
            totalErrors = roomValidator.validateNewRoom(
                fakeRoom.toObject() as RoomInterfaceIdMongodb,
                totalRoomNumbers
            )
            if (totalErrors.length === 0) {
                rooms.push(fakeRoom)
                totalRoomNumbers.push(actualNumber)
            }
            else {
                console.error(`Validación fallida en el fakeRoom #${i}: ${totalErrors.join(', ')}`)
                continue
            }
        }
        console.log(`Total users válidos: [${rooms.length}]`)
        await RoomModelMongodb.insertMany(rooms)
    }
    catch (error) {
        console.error('Error creating rooms with faker', error)
        throw error
    }
}

const createBookingsOnly = async (): Promise<void> => {
    await connectMongodbDB()
    try {
        const allBookings: InstanceType<typeof BookingModelMongodb>[] = []

        const allBookingDatesNotArchived = await bookingServiceMongodb.fetchAllDatesNotArchived()
        const allRoomIdsNotArchived = await roomServiceMongodb.fetchAllIdsNotArchived()
        const allClientIdsNotArchived = await clientServiceMongodb.fetchAllIdsNotArchived()
        const bookingValidator = new BookingValidator()
        let totalRoomNumbers = []
        let actualNumber = ''

        let totalErrors
        for (let i = 0; i < 5; i++) {
            const check_in_date = faker.date.future({ years: faker.number.float({ min: 0.2, max: 2 }) })
            actualNumber = String(faker.number.int({ min: 0, max: 999 })).padStart(3, '0')
            const fakeBooking = new BookingModelMongodb({
                order_date: faker.date.recent({ days: 30 }).toISOString(),
                check_in_date: check_in_date.toISOString(),
                check_out_date: faker.date.future({ years: faker.number.float({ min: 0.1, max: 2 }), refDate: check_in_date }).toISOString(),
                price: faker.number.float({ min: 25, max: 10000, fractionDigits: 2 }),
                special_request: faker.lorem.sentence(faker.number.int({ min: 10, max: 40 })),
                isArchived: faker.helpers.arrayElement(Object.values(OptionYesNo)),
                room_id_list: [],
                client_id: "0"
            })
            totalRoomNumbers.push(actualNumber)
            totalErrors = bookingValidator.validateNewBooking(
                fakeBooking.toObject() as BookingInterfaceIdMongodb,
                allBookingDatesNotArchived,
                allRoomIdsNotArchived,
                fakeBooking.client_id,
                allClientIdsNotArchived
            )
            if (totalErrors.length === 0) {
                allBookings.push(fakeBooking)
            }
            else {
                console.error(`Validación fallida en el fakeBooking #${i}: ${totalErrors.join(', ')}`)
                continue
            }
        }
        console.log(`Bookings válidas: ${allBookings}`)
        await BookingModelMongodb.insertMany(allBookings)
    }
    catch (error) {
        console.error('Error creating bookings with faker', error)
        throw error
    }
}

// ( Vieja versión V2 )
// const createRoomsAndBookings = async (): Promise<void> => {
//     await connectMongodbDB()
//     try {
//         const rooms: InstanceType<typeof RoomModelMongodb>[] = []
//         const bookings: BookingInterfaceIdMongodb[] = []
//         const roomValidator = new RoomValidator()
//         const bookingValidator = new BookingValidator()
//         let roomTotalErrors: string[] = []
//         let bookingTotalErrors: string[] = []

//         for (let i = 0; i < 5; i++) {
//             const fakeRoom = new RoomModelMongodb({
//                 photos: Array.from({ length: 3 }, () => faker.image.urlPicsumPhotos()),
//                 number: faker.number.int({ min: 0, max: 999 }).toString().padStart(3, "0"),
//                 type: faker.helpers.arrayElement(Object.values(RoomType)),
//                 amenities: faker.helpers.arrayElements(Object.values(RoomAmenities), faker.number.int({ min: 3, max: 10 })),
//                 price: faker.number.float({ min: 25, max: 10000, fractionDigits: 2 }),
//                 discount: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
//                 booking_id_list: []
//             })
//             roomTotalErrors = roomValidator.validateNewRoom(
//                 fakeRoom.toObject() as RoomInterfaceIdMongodb,
//                 rooms as RoomInterfaceIdMongodb[]
//             )
//             if (roomTotalErrors.length === 0) {
//                 rooms.push(fakeRoom)
//             } else {
//                 console.error(`Validación fallida en el fakeRoom #${i}: ${roomTotalErrors.join(', ')}`)
//                 continue
//             }
//         }

//         for (let i = 0; i < 75; i++) {
//             if (rooms.length === 0) break
//             const selectedRoom = faker.helpers.arrayElement(rooms)
//             const check_in_date = faker.date.future({ years: faker.number.float({ min: 0.2, max: 2 }) })
//             const fakeBooking = new BookingModelMongodb({
//                 photo: faker.image.avatar(),
//                 full_name_guest: faker.person.fullName(),
//                 order_date: faker.date.recent({ days: 30 }).toISOString(),
//                 check_in_date: check_in_date.toISOString(),
//                 check_out_date: faker.date.future({ years: faker.number.float({ min: 0.1, max: 2 }), refDate: check_in_date }).toISOString(),
//                 special_request: faker.lorem.sentence(faker.number.int({ min: 10, max: 40 })),
//                 room_id: selectedRoom._id.toString()
//             })
//             bookingTotalErrors = bookingValidator.validateNewBooking(
//                 fakeBooking.toObject() as BookingInterfaceIdMongodb,
//                 bookings as BookingInterfaceIdMongodb[],
//                 rooms as RoomInterfaceIdMongodb[]
//             )
//             if (bookingTotalErrors.length === 0) {
//                 bookings.push(fakeBooking)
//                 selectedRoom.booking_id_list.push(fakeBooking._id.toString())
//             }
//             else {
//                 console.error(`Validación fallida en el fakeBooking #${i}: ${bookingTotalErrors.join(', ')}`)
//                 continue
//             }
//         }

//         // rooms.map(room => {
//         //     console.log(room._id, room.number, room.booking_list)
//         // })
//         // console.log('=============')
//         // bookings.map(booking => {
//         //     console.log(booking._id, booking.room_id)
//         // })
//         await RoomModelMongodb.insertMany(rooms)
//         await BookingModelMongodb.insertMany(bookings)
//     }
//     catch (error) {
//         console.error('Error creating bookings and rooms with faker', error)
//         throw error
//     }
// }


const main = async () => {
    // await createUsers(5)
    // await createClientsNoBookings(5)
    await createRoomsOnly(5)
    // await createBookingsOnly()
}
main()



/* === Ejecutar fichero Seed (crea .js de todos los ficheros d proyecto, opción menos práctica) === */
// npx tsc seedMongodb.ts
// node seedMongodb.js

/* === Ejecuta el fichero .ts sin necesidad de crear previamente un .js (tampoco se crean otros .js en por el proyecto) === */
// npx ts-node seedMongodb.ts