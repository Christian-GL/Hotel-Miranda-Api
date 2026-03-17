
import { BookingInterfaceIdMongodb } from "interfaces/mongodb/bookingInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "interfaces/mongodb/clientInterfaceMongodb"
import { RoomInterfaceIdMongodb } from "interfaces/mongodb/roomInterfaceMongodb"


export interface BookingArchiveResponseInterface {
    booking: BookingInterfaceIdMongodb | null,
    updatedRooms: RoomInterfaceIdMongodb[],
    updatedClient: ClientInterfaceIdMongodb | null
}