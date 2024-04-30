import express from "express";
import utilisateurController from "../controllers/utilisateurController.js";

const router = express.Router();

router.post('/',utilisateurController.createMateriel);


export default router;