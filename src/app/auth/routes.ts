import express, { Router } from 'express'
import AuthenticationController from './controller.js'
import { validateBody } from './middleware.js'
import { signinPayloadModel, signupPayloadModel } from './models.js'

const authenticationController = new AuthenticationController()

export const authRouter: Router = express.Router()

authRouter.post('/sign-up', validateBody(signupPayloadModel), authenticationController.handleSignup.bind(authenticationController))
authRouter.post('/sign-in', validateBody(signinPayloadModel), authenticationController.handleSignin.bind(authenticationController))




