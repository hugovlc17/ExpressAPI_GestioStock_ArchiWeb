import DemandeAttribution from "../models/demandeAttribution.js";
import Materiel from "../models/materiel.js";
import {handler} from '../exceptions/handler.js';

const createDemande = async (req, res) => {
    const {id_utilisateur, id_materiel, date_retour_prevue} = req.body;

    if (!id_utilisateur || !id_materiel || !date_retour_prevue) {
        return handler(res, 'BAD_REQUEST', 'Tous les champs requis doivent être fournis.', 400);
    }

    try{

        //Vérifier si la demande existe déjà
        const demandeExistante = await DemandeAttribution.findOne({
            id_utilisateur,
            id_materiel,
            statut: 'En attente'
        });
        if (demandeExistante) {
            return handler(res, 'CONFLICT', 'Une demande avec le même utilisateur et matériel est déjà en attente.', 409);
        }

        //Vérifier si le materiel est en stock.
        const materiel = await Materiel.findById(id_materiel);
        if (!materiel || materiel.statut !== 'stocké') {
            return handler(res, 'BAD_REQUEST', 'Le matériel spécifié n\'est pas disponible en stock.', 400);
        }

        const nouvelleDemande = new DemandeAttribution({
            id_utilisateur,
            id_materiel,
            date_retour_prevue,
        });

        await nouvelleDemande.save()
            .then(demande => {
                res.status(201).json({demande});
            })
    }catch (error){
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
};

const getAllDemandes = async (req, res) =>{
    await DemandeAttribution.find()
        .then((demandes) => {
            return res.status(200).json({demandes})
        })
        .catch(error => {
            return handler(res, 'INTERNAL_ERROR', error.message, 500);
        });
};

const getUneDemande = async (req, res) =>{
    const demandeId = req.params.id;
    await DemandeAttribution.findById(demandeId)
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
        const demande = await DemandeAttribution.findById(id);
        if (!demande) {
            return handler(res, 'NOT_FOUND', 'La demande n\'a pas été trouvée', 404);
        }
        await DemandeAttribution.findByIdAndDelete(id);
        res.status(200).json({ message: 'Demande supprimée !' });
    }catch (error) {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
}

const validerDemande = async (req, res) =>{
    //créer l'attribution avec l'id de la demandeAttribution.
    //Créer une attribution
}

const refuserDemande = async (req, res) =>{
}




export default {createDemande, getAllDemandes, getUneDemande, deleteDemande};