
import { Document } from "mongoose"
import { BookingInterfaceReviewMongodb } from "./bookingInterfaceMongodb"
import { OptionYesNo } from "../../enums/optionYesNo"


export interface ClientInterfaceDTO {
    full_name: string
    email: string
    phone_number: string
    isArchived: OptionYesNo
    booking_id_list: string[]
}

export interface ClientInterfaceIdMongodb extends ClientInterfaceDTO, Document {
    _id: string
}

export interface ClientInterfaceFullDataMongodb extends Omit<ClientInterfaceDTO, 'booking_id_list'>, Document {
    booking_data: BookingInterfaceReviewMongodb[]
}