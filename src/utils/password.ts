import { randomBytes, createHmac } from 'node:crypto'
import { create } from 'node:domain'
import { string } from 'zod'

export function hashPassword(password: string) {
    const salt = randomBytes(32).toString('hex')
    const hash = createHmac('sha256', salt).update(password).digest('hex')

    return { salt, hash }
}

export function checkHashedPassword(salt: string, password: string, storedHash: string) {
    const hash = createHmac('sha256', salt).update(password).digest('hex')

    return hash === storedHash
}