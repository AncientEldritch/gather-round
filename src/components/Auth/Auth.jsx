import React, { useState } from 'react'
import './Auth.css'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
  } from "firebase/auth";
import { addDoc, collection, query, where, getDocs, serverTimestamp} from "firebase/firestore";
import { auth } from "../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { db } from '../../config/firebaseConfig';


function Auth({closeModal}) {

  const navigate = useNavigate();
  const [existingUser, setExistingUser] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [lowercaseUsername, setLowercaseUsername] = useState("");

  

  const handleSignup = async (e) => {
    e.preventDefault();
    // Check if the username already exists in the "users" collection
    const usernameQuery = query(
      collection(db, "users"),
      where("lowercaseUsername", "==", lowercaseUsername) 
    );
  
    const usernameSnapshot = await getDocs(usernameQuery);
    const allowedCharactersRegex = /^[a-zA-Z0-9._-]{1,20}$/;

    if (!usernameSnapshot.empty) {
      // Handle the case where the username already exists
      alert("Username already exists. Please choose another username.");
      return;
    } else if(!allowedCharactersRegex.test(name)) {
      // Handle the case where the username already exists
      alert("Username must be 20 characters or less and may only contain [a-z] [A-Z] [0-9] . - _"
      );
      return;
     } else {
      createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // After creating the user, add their data to the users collection
        const usersRef = collection(db, "users");

        addDoc(usersRef, {
          username: name, 
          lowercaseUsername: lowercaseUsername,
          profilePicture: "https://firebasestorage.googleapis.com/v0/b/gather-round-5167f.appspot.com/o/image_2023-10-11_195037045.png?alt=media&token=1354a376-83fe-4df6-8b5b-17e4f40c5a3e",
          profileCreated: serverTimestamp(),
        })
          .then(() => {
            // Update user profile with display name
            updateProfile(auth.currentUser, { displayName: name});
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
      .catch((err) => alert("Invalid credentials."));
  };


  return (
    <div className="auth-container">
    {existingUser ? (
      <form className="auth-form-container" onSubmit={handleLogin}>
        <h1 className="auth-title" >Login with your email</h1>
        <div className="auth-input-container">
          <input 
            type="email"
            placeholder="Enter your email"
            className="auth-input"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="auth-input"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button className="auth-submit" type="submit">Login</button>
        <p>
          Don't have an account?{" "}
          <span className="form-change-link" onClick={() => setExistingUser(false)}>
            Signup
          </span>
        </p>
      </form>
    ) : (
      <form className="auth-form-container" onSubmit={handleSignup}>
        <h1 className="auth-title">Signup with your email</h1>
        <div className="auth-input-container">
          <input
            type="text"
            placeholder="Enter your name"
            className="auth-input"
            required
            onChange={(e) => {
              setName(e.target.value)
              setLowercaseUsername(e.target.value.toLowerCase())
            }}
            value={name}
          />
          <input
            type="email"
            placeholder="Enter your email"
            className="auth-input"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="auth-input"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button className="auth-submit"  type="submit">Register</button>
        <p>
          Already have an account?
          <span className="form-change-link" onClick={() => setExistingUser(true)}>
            Login
          </span>
        </p>
      </form>
    )}
  </div>
  )
}

export default Auth