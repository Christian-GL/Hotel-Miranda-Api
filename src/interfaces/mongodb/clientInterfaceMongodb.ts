
import { Document } from "mongoose"
import { OptionYesNo } from "../../enums/optionYesNo"


export interface ClientInterface {
    full_name: string
    email: string
    phone_number: string
    isArchived: OptionYesNo
    booking_id_list: string[]
}

export interface ClientInterfaceIdMongodb extends ClientInterface, Document {
    _id: string
}