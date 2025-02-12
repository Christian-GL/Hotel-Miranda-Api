
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'


export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1]

    if (!token) {
        res.status(403).json({ message: 'Access denied. Token is required' })
    }

    else {
        jwt.verify(token, process.env.TOKEN_SECRET as string, error => {
            if (error) {
                res.status(403).json({ message: 'Invalid token' })
            }
            next()
        })
    }

}
