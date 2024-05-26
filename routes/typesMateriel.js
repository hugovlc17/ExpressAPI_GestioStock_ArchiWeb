import express from 'express';
import typeMaterielController from '../controllers/typeMaterielController.js';
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/', auth, typeMaterielController.createTypeMateriel);
router.get('/', typeMaterielController.getAllTypesMateriel);

export default router;