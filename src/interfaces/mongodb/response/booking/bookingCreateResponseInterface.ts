
import { BookingInterface } from "../../bookingInterfaceMongodb"
import { RoomInterface } from "../../roomInterfaceMongodb"
import { ClientInterface } from "../../clientInterfaceMongodb"


export interface BookingCreateResponseInterface {
    booking: BookingInterface
    updatedRooms: RoomInterface[]
    updatedClient: ClientInterface
}