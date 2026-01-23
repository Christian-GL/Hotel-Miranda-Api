
import { BookingInterface } from "../../bookingInterfaceMongodb"
import { RoomInterface } from "../../roomInterfaceMongodb"
import { ClientInterface } from "../../clientInterfaceMongodb"


export interface BookingUpdateResponseInterface {
    booking: BookingInterface | null,
    updatedRooms: RoomInterface[],
    updatedClient: ClientInterface | null
}