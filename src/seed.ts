
import { faker } from '@faker-js/faker'
import { connectDB } from './utils/database'
import { hashPassword } from './utils/hashPassword'

import { ContactInterface } from './interfaces/contactInterface'
import { UserInterface } from './interfaces/userInterface'
import { ContactModel } from './models/contactModel'
import { UserModel } from './models/userModel'
import { UserStatus } from './enums/userStatus'
import { ContactValidator } from './validators/contactValidator'
import { UserValidator } from './validators/userValidator'


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
                status: faker.helpers.arrayElement([UserStatus.active, UserStatus.inactive]),
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
                publish_date: faker.date.future(),
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
createContacts()