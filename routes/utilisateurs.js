import express from "express";
import utilisateurController from "../controllers/utilisateurController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post('/',utilisateurController.createUtilisateur);
router.post('/login', utilisateurController.loginUtilisateur);
router.get('/', auth, utilisateurController.getAllUtilisateur);
router.get('/:id', auth, utilisateurController.getUnUtilisateur);
router.put('/:id', auth, utilisateurController.updateUtilisateur);
router.delete('/:id', auth, utilisateurController.deleteUtilisateur);

export default router;