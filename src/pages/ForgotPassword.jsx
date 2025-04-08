import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({ email: "", otp: "", newPassword: "" });
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false); // Track API request state
  const navigate = useNavigate();
  
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  // 🔹 Validate Email
  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  // 🔹 Request OTP
  const handleSendOTP = async () => {
    if (!isValidEmail(formData.email)) {
      setError("Please enter a valid email.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email: formData.email });
      setMessage(response.data.message);
      setStep(2);
      setTimer(120);
    } catch (err) {
      setError(err.response?.data?.error || "Error sending OTP");
    }
    setLoading(false);
  };

  // 🔹 Verify OTP
  const handleVerifyOTP = async () => {
    if (formData.otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/verify-otp", { email: formData.email, otp: formData.otp });
      setMessage(response.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired OTP");
    }
    setLoading(false);
  };

  // 🔹 Reset Password
  const handleResetPassword = async () => {
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", formData);
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
    }
    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "400px" }}>
        <h2 className="text-center mb-4">Reset Password</h2>
        {message && <div className="alert alert-success text-center">{message}</div>}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <>
            <label>Email</label>
            <input
              type="email"
              className="form-control mb-3"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <button className="btn btn-primary w-100" onClick={handleSendOTP} disabled={loading || timer > 0}>
              {loading ? "Sending OTP..." : timer > 0 ? `Resend OTP in ${timer}s` : "Send OTP"}
            </button>
          </>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <>
            <p className="text-muted">OTP sent to <strong>{formData.email}</strong></p>
            <label>Enter OTP</label>
            <input
              type="text"
              className="form-control mb-3"
              name="otp"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              required
              maxLength="6"
              pattern="\d*"
            />
            <button className="btn btn-primary w-100 mb-2" onClick={handleVerifyOTP} disabled={loading}>
              {loading ? "Verifying OTP..." : "Verify OTP"}
            </button>
            <button className="btn btn-secondary w-100" onClick={handleSendOTP} disabled={loading || timer > 0}>
              {timer > 0 ? `Resend OTP in ${timer}s` : "Resend OTP"}
            </button>
          </>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <>
            <p className="text-muted">OTP verified. Set your new password.</p>
            <label>New Password</label>
            <input
              type="password"
              className="form-control mb-3"
              name="newPassword"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />
            <button className="btn btn-primary w-100" onClick={handleResetPassword} disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
