const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (email, password) => {
  const [user] = await db.query("SELECT * FROM master_user WHERE email = ?", [email]);
  if (user.length === 0) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user[0].password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user[0].user_id, role: user[0].role_id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return { token, user: { user_id: user[0].user_id, first_name: user[0].first_name, role: user[0].role_id } };
};

module.exports = { login };

