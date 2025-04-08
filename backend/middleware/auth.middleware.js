const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                error: 'AUTH_ERROR',
                message: "Authorization header is missing" 
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ 
                error: 'AUTH_ERROR',
                message: "Invalid authorization format. Use 'Bearer <token>'" 
            });
        }

        const token = authHeader.split(" ")[1];

        if (!token || typeof token !== 'string') {
            return res.status(401).json({ 
                error: 'AUTH_ERROR',
                message: "Invalid token format" 
            });
        }

        const user = await jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: 'TOKEN_EXPIRED',
                message: "Authentication token has expired" 
            });
        }
        
        if (err.name === 'JsonWebTokenError') {
            return res.status(403).json({ 
                error: 'INVALID_TOKEN',
                message: "Invalid authentication token" 
            });
        }

        console.error('Authentication error:', err);
        return res.status(500).json({ 
            error: 'SERVER_ERROR',
            message: "An unexpected error occurred during authentication" 
        });
    }
};

module.exports = { authenticateToken };
