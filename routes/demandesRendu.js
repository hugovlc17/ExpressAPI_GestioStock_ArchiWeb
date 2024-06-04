import express from "express";
import demandeRenduController from "../controllers/demandeRenduController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/',auth , demandeRenduController.getAllDemandesRendu);
router.post('/',auth , demandeRenduController.createDemandeRendu);
router.get('/:id_utilisateur',auth , demandeRenduController.getDemandeRenduUserID);
router.delete('/:id',auth , demandeRenduController.deleteDemandeRendu);
router.put('/valider/:id_demande',auth , demandeRenduController.validerDemandeRendu);
router.post('/refuser/:id_demande',auth , demandeRenduController.refuserDemandeRendu);

export default router;