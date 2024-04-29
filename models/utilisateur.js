import mongoose from "mongoose";

const utilisateurSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['administrateur', 'organisme', 'personnel'],
        required: true
    },
    email: { //pas besoin pour les organismes
        type: String,
        unique: true,
        sparse: true // Autorise les valeurs null ou vides
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    motDePasse: {
        type: String,
        required: true
    }
});

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

export default Utilisateur;