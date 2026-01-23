
import { BookingInterface } from "../../bookingInterfaceMongodb"
import { ClientInterface } from "../../clientInterfaceMongodb"


export interface ClientUpdateResponseInterface {
    clientUpdated: ClientInterface
    updatedBookings: BookingInterface[]
}
