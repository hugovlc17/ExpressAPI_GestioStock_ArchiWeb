import Utilisateur from "../models/utilisateur.js";
import bcrypt from 'bcryptjs';
import {handler} from '../exceptions/handler.js';
const createMateriel = async (req, res) => {
    const { nom, prenom, type, email, username, motDePasse } = req.body;


    if (!nom || !prenom || !type || !username || !motDePasse) {
        return handler(res, 'BAD_REQUEST','Tous les champs requis doivent être fournis !', 400);
    }

    if (motDePasse.length < 8) {
        return handler(res, 'BAD_REQUEST', 'Le mot de passe doit contenir au moins 8 caractères.', 400);
    }

    try{

        const utilisateurExistant = await Utilisateur.findOne({ username });
        if (utilisateurExistant) {
            return handler(res, 'BAD_REQUEST', 'Ce nom d\'utilisateur existe déjà !', 400);
        }

        const hashMotDePasse = await bcrypt.hash(motDePasse, 10); //hashage du mdp

        const nouvelUtilisateur = new Utilisateur({
            nom,
            prenom,
            type,
            email,
            username,
            motDePasse : hashMotDePasse
        });

       await nouvelUtilisateur.save()
       .then(utilisateur => {
           res.status(201).json({utilisateur});
       })
    }catch(error) {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
};

export default {createMateriel};
