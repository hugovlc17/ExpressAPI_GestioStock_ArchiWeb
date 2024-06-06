import express from "express";
import demandeAttributionController from "../controllers/demandeAttributionController.js";
import auth from "../middleware/auth.js";


const router = express.Router();

router.get('/', auth, demandeAttributionController.getAllDemandesAttribution);
router.post('/',auth , demandeAttributionController.createDemandeAttribution);
router.get('/enattente',auth , demandeAttributionController.getDemandeAttributionEnAttente);
router.get('/count/enattente',auth , demandeAttributionController.countDemandeAttributionEnAttente);
router.get('/:id_utilisateur',auth , demandeAttributionController.getDemandeAttributionUserID);
router.delete('/:id',auth , demandeAttributionController.deleteDemandeAttribution);
router.put('/valider/:id_demande',auth , demandeAttributionController.validerDemandeAttribution);
router.post('/refuser/:id_demande',auth , demandeAttributionController.refuserDemandeAttribution);


export default router;