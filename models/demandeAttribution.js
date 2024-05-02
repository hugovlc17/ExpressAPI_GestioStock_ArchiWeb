import mongoose from 'mongoose';

const attributionSchema = new mongoose.Schema({
    id_utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    id_materiel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Materiel',
        required: true
    },
    date_attribution: {
        type: Date,
        default: Date.now,
        required: true
    },
    date_retour_prevue: {
        type: Date,
        required: true
    },
    statut: {
        type: String,
        enum: ['En attente', 'Approuvée', 'Refusée'],
        default: 'En attente',
        required: true
    }
});

const DemandeAttribution = mongoose.model('Attribution', attributionSchema);

export default DemandeAttribution;