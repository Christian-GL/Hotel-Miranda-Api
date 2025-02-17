
import { UserModel } from '../models/userModel'
import { UserInterface } from '../interfaces/userInterface'
import { ServiceInterface } from '../interfaces/serviceInterface'


export class UserService implements ServiceInterface<UserInterface> {

    async fetchAll(): Promise<UserInterface[]> {
        try {
            const users: UserInterface[] = await UserModel.find()
            return users
        }
        catch (error) {
            console.error('Error in fetchAll of Users', error)
            throw error
        }

    }

    async fetchById(id: number): Promise<UserInterface | null> {
        try {
            const user: UserInterface | null = await UserModel.findById(id)
            if (user) return user
            else throw new Error('User not found')

        }
        catch (error) {
            console.error('Error in fetchById of users', error)
            throw error
        }
    }

    async create(user: UserInterface): Promise<UserInterface> {
        try {
            const newUser: UserInterface = await UserModel.create(user)
            await newUser.save()
            return newUser
        }
        catch (error) {
            console.error('Error in create of users', error)
            throw error
        }
    }

    async update(user: UserInterface): Promise<UserInterface | null> {
        try {
            const updatedUser: UserInterface | null = await UserModel.findOneAndUpdate(
                { _id: user.id },
                user,
                { new: true }
            )
            if (updatedUser) return updatedUser
            else return null
        }
        catch (error) {
            console.error('Error in update of users', error)
            throw error
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const deletedUser = await UserModel.findByIdAndDelete(id)
            if (deletedUser) return true
            else return false
        }
        catch (error) {
            console.error('Error in delete of users', error)
            throw error
        }
    }

}