
import { BookingInterfaceIdMongodb } from "interfaces/mongodb/bookingInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "interfaces/mongodb/clientInterfaceMongodb"


export interface RoomDeleteResponseInterface {
    roomIsDeleted: boolean
    roomId: string
    updatedBookings: BookingInterfaceIdMongodb[]
    updatedClients: ClientInterfaceIdMongodb[]
}