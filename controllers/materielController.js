import Materiel from '../models/materiel.js';

const createMateriel = (req, res, next) => {
    const { nom, description, type, statut, salle, date_renouvellement } = req.body;

    // Créer une nouvelle instance de Materiel avec les données fournies
    const nouveauMateriel = new Materiel({
        nom,
        description,
        type,
        statut,
        salle,
        date_renouvellement
    });

    // Enregistrer le nouveau matériel dans la base de données
    nouveauMateriel.save()
        .then(materiel => {
            res.status(201).json({ materiel });
        })
        .catch(err => {
            next(err);
        });
}

const getUnMateriel = (req, res, next)=> {
    const id = req.params.id;

    Materiel.findOne({_id: id})
        .then((materiel) => {
            return res.status(200).json({materiel})
        })
        .catch(err => {
            next(err);
        });
}

const getAllMateriel = (req, res, next)=> {

    Materiel.find()
        .then((materiels) => {
            return res.status(200).json({materiels})
        })
        .catch(err => {
            next(err);
        });
}



export default {
    createMateriel,
    getUnMateriel,
    getAllMateriel
};