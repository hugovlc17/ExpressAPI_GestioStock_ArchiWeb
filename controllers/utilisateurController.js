import Utilisateur from "../models/utilisateur.js";
import bcrypt from 'bcryptjs';
import {handler} from '../exceptions/handler.js';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();

const secretKey = process.env.SECRET_KEY;

const createUtilisateur = async (req, res) => {
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

const loginUtilisateur = async (req, res) =>{
    const { username, motDePasse } = req.body;

    if (!username || !motDePasse) {
        return handler(res, 'BAD_REQUEST', 'Nom d\'utilisateur et mot de passe sont requis.', 400);
    }

    try {
        const utilisateur = await Utilisateur.findOne({ username });
        if (!utilisateur) {
            return handler(res, 'BAD_REQUEST', 'Nom d\'utilisateur ou mot de passe incorrect.', 400);
        }

        const isMatch = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
        if (!isMatch) {
            return handler(res, 'BAD_REQUEST', 'Nom d\'utilisateur ou mot de passe incorrect.', 400);
        }

        const token = jwt.sign({ id: utilisateur._id }, secretKey, { expiresIn: '1h' });

        res.status(200).json({
            token,
            utilisateur: {
                id: utilisateur._id,
                nom: utilisateur.nom,
                prenom: utilisateur.prenom,
                type: utilisateur.type,
                email: utilisateur.email,
                username: utilisateur.username
            }
        });
    } catch (error) {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }

};

export default {createUtilisateur, loginUtilisateur};
