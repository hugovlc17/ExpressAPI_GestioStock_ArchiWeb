import express from "express";
import demandeAttributionController from "../controllers/demandeAttributionController.js";

const router = express.Router();

router.post('/', demandeAttributionController.createDemande);
router.get('/:id', demandeAttributionController.getUneDemande);
router.get('/', demandeAttributionController.getAllDemandes);
router.delete('/:id', demandeAttributionController.deleteDemande);

export default router;