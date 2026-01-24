
import { BookingInterfaceIdMongodb } from "../../bookingInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "../../clientInterfaceMongodb"


export interface RoomDeleteResponseInterface {
    roomIsDeleted: boolean
    roomId: string
    updatedBookings: BookingInterfaceIdMongodb[]
    updatedClients: ClientInterfaceIdMongodb[]
}