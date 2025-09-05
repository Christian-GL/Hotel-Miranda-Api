
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { DecodedUser } from '../interfaces/common/decodedUser'


export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization']
    const token = typeof authHeader === 'string' ? authHeader.split(' ')[1] : undefined

    if (!token) {
        res.status(401).json({ message: 'Access denied. Token is required' })
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET as string) as DecodedUser; (req as any).user = decoded
        next()
    }
    catch (err) {
        res.status(401).json({ message: 'Invalid or expired token' })
        return
    }
}