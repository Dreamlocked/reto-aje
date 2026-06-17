import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ProblemDetailError } from '../../domain/exceptions/ProblemDetailError';

export async function ValidateInput<T extends object>(type: new () => T, body: unknown): Promise<T> {
    const input = plainToInstance(type, body ?? {});

    const errors = await validate(input, {
        whitelist: true,
        forbidNonWhitelisted: true
    });

    if (errors.length > 0) {
        const errorDetails = errors.map(err => ({
            property: err.property,
            constraints: err.constraints
        }));

        throw new ProblemDetailError(
            400,
            'Validation Error',
            'Uno o más campos son inválidos.',
            errorDetails
        );
    }

    return input;
}