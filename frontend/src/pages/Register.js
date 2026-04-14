import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://personal-finance-ai-advisor-1.onrender.com/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      alert("User registered successfully");
      navigate("/login");

      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      alert("Error registering user");
    }
  };

  return (
  <div className="auth-container">
    <div className="auth-card">
      <h2 className="auth-title">Register</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          className="auth-input"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="auth-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="auth-button">Register</button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login" className="auth-link">Login</Link>
      </p>
    </div>
  </div>
);

}

export default Register;
