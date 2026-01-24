
import { BookingInterface } from "../../bookingInterfaceMongodb"


export interface ClientDeleteResponseInterface {
    clientIsDeleted: boolean
    clientId: string
    updatedBookings: BookingInterface[]
}