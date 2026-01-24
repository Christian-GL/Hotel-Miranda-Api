
import { BookingInterfaceIdMongodb } from "../../bookingInterfaceMongodb"
import { RoomInterfaceIdMongodb } from "../../roomInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "../../clientInterfaceMongodb"


export interface BookingCreateResponseInterface {
    booking: BookingInterfaceIdMongodb
    updatedRooms: RoomInterfaceIdMongodb[]
    updatedClient: ClientInterfaceIdMongodb
}