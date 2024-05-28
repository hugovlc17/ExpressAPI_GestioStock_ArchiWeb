import express from "express";
import demandeRenduController from "../controllers/demandeRenduController.js";

const router = express.Router();

router.get('/', demandeRenduController.getAllDemandesRendu);
router.post('/', demandeRenduController.createDemandeRendu);
router.get('/:id_utilisateur', demandeRenduController.getDemandeRenduUserID);
router.delete('/:id', demandeRenduController.deleteDemandeRendu);
router.put('/valider/:id_demande', demandeRenduController.validerDemandeRendu);
router.post('/refuser/:id_demande', demandeRenduController.refuserDemandeRendu);

export default router;