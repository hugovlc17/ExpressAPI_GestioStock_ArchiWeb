// demandeRenduController.js

import { handler } from '../exceptions/handler.js';
import DemandeRendu from "../models/demandeRendu.js";
import Attribution from "../models/attribution.js";
import Materiel from "../models/materiel.js";
import Utilisateur from "../models/utilisateur.js";

export const getAllDemandesRendu = async (req, res) => {
    try {
        const demandes = await DemandeRendu.find()
            .populate('id_utilisateur', 'username')
            .populate({
                path: 'id_attribution',
                populate: {
                    path: 'id_materiel',
                    select: 'nom'
                }
            });

        const result = demandes.map(demande => {
            const demandeJSON = demande.toJSON();
            return {
                _id: demandeJSON._id,
                id_utilisateur: demandeJSON.id_utilisateur?._id || null,
                statut: demandeJSON.statut,
                id_attribution: demandeJSON.id_attribution?._id || null,
                date_demande: demande.date_demande.toISOString().split('T')[0],
                __v: demandeJSON.__v,
                username_utilisateur: demandeJSON.id_utilisateur?.username || null,
                nom_materiel: demandeJSON.id_attribution?.id_materiel?.nom || null
            };
        });

        res.json(result);
    } catch (error) {
        return handler(res, 'INTERNAL_SERVER_ERROR', error.message);
    }
};

export const createDemandeRendu = async (req, res) => {
    const { id_utilisateur, id_attribution } = req.body;

    try {
        const utilisateur = await Utilisateur.findById(id_utilisateur);
        if (!utilisateur) {
            return handler(res, 'BAD_REQUEST', "L'utilisateur n'existe pas.", 400);
        }

        const attribution = await Attribution.findById(id_attribution);
        if (!attribution) {
            return handler(res, 'BAD_REQUEST', "L'attribution n'existe pas.", 400);
        }

        const demande = new DemandeRendu({
            id_utilisateur,
            id_attribution
        });

        await demande.save();
        res.status(201).json(demande);
    } catch (error) {
        return handler(res, 'INTERNAL_SERVER_ERROR', error.message);
    }
};

export const getDemandeRenduUserID = async (req, res) => {
    const { id_utilisateur } = req.params;

    try {
        const utilisateur = await Utilisateur.findById(id_utilisateur);
        if (!utilisateur) {
            return handler(res, 'NOT_FOUND', "L'utilisateur n'existe pas.", 404);
        }

        const demandes = await DemandeRendu.find({ id_utilisateur: id_utilisateur })
            .populate('id_utilisateur', 'username')
            .populate({
                path: 'id_attribution',
                populate: {
                    path: 'id_materiel',
                    select: 'nom'
                }
            });

        const demandesRendu = demandes.map(demande => {
            const demandeJSON = demande.toJSON();
            return {
                _id: demandeJSON._id,
                id_utilisateur: demandeJSON.id_utilisateur?._id || null,
                statut: demandeJSON.statut,
                id_attribution: demandeJSON.id_attribution?._id || null,
                date_demande: new Date(demande.date_demande).toISOString().split('T')[0],
                __v: demandeJSON.__v,
                username_utilisateur: demandeJSON.id_utilisateur?.username || null,
                nom_materiel: demandeJSON.id_attribution?.id_materiel?.nom || null
            };
        });

        res.json(demandesRendu);
    } catch (error) {
        return handler(res, 'INTERNAL_SERVER_ERROR', error.message);
    }
};

export const deleteDemandeRendu = async (req, res) => {
    const { id } = req.params;

    try {
        await DemandeRendu.findByIdAndDelete(id);
        res.json({message: 'Demande de rendu supprimée avec succès.'
        });
    } catch (error) {
        return handler(res, 'INTERNAL_SERVER_ERROR', error.message);
    }
};

export const validerDemandeRendu = async (req, res) => {
    const { id_demande } = req.params;

    try {
        // Trouver la demande de rendu par son ID
        const demande = await DemandeRendu.findById(id_demande);
        if (!demande) {
            return handler(res, 'BAD_REQUEST', 'La demande de rendu n\'existe pas.', 400);
        }

        // Trouver l'attribution associée à la demande de rendu
        const attribution = await Attribution.findById(demande.id_attribution);
        if (!attribution) {
            return handler(res, 'BAD_REQUEST', 'L\'attribution associée à la demande de rendu n\'existe pas.', 400);
        }

        // Mettre à jour le statut de l'attribution
        attribution.statut = 'terminé';
        await attribution.save();

        // Trouver le matériel associé à l'attribution
        const materiel = await Materiel.findById(attribution.id_materiel);
        if (!materiel) {
            return handler(res, 'BAD_REQUEST', 'Le matériel associé à l\'attribution n\'existe pas.', 400);
        }

        materiel.statut = 'stocké';

        demande.statut = 'Approuvée';

        await materiel.save();
        await demande.save();

        res.json({ message: 'Demande de rendu validée avec succès.' });
    } catch (error) {
        return handler(res, 'INTERNAL_SERVER_ERROR', error.message);
    }
};

export const refuserDemandeRendu = async (req, res) => {
    const { id_demande } = req.params;

    try {
        const demande = await DemandeRendu.findById(id_demande);
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

export const countDemandeRenduEnAttente = async (req, res) => {
    try {
        const count = await DemandeRendu.countDocuments({ statut: 'En attente' });
        res.json({ count });
    } catch (error) {
        return handler(res, 'INTERNAL_SERVER_ERROR', error.message);
    }
};

export default { getAllDemandesRendu, createDemandeRendu, getDemandeRenduUserID, deleteDemandeRendu, validerDemandeRendu, refuserDemandeRendu, countDemandeRenduEnAttente };
