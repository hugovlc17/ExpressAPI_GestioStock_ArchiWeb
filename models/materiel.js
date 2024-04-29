import mongoose from "mongoose";

const materielSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TypeMateriel',
        required: true
    },
    statut: {
        type: String,
        enum: ['stocké', 'utilisé'],
        required: true
    },
    salle: {
        type: String,
        required: true
    },
    date_renouvellement: {
        type: Date
    },
    matricule: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 5
    }
});


const Materiel = mongoose.model('Materiel', materielSchema);

export default Materiel;