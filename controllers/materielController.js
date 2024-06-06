import Materiel from '../models/materiel.js';
import DemandeAttribution from "../models/demandeAttribution.js";
import DemandeRendu from "../models/demandeRendu.js";
import Attribution from "../models/attribution.js";
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

const getUnMateriel = async (req, res) => {
    const id = req.params.id;

    try {
        const materiel = await Materiel.findOne({_id: id});
        if (!materiel) {
            return handler(res, 'NOT_FOUND', "Le matériel n'existe pas.", 404);
        }

        // Formater la date de renouvellement
        const formattedMateriel = {
            ...materiel.toObject(),
            date_renouvellement: materiel.date_renouvellement ? new Date(materiel.date_renouvellement).toISOString().split('T')[0] : null
        };

        return res.status(200).json({ materiel: formattedMateriel });
    } catch (error) {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
};

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
                return handler(res, 'NOT_FOUND', 'Matériel non trouvé', 404);
            }
            res.status(200).json({ materiel });
        })
        .catch(err => {
            return handler(res, 'INTERNAL_ERROR', err.message, 500);
        });
};

const deleteMateriel = async (req, res) => {
    const id = req.params.id;

    try {
        // Supprimer le matériel
        const deletedMateriel = await Materiel.findByIdAndDelete(id);
        if (!deletedMateriel) {
            return handler(res, 'NOT_FOUND', 'Matériel non trouvé', 404);
        }

        // Supprimer les demandes d'attribution associées
        await DemandeAttribution.deleteMany({ id_materiel: id });

        // Récupérer les attributions associées au matériel
        const attributions = await Attribution.find({ id_materiel: id }, '_id');

        // Supprimer les demandes de rendu associées à partir de l'ID de l'attribution
        for (const attribution of attributions) {
            await DemandeRendu.deleteMany({ id_attribution: attribution._id });
        }

        // Supprimer les attributions associées
        await Attribution.deleteMany({ id_materiel: id });

        res.status(200).json({ message: 'Matériel supprimé avec succès' });
    } catch (error) {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
}

const getStatMaterielStatut = async (req, res) => {
    try {
        const stats = await Materiel.aggregate([
            {
                $group: {
                    _id: '$statut',
                    count: { $sum: 1 }
                }
            }
        ]);

        const formattedStats = stats.reduce((acc, stat) => {
            if (stat._id === 'stocké') {
                acc.stocke = stat.count;
            } else if (stat._id === 'utilisé') {
                acc.utilise = stat.count;
            }
            return acc;
        }, { stocke: 0, utilise: 0 });

        res.status(200).json({ stats: formattedStats });
    } catch (error) {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
};

const getMaterielRenouvellementBientot = async (req, res) => {
    try {
        const now = new Date();
        const dansTroisMois = new Date();
        dansTroisMois.setMonth(dansTroisMois.getMonth() + 3);

        const materielsProchainsMois = await Materiel.find({
            date_renouvellement: { $gte: now, $lte: dansTroisMois }
        }, 'nom matricule date_renouvellement');

        const materielsDepasses = await Materiel.find({
            date_renouvellement: { $lt: now }
        }, 'nom matricule date_renouvellement');

        const materiels = [...materielsProchainsMois, ...materielsDepasses];

        const formattedMateriels = materiels.map(materiel => ({
            nom: materiel.nom,
            matricule: materiel.matricule,
            date_renouvellement: materiel.date_renouvellement ? new Date(materiel.date_renouvellement).toISOString().split('T')[0] : null
        }));

        res.status(200).json({ materiels: formattedMateriels });
    } catch (error) {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
};



export default {
    createMateriel,
    getUnMateriel,
    getAllMateriel,
    updateMateriel,
    deleteMateriel,
    getStatMaterielStatut,
    getMaterielRenouvellementBientot
};