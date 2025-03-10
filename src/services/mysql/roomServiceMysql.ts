
import { ServiceInterfaceMysql } from '../../interfaces/mysql/serviceInterfaceMysql'
import { RoomModelMysql } from '../../models/mysql/roomModelMysql'
import { RoomInterfaceMysql } from '../../interfaces/mysql/roomInterfaceMysql'


export class RoomServiceMysql implements ServiceInterfaceMysql<RoomInterfaceMysql> {

    async fetchAll(): Promise<RoomInterfaceMysql[]> {
        try {
            const rooms: RoomInterfaceMysql[] = await RoomModelMysql.findAll()
            const roomsParsed = rooms.map(room => ({
                _id: room._id,
                photos: typeof room.photos === 'string' ? JSON.parse(room.photos) : room.photos,
                number: room.number,
                type: room.type,
                amenities: typeof room.amenities === 'string' ? JSON.parse(room.amenities) : room.amenities,
                price: typeof room.price === 'string' ? parseFloat(room.price) : room.price,
                discount: typeof room.discount === 'string' ? parseFloat(room.discount) : room.discount,
                booking_id_list: typeof room.booking_id_list === 'string'
                    ? JSON.parse(room.booking_id_list).map(Number)
                    : room.booking_id_list.map(Number),
            }))
            return roomsParsed
        }
        catch (error) {
            console.error('Error in fetchAll of roomService', error)
            throw error
        }
    }

    async fetchById(id: number): Promise<RoomInterfaceMysql | null> {
        try {
            const room: RoomInterfaceMysql | null = await RoomModelMysql.findByPk(id)
            if (room !== null) {
                const roomParsed = {
                    _id: room._id,
                    photos: typeof room.photos === 'string' ? JSON.parse(room.photos) : room.photos,
                    number: room.number,
                    type: room.type,
                    amenities: typeof room.amenities === 'string' ? JSON.parse(room.amenities) : room.amenities,
                    price: typeof room.price === 'string' ? parseFloat(room.price) : room.price,
                    discount: typeof room.discount === 'string' ? parseFloat(room.discount) : room.discount,
                    booking_id_list: typeof room.booking_id_list === 'string'
                        ? JSON.parse(room.booking_id_list).map(Number)
                        : room.booking_id_list.map(Number),
                }
                return roomParsed
            }
            else throw new Error('Room not found')
        }
        catch (error) {
            console.error('Error in fetchById of roomService', error)
            throw error
        }
    }

    async create(room: RoomInterfaceMysql): Promise<RoomInterfaceMysql> {
        try {
            const newRoom: RoomInterfaceMysql = await RoomModelMysql.create(room)
            return newRoom
        }
        catch (error) {
            console.error('Error in create of roomService', error)
            throw error
        }
    }

    async update(id: number, room: RoomInterfaceMysql): Promise<RoomInterfaceMysql | null> {
        try {
            const existingRoom: RoomInterfaceMysql | null = await this.fetchById(id)
            if (existingRoom == null) return null

            const [updatedRoom] = await RoomModelMysql.update(room, { where: { _id: id } })
            if (updatedRoom === 0) return null

            return await this.fetchById(id)
        }
        catch (error) {
            console.error('Error in update of roomService', error)
            throw error
        }
    }

    async delete(id: number): Promise<boolean> {
        try {
            const deletedRoom = await RoomModelMysql.destroy({ where: { _id: id } })

            if (deletedRoom) return true
            else return false
        }
        catch (error) {
            console.error('Error in delete of roomService', error)
            throw error
        }
    }

}