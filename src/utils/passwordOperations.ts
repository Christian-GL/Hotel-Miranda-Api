
import * as bcrypt from 'bcryptjs'


export const hashPassword = async (password: string): Promise<string> => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        return hashedPassword
    }
    catch (error) {
        console.error('Error hashing password:', error)
        throw new Error('Error hashing password')
    }
}

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        const comparedPasswords = await bcrypt.compare(password, hashedPassword)
        return comparedPasswords
    }
    catch (error) {
        console.error('Error comparing passwords:', error)
        throw new Error('Error comparing passwords')
    }
}