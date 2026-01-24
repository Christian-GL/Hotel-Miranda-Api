
import { BookingInterfaceIdMongodb } from "../../bookingInterfaceMongodb"
import { RoomInterfaceIdMongodb } from "../../roomInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "../../clientInterfaceMongodb"


export interface BookingUpdateResponseInterface {
    booking: BookingInterfaceIdMongodb | null,
    updatedRooms: RoomInterfaceIdMongodb[],
    updatedClient: ClientInterfaceIdMongodb | null
}