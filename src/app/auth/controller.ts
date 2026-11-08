import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import {randomBytes, createHmac} from 'node:crypto'
import { signinPayloadModel, signupPayloadModel } from "./models.js";
import { db } from "../../db/index.js";
import { usersTable } from "../../db/schema.js";
import { checkHashedPassword, hashPassword } from "../../utils/password.js";

class AuthenticationController {
    public async handleSignup(req: Request, res: Response) {
        const { firstName, lastName, email, password } = req.body
        
        const userEmailResult = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if (userEmailResult.length > 0) return res.status(400).json({ error: 'duplicate entry', message: `user with email ${email} already exists` })
        
        const {salt, hash} = hashPassword(password)

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

    public async handleSignin(req: Request, res: Response) {
        const { email, password } = req.body;

        const [userSelect] = await db.select().from(usersTable).where(eq(usersTable.email, email))

        if (!userSelect) return res.status(404).json({ message: `user with email ${email} does not exists` })
        
        if (!userSelect.salt || !userSelect.password) {
            return res.status(500).json({
                message: 'User password data is missing'
        });
        }
        
        const isPasswordCorrect = checkHashedPassword(userSelect.salt, password, userSelect.password)
        
        if (!isPasswordCorrect) return res.status(400).json({
            message: `user email or password is incorrect`
        })

        // TODO: Token Banao

        return res.json({ message: 'Signin Success', data: { token: 1 } })
        
    
        
    }
}

export default AuthenticationController
