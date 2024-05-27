import express from "express";
import demandeRenduController from "../controllers/demandeRenduController.js";

const router = express.Router();

router.get('/', demandeRenduController.getAllDemandesRendu);
router.post('/', demandeRenduController.createDemandeRendu);
router.get('/:id_utilisateur', demandeRenduController.getDemandeRenduUserID);
router.delete('/:id', demandeRenduController.deleteDemandeRendu);
router.put('/:id_demande/valider', demandeRenduController.validerDemandeRendu);

export default router;