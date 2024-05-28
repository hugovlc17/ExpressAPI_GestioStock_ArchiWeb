import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import RouteMateriels from './routes/materiels.js';
import typeMaterielsRoutes from './routes/typesMateriel.js';
import utilisateurRoutes from "./routes/utilisateurs.js";
import DemandeAttributionRoutes from "./routes/demandeAttributions.js";
import DemandesRenduRoutes from "./routes/demandesRendu.js";
import AttributionsRoutes from "./routes/attributions.js";


import dotenv from 'dotenv';
import cors from 'cors';
//const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.use(cors({
    origin: 'http://localhost:4200', // Autoriser les requêtes provenant du front
    optionsSuccessStatus: 200
}));

//connexion avec la BDD MongoDB (Atlas)
mongoose.connect('mongodb+srv://userdb:umPN6ni@clusterhugomiage.cmsugih.mongodb.net/projetArchiWeb?retryWrites=true&w=majority&appName=ClusterHugoMIAGE').then(()=> {
    console.log("Connexion à la BDD réussie !");
}).catch((error) => {
    console.log(error);
});

app.use(bodyParser.json());
app.use('/api/materiels/', RouteMateriels);
app.use('/api/typeMateriels/',typeMaterielsRoutes);
app.use('/api/utilisateurs',utilisateurRoutes);
app.use('/api/demandesAttribution', DemandeAttributionRoutes);
app.use('/api/demandesRendu', DemandesRenduRoutes);
app.use('/api/attributions', AttributionsRoutes);



export default app;

