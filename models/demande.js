import mongoose from 'mongoose';

const demandeSchema = new mongoose.Schema({
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
    type_demande: {
        type: String,
        enum: ['Attribution', 'Rendu'],
        required: true
    },
    date_demande: {
        type: Date,
        default: Date.now,
        required: true
    },
    date_rendu: {
        type: Date,
        required: function() {
            return this.type_demande === 'Rendu';
        }
    },
    statut: {
        type: String,
        enum: ['En attente', 'Approuvée', 'Refusée'],
        default: 'En attente',
        required: true
    }
});

const Demande = mongoose.model('Demande', demandeSchema);

export default Demande;