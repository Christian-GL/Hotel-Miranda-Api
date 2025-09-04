
import { Request, Response, NextFunction } from 'express'

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user) return res.status(401).json({ message: 'Unauthenticated' })
    if (user.role !== 'admin') return res.status(403).json({ message: 'Forbidden: admin only' })
    next()
}