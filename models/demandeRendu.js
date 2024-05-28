import mongoose from 'mongoose';

const demandeRenduSchema = new mongoose.Schema({
    id_utilisateur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Utilisateur',
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
    id_attribution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attribution',
        required: true
    }
});

const DemandeRendu = mongoose.model('DemandeRendu', demandeRenduSchema);

export default DemandeRendu;