import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'routing-controllers';
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
        return;
    }

    if (err instanceof HttpError) {
        res.status(err.httpCode).type('application/problem+json').json({
            type: "https://datatracker.ietf.org/doc/html/rfc7807",
            title: err.name || "HTTP Error",
            status: err.httpCode,
            detail: err.message || "Ocurrió un error HTTP."
        });
        return;
    }

    res.status(500).type('application/problem+json').json({
        type: "https://datatracker.ietf.org/doc/html/rfc7807",
        title: "Internal Server Error",
        status: 500,
        detail: err.message || "Ocurrió un error inesperado."
    });
}