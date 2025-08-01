import { Router } from 'express'
import { info } from '../controllers/info.controller'

const router: Router = Router()

// router.post('/addNotificationToken', info.addNotificationToken)

router.post('/addPayment', info.addPayment)
router.post('/deletePayment', info.deletePayment)

router.get('/fetchPayments', info.fetchPayments)

module.exports = router;
