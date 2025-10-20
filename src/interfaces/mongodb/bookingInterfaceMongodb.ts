
import { Document } from "mongoose"
import { OptionYesNo } from "../../enums/optionYesNo"
import { RoomInterfaceIdMongodb } from "./roomInterfaceMongodb"
import { ClientInterfaceIdMongodb } from "./clientInterfaceMongodb"


export interface BookingInterfaceDatesNotArchived {
    check_in_date: Date
    check_out_date: Date
}

export interface BookingInterfaceDatesAndIdNotArchived extends BookingInterfaceDatesNotArchived {
    _id: string
}

export interface BookingInterfaceDTO extends BookingInterfaceDatesNotArchived {
    order_date: Date
    // check_in_date
    // check_out_date
    price: number
    special_request: string
    isArchived: OptionYesNo
    room_id_list: string[]
    client_id: string
}

export interface BookingInterfaceId extends BookingInterfaceDTO {
    _id: string
}

export interface BookingInterfaceIdMongodb extends BookingInterfaceDTO, Document {
    _id: string
}

// export interface BookingInterfaceIdFullDataMongodb extends Omit<BookingInterfaceIdMongodb, 'room_id' | 'client_id'> {
//     room_data_list: RoomInterfaceIdMongodb[]
//     client_data: ClientInterfaceIdMongodb
// }