
import { Document } from "mongoose"
import { BookingInterfaceMongodb } from "./bookingInterfaceMongodb"
import { OptionYesNo } from "../../enums/optionYesNo"


export interface ClientInterfaceMongodb extends Document {
    _id: string
    full_name: string
    email: string
    phone_number: string
    review_date: Date
    review_comment: string
    isArchived: OptionYesNo
    booking_id_list: string[]
}

export interface ClientInterfaceWithDataMongodb extends Document {
    _id: string
    full_name: string
    email: string
    phone_number: string
    review_date: Date
    review_comment: string
    isArchived: OptionYesNo
    booking_data: BookingInterfaceMongodb[]
}