const jwt = require("jsonwebtoken");

class AuthMiddleware {
    // Method to authenticate the access token
    static authenticateAccessToken(req, res, next) {
        const accessToken = req.cookies.accessToken; // Get access token from cookies

        if (!accessToken) {
            return res.status(401).json({
                error: "AUTH_ERROR",
                message: "Authorization token is missing",
            });
        }

        try {
            const user = jwt.verify(accessToken, process.env.JWT_SECRET);
            req.user = user;
            next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    error: "TOKEN_EXPIRED",
                    message: "Access token has expired",
                });
            }

            if (err.name === "JsonWebTokenError") {
                return res.status(403).json({
                    error: "INVALID_TOKEN",
                    message: "Invalid access token",
                });
            }

            console.error("Access token error:", err);
            return res.status(500).json({
                error: "SERVER_ERROR",
                message: "An error occurred during authentication",
            });
        }
    }

    static async authenticateRefreshToken(req, res, next) {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                error: "TOKEN_ERROR",
                message: "Refresh token is missing",
            });
        }

        try {
            jwt.verify(refreshToken, process.env.JWT_SECRET);

            next(); 
        } catch (err) {
            console.error("Refresh token error:", err);
            return res.status(401).json({
                error: "TOKEN_EXPIRED",
                message: "Refresh token expired or invalid",
            });
        }
    }
}

module.exports = AuthMiddleware;
