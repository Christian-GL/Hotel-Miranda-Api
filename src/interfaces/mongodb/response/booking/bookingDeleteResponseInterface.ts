
import { ClientInterfaceIdMongodb } from "interfaces/mongodb/clientInterfaceMongodb"
import { RoomInterfaceIdMongodb } from "interfaces/mongodb/roomInterfaceMongodb"


export interface BookingDeleteResponseInterface {
    bookingIsDeleted: boolean,
    bookingId: string,
    updatedRooms: RoomInterfaceIdMongodb[],
    updatedClient: ClientInterfaceIdMongodb | null
}