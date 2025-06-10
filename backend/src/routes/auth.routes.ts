import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller';
import { auth } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/me', auth, me);

export { router as authRouter }; 