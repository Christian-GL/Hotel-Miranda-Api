
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import bcrypt from 'bcryptjs'

import { LoginRequestInterface } from '../../interfaces/mongodb/request/loginRequestInterface'
import { UserModelMongodb } from '../../models/mongodb/userModelMongodb'
import { Role } from '../../enums/role'
import { OptionYesNo } from '../../enums/optionYesNo'
import { appForTest } from '../appForTest'


jest.setTimeout(30000)

const LOGIN_PATH = '/login'
process.env.TOKEN_SECRET = 'test-secret'
let mongod: MongoMemoryServer
const EXISTING_EMAIL = 'admindefault@gmail.com'
const EXISTING_PASSWORD = 'Abcd1234.'

beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    await mongoose.connect(uri)
})
afterAll(async () => {
    await mongoose.disconnect()
    await mongod.stop()
})
afterEach(async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        await collections[key].deleteMany({})
    }
})

async function seedAdminUser() {
    const hashedPassword = await bcrypt.hash(EXISTING_PASSWORD, 10)

    await UserModelMongodb.create({
        photo: null,
        full_name: 'Admin Default',
        email: EXISTING_EMAIL,
        phone_number: '000000000',
        start_date: new Date('2000-01-01'),
        end_date: new Date('2100-01-01'),
        job_position: 'Administrator',
        role: Role.admin,
        password: hashedPassword,
        isArchived: OptionYesNo.no
    })
}

describe('loginControllerMongodb - POST: /login — ', () => {

    test('SUCCEED: correct user and correct password', async () => {
        await seedAdminUser()

        const payload: LoginRequestInterface = {
            email: EXISTING_EMAIL,
            password: EXISTING_PASSWORD
        }

        const res = await request(appForTest).post(LOGIN_PATH).send(payload)

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('token')
        expect(res.body).toHaveProperty('loggedUserID')
        expect(res.body).toHaveProperty('role')
        expect(typeof res.body.token).toBe('string')
        expect(res.body.token).toMatch(/^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/)
        expect(res.body.loggedUserID).toMatch(/^[a-f\d]{24}$/i)
        expect(res.body.role).toBe(Role.admin)
    })

    test('FAIL: correct email and wrong password', async () => {

        await seedAdminUser()

        const payload: LoginRequestInterface = {
            email: EXISTING_EMAIL,
            password: 'WrongPassword'
        }

        const res = await request(appForTest).post('/login').send(payload)

        expect(res.status).toBe(401)
    })

    test('FAIL: wrong email and correct password', async () => {

        await seedAdminUser()

        const payload: LoginRequestInterface = {
            email: 'errorEmail@gmail.com',
            password: EXISTING_PASSWORD
        }

        const res = await request(appForTest).post('/login').send(payload)

        expect(res.status).toBe(401)
    })

    test('FAIL: wrong email and wrong password', async () => {

        const payload: LoginRequestInterface = {
            email: 'errorEmail@gmail.com',
            password: '1234'
        }

        const res = await request(appForTest).post(LOGIN_PATH).send(payload)

        expect(res.status).toBe(401)
        expect(res.body).toHaveProperty('message')
    })

})