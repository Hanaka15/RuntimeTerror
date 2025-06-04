exports.ensureAuth = (req, res, next) => {
    console.log('Auth check - isAuthenticated function exists:', typeof req.isAuthenticated);
    console.log('Auth check - isAuthenticated result:', req.isAuthenticated ? req.isAuthenticated() : 'N/A');
    console.log('Auth check - user object:', req.user ? 'User exists' : 'No user');
    console.log('Auth check - session ID:', req.sessionID);
    
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    } else {
        console.log('❌ Auth failed - returning 401');
        return res.status(401).json({ message: "Unauthorized" }); 
    }
};