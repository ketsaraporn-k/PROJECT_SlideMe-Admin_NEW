import express from 'express';
import { getAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin } from '../controllers/adminController.js';

const router = express.Router();

// Routes
router.get('/', getAdmins);

router.get('/:id', getAdminById);

router.post('/', createAdmin);

router.put('/:id', updateAdmin);

router.delete('/:id', deleteAdmin);

export default router;