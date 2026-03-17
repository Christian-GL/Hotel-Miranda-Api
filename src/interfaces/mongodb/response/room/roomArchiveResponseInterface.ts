
import { BookingInterfaceIdMongodb } from "interfaces/mongodb/bookingInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "interfaces/mongodb/clientInterfaceMongodb"
import { RoomInterfaceIdMongodb } from "interfaces/mongodb/roomInterfaceMongodb"


export interface RoomArchiveResponseInterface {
    roomUpdated: RoomInterfaceIdMongodb
    updatedBookings: BookingInterfaceIdMongodb[]
    updatedClients: ClientInterfaceIdMongodb[]
}