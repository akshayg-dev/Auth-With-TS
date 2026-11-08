import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import {randomBytes, createHmac} from 'node:crypto'
import { signupPayloadModel } from "./models.js";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema.js";

class AuthenticationController {
    public async handleSignup(req: Request, res: Response) {
        const validationResult = await signupPayloadModel.safeParseAsync(req.body)
        if (validationResult.error) return res.status(400).json({ message: 'body validation failed', error: validationResult.error.issues })
        
        const { firstName, lastName, email, password } = validationResult.data
        
        const userEmailResult = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if (userEmailResult.length > 0) return res.status(400).json({ error: 'duplicate entry', message: `user with email ${email} already exists` })
        
        const salt = randomBytes(32).toString('hex')
        const hash = createHmac('sha256', salt).update(password).digest('hex')

        const result = await db.insert(usersTable).values({
            firstName, 
            lastName,
            email,
            password: hash,
            salt
        }).returning({ id: usersTable.id })
        
        const createdUser = result[0]
        if (!createdUser) return res.status(500).json({ message: 'user creation failed' })

        return res.status(201).json({ message: 'user has been created successfully', data: { id: createdUser.id} })
    }
}

export default AuthenticationController
