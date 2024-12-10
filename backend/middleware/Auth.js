const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token; // Access the token from the cookies

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded._id; // Attach user ID to request
        next();
    } catch (err) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
};

module.exports = {authMiddleware};
