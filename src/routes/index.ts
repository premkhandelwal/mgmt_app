import { Request, Response, Router } from 'express'
const loginRoute = require('./login.routes')
const infoRoute = require('./info.routes')

const router: Router = Router()

router.get('/', (req: Request, res: Response) => {
  res.status(200).send({
    data: {},
    meta: {
      message: 'Renter is now live!!',
    },
  })
})

router.use('/addDetails', infoRoute)
router.use('/auth', loginRoute)

module.exports = router
