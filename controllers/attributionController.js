//import Affectation from "../models/attribution.js";
import Attribution from "../models/attribution.js";
import {handler} from '../exceptions/handler.js';
import Utilisateur from "../models/utilisateur.js";



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

const getAttributionUserID = async (req, res) => {
    const { idUser } = req.params;
    try {
        const utilisateur = await Utilisateur.findById(idUser);
        if (!utilisateur) {
            return handler(res, 'NOT_FOUND', "L'utilisateur n'existe pas.", 404);
        }

        // Recup uniquement les attributions avec le statut 'en cours'
        const attributions = await Attribution.find({ id_utilisateur: idUser, statut: 'en cours' });

        const formattedAttributions = attributions.map(attribution => {
            return {
                ...attribution.toObject(),
                date_attribution:  new Date(attribution.date_attribution).toISOString().split('T')[0],
                date_retour_prevue: new Date(attribution.date_retour_prevue).toISOString().split('T')[0]
            };
        });

        res.json(formattedAttributions);
    } catch (error) {
        return handler(res, 'INTERNAL_SERVER_ERROR', error.message);
    }
};

const getAttributionsDepassees = async (req, res) => {
    try {
        const now = new Date();
        const attributions = await Attribution.find({
            statut: 'en cours',
            date_retour_prevue: { $lt: now }
        }).populate('id_materiel', 'nom salle').populate('id_utilisateur', 'username');

        const formattedAttributions = attributions.map(attribution => ({
            username: attribution.id_utilisateur.username,
            nom: attribution.id_materiel.nom,
            salle: attribution.id_materiel.salle,
            date_retour_prevue: attribution.date_retour_prevue.toISOString().split('T')[0]
        }));

        res.status(200).json({ attributions: formattedAttributions });
    } catch (error) {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
};

const getAttributionsBientotExpirees = async (req, res) => {
    try {
        const now = new Date();
        const dateDans1Semaine = new Date();
        dateDans1Semaine.setDate(now.getDate() + 7);

        const attributions = await Attribution.find({
            statut: 'en cours',
            date_retour_prevue: { $gte: now, $lte: dateDans1Semaine }
        }).populate('id_materiel', 'nom salle').populate('id_utilisateur', 'username');

        const formattedAttributions = attributions.map(attribution => ({
            username : attribution.id_utilisateur.username,
            nom: attribution.id_materiel.nom,
            salle: attribution.id_materiel.salle,
            date_retour_prevue: attribution.date_retour_prevue.toISOString().split('T')[0]
        }));

        res.status(200).json({ attributions: formattedAttributions });
    } catch (error) {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
};

const getAttributionsDepasseesUtilisateur = async (req, res) => {
    const userId = req.params.userId;
    try {
        const now = new Date();
        const attributions = await Attribution.find({
            id_utilisateur: userId,
            statut: 'en cours',
            date_retour_prevue: { $lt: now }
        }).populate('id_materiel', 'nom salle');

        const formattedAttributions = attributions.map(attribution => ({
            nom: attribution.id_materiel.nom,
            salle: attribution.id_materiel.salle,
            date_retour_prevue: attribution.date_retour_prevue.toISOString().split('T')[0]
        }));

        res.status(200).json({ attributions: formattedAttributions });
    } catch (error) {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
};

const getAttributionsBientotExpireesUtilisateur = async (req, res) => {
    const userId = req.params.userId;
    try {
        const now = new Date();
        const dateDans1Semaine = new Date();
        dateDans1Semaine.setDate(now.getDate() + 7);

        const attributions = await Attribution.find({
            id_utilisateur: userId,
            statut: 'en cours',
            date_retour_prevue: { $gte: now, $lte: dateDans1Semaine }
        }).populate('id_materiel', 'nom salle');

        const formattedAttributions = attributions.map(attribution => ({
            nom: attribution.id_materiel.nom,
            salle: attribution.id_materiel.salle,
            date_retour_prevue: attribution.date_retour_prevue.toISOString().split('T')[0]
        }));

        res.status(200).json({ attributions: formattedAttributions });
    } catch (error) {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
};




export default {
    getUneAttribution,
    getAllAttribution,
    getAttributionUserID,
    getAttributionsDepassees,
    getAttributionsBientotExpirees,
    getAttributionsDepasseesUtilisateur,
    getAttributionsBientotExpireesUtilisateur
};