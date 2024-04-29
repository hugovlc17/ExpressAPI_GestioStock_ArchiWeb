import Materiel from '../models/materiel.js';

const createMateriel = (req, res) => {
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
            res.status(500).json({ error: err.message });
        });
}

const getUnMateriel = (req, res)=> {
    const id = req.params.id;

    Materiel.findOne({_id: id})
        .then((materiel) => {
            return res.status(200).json({materiel})
        })
        .catch((error) => {
            return res.status(400).json({error})
        });
}

const getAllMateriel = (req, res)=> {

    Materiel.find()
        .then((materiels) => {
            return res.status(200).json({materiels})
        })
        .catch((error) => {
            return res.status(400).json({error})
        });
}

export default {
    createMateriel,
    getUnMateriel,
    getAllMateriel
};