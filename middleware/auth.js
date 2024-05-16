import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.utilisateur = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Token invalide.' });
    }
};
export default auth;
