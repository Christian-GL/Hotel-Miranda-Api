
import { faker } from '@faker-js/faker'
import { connectDB } from './utils/database'
import { hashPassword } from './utils/hashPassword'

import { UserInterface } from './interfaces/userInterface'
import { UserModel } from './models/userModel'
import { UserStatus } from './enums/userStatus'
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
createUsers()