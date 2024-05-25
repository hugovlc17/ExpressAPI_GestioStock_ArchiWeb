import Utilisateur from "../models/utilisateur.js";
import bcrypt from 'bcryptjs';
import {handler} from '../exceptions/handler.js';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import utilisateurs from "../routes/utilisateurs.js";
import Materiel from "../models/materiel.js";
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

const getAllUtilisateur = (req, res) =>{
    Utilisateur.find()
        .select('nom prenom email username type')
        .then((utilisateurs) => {
            return res.status(200).json({ utilisateurs });
        })
        .catch(error => {
            return handler(res, 'INTERNAL_ERROR', error.message, 500);
        });
};

const getUnUtilisateur = (req, res)=> {
    const id = req.params.id;

    Utilisateur.findOne({_id: id})
        .then((utilisateur) => {
            return res.status(200).json({utilisateur})
        })
        .catch(error => {
            return handler(res, 'INTERNAL_ERROR', error.message, 500);
        });
};

const updateUtilisateur = async (req, res) => {
    const id = req.params.id;
    const { nom, prenom, type, email, username, motDePasse } = req.body;

    try {
        const utilisateur = await Utilisateur.findById(id);
        if (!utilisateur) {
            return handler(res, 'NOT_FOUND', 'Utilisateur non trouvé.', 404);
        }

        // Mettre à jour les champs seulement s'ils sont présents dans la requête
        if (nom !== undefined) utilisateur.nom = nom;
        if (prenom !== undefined) utilisateur.prenom = prenom;
        if (type !== undefined) utilisateur.type = type;
        if (email !== undefined) utilisateur.email = email;
        if (username !== undefined) utilisateur.username = username;
        if (motDePasse !== undefined) {
            if (motDePasse.length < 8) {
                return handler(res, 'BAD_REQUEST', 'Le mot de passe doit contenir au moins 8 caractères.', 400);
            }
            utilisateur.motDePasse = await bcrypt.hash(motDePasse, 10);
        }

        await utilisateur.save();

        res.status(200).json({ utilisateur });
    } catch (error) {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
};

const deleteUtilisateur = async (req, res) =>{
    const id = req.params.id;

    try{
        const deleteUtilisateur = await Utilisateur.findByIdAndDelete(id);
        if(!deleteUtilisateur) {
            return handler(res, 'NOT_FOUND', 'Utilisateur non trouvé', 404);
        }
        res.status(200).json({ message: 'Utilisateur supprimé avec succès'});
    }catch (error){
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    }
}


export default {createUtilisateur, loginUtilisateur, getAllUtilisateur, getUnUtilisateur, updateUtilisateur, deleteUtilisateur};
