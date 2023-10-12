import React, { useState } from 'react'
import './Auth.css'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
  } from "firebase/auth";
import { addDoc, collection, query, where, getDocs} from "firebase/firestore";
import { auth } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { db } from '../../config/firebaseConfig';

function Auth({closeModal}) {

  const navigate = useNavigate();
  const [existingUser, setExistingUser] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  

  const handleSignup = async (e) => {
    e.preventDefault();
    // Check if the username already exists in the "users" collection
    const usernameQuery = query(
      collection(db, "users"),
      where("username", "==", name) 
    );
  
    const usernameSnapshot = await getDocs(usernameQuery);

    if (!usernameSnapshot.empty) {
      // Handle the case where the username already exists
      alert("Username already exists. Please choose another username.");
      return;
    } else {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // After creating the user, add their data to the Firestore collection
        const usersRef = collection(db, "users");
  
        // Add user data to the Firestore collection
        addDoc(usersRef, {
          username: name, 
        })
          .then(() => {
            // Update user profile with display name
            updateProfile(auth.currentUser, { displayName: name, photoURL:"gs://gather-round-5167f.appspot.com/image_2023-10-11_195037045.png"});
            //close the auth modal
            closeModal();
          })
          .catch((error) => {
            console.error(error);
            
          });
      })
      .catch((err) => alert(err.code));
  };}
  
    

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