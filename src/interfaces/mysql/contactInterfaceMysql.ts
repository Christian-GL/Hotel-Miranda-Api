

import { ContactArchived } from "../../enums/contactArchived"

export interface ContactInterfaceMysql {
    _id: number
    publish_date: Date
    full_name: string
    email: string
    phone_number: string
    comment: string
    archived: ContactArchived
}