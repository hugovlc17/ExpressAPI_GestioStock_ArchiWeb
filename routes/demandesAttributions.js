import express from "express";
import demandeAttributionController from "../controllers/demandeAttributionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/', auth, demandeAttributionController.createDemande);
router.get('/:id', auth, demandeAttributionController.getUneDemande);
router.get('/', auth, demandeAttributionController.getAllDemandes);
router.delete('/:id', auth, demandeAttributionController.deleteDemande);

export default router;