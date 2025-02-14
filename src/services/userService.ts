
import userData from '../data/userData.json'
import { UserInterface } from '../interfaces/userInterface'
import { ServiceInterface } from '../interfaces/serviceInterface'
import { checkFirstIDAvailable } from '../utils/dateUtils'


export class UserService implements ServiceInterface<UserInterface> {

    private users: UserInterface[] = userData as UserInterface[]

    fetchAll(): UserInterface[] {
        return this.users
    }

    fetchById(id: number): UserInterface | null {
        const user = this.users.find(user => user.id === id)
        return user === undefined ? null : user
    }

    create(user: UserInterface): UserInterface {
        const newUser = { ...user, id: checkFirstIDAvailable(this.users.map(item => item.id)) }
        this.users.push(newUser)
        return newUser
    }

    update(userIn: UserInterface): UserInterface | null {
        const userToUpdate = this.users.find(user => user.id === userIn.id)
        if (userToUpdate) {
            const updatedUser = { ...userToUpdate, ...userIn }
            this.users = this.users.map(user =>
                user.id === userIn.id ? updatedUser : user
            )
            return updatedUser
        }
        else return null
    }

    delete(id: number): boolean {
        const userToDelete = this.users.find(user => user.id === id)
        if (userToDelete) {
            this.users = this.users.filter(user => user.id !== id)
            return true
        }
        return false
    }

}