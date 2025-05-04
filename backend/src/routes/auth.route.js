import { Router } from 'express';
import { authCallback } from '../controller/auth.controller.js';

const router = Router();

// The callback route that handles the logic after Clerk authentication
router.post('/callback', authCallback);

export default router;
