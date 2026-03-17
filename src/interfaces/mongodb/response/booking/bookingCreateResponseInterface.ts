
import { BookingInterfaceIdMongodb } from "interfaces/mongodb/bookingInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "interfaces/mongodb/clientInterfaceMongodb"
import { RoomInterfaceIdMongodb } from "interfaces/mongodb/roomInterfaceMongodb"


export interface BookingCreateResponseInterface {
    booking: BookingInterfaceIdMongodb
    updatedRooms: RoomInterfaceIdMongodb[]
    updatedClient: ClientInterfaceIdMongodb
}