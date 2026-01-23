
import { BookingInterface } from "../../bookingInterfaceMongodb"


export interface ClientDeleteResponseInterface {
    clientDeleted: boolean
    clientId: string
    updatedBookings: BookingInterface[]
}