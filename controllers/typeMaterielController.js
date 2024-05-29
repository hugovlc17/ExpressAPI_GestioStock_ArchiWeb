import TypeMateriel from '../models/typeMateriel.js';
import {handler} from '../exceptions/handler.js';
import typeMateriel from "../models/typeMateriel.js";

const createTypeMateriel = (req, res) => {

    const { nom } = req.body;

    const nouveauTypeMateriel = new TypeMateriel({
        nom
    });

    nouveauTypeMateriel.save()
        .then(typeMateriel => {
            res.status(201).json({ typeMateriel });
        })
        .catch(error => {
            return handler(res, 'INTERNAL_ERROR', error.message, 500);
        });
};

const getAllTypesMateriel = (req, res)=> {

    typeMateriel.find()
    .then((types) => {
        return res.status(200).json({types})
    })
    .catch(error => {
        return handler(res, 'INTERNAL_ERROR', error.message, 500);
    });
}

const getUnType = (req, res)=> {
    const id = req.params.id;

    TypeMateriel.findOne({_id: id})
        .then((type) => {
            return res.status(200).json({type})
        })
        .catch(error => {
            return handler(res, 'INTERNAL_ERROR', error.message, 500);
        });
}

export default {createTypeMateriel, getAllTypesMateriel, getUnType};