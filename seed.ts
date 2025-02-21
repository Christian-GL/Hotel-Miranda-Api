
import { faker } from '@faker-js/faker'
import { connectDB } from './src/utils/database'
import { hashPassword } from './src/utils/hashPassword'

import { BookingInterface } from './src/interfaces/bookingInterface'
import { RoomInterface } from './src/interfaces/roomInterface'
import { ContactInterface } from './src/interfaces/contactInterface'
import { UserInterface } from './src/interfaces/userInterface'
import { BookingModel } from './src/models/bookingModel'
import { RoomModel } from './src/models/roomModel'
import { ContactModel } from './src/models/contactModel'
import { UserModel } from './src/models/userModel'
import { BookingValidator } from './src/validators/bookingValidator'
import { RoomValidator } from './src/validators/roomValidator'
import { ContactValidator } from './src/validators/contactValidator'
import { UserValidator } from './src/validators/userValidator'
import { UserStatus } from './src/enums/userStatus'
import { RoomType } from './src/enums/roomType'
import { RoomAmenities } from './src/enums/roomAmenities'
import { BookingStatus } from './src/enums/bookingStatus'


const createUsers = async (): Promise<void> => {
    await connectDB()
    try {
        const users = []
        const userValidator = new UserValidator()
        let totalErrors
        for (let i = 0; i < 10; i++) {
            const fakeUser = new UserModel({
                photo: faker.image.avatar(),
                full_name: faker.person.fullName(),
                email: faker.internet.email(),
                start_date: faker.date.future(),
                description: faker.lorem.paragraph(),
                phone_number: faker.string.numeric(9),
                status: faker.helpers.arrayElement(Object.values(UserStatus)),
                password: 'Abcd1234.'
            })
            totalErrors = userValidator.validateUser(fakeUser.toObject() as UserInterface)
            if (totalErrors.length === 0) {
                fakeUser.password = await hashPassword(fakeUser.password)
                users.push(fakeUser)
            }
            else {
                console.error(`Validación fallida en el fakeUser #${i}: ${totalErrors.join(', ')}`)
                continue
            }
        }
        await UserModel.insertMany(users)
    }
    catch (error) {
        console.error('Error creating users with faker', error)
        throw error
    }
}

const createContacts = async (): Promise<void> => {
    await connectDB()
    try {
        const contacts = []
        const contactValidator = new ContactValidator()
        let totalErrors
        for (let i = 0; i < 10; i++) {
            const fakeContact = new ContactModel({
                full_name: faker.person.fullName(),
                email: faker.internet.email(),
                publish_date: faker.date.past(),
                phone_number: faker.string.numeric(9),
                comment: faker.lorem.paragraph()
            })
            totalErrors = contactValidator.validateContact(fakeContact.toObject() as ContactInterface)
            if (totalErrors.length === 0) {
                contacts.push(fakeContact)
            }
            else {
                console.error(`Validación fallida en el fakeContact #${i}: ${totalErrors.join(', ')}`)
                continue
            }
        }
        await ContactModel.insertMany(contacts)
    }
    catch (error) {
        console.error('Error creating contacts with faker', error)
        throw error
    }
}

const createRooms = async (): Promise<void> => {
    await connectDB()
    try {
        const rooms = []
        const roomValidator = new RoomValidator()
        let totalErrors
        for (let i = 0; i < 10; i++) {
            const fakeRoom = new RoomModel({
                photos: Array.from({ length: 3 }, () => faker.image.avatar()),
                number: faker.number.int({ min: 0, max: 999 }).toString().padStart(3, "0"),
                type: faker.helpers.arrayElement(Object.values(RoomType)),
                amenities: faker.helpers.arrayElements(Object.values(RoomAmenities), faker.number.int({ min: 3, max: 10 })),
                price: faker.number.float({ min: 25, max: 100000, fractionDigits: 2 }),
                discount: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
                booking_list: []
            })
            totalErrors = roomValidator.validateRoom(fakeRoom.toObject() as RoomInterface)
            if (totalErrors.length === 0) {
                rooms.push(fakeRoom)
            }
            else {
                console.error(`Validación fallida en el fakeRoom #${i}: ${totalErrors.join(', ')}`)
                continue
            }
        }
        await RoomModel.insertMany(rooms)
    }
    catch (error) {
        console.error('Error creating rooms with faker', error)
        throw error
    }
}

const createBookings = async (): Promise<void> => {
    await connectDB()
    try {
        const bookings = []
        const bookingValidator = new BookingValidator()
        let totalErrors
        for (let i = 0; i < 6; i++) {
            const fakeBooking = new BookingModel({
                photo: faker.image.urlPicsumPhotos(),
                full_name_guest: faker.person.fullName(),
                order_date: faker.date.recent({ days: 30 }),
                check_in_date: faker.date.future({ years: 0.1 }),
                check_out_date: faker.date.future({ years: 0.1, refDate: new Date() }),
                room: {
                    id: '67b74dbe7273c7ce5864e482',
                    type: RoomType.singleBed
                },
                booking_status: faker.helpers.arrayElement(Object.values(BookingStatus)),
                special_request: faker.lorem.sentence(faker.number.int({ min: 10, max: 40 }))
            })
            totalErrors = bookingValidator.validateBooking(fakeBooking.toObject() as BookingInterface, bookings as BookingInterface[])
            if (totalErrors.length === 0) {
                bookings.push(fakeBooking)
            }
            else {
                console.error(`Validación fallida en el fakeBooking #${i}: ${totalErrors.join(', ')}`)
                continue
            }
        }
        await BookingModel.insertMany(bookings)
    }
    catch (error) {
        console.error('Error creating bookings with faker', error)
        throw error
    }
}


// createUsers()
// createContacts()
// createRooms()
// createBookings()




// const createRoomsAndBookings = async (): Promise<void> => {
//     await connectDB()
//     try {
//         const rooms = []
//         const bookings = []
//         const roomValidator = new RoomValidator()
//         const bookingValidator = new BookingValidator()
//         let totalRoomErrors
//         let totalBookingErrors

//         for (let i = 1; i < 11; i++) {
//             // let bookingL: number[]
//             // switch (i) {
//             //     case 2: bookingL = [1, 2, 3]
//             //     case 3: bookingL = [4, 5]
//             //     case 5: bookingL = [6]
//             //     default: bookingL = []
//             // }
//             const fakeRoom = new RoomModel({
//                 photos: Array.from({ length: 3 }, () => faker.image.avatar()),
//                 number: faker.number.int({ min: 0, max: 999 }).toString().padStart(3, "0"),
//                 type: faker.helpers.arrayElement(Object.values(RoomType)),
//                 amenities: faker.helpers.arrayElements(Object.values(RoomAmenities), faker.number.int({ min: 3, max: 10 })),
//                 price: faker.number.float({ min: 25, max: 100000, fractionDigits: 2 }),
//                 discount: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }),
//                 // booking_list: bookingL
//                 booking_list: []
//             })

//             totalRoomErrors = roomValidator.validateRoom(fakeRoom.toObject() as RoomInterface)
//             if (totalRoomErrors.length === 0) { rooms.push(fakeRoom) }
//             else {
//                 console.error(`Validación fallida en el fakeRoom #${i}: ${totalRoomErrors.join(', ')}`)
//                 continue
//             }
//         }

//         for (let i = 1; i < 6; i++) {
//             // let roomProps: number[]
//             // switch (i) {
//             //     case 1: roomProps = []
//             //     case 2: roomProps = [4, 5]
//             //     case 4: roomProps = [6]
//             //     default: roomProps = []
//             // }
//             const fakeBooking = new BookingModel({
//                 photo: faker.image.urlPicsumPhotos(),
//                 full_name_guest: faker.person.fullName(),
//                 order_date: faker.date.recent({ days: 30 }),
//                 check_in_date: faker.date.future({ years: 0.1 }),
//                 check_out_date: faker.date.future({ years: 0.1, refDate: new Date() }),
//                 room: {
//                     id: 'CHANGE ME',
//                     type: RoomType.suite
//                 },
//                 booking_status: faker.helpers.arrayElement(Object.values(BookingStatus)),
//                 special_request: faker.lorem.sentence({ min: 10, max: 450 })
//             })

//             totalBookingErrors = bookingValidator.validateBooking(fakeBooking.toObject() as BookingInterface)
//             if (totalBookingErrors.length === 0) { bookings.push(fakeBooking) }
//             else {
//                 console.error(`Validación fallida en el fakeBooking #${i}: ${totalBookingErrors.join(', ')}`)
//                 continue
//             }
//         }

//         await RoomModel.insertMany(rooms)
//         await BookingModel.insertMany(bookings)
//     }
//     catch (error) {
//         console.error('Error creating rooms with faker', error)
//         throw error
//     }
// }