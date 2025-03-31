import express from 'express';
import { getAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin } from '../controllers/adminController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin management API
 */

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Get all admins
 *     tags: [Admins]
 *     responses:
 *       200:
 *         description: A list of admins
 */
router.get('/', getAdmins);

/**
 * @swagger
 * /admin/{id}:
 *   get:
 *     summary: Get an admin by ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Admin ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Admin details
 *       404:
 *         description: Admin not found
 */
router.get('/:id', getAdminById);

/**
 * @swagger
 * /admin:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 */
router.post('/', createAdmin);

/**
 * @swagger
 * /admin/{id}:
 *   put:
 *     summary: Update an admin
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Admin ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       404:
 *         description: Admin not found
 */
router.put('/:id', updateAdmin);

/**
 * @swagger
 * /admin/{id}:
 *   delete:
 *     summary: Delete an admin
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Admin ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 */
router.delete('/:id', deleteAdmin);

export default router;