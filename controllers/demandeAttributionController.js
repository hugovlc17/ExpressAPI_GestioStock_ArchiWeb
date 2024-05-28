import { handler } from '../exceptions/handler.js';
import DemandeAttribution from "../models/demandeAttribution.js";
import Attribution from "../models/attribution.js";
import Materiel from "../models/materiel.js";
import Utilisateur from "../models/utilisateur.js";


export const getAllDemandesAttribution = async (req, res) => {
    try {
        const demandesAttribution = await DemandeAttribution.find().populate('id_utilisateur').populate('id_materiel');
        const formattedDemandes = demandesAttribution.map(demande => ({
            _id: demande._id,
            id_utilisateur: demande.id_utilisateur._id,
            username_utilisateur: demande.id_utilisateur.username,
            id_materiel: demande.id_materiel._id,
            nom_materiel: demande.id_materiel.nom,
            statut: demande.statut,
            salle: demande.salle,
            date_demande: demande.date_demande.toISOString().split('T')[0], // Format YYYY-MM-DD
            __v: demande.__v
        }));
        res.status(200).json({ demandesAttribution: formattedDemandes });
    } catch (error) {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
};

export const createDemandeAttribution = async (req, res) => {
    const { id_utilisateur, id_materiel, salle } = req.body;

    try {
        const utilisateur = await Utilisateur.findById(id_utilisateur);
        if (!utilisateur) {
            return handler(res, 'BAD_REQUEST', "L'utilisateur n'existe pas.", 400);
        }

        const materiel = await Materiel.findById(id_materiel);
        if (!materiel) {
            return handler(res, 'BAD_REQUEST', "Le matériel n'existe pas.", 400);
        }

        const demande = new DemandeAttribution({
            id_utilisateur,
            id_materiel,
            salle
        });

        await demande.save();
        res.status(201).json(demande);
    } catch (error) {
        return handler(res, 'INTERNAL_SERVER_ERROR', error.message);
    }
};

export const getDemandeAttributionUserID = async (req, res) => {
    const { id_utilisateur } = req.params;

    try {
        const utilisateur = await Utilisateur.findById(id_utilisateur);
        if (!utilisateur) {
            return handler(res, 'NOT_FOUND', "L'utilisateur n'existe pas.", 404);
        }

        const demandes = await DemandeAttribution.find({ id_utilisateur: id_utilisateur });
        res.json(demandes);
    } catch (error) {
        return handler(res, 'INTERNAL_SERVER_ERROR', error.message);
    }
};

export const deleteDemandeAttribution = async (req, res) => {
    const { id } = req.params;

    try {
        await DemandeAttribution.findByIdAndDelete(id);
        res.json({ message: 'Demande d\'attribution supprimée avec succès.' });
    } catch (error) {
        return handler(res, 'INTERNAL_SERVER_ERROR', error.message);
    }
};

export const getDemandeAttributionEnAttente = async (req, res) => {
    try {
        const demandes = await DemandeAttribution.find({ statut: 'En attente' });
        res.json(demandes);
    } catch (error) {
        return handler(res, 'INTERNAL_SERVER_ERROR', error.message);
    }
};

export const validerDemandeAttribution = async (req, res) => {
    const { id_demande } = req.params;

    try {
        const demande = await DemandeAttribution.findById(id_demande);
        if (!demande) {
            return handler(res, 'BAD_REQUEST', 'La demande d\'attribution n\'existe pas.', 400);
        }

        const materiel = await Materiel.findById(demande.id_materiel);
        if (!materiel || materiel.statut !== 'stocké') {
            return handler(res, 'BAD_REQUEST', 'Le matériel associé à la demande n\'est pas disponible.', 400);
        }

        const attribution = new Attribution({
            id_utilisateur: demande.id_utilisateur,
            id_materiel: demande.id_materiel,
            date_attribution: new Date(),
            date_retour_prevue: req.body.date_retour_prevue,
            statut: 'en cours'
        });

        demande.statut = 'Approuvée';
        await demande.save();

        await attribution.save();

        materiel.statut = 'utilisé';
        await materiel.save();

        res.json(attribution);
    } catch (error) {
        return handler(res, 'INTERNAL_SERVER_ERROR', error.message);
    }
};

export const refuserDemandeAttribution = async (req, res) => {
    const { id_demande } = req.params;

    try {
        const demande = await DemandeAttribution.findById(id_demande);
        if (!demande) {
            return handler(res, 'BAD_REQUEST', 'La demande de rendu n\'existe pas.', 400);
        }

        demande.statut = 'Refusée';
        await demande.save();

        res.json({ message: 'Demande de rendu refusée avec succès.' });
    } catch (error) {
        return handler(res, 'INTERNAL_SERVER_ERROR', error.message);
    }
};

export default { getAllDemandesAttribution, createDemandeAttribution, getDemandeAttributionUserID, deleteDemandeAttribution, getDemandeAttributionEnAttente, validerDemandeAttribution, refuserDemandeAttribution };