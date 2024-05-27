import mongoose from 'mongoose';

const demandeAttributionSchema = new mongoose.Schema({
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
    date_demande: {
        type: Date,
        default: Date.now,
        required: true
    },
    statut: {
        type: String,
        enum: ['En attente', 'Approuvée', 'Refusée'],
        default: 'En attente',
        required: true
    },
    salle: {
        type: String
    }
});

const DemandeAttribution = mongoose.model('DemandeAttribution', demandeAttributionSchema);

export default DemandeAttribution;