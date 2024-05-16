import express from "express";
import utilisateurController from "../controllers/utilisateurController.js";

const router = express.Router();

router.post('/',utilisateurController.createUtilisateur);
router.post('/login', utilisateurController.loginUtilisateur);


export default router;