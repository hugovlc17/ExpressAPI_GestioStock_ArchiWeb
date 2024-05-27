import express from "express";
import demandeAttributionController from "../controllers/demandeAttributionController.js";

const router = express.Router();

router.get('/', demandeAttributionController.getAllDemandesAttribution);
router.post('/', demandeAttributionController.createDemandeAttribution);
router.get('/enattente', demandeAttributionController.getDemandeAttributionEnAttente);
router.get('/:id_utilisateur', demandeAttributionController.getDemandeAttributionUserID);
router.delete('/:id', demandeAttributionController.deleteDemandeAttribution);
router.put('/:id_demande/valider', demandeAttributionController.validerDemandeAttribution);


export default router;