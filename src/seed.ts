
import { faker } from '@faker-js/faker'
import { connectDB } from './utils/database'
import { hashPassword } from './utils/hashPassword'

import { RoomInterface } from './interfaces/roomInterface'
import { ContactInterface } from './interfaces/contactInterface'
import { UserInterface } from './interfaces/userInterface'
import { RoomModel } from './models/roomModel'
import { ContactModel } from './models/contactModel'
import { UserModel } from './models/userModel'
import { RoomValidator } from './validators/roomValidator'
import { ContactValidator } from './validators/contactValidator'
import { UserValidator } from './validators/userValidator'
import { UserStatus } from './enums/userStatus'
import { RoomType } from './enums/roomType'
import { RoomAmenities } from './enums/roomAmenities'


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
// createUsers()

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
// createContacts()

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
                // booking_list: Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => faker.number.int({ min: 1, max: 10 }))
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
createRooms()