const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("Authorization Header:", authHeader); // Debugging

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - No Token Provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.user_id, role: decoded.role };

    console.log("Decoded User:", req.user); // Debugging
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);
    return res.status(403).json({ error: "Invalid token" });
  }
};

const isAdminOrSuperAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "Admin" || req.user.role === "Super Admin")) {
    return next();
  }
  return res.status(403).json({ message: "Access denied" });
};

// Correct export
module.exports = { authenticateUser, isAdminOrSuperAdmin };
