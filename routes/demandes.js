import express from "express";
import demandeController from "../controllers/demandeController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/', auth, demandeController.createDemande);
router.get('/:id', auth, demandeController.getUneDemande);
router.get('/', auth, demandeController.getAllDemandes);
router.delete('/:id', auth, demandeController.deleteDemande);
export default router;