import { Router } from 'express'
import { info } from '../controllers/info.controller'

const router: Router = Router()

// router.post('/addNotificationToken', info.addNotificationToken)

router.post('/addPayment', info.addPayment)

router.get('/fetchPayments', info.fetchPayments)

export default router
