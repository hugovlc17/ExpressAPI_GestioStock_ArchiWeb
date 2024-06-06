import express from "express";
import attributionController from "../controllers/attributionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/depassees' ,auth , attributionController.getAttributionsDepassees);
router.get('/bientot-expirees', attributionController.getAttributionsBientotExpirees);
router.get('/:id',auth , attributionController.getUneAttribution);
router.get('/',auth , attributionController.getAllAttribution);
router.get('/user/:idUser',auth , attributionController.getAttributionUserID);
router.get('/depassees/user/:userId', auth, attributionController.getAttributionsDepasseesUtilisateur);
router.get('/bientot-expirees/user/:userId', auth, attributionController.getAttributionsBientotExpireesUtilisateur);

export default router;