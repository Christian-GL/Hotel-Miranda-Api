
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { UserModelMongodb } from '../../models/mongodb/userModelMongodb'
import { UserInterface, UserInterfaceIdMongodb } from '../../interfaces/mongodb/userInterfaceMongodb'
import { hashPassword } from '../../utils/hashPassword'
import { OptionYesNo } from '../../enums/optionYesNo'
import { ClientSession } from 'mongoose'


export class UserServiceMongodb implements ServiceInterfaceMongodb<UserInterfaceIdMongodb> {

    async fetchAll(): Promise<UserInterfaceIdMongodb[]> {
        try {
            const users: UserInterfaceIdMongodb[] = await UserModelMongodb.find()
            return users
        }
        catch (error) {
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
            return null
        }
    }

    async create(user: UserInterface): Promise<UserInterfaceIdMongodb> {
        try {
            user.password = await hashPassword(user.password)
            const newUser: UserInterfaceIdMongodb = new UserModelMongodb(user)
            await newUser.save()
            return newUser
        }
        catch (error) {
            throw error
        }
    }

    async update(id: string, user: UserInterface): Promise<UserInterfaceIdMongodb | null> {
        try {
            const updatedUser: UserInterfaceIdMongodb | null = await UserModelMongodb.findOneAndUpdate(
                { _id: id },
                { $set: user },
                { new: true }
            ).lean() as UserInterfaceIdMongodb | null

            return updatedUser
        }
        catch (error) {
            throw error
        }
    }

    async updateArchiveState(id: string, isArchived: OptionYesNo, session?: ClientSession): Promise<UserInterfaceIdMongodb | null> {
        try {
            const updatedUser = await UserModelMongodb.findByIdAndUpdate(
                id,
                { $set: { isArchived: isArchived } },
                { new: true, session }
            )

            return updatedUser
        }
        catch (error) {
            throw error
        }
    }

    async archive(id: string, isArchived: OptionYesNo): Promise<UserInterfaceIdMongodb | null> {
        try {
            const updatedUser = await this.updateArchiveState(id, isArchived)
            if (!updatedUser) return null

            return updatedUser
        }
        catch (error) {
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
            throw error
        }
    }

}