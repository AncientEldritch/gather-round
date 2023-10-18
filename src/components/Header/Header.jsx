import React, {useState, useEffect } from 'react'
import './Header.css'
import { Link } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../config/firebaseConfig";
import { signOut } from "firebase/auth";
import { getDocs, collection, query, where} from "firebase/firestore";
import { db } from '../../config/firebaseConfig';
import Modal from 'react-modal'
import Auth from '../Auth/Auth';
import campfireLogo from "../../assets/campfire-icon.png"


 //modal setup
 const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      height: '40%',
      width: '40%',
      borderRadius: "24px",
    },
  };

  Modal.setAppElement('#root');
  //end modal setup

function Header() {
  const [profile, setProfile] = useState(null);
  

  // modal initiation 
  let subtitle;
  const [modalIsOpen, setIsOpen] = useState(false);
  
  const [user] = useAuthState(auth);
  
  

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.displayName) {
        const userRef = collection(db, 'users');
        const q = query(userRef, where("username", "==", user.displayName));
        try {
          const querySnapshot = await getDocs(q);
          if (querySnapshot.size > 0) {
            // Grab the first document from the query result
            const userData = querySnapshot.docs[0].data();
            setProfile(userData);
            //console.log(userData);
          } else {
            // Handle the case where no user document is found
            //console.log("User document not found.");
          }
        } catch (error) {
          // Handle errors if any occur during the query
          //console.error("Error fetching user data:", error);
        }
      } else {
        // Handle the case where user is not logged in or does not have a displayName
        //console.log("User not logged in or does not have a displayName.");
      }
    };
  
    fetchData();
  }, [user]);
  



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
            <img className="campfire-icon" src={campfireLogo} alt="campfire icon" />
            <h1 className="header-title">Gather-Round</h1>
          </Link>
          <p className="header-blurb">Come share a tale.</p>
        </div>
        
        <div className="header-auth-info">{user ? (
            //if the user is logged in, display their name and option to sign out. If not, display the signup link that opens the modal
            <div className="auth-info-loggedin">
              <img src={profile?.profilePicture} alt="user icon" className="header-user-icon" />
              <Link className="header-username link" to={`/user/${user?.displayName}`}  onClick={() => {window.location.href = `/user/${user?.displayName}`;}}>{user?.displayName}</Link>
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