
import { ClientInterfaceIdMongodb } from "../../clientInterfaceMongodb"
import { BookingInterfaceIdMongodb } from "../../bookingInterfaceMongodb"


export interface ClientUpdateResponseInterface {
    clientUpdated: ClientInterfaceIdMongodb
    updatedBookings: BookingInterfaceIdMongodb[]
}
