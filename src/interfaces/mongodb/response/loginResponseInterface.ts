
import { Role } from "user/enums/role"


export interface LoginResponseInterface {
    token: string
    loggedUserID: string
    role: Role
}