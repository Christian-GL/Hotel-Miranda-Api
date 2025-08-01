
import { Document } from "mongoose"
import { BookingInterfaceReviewMongodb } from "./bookingInterfaceMongodb"
import { OptionYesNo } from "../../enums/optionYesNo"


interface ClientInterfaceBaseMongodb extends Document {
    _id: string
    full_name: string
    email: string
    phone_number: string
    isArchived: OptionYesNo
}

export interface ClientInterfaceIdMongodb extends ClientInterfaceBaseMongodb {
    booking_id_list: string[]
}

export interface ClientInterfaceFullDataMongodb extends ClientInterfaceBaseMongodb {
    booking_data: BookingInterfaceReviewMongodb[]
}