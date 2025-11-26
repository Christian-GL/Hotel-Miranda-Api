
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { UserModelMongodb } from '../../models/mongodb/userModelMongodb'
import { UserInterfaceDTO, UserInterfaceIdMongodb } from '../../interfaces/mongodb/userInterfaceMongodb'
import { hashPassword } from '../../utils/hashPassword'


export class UserServiceMongodb implements ServiceInterfaceMongodb<UserInterfaceIdMongodb> {

    async fetchAll(): Promise<UserInterfaceIdMongodb[]> {
        try {
            const users: UserInterfaceIdMongodb[] = await UserModelMongodb.find()
            return users
        }
        catch (error) {
            console.error('Error in fetchAll of userService', error)
            throw error
        }
    }

    async fetchById(id: string): Promise<UserInterfaceIdMongodb | null> {
        try {
            const user: UserInterfaceIdMongodb | null = await UserModelMongodb.findById(id)
            if (user) return user
            else throw new Error('User not found')
        }
        catch (error) {
            console.error('Error in fetchById of userService', error)
            return null
        }
    }

    async create(user: UserInterfaceDTO): Promise<UserInterfaceIdMongodb> {
        try {
            user.password = await hashPassword(user.password)
            const newUser: UserInterfaceIdMongodb = new UserModelMongodb(user)
            await newUser.save()
            return newUser
        }
        catch (error) {
            console.error('Error in create of userService', error)
            throw error
        }
    }

    async update(id: string, user: UserInterfaceDTO, passwordHasChanged: boolean = false): Promise<UserInterfaceIdMongodb | null> {
        try {
            if (passwordHasChanged) {
                user.password = await hashPassword(user.password)
            }

            const updatedUser: UserInterfaceIdMongodb | null = await UserModelMongodb.findOneAndUpdate(
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

    async deleteAndArchiveBookings(id: string): Promise<boolean> {
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