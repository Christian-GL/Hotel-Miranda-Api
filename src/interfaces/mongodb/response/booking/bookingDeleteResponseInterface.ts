
import { RoomInterfaceIdMongodb } from "../../roomInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "../../clientInterfaceMongodb"


export interface BookingDeleteResponseInterface {
    bookingIsDeleted: boolean,
    bookingId: string,
    updatedRooms: RoomInterfaceIdMongodb[],
    updatedClient: ClientInterfaceIdMongodb | null
}