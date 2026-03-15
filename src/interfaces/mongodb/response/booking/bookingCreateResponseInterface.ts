
import { BookingInterfaceIdMongodb } from "bookingInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "clientInterfaceMongodb"
import { RoomInterfaceIdMongodb } from "roomInterfaceMongodb"


export interface BookingCreateResponseInterface {
    booking: BookingInterfaceIdMongodb
    updatedRooms: RoomInterfaceIdMongodb[]
    updatedClient: ClientInterfaceIdMongodb
}