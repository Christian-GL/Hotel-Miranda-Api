
import { Request, Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'

interface DecodedUser extends JwtPayload {
    id: string
    role: string
}


export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
        res.status(403).json({ message: 'Access denied. Token is required' })
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as DecodedUser
        (req as any).user = decoded
        next()
    }
    catch (error) {
        res.status(403).json({ message: 'Invalid token' })
    }
}