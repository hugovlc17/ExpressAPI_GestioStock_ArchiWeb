//import Affectation from "../models/attribution.js";
import Attribution from "../models/attribution.js";
import {handler} from '../exceptions/handler.js';



const getUneAttribution = (req, res)=> {
    const id = req.params.id;

    Attribution.findOne({_id: id})
        .populate('id_utilisateur', 'username')
        .populate('id_materiel', 'nom matricule')
        .then((attribution) => {
            if (!attribution) {
                return res.status(404).json({ error: 'Attribution not found' });
            }

            // Modification de la structure de l'objet de réponse
            const formattedAttribution = {
                _id: attribution._id,
                id_utilisateur: attribution.id_utilisateur._id,
                username_utilisateur: attribution.id_utilisateur.username,
                id_materiel: attribution.id_materiel._id,
                nom_matériel: attribution.id_materiel.nom,
                matricule_materiel: attribution.id_materiel.matricule,
                date_attribution: attribution.date_attribution.toISOString().split('T')[0],
                date_retour_prevue: attribution.date_retour_prevue.toISOString().split('T')[0],
                statut: attribution.statut
            };

            return res.status(200).json({ attribution: formattedAttribution });
        })
        .catch(error => {
            return handler(res, 'INTERNAL_ERROR', error.message, 500);
        });
}

const getAllAttribution = (req, res)=> {

    Attribution.find()
        .then((attributions) => {
            return res.status(200).json({attributions})
        })
        .catch(error => {
            return handler(res, 'INTERNAL_ERROR', error.message, 500);
        });
}

export default {
    getUneAttribution,
    getAllAttribution
};