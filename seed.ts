
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
                start_date: faker.date.future().toISOString(),
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
                publish_date: faker.date.past().toISOString(),
                phone_number: faker.string.numeric(9),
                comment: faker.lorem.paragraph(),
                archived: faker.datatype.boolean()
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

const createRoomsAndBookings = async (): Promise<void> => {
    await connectDB()
    try {
        const rooms: RoomInterface[] = []
        const bookings: BookingInterface[] = []
        const roomValidator = new RoomValidator()
        const bookingValidator = new BookingValidator()
        let roomTotalErrors: string[] = []
        let bookingTotalErrors: string[] = []

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
            roomTotalErrors = roomValidator.validateRoom(
                fakeRoom.toObject() as RoomInterface,
                rooms as RoomInterface[],
                bookings as BookingInterface[]
            )
            if (roomTotalErrors.length === 0) {
                rooms.push(fakeRoom)
            } else {
                console.error(`Validación fallida en el fakeRoom #${i}: ${roomTotalErrors.join(', ')}`)
                continue
            }
        }

        for (let i = 0; i < 20; i++) {
            if (rooms.length === 0) break

            const selectedRoom = faker.helpers.arrayElement(rooms)
            const check_in_date = faker.date.future({ years: faker.number.float({ min: 0.2, max: 2 }) })
            const fakeBooking = new BookingModel({
                photo: faker.image.urlPicsumPhotos(),
                full_name_guest: faker.person.fullName(),
                order_date: faker.date.recent({ days: 30 }).toISOString(),
                check_in_date: check_in_date.toISOString(),
                check_out_date: faker.date.future({ years: faker.number.float({ min: 0.1, max: 2 }), refDate: check_in_date }).toISOString(),
                status: faker.helpers.arrayElement(Object.values(BookingStatus)),
                special_request: faker.lorem.sentence(faker.number.int({ min: 10, max: 40 })),
                room_list: [
                    {
                        _id: selectedRoom._id,
                        photos: [...selectedRoom.photos],
                        number: selectedRoom.number,
                        type: selectedRoom.type,
                        amenities: [...selectedRoom.amenities],
                        price: selectedRoom.price,
                        discount: selectedRoom.discount
                    }
                ]
            })

            bookingTotalErrors = bookingValidator.validateBooking(
                fakeBooking.toObject() as BookingInterface,
                bookings as BookingInterface[],
                rooms as RoomInterface[]
            )
            if (bookingTotalErrors.length === 0) {
                bookings.push(fakeBooking)

                selectedRoom.booking_list.push({
                    _id: fakeBooking._id,
                    photo: fakeBooking.photo,
                    full_name_guest: fakeBooking.full_name_guest,
                    order_date: fakeBooking.order_date,
                    check_in_date: fakeBooking.check_in_date,
                    check_out_date: fakeBooking.check_out_date,
                    status: fakeBooking.status,
                    special_request: fakeBooking.special_request
                } as BookingInterface)
            } else {
                console.error(`Validación fallida en el fakeBooking #${i}: ${bookingTotalErrors.join(', ')}`)
                continue
            }
        }

        // rooms.map(room => {
        //     console.log(room._id, room.number, room.price)
        // })
        // console.log('=============')
        // bookings.map(booking => {
        //     console.log(booking)
        // })
        await RoomModel.insertMany(rooms)
        await BookingModel.insertMany(bookings)

    } catch (error) {
        console.error('Error creating bookings and rooms with faker', error)
        throw error
    }
}


// createUsers()
// createContacts()
createRoomsAndBookings()