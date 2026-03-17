
import { BookingInterfaceIdMongodb } from "interfaces/mongodb/bookingInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "interfaces/mongodb/clientInterfaceMongodb"


export interface ClientArchiveResponseInterface {
    clientUpdated: ClientInterfaceIdMongodb
    updatedBookings: BookingInterfaceIdMongodb[]
}