
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
        res.status(403).json({ message: 'Access denied. Token is required' })
        return
    }
    else {
        try {
            jwt.verify(token, process.env.TOKEN_SECRET as string)
            next()
        }
        catch (error) {
            res.status(403).json({ message: 'Invalid token' })
            return
        }
    }

}