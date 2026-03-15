
import { BookingInterfaceIdMongodb } from "bookingInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "clientInterfaceMongodb"
import { RoomInterfaceIdMongodb } from "roomInterfaceMongodb"


export interface BookingArchiveResponseInterface {
    booking: BookingInterfaceIdMongodb | null,
    updatedRooms: RoomInterfaceIdMongodb[],
    updatedClient: ClientInterfaceIdMongodb | null
}