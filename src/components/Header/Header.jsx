import React, {useState, useEffect } from 'react'
import './Header.css'
import { Link } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebaseConfig";
import { signOut } from "firebase/auth";
import { getDoc, doc, collection, query, where} from "firebase/firestore";
import { db } from '../../config/firebaseConfig';
import Modal from 'react-modal'
import Auth from '../Auth/Auth';

 //modal setup
 const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      height: '30%',
      borderRadius: "24px",
    },
  };

  Modal.setAppElement('#root');
  //end modal setup

function Header() {

  // modal initiation 
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
 
  const [user] = useAuthState(auth);



  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    
  }

  function closeModal() {
    setIsOpen(false);
  }
  //end modal intitiation
      
  return (
    <div className="header-container">
        <div className="left-header-container">
          <Link className="icon-and-title link" to="/">
            <img className="campfire-icon" src="src\assets\campfire-icon.png" alt="campfire icon" />
            <h1 className="header-title">Gather-Round</h1>
          </Link>
          <p className="header-blurb">Come share a tale.</p>
        </div>
        
        <div className="header-auth-info">{user ? (
            //if the user is logged in, display their name and option to sign out. If not, display the signup link that opens the modal
            <div className="auth-info-loggedin">
              <img src={user?.photoURL} alt="user icon" className="header-user-icon" />
              <Link className="header-username link" to={`/user/${user?.displayName}`}>{user?.displayName}</Link>
              <button className="header-button" onClick={() => signOut(auth)}>Logout</button>
            </div>
        ) : (
            <button className="header-button" onClick={openModal}>Log In or Signup</button>
        )}</div>
          <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Log In/Signup Modal"
      >
        <Auth closeModal = {closeModal}/>
      </Modal>

    </div>
        
      
  )
}

export default Header