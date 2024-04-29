import express from 'express';
import typeMaterielController from '../controllers/typeMaterielController.js';

const router = express.Router();

router.post('/', typeMaterielController.createTypeMateriel);

export default router;