// src/routes/index.ts
import { Request, Response, Router } from 'express';
import loginRoute from './login.routes';
import infoRoute from './info.routes';

const router: Router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).send({
    data: {},
    meta: { message: 'Renter is now live!!' },
  });
});

router.use('/addDetails', infoRoute);
router.use('/auth', loginRoute);

export default router;