import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { ProblemDetailError } from '../../domain/exceptions/ProblemDetailError';

export function ValidateBody(type: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const input = plainToInstance(type, req.body);
        const errors = await validate(input);

        if (errors.length > 0) {
            const errorDetails = errors.map(err => ({
                property: err.property,
                constraints: err.constraints
            }));
            // Retornar 400 Bad Request en formato Problem Details
            next(new ProblemDetailError(400, "Validation Error", "Uno o más campos son inválidos.", errorDetails));
            return;
        }
        req.body = input; // Input ya parseado y validado
        next();
    };
}