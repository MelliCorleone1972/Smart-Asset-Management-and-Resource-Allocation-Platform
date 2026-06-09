const jwt = require('jsonwebtoken');

// Verifies if the user is logged in
exports.verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1]; // Expects "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attaches the decoded payload (userId, role) to the request
        next(); // Passes control to the next function
    } catch (error) {
        res.status(403).json({ message: 'Invalid or expired token.' });
    }
};

// Verifies if the logged-in user is an admin
exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
};
