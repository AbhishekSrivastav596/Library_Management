const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token is required' });

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const checkRole = (role) => (req, res, next) => {
    if (req.user.role !== role) return res.status(403).json({ message: 'Access forbidden' });
    next();
};

module.exports = { verifyToken, checkRole };
