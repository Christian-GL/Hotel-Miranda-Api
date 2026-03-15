
import { ClientInterfaceIdMongodb } from "clientInterfaceMongodb"
import { RoomInterfaceIdMongodb } from "roomInterfaceMongodb"


export interface BookingDeleteResponseInterface {
    bookingIsDeleted: boolean,
    bookingId: string,
    updatedRooms: RoomInterfaceIdMongodb[],
    updatedClient: ClientInterfaceIdMongodb | null
}