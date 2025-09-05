
import type { DecodedUser } from '../interfaces/common/decodedUser'


declare global {
    namespace Express {
        interface Request {
            user?: DecodedUser
        }
    }
}

// "export { }" hace que el archivo sea tratado como módulo y la declaración global se aplique.
export { }