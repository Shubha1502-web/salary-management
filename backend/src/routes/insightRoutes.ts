import { Router } from 'express';
import {
  getSalaryStats,
  getSalaryByTitle,
} from '../controllers/insightController';

const router = Router();

router.get('/salary-stats', getSalaryStats);
router.get('/salary-by-title', getSalaryByTitle);

export default router;