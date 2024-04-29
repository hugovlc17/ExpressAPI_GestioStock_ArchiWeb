import Materiel from '../models/materiel.js';
import {handler} from '../exceptions/handler.js';


const createMateriel = (req, res) => {
    const { nom, description, type, statut, salle, date_renouvellement, matricule } = req.body;

    // Créer une nouvelle instance de Materiel avec les données fournies
    const nouveauMateriel = new Materiel({
        nom,
        description,
        type,
        statut,
        salle,
        date_renouvellement,
        matricule
    });

    // Enregistrer le nouveau matériel dans la base de données
    nouveauMateriel.save()
        .then(materiel => {
            res.status(201).json({ materiel });
        })
        .catch(error => {
            return handler(res, 'INTERNAL_ERROR', error.message, 500);
        });
}

const getUnMateriel = (req, res)=> {
    const id = req.params.id;

    Materiel.findOne({_id: id})
        .then((materiel) => {
            return res.status(200).json({materiel})
        })
        .catch(error => {
            return handler(res, 'INTERNAL_ERROR', error.message, 500);
        });
}

const getAllMateriel = (req, res)=> {

    Materiel.find()
        .then((materiels) => {
            return res.status(200).json({materiels})
        })
        .catch(error => {
            return handler(res, 'INTERNAL_ERROR', error.message, 500);
        });
}

const updateMateriel = (req, res) => {
    const id = req.params.id;
    const { nom, description, type, statut, salle, date_renouvellement, matricule } = req.body;

    Materiel.findByIdAndUpdate(id, {
        nom,
        description,
        type,
        statut,
        salle,
        date_renouvellement,
        matricule
    }, { new: true })
        .then(materiel => {
            if (!materiel) {
                return res.status(404).json({ error: 'Materiel not found' });
            }
            res.status(200).json({ materiel });
        })
        .catch(err => {
            return handler(res, 'INTERNAL_ERROR', err.message, 500);
        });
};

export default {
    createMateriel,
    getUnMateriel,
    getAllMateriel,
    updateMateriel
};