import express from "express";
import demandeController from "../controllers/demandeController.js";

const router = express.Router();

router.post('/', demandeController.createDemande);
router.get('/:id', demandeController.getUneDemande);
router.get('/', demandeController.getAllDemandes);
router.delete('/:id', demandeController.deleteDemande);
export default router;