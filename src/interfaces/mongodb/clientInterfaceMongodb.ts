
import { Document } from "mongoose"
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

export interface ClientInterfaceFullDataMongodb extends Omit<ClientInterfaceIdMongodb, 'booking_id_list'> {
    booking_data_list: {
        room_id: string
        review_date: Date
        review_comment: string
    }[]
}