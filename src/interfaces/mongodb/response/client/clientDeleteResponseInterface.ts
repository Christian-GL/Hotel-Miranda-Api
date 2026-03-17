
import { BookingInterface } from "interfaces/mongodb/bookingInterfaceMongodb"


export interface ClientDeleteResponseInterface {
    clientIsDeleted: boolean
    clientId: string
    updatedBookings: BookingInterface[]
}