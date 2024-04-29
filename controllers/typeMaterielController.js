import TypeMateriel from '../models/typeMateriel.js';
import {handler} from '../exceptions/handler.js';

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

export default {createTypeMateriel};