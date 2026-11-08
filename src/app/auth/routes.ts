import express, { Router } from 'express'
import AuthenticationController from './controller.js'
import { restrictToAuthenticatedUser, validateBody } from '../middleware/auth-middleware.js'
import { signinPayloadModel, signupPayloadModel } from './models.js'

const authenticationController = new AuthenticationController()

export const authRouter: Router = express.Router()

authRouter.post('/sign-up', validateBody(signupPayloadModel), authenticationController.handleSignup.bind(authenticationController))
authRouter.post('/sign-in', validateBody(signinPayloadModel), authenticationController.handleSignin.bind(authenticationController))

authRouter.get('/me', restrictToAuthenticatedUser(), authenticationController.handleMe.bind(authenticationController))
