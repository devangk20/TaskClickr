const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        console.error("❌ No Authorization header provided");
        return res.status(401).json({ message: "Access Denied" });
    }

    const token = authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Ensure `req.user` is set
        console.log("🔐 Authenticated User:", req.user); // Debug log
        next();
    } catch (error) {
        console.error("❌ Invalid Token:", error);
        res.status(400).json({ message: "Invalid Token" });
    }
};

const isAdminOrSuperAdmin = (req, res, next) => {
    if (req.user && (req.user.role === "Admin" || req.user.role === "Super Admin")) {
        return next();
    }
    return res.status(403).json({ message: "Access denied" });
};
exports.verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; 
  
    if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Attach user info to request
      next();
    } catch (err) {
      res.status(401).json({ error: "Unauthorized: Invalid token" });
    }
  };

module.exports = { authenticateUser, isAdminOrSuperAdmin };
