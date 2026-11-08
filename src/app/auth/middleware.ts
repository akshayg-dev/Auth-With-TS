import type { Request, Response, NextFunction } from 'express';
import type { z } from 'zod';

export function validateBody(payloadModel: z.ZodType) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const validationResult =
            await payloadModel.safeParseAsync(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: 'body validation failed',
                error: validationResult.error.issues
            });
        }

        req.body = validationResult.data;
        next();
    };
}
