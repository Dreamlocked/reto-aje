import { Request, Response, NextFunction } from 'express';
import { ProblemDetailError } from '../../domain';

export function ProblemDetailsMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof ProblemDetailError) {
        res.status(err.status).type('application/problem+json').json({
            type: err.type,
            title: err.message,
            status: err.status,
            detail: err.detail,
            errors: err.errors
        });
    } else {
        // Error 500 no controlado
        res.status(500).type('application/problem+json').json({
            type: "https://datatracker.ietf.org/doc/html/rfc7807",
            title: "Internal Server Error",
            status: 500,
            detail: err.message || "Ocurrió un error inesperado."
        });
    }
}