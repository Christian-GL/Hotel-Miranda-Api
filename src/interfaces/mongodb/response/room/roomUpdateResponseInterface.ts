
import { BookingInterface } from "../../bookingInterfaceMongodb"
import { RoomInterface } from "../../roomInterfaceMongodb"
import { ClientInterface } from "../../clientInterfaceMongodb"


export interface RoomUpdateResponseInterface {
    roomUpdated: RoomInterface
    updatedBookings: BookingInterface[]
    updatedClients: ClientInterface[]
}