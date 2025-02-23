
import { isEqual } from 'lodash'
import { ServiceInterface } from '../interfaces/serviceInterface'
import { RoomModel } from '../models/roomModel'
import { RoomInterface } from '../interfaces/roomInterface'
import { BookingModel } from '../models/bookingModel'


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
            const existingRoom: RoomInterface | null = await this.fetchById(id)
            const updatedRoom: RoomInterface | null = await RoomModel.findOneAndUpdate(
                { _id: id },
                room,
                { new: true }
            )
            if (existingRoom !== null && updatedRoom !== null) {
                if (!isEqual(existingRoom.booking_list, room.booking_list)) {
                    await BookingModel.updateMany(
                        { 'room_list.id': id },
                        { $set: { 'room_list.$[elem]': room } },
                        { arrayFilters: [{ 'elem.id': id }] }
                    )
                }
                return updatedRoom
            }
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
            if (deletedRoom) {
                await BookingModel.updateMany(
                    { 'room_list.id': id },
                    { $pull: { room_list: { id } } }
                )
                await BookingModel.deleteMany({
                    'room_list.id': id,
                    $expr: { $eq: [{ $size: '$room_list' }, 1] }
                })
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