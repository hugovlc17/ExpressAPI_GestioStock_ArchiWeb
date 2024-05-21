import express from "express";
import utilisateurController from "../controllers/utilisateurController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/',utilisateurController.createUtilisateur);
router.post('/login', utilisateurController.loginUtilisateur);
router.get('/',auth, utilisateurController.getAllUtilisateur);


export default router;