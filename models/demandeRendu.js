import mongoose from 'mongoose';

const demandeRenduSchema = new mongoose.Schema({
    id_utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
        required: true
    },
    id_demande_attribution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DemandeAttribution',
        required: true
    },
    date_demande_rendu: {
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

const DemandeRendu = mongoose.model('DemandeRendu', demandeRenduSchema);

export default DemandeRendu;