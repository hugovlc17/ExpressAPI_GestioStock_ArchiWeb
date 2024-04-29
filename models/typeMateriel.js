import mongoose from "mongoose";

const typeMaterielSchema  = new mongoose.Schema({
    nom: {
        type: String,
        required: true
    },
});

const TypeMateriel = mongoose.model('TypeMateriel', typeMaterielSchema);

export default TypeMateriel;