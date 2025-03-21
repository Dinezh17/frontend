import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "./api/api";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("HR"); // Default role is HR
  const [departmentName, setDepartmentName] = useState(""); // Change this to a string
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !role || !departmentName) {
      setError("All fields are required");
      return;
    }

    try {
      await register(username, password, role, departmentName);
      setSuccess("User registered successfully!");
      setError("");
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="HR">HR</option>
            <option value="HOD">HOD</option>
          </select>
        </div>
        <div>
          <label>Department Name:</label>
          <select value={departmentName} onChange={(e) => setDepartmentName(e.target.value)}>
            <option value="HR">select dept</option>
            <option value="IT">IT</option>
            <option value="Fincance">Fincance</option>
            <option value="Functional">Functional</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;