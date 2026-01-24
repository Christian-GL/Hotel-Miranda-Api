
import { BookingInterfaceIdMongodb } from "../../bookingInterfaceMongodb"
import { RoomInterfaceIdMongodb } from "../../roomInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "../../clientInterfaceMongodb"


export interface RoomUpdateResponseInterface {
    roomUpdated: RoomInterfaceIdMongodb
    updatedBookings: BookingInterfaceIdMongodb[]
    updatedClients: ClientInterfaceIdMongodb[]
}