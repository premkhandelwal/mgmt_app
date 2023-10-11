import { Router } from 'express'
import { auth } from '../controllers/auth.controller'

const googleTokenVerifier = require('../utils/google_token_verifier')

const router: Router = Router()

router.post(
  '/isUserExist',
  googleTokenVerifier.verifyGoogleAccessToken,
  auth.isUserExist,
)

router.post(
  '/addCustomer',
  googleTokenVerifier.verifyGoogleAccessToken,
  auth.addUser,
)

module.exports = router
