
import { ServiceInterfaceMongodb } from '../../interfaces/mongodb/serviceInterfaceMongodb'
import { RoomModelMongodb } from '../../models/mongodb/roomModelMongodb'
import { RoomInterfaceDTO, RoomInterfaceIdMongodb } from '../../interfaces/mongodb/roomInterfaceMongodb'


export class RoomServiceMongodb implements ServiceInterfaceMongodb<RoomInterfaceIdMongodb> {

    async fetchAll(): Promise<RoomInterfaceIdMongodb[]> {
        try {
            const rooms: RoomInterfaceIdMongodb[] = await RoomModelMongodb.find()
            return rooms
        }
        catch (error) {
            console.error('Error in fetchAll of roomService', error)
            throw error
        }
    }

    async fetchById(id: string): Promise<RoomInterfaceIdMongodb | null> {
        try {
            const room: RoomInterfaceIdMongodb | null = await RoomModelMongodb.findById(id)
            if (room) return room
            else throw new Error('Room not found')
        }
        catch (error) {
            console.error('Error in fetchById of roomService', error)
            throw error
        }
    }

    async create(room: RoomInterfaceDTO): Promise<RoomInterfaceIdMongodb> {
        try {
            const newRoom: RoomInterfaceIdMongodb = new RoomModelMongodb(room)
            await newRoom.save()
            return newRoom
        }
        catch (error) {
            console.error('Error in create of roomService', error)
            throw error
        }
    }

    async update(id: string, room: RoomInterfaceDTO): Promise<RoomInterfaceIdMongodb | null> {
        try {
            const existingRoom: RoomInterfaceIdMongodb | null = await this.fetchById(id)
            if (existingRoom == null) return null

            const updatedRoom: RoomInterfaceIdMongodb | null = await RoomModelMongodb.findOneAndUpdate(
                { _id: id },
                room,
                { new: true }
            )
            if (updatedRoom === null) return null

            return updatedRoom
        }
        catch (error) {
            console.error('Error in update of roomService', error)
            throw error
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            const deletedRoom = await RoomModelMongodb.findByIdAndDelete(id)
            if (deletedRoom) {
                return true
            }
            else return false
        }
        catch (error) {
            console.error('Error in delete of roomService', error)
            throw error
        }
    }

}