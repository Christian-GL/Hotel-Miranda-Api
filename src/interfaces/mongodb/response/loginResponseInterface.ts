
import { Role } from "../../../enums/role"


export interface LoginResponseInterface {
    token: string
    loggedUserID: string
    role: Role
}