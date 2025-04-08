import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/logo.png"; // Ensure correct path

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const response = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });

    console.log("Login API Response:", response.data); // 🔍 Debugging Log

    if (response.data.success) {
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Token or user data missing in response");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", String(user.role));
      localStorage.setItem("userId", user.id);
      localStorage.setItem("email", user.email);

      const role = localStorage.getItem("role");

      if (role === "3" || role === "1") {
        navigate("/admin-dashboard");
      } else {
        navigate("/user-dashboard");
      }
    } else {
      setError("Invalid email or password");
    }
  } catch (err) {
    console.error("Login Error:", err.response?.data || err.message);
    setError(err.response?.data?.error || "Invalid email or password");
  }
};


  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        background: "linear-gradient(to bottom, #f4f6f9, #d6d8db)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <div
        className="card p-4 shadow-lg"
        style={{
          width: "400px",
          borderRadius: "12px",
          background: "#fff",
          border: "1px solid #ccc",
        }}
      >
        <div className="text-center">
          <img src={logo} alt="CL!CKR Logo" className="mb-3" width="80" />
        </div>
        <h2 className="text-center mb-4" style={{ fontWeight: "bold", color: "#333" }}>
          Welcome to CL!CKR
        </h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label" style={{ color: "#333" }}>Email</label>
            <div className="input-group">
              <span className="input-group-text bg-light border">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: "#333" }}>Password</label>
            <div className="input-group">
              <span className="input-group-text bg-light border">
                <i className="bi bi-key"></i>
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn w-100" style={{ backgroundColor: "#0056b3", color: "#fff", fontWeight: "bold" }}>
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="/forgot-password" style={{ color: "#0056b3", fontWeight: "bold" }}>
            Forgot password?
          </a>
        </div>
      </div>
    </div>
    
    
  );
  
};


export default Login;
