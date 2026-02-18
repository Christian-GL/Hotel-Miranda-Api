
import { BookingInterfaceIdMongodb } from "../../bookingInterfaceMongodb"
import { RoomInterfaceIdMongodb } from "../../roomInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "../../clientInterfaceMongodb"


export interface RoomArchiveResponseInterface {
    roomUpdated: RoomInterfaceIdMongodb
    updatedBookings: BookingInterfaceIdMongodb[]
    updatedClients: ClientInterfaceIdMongodb[]
}