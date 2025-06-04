exports.ensureAuth = (req, res, next) => {
    if (req.isAuthenticated && req.isAuthenticated()) {
        return next();
    } else {
        return res.status(401).json({ message: "Unauthorized" }); 
        console.log(req)
    }
};