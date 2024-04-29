import express from "express";
import materielController from '../controllers/materielController.js';


const router = express.Router();

router.post('/',materielController.createMateriel);
router.get('/:id',materielController.getUnMateriel);
router.get('/',materielController.getAllMateriel);

export default router;