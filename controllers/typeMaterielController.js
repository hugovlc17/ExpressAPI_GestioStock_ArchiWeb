import TypeMateriel from '../models/typeMateriel.js';

const createTypeMateriel = (req, res) => {

    const { nom } = req.body;

    const nouveauTypeMateriel = new TypeMateriel({
        nom
    });

    nouveauTypeMateriel.save()
        .then(typeMateriel => {
            res.status(201).json({ typeMateriel });
        })
        .catch(err => {
            res.status(500).json({ error: err.message });
        });
};

export default {createTypeMateriel};