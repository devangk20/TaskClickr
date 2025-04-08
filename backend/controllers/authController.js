const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const db = require("../config/db");
const randomatic = require("randomatic");
require("dotenv").config();

// ✅ Configure Email Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Forgot Password - Generate & Send OTP
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM master_user WHERE email = ?", [email]);

    if (users.length === 0) return res.status(404).json({ error: "Email not found" });

    const user = users[0];
    const currentTime = new Date();

    if (user.otp_expires && new Date(user.otp_expires) > currentTime) {
      return res.status(429).json({ error: "OTP already sent. Wait 5 minutes." });
    }

    const otp = randomatic("0", 6);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await db.query("UPDATE master_user SET otp = ?, otp_expires = ? WHERE email = ?", [otp, otpExpires, email]);

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP is: <strong>${otp}</strong></p><p>Expires in 5 minutes.</p>`,
    });

    res.json({ success: true, message: "OTP sent!" });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Verify OTP
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM master_user WHERE email = ?", [email]);
    if (users.length === 0) return res.status(404).json({ error: "Email not found" });

    const user = users[0];
    if (!user.otp || String(user.otp) !== String(otp)) return res.status(400).json({ error: "Invalid OTP" });

    if (new Date(user.otp_expires) < new Date()) return res.status(400).json({ error: "OTP expired." });

    res.json({ success: true, message: "OTP verified." });
  } catch (err) {
    console.error("❌ OTP Verification Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const [users] = await db.query("SELECT * FROM master_user WHERE email = ?", [email]);
    if (users.length === 0) return res.status(404).json({ error: "Email not found" });

    const user = users[0];
    if (!user.otp || String(user.otp) !== String(otp)) return res.status(400).json({ error: "Invalid OTP" });

    if (new Date(user.otp_expires) < new Date()) return res.status(400).json({ error: "OTP expired." });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.query("UPDATE master_user SET password = ?, otp = NULL, otp_expires = NULL WHERE email = ?", 
      [hashedPassword, email]);

    res.json({ success: true, message: "Password reset successful!" });
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const [users] = await db.query("SELECT * FROM master_user WHERE email = ? AND is_deleted = FALSE", [email]);

    if (users.length === 0) return res.status(404).json({ error: "User not found" });

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid password" });

    // ✅ Include name in the token payload
    const token = jwt.sign(
      { userId: user.user_id, role: user.role_id, name: user.name },  
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.user_id,
        name: user.name,  // ✅ Include name
        email: user.email,
        role: String(user.role_id),
      },
    });
  } catch (err) {
    console.error("❌ Login Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete Expired OTPs Every 10 Minutes
setInterval(async () => {
  try {
    await db.query("UPDATE master_user SET otp = NULL, otp_expires = NULL WHERE otp_expires < NOW()");
    console.log("🗑️ Expired OTPs cleared");
  } catch (err) {
    console.error("❌ Error clearing expired OTPs:", err);
  }
}, 10 * 60 * 1000); // Runs every 10 minutes