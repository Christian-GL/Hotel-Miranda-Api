
import { ServiceInterface } from '../interfaces/serviceInterface'
import { RoomModel } from '../models/roomModel'
import { RoomInterface } from '../interfaces/roomInterface'


export class RoomService implements ServiceInterface<RoomInterface> {

    async fetchAll(): Promise<RoomInterface[]> {
        try {
            const rooms: RoomInterface[] = await RoomModel.find()
            return rooms
        }
        catch (error) {
            console.error('Error in fetchAll of roomService', error)
            throw error
        }
    }

    async fetchById(id: string): Promise<RoomInterface | null> {
        try {
            const room: RoomInterface | null = await RoomModel.findById(id)
            if (room) return room
            else throw new Error('Room not found')
        }
        catch (error) {
            console.error('Error in fetchById of roomService', error)
            throw error
        }
    }

    async create(room: RoomInterface): Promise<RoomInterface> {
        try {
            const newRoom: RoomInterface = new RoomModel(room)
            await newRoom.save()
            return newRoom
        }
        catch (error) {
            console.error('Error in create of roomService', error)
            throw error
        }
    }

    async update(id: string, room: RoomInterface): Promise<RoomInterface | null> {
        try {
            const updatedRoom: RoomInterface | null = await RoomModel.findOneAndUpdate(
                { _id: id },
                room,
                { new: true }
            )
            if (updatedRoom) return updatedRoom
            else return null
        }
        catch (error) {
            console.error('Error in update of roomService', error)
            throw error
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const deletedRoom = await RoomModel.findByIdAndDelete(id)
            if (deletedRoom) return true
            else return false
        }
        catch (error) {
            console.error('Error in delete of roomService', error)
            throw error
        }
    }

}