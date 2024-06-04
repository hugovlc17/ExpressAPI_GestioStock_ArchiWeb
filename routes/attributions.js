import express from "express";
import attributionController from "../controllers/attributionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/:id',auth , attributionController.getUneAttribution);
router.get('/',auth , attributionController.getAllAttribution);
router.get('/user/:idUser',auth , attributionController.getAttributionUserID);


export default router;