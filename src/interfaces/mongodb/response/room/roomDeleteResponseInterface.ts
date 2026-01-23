
import { BookingInterface } from "../../bookingInterfaceMongodb"
import { ClientInterface } from "../../clientInterfaceMongodb"


export interface RoomDeleteResponseInterface {
    roomDeleted: boolean
    roomId: string
    updatedBookings: BookingInterface[]
    updatedClients: ClientInterface[]
}