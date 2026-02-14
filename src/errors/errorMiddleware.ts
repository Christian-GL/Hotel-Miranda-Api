
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import { ApiError } from './ApiError'


export const errorMiddleware: ErrorRequestHandler = (
    error: unknown,
    request: Request,
    response: Response,
    next: NextFunction
) => {

    if (error instanceof ApiError) {
        response.status(error.status).json({
            status: error.status,
            message: error.message
        })
        return
    }

    console.error(error)

    response.status(500).json({
        status: 500,
        message: 'Internal unknow server error'
    })
    return
}