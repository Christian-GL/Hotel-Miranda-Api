
import { RoomInterface } from "../../roomInterfaceMongodb"
import { ClientInterface } from "../../clientInterfaceMongodb"


export interface BookingDeleteResponseInterface {
    deleted: boolean,
    bookingId: string,
    updatedRooms: RoomInterface[],
    updatedClient: ClientInterface | null
}