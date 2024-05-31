import express from "express";
import attributionController from "../controllers/attributionController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get('/:id', attributionController.getUneAttribution);
router.get('/', attributionController.getAllAttribution);
router.get('/user/:idUser', attributionController.getAttributionUserID);


export default router;