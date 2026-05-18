import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportLeadsCSV,
  getDashboardStats,
} from '../controllers/lead.controller';
import { protect } from '../middleware/auth.middleware';
import { authorize } from '../middleware/role.middleware';
import { validate } from '../middleware/validate.middleware';
import { createLeadSchema, updateLeadSchema, getLeadsQuerySchema } from '../validators/lead.validator';

const router = Router();

// All routes require authentication
router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/export/csv', authorize('Admin'), exportLeadsCSV);

router.route('/')
  .get(validate(getLeadsQuerySchema), getLeads)
  .post(validate(createLeadSchema), createLead);

router.route('/:id')
  .get(getLead)
  .put(validate(updateLeadSchema), updateLead)
  .delete(authorize('Admin'), deleteLead);

export default router;
