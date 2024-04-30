import Demande from "../models/demande.js";
import Utilisateur from "../models/utilisateur.js";
import Materiel from "../models/materiel.js";
import {handler} from '../exceptions/handler.js';
import Demandes from "../routes/demandes.js";


const createDemande = async (req, res) => {

    const { id_utilisateur, id_materiel, type_demande } = req.body;

    if (!id_utilisateur || !id_materiel || !type_demande) {
        return handler(res, 'BAD_REQUEST', 'Tous les champs requis doivent être fournis.', 400);
    }

    try {
        const utilisateurExiste = await Utilisateur.exists({ _id: id_utilisateur });
        if (!utilisateurExiste) {
            return handler(res, 'BAD_REQUEST', 'L\'utilisateur n\'existe pas.', 400);
        }

        const materielExiste = await Materiel.exists({ _id: id_materiel });
        if (!materielExiste) {
            return handler(res, 'BAD_REQUEST', 'Le matériel n\'existe pas.', 400);
        }

        if (type_demande !== 'Attribution' && type_demande !== 'Rendu') {
            return handler(res, 'BAD_REQUEST', 'Le type de demande doit être "Attribution" ou "Rendu".', 400);
        }

        const nouvelleDemande = new Demande({
            id_utilisateur,
            id_materiel,
            type_demande
        });

        await nouvelleDemande.save()
        .then(demande => {
            res.status(201).json({demande});
        })
    } catch (error) {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
};

const getAllDemandes = async (req, res) =>{
    await Demande.find()
        .then((demandes) => {
            return res.status(200).json({demandes})
        })
        .catch(error => {
            return handler(res, 'INTERNAL_ERROR', error.message, 500);
        });
};

const getUneDemande = async (req, res) =>{
    const demandeId = req.params.id;
    await Demande.findById(demandeId)
        .then((demande) =>
        {
            return res.status(200).json({demande})
        })
        .catch(error => {
            return handler(res, 'INTERNAL_ERROR', error.message, 500);
        });
};

const deleteDemande = async (req, res) => {
    const id = req.params.id;

    try{
        const demande = await Demande.findById(id);
        if (!demande) {
            return handler(res, 'NOT_FOUND', 'La demande n\'a pas été trouvée', 404);
        }
        await Demande.findByIdAndDelete(id);
        res.status(200).json({ message: 'Demande supprimée !' });
    }catch (error) {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
}

export default { createDemande, getAllDemandes, getUneDemande, deleteDemande };
