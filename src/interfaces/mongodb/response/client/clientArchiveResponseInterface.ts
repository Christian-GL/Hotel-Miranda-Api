
import { BookingInterfaceIdMongodb } from "../../bookingInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "../../clientInterfaceMongodb"


export interface ClientArchiveResponseInterface {
    clientUpdated: ClientInterfaceIdMongodb
    updatedBookings: BookingInterfaceIdMongodb[]
}