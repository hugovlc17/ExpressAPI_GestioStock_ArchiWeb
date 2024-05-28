import express from "express";
import demandeAttributionController from "../controllers/demandeAttributionController.js";


const router = express.Router();

router.get('/', demandeAttributionController.getAllDemandesAttribution);
router.post('/', demandeAttributionController.createDemandeAttribution);
router.get('/enattente', demandeAttributionController.getDemandeAttributionEnAttente);
router.get('/:id_utilisateur', demandeAttributionController.getDemandeAttributionUserID);
router.delete('/:id', demandeAttributionController.deleteDemandeAttribution);
router.put('/valider/:id_demande', demandeAttributionController.validerDemandeAttribution);
router.post('/refuser/:id_demande', demandeAttributionController.refuserDemandeAttribution);


export default router;