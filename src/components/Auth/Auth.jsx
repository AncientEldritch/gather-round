import React, { useState } from 'react'
import './Auth.css'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
  } from "firebase/auth";
import { auth } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";

function Auth({closeModal}) {

    const navigate = useNavigate();
  const [existingUser, setExistingUser] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, password)
      .then((res) => {
        updateProfile(auth.currentUser, { displayName: name });
        navigate("/");
        closeModal();
      })
      .catch((err) => alert(err.code));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // login
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        navigate("/")
        closeModal();
      })
      .catch((err) => alert(err.com));
  };


  return (
    <div>
    {existingUser ? (
      <form className="auth-form" onSubmit={handleLogin}>
        <h1>Login with your email</h1>
        <div className="form-group">
          <input
            type="email"
            placeholder="Enter your email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            placeholder="Enter your password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button type="submit">Login</button>
        <p>
          Don't have an account?{" "}
          <span className="form-link" onClick={() => setExistingUser(false)}>
            Signup
          </span>
        </p>
      </form>
    ) : (
      <form className="auth-form" onSubmit={handleSignup}>
        <h1>Signup with your email</h1>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter your name"
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <input
            type="email"
            placeholder="Enter your email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            placeholder="Enter your password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button type="submit">Register</button>
        <p>
          Already have an account?
          <span className="form-link" onClick={() => setExistingUser(true)}>
            Login
          </span>
        </p>
      </form>
    )}
  </div>
  )
}

export default Auth