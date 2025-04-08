
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { UserModelMongodb } from '../../models/mongodb/userModelMongodb'
import { UserInterfaceMongodb } from '../../interfaces/mongodb/userInterfaceMongodb'
import { hashPassword } from '../../utils/hashPassword'


export class UserServiceMongodb implements ServiceInterfaceMongodb<UserInterfaceMongodb> {

    async fetchAll(): Promise<UserInterfaceMongodb[]> {
        try {
            const users: UserInterfaceMongodb[] = await UserModelMongodb.find()
            return users
        }
        catch (error) {
            console.error('Error in fetchAll of userService', error)
            throw error
        }
    }

    async fetchById(id: string): Promise<UserInterfaceMongodb | null> {
        try {
            const user: UserInterfaceMongodb | null = await UserModelMongodb.findById(id)
            if (user) return user
            else throw new Error('User not found')
        }
        catch (error) {
            console.error('Error in fetchById of userService', error)
            return null
        }


        // const user: UserInterfaceMongodb = new UserModelMongodb({
        //     _id: '67c0b7e411836cd096df50e1',
        //     photo: 'https://example.com/photo.jpg',
        //     full_name: 'Juan Pérez',
        //     email: 'juan.perez@example.com',
        //     start_date: new Date('2022-01-01T00:00:00Z'),
        //     description: 'Desarrollador full stack con 5 años de experiencia.',
        //     phone_number: '+34 612 345 678',
        //     status: 'active',
        //     password: 'hashedPassword123'
        // })
        // return user
    }

    async create(user: UserInterfaceMongodb): Promise<UserInterfaceMongodb> {
        try {
            user.password = await hashPassword(user.password)
            const newUser: UserInterfaceMongodb = new UserModelMongodb(user)
            await newUser.save()
            return newUser
        }
        catch (error) {
            console.error('Error in create of userService', error)
            throw error
        }
    }

    async update(id: string, user: UserInterfaceMongodb, passwordHasChanged: boolean = false): Promise<UserInterfaceMongodb | null> {
        try {
            if (passwordHasChanged) {
                user.password = await hashPassword(user.password)
            }

            const updatedUser: UserInterfaceMongodb | null = await UserModelMongodb.findOneAndUpdate(
                { _id: id },
                user,
                { new: true }
            )
            if (updatedUser) return updatedUser
            else return null
        }
        catch (error) {
            console.error('Error in update of userService', error)
            throw error
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const deletedUser = await UserModelMongodb.findByIdAndDelete(id)
            if (deletedUser) return true
            else return false
        }
        catch (error) {
            console.error('Error in delete of userService', error)
            throw error
        }
    }

}