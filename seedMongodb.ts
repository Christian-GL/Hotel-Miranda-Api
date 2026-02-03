
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

const createUsers = async (): Promise<void> => {
    await connectMongodbDB()
    try {
        const users: InstanceType<typeof UserModelMongodb>[] = []
        const userValidator = new UserValidator()
        let totalErrors
        for (let i = 0; i < 5; i++) {

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
        console.log(`Clientes válidos: ${clients}`)
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
            "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
            "https://images.unsplash.com/photo-1471115853179-bb1d604434e0",
            "https://images.unsplash.com/photo-1519821172141-b1c09a4f8b53",
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
            "https://images.unsplash.com/photo-1525026198544-46cae6ee4e98",
            "https://images.unsplash.com/photo-1542314831-b4a5f6cb7c3a",
            "https://images.unsplash.com/photo-1576675780201-67329831be1b",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427",
            "https://images.unsplash.com/photo-1566073771259-6a8506099945",
            "https://images.unsplash.com/photo-1542314831-c98aad179a11",
            "https://images.unsplash.com/photo-1534850336045-cb2f2b490043",
            "https://images.unsplash.com/photo-1542314831-9f8f0374e9de",
            "https://images.unsplash.com/photo-1560185127-6c670ede356e",
            "https://images.unsplash.com/photo-1505691938895-552c7412fdfb",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427",
            "https://images.unsplash.com/photo-1525026198544-dd1bc5a28a76",
            "https://images.unsplash.com/photo-1484154218962-a197022b5858",
            "https://images.unsplash.com/photo-1522708323590-e79c1c854b09",
            "https://images.unsplash.com/photo-1566073771259-e8e68d1e1a4c",
            "https://images.unsplash.com/photo-1542314831-68eebv6db7c6",
            "https://images.unsplash.com/photo-1505691938895-43df9bb53ecf",
            "https://images.unsplash.com/photo-1576675780201-8b2aae943988",
            "https://images.unsplash.com/photo-1542314831-b7f4c73b66a8",
            "https://images.unsplash.com/photo-1525026198544-39ed3c5855fc",
            "https://images.unsplash.com/photo-1542314831-f2ffbc9eedbc",
            "https://images.unsplash.com/photo-1590490360182-abcde57891ef",
            "https://images.unsplash.com/photo-1505691938895-82b12b3077c8",
            "https://images.unsplash.com/photo-1522708323590-555a5880b7e1",
            "https://images.unsplash.com/photo-1542314831-df5fabe4fc3d",
            "https://images.unsplash.com/photo-1484154218962-5a5a0f93b27f",
            "https://images.unsplash.com/photo-1542314831-864e951b93a9",
            "https://images.unsplash.com/photo-1525026198544-dba5a0f90c68",
            "https://images.unsplash.com/photo-1505691938895-a1e69ce2f79c",
            "https://images.unsplash.com/photo-1566073771259-40245dc82598",
            "https://images.unsplash.com/photo-1542314831-1157f19bdd6c",
            "https://images.unsplash.com/photo-1522708323590-a5a49b4f49b2",
            "https://images.unsplash.com/photo-1590490360182-90bb391c07e4"
        ]
        const shuffleArray = <T>(array: T[]): T[] => {
            const copy = [...array]
            for (let i = copy.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1))
                    ;[copy[i], copy[j]] = [copy[j], copy[i]]
            }
            return copy
        }
        const shuffledImages = shuffleArray(hotelRoomImages)
        let totalRoomNumbers = []
        let actualNumber = ''
        let totalErrors
        for (let i = 0; i < numberRooms; i++) {
            actualNumber = String(faker.number.int({ min: 0, max: 999 })).padStart(3, '0')
            const fakeRoom = new RoomModelMongodb({
                photos: Array.from({ length: faker.number.int({ min: 3, max: 5 }) }, () => shuffledImages.pop()!),
                number: actualNumber,
                type: faker.helpers.arrayElement(Object.values(RoomType)),
                amenities: faker.helpers.arrayElements(Object.values(RoomAmenities), faker.number.int({ min: 1, max: Math.max(1, Object.values(RoomAmenities).length) })) as RoomAmenities[],
                price: faker.number.float({ min: 25, max: 10000, fractionDigits: 2 }),
                discount: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
                isActive: faker.helpers.arrayElement(Object.values(OptionYesNo)),
                isArchived: faker.helpers.arrayElement(Object.values(OptionYesNo)),
                booking_id_list: []
            })
            totalRoomNumbers.push(actualNumber)
            totalErrors = roomValidator.validateNewRoom(
                fakeRoom.toObject() as RoomInterfaceIdMongodb,
                totalRoomNumbers
            )
            if (totalErrors.length === 0) {
                rooms.push(fakeRoom)
            }
            else {
                console.error(`Validación fallida en el fakeRoom #${i}: ${totalErrors.join(', ')}`)
                continue
            }
        }
        console.log(`Rooms válidas: ${rooms}`)
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
    // await createUsers()
    await createClientsNoBookings(3)
    await createRoomsOnly(3)
    // await createBookingsOnly()
}
main()



/* === Ejecutar fichero Seed (crea .js de todos los ficheros d proyecto, opción menos práctica) === */
// npx tsc seedMongodb.ts
// node seedMongodb.js

/* === Ejecuta el fichero .ts sin necesidad de crear previamente un .js (tampoco se crean otros .js en por el proyecto) === */
// npx ts-node seedMongodb.ts