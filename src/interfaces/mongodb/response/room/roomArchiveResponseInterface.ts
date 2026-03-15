
import { BookingInterfaceIdMongodb } from "bookingInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "clientInterfaceMongodb"
import { RoomInterfaceIdMongodb } from "roomInterfaceMongodb"


export interface RoomArchiveResponseInterface {
    roomUpdated: RoomInterfaceIdMongodb
    updatedBookings: BookingInterfaceIdMongodb[]
    updatedClients: ClientInterfaceIdMongodb[]
}