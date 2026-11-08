import JWT from "jsonwebtoken";
import 'dotenv/config'

export interface UserTokenPayload {
    id: string
}

export function createUserToken(payload: UserTokenPayload) {
    const token = JWT.sign(payload, process.env.JWT_SECRET!)
    return token
}


export function verifyUserToken(token: string) {
    try {
        const payload = JWT.verify(token, process.env.JWT_SECRET!) as UserTokenPayload
        return payload
    }
    catch (error){
        return null
    }
}