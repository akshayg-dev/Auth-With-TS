import type { Request, Response, NextFunction } from 'express';
import type { z } from 'zod';
import { verifyUserToken } from '../auth/utils/token.js';

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

export function authenticationMiddleware() {
    return function (req: Request, res: Response, next: NextFunction) {
        const header = req.headers['authorization']
        if (!header) return next()
        
        if (!header.startsWith('Bearer')) return res.status(400).json({ error: `authorization header must start with bearer` })
        
        const token = header.split(' ')[1]

        if (!token) return res.status(400).json({ error: `authorization header must start with bearer and followed by token` })
        
        const user = verifyUserToken(token)
        
        //@ts-ignore
        req.user = user
        
        return next()
    }
}

export function restrictToAuthenticatedUser() {
    return function (req: Request, res: Response, next: NextFunction) {
        //@ts-ignore
        if (!req.user) return res.status(401).json({ error: 'Authentication Required' })
        return next()
    }
}
