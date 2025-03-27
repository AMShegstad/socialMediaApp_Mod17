import { Router } from 'express';
import usersRoutes from './usersRoutes.js';
import thoughtsRoutes from './thoughtsRoutes.js';

const router = Router();

router.use('/users', usersRoutes);
router.use('/thoughts', thoughtsRoutes);

export default router;
