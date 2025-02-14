
import roomData from '../data/roomData.json'
import { RoomInterface } from '../interfaces/roomInterface'
import { ServiceInterface } from '../interfaces/serviceInterface'
import { checkFirstIDAvailable } from '../utils/dateUtils'


export class RoomService implements ServiceInterface<RoomInterface> {

    private rooms: RoomInterface[] = roomData as RoomInterface[]

    fetchAll(): RoomInterface[] {
        return this.rooms
    }

    fetchById(id: number): RoomInterface | null {
        const room = this.rooms.find(room => room.id === id)
        return room === undefined ? null : room
    }

    create(room: RoomInterface): RoomInterface {
        const newRoom = { ...room, id: checkFirstIDAvailable(this.rooms.map(item => item.id)) }
        this.rooms.push(newRoom)
        return newRoom
    }

    update(roomIn: RoomInterface): RoomInterface | null {
        const roomToUpdate = this.rooms.find(room => room.id === roomIn.id)
        if (roomToUpdate) {
            const updatedRoom = { ...roomToUpdate, ...roomIn }
            this.rooms = this.rooms.map(room =>
                room.id === roomIn.id ? updatedRoom : room
            )
            return updatedRoom
        }
        else return null
    }

    delete(id: number): boolean {
        const roomToDelete = this.rooms.find(room => room.id === id)
        if (roomToDelete) {
            this.rooms = this.rooms.filter(room => room.id !== id)
            return true
        }
        return false
    }
    // delete(id: number): boolean {
    //     const roomToDelete = this.rooms.find(room => room.id === id)
    //     if (roomToDelete) {
    //         roomToDelete.booking_list.map(bookingId => {
    //             this.bookings = this.bookings.filter(booking => booking.id !== bookingId)
    //         })
    //         this.rooms = this.rooms.filter(room => room.id !== id)
    //         // console.log(this.bookings)
    //         // console.log('============================')
    //         return true
    //     }
    //     return false
    // }

}