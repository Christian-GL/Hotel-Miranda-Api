
import { ServiceInterfaceMysql } from '../../interfaces/mysql/serviceInterfaceMysql'
import { UserModelMysql } from '../../models/mysql/userModelMysql'
import { UserInterfaceMysql } from '../../interfaces/mysql/userInterfaceMysql'
import { hashPassword } from '../../utils/hashPassword'


export class UserServiceMysql implements ServiceInterfaceMysql<UserInterfaceMysql> {

    async fetchAll(): Promise<UserInterfaceMysql[]> {
        try {
            const users: UserInterfaceMysql[] = await UserModelMysql.findAll()
            return users
        }
        catch (error) {
            console.error('Error in fetchAll of userService', error)
            throw error
        }
    }

    async fetchById(id: number): Promise<UserInterfaceMysql | null> {
        try {
            const user: UserInterfaceMysql | null = await UserModelMysql.findByPk(id)
            if (user) return user
            else throw new Error('User not found')
        }
        catch (error) {
            console.error('Error in fetchById of userService', error)
            return null
        }
    }

    async create(user: UserInterfaceMysql): Promise<UserInterfaceMysql> {
        try {
            user.password = await hashPassword(user.password)
            const newUser: UserInterfaceMysql = await UserModelMysql.create(user)
            return newUser
        }
        catch (error) {
            console.error('Error in create of userService', error)
            throw error
        }
    }

    async update(id: number, user: UserInterfaceMysql, passwordHasChanged: boolean = false): Promise<UserInterfaceMysql | null> {
        try {
            if (passwordHasChanged) {
                user.password = await hashPassword(user.password)
            }

            const [updatedContact] = await UserModelMysql.update(user, { where: { _id: id } })
            if (updatedContact === 0) return null

            return await this.fetchById(id)
        }
        catch (error) {
            console.error('Error in update of userService', error)
            throw error
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const deletedUser = await UserModelMysql.destroy({ where: { _id: id } })

            if (deletedUser) return true
            else return false
        }
        catch (error) {
            console.error('Error in delete of userService', error)
            throw error
        }
    }

}