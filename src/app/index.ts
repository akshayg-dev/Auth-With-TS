import express from 'express'
import type { Express } from 'express'

export function createApplication():Express {
    const app = express()

    //Middlewares


    //Routes
    app.get('/', (req, res) => {
        return res.json({message: 'Welcome to TS Auth Service'})
    })


    return app
}