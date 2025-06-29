import express from "express";
import materielController from '../controllers/materielController.js';
import auth from "../middleware/auth.js";


const router = express.Router();

router.post('/',auth , materielController.createMateriel);
router.get('/statsStatut', auth , materielController.getStatMaterielStatut);
router.get('/renouvellementBientot', materielController.getMaterielRenouvellementBientot);
router.get('/:id',auth , materielController.getUnMateriel);
router.get('/',auth , materielController.getAllMateriel);
router.put('/:id',auth , materielController.updateMateriel);
router.delete('/:id', auth, materielController.deleteMateriel);



export default router;