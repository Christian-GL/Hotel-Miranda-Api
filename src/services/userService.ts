
import { ServiceInterface } from '../interfaces/serviceInterface'
import { UserModel } from '../models/userModel'
import { UserInterface } from '../interfaces/userInterface'
import { hashPassword } from '../utils/hashPassword'


export class UserService implements ServiceInterface<UserInterface> {

    async fetchAll(): Promise<UserInterface[]> {
        try {
            const users: UserInterface[] = await UserModel.find()
            return users
        }
        catch (error) {
            console.error('Error in fetchAll of userService', error)
            throw error
        }
    }

    async fetchById(id: string): Promise<UserInterface | null> {
        try {
            const user: UserInterface | null = await UserModel.findById(id)
            if (user) return user
            else throw new Error('User not found')
        }
        catch (error) {
            console.error('Error in fetchById of userService', error)
            return null
        }
    }

    async create(user: UserInterface): Promise<UserInterface> {
        try {
            user.password = await hashPassword(user.password)
            const newUser: UserInterface = new UserModel(user)
            await newUser.save()
            return newUser
        }
        catch (error) {
            console.error('Error in create of userService', error)
            throw error
        }
    }

    async update(id: string, user: UserInterface, passwordHasChanged: boolean = false): Promise<UserInterface | null> {
        try {
            if (passwordHasChanged) {
                user.password = await hashPassword(user.password)
            }

            const updatedUser: UserInterface | null = await UserModel.findOneAndUpdate(
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
            const deletedUser = await UserModel.findByIdAndDelete(id)
            if (deletedUser) return true
            else return false
        }
        catch (error) {
            console.error('Error in delete of userService', error)
            throw error
        }
    }

}