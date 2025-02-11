
import roomData from '../data/roomData.json'
import { RoomInterface } from '../interfaces/roomInterface'
import { ServiceInterface } from '../interfaces/serviceInterface'
import { checkFirstIDAvailable } from '../utils/utils'


export class RoomService implements ServiceInterface<RoomInterface> {

    private rooms: RoomInterface[] = roomData as RoomInterface[]

    fetchAll(): RoomInterface[] {
        return this.rooms
    }

    fetchById(id: number): RoomInterface | undefined {
        return this.rooms.find(room => room.id === id)
    }

    create(room: RoomInterface): RoomInterface {
        const newRoom = { ...room, id: checkFirstIDAvailable(this.rooms.map(item => item.id)) }
        this.rooms.push(newRoom)
        return newRoom
    }

    update(roomIn: RoomInterface): RoomInterface | undefined {
        const roomToUpdate = this.rooms.find(room => room.id === roomIn.id)
        if (roomToUpdate) {
            const updatedRoom = { ...roomToUpdate, ...roomIn }
            this.rooms = this.rooms.map(room =>
                room.id === roomIn.id ? updatedRoom : room
            )
            return updatedRoom
        }
        else return undefined
    }

    delete(id: number): boolean {
        const roomToDelete = this.rooms.find(room => room.id === id)
        if (roomToDelete) {
            this.rooms = this.rooms.filter(room => room.id !== id)
            return true
        }
        return false
    }

}