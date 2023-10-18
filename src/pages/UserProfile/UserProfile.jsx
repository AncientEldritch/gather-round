import React, { useState, useEffect } from 'react'
import './UserProfile.css'
import { auth } from "../../config/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams, Link } from 'react-router-dom';
import { getDocs, collection, query, where} from "firebase/firestore";
import { db } from '../../config/firebaseConfig';
import { render } from 'react-dom';
import MemberOfContainer from '../../components/MemberOfContainer/MemberOfContainer';



function UserProfile() {
  const [user] = useAuthState(auth);
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [isUserPage, setIsUserPage] = useState(false);

  const renderUserBox = () => {
    if (profile?.userPageBox) {
      return (
        <div className="user-page-box" dangerouslySetInnerHTML={{ __html: profile?.userPageBox }}  />
      )
    } else {
      return (
        <p className="user-page-box placeholder-text">User information</p>
      )
    }
  }

  useEffect(() => {
    const fetchData = async () => {
        const userRef = collection(db, 'users');
        const q = query(userRef, where("username", "==", username));
        try {
          const querySnapshot = await getDocs(q);
          if (querySnapshot.size > 0) {
            // Grab the first document from the query result
            const userData = querySnapshot.docs[0].data();
            setProfile(userData);
            //console.log(userData);
          } else {
            // Handle the case where no user document is found
            console.log("User document not found.");
          }
        } catch (error) {
          // Handle errors if any occur during the query
          console.error("Error fetching user data:", error);
        }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (username === user?.displayName) {
      setIsUserPage(true);
    }
  }, [profile, username]);

  return (
    <div className="user-profile-container">
      <div style={{backgroundImage: `url(${profile?.banner})`}} className="user-profile-banner-container">
        <div className="user-profile-icon-container">
          <img src={profile?.profilePicture} alt="user icon" className="user-profile-icon-larger" />
        </div>
      </div>
      <div className="user-profile-top-container">
        <div className="user-profile-username-container">
          <h2 className="user-profile-username">{`${profile?.username} ●`}</h2>
        </div>
        <div className="user-profile-blurb-container">
          <p className="user-profile-blurb">{profile?.blurb}</p>
        </div>
      </div>
      <div className="user-basic-information-container">
        <div className="profile-basic-information-item">
          <h3 className="profile-information-title">Date Joined:</h3>
          <p className="user-profile-information-item">{profile?.profileCreated.toDate().toDateString()}</p>
        </div>
        <div className="profile-basic-information-item">
          <h3 className="profile-information-title">Pronouns:</h3>
          <p className="user-profile-information-item">{profile?.pronouns}</p>
        </div>
        <div className="profile-basic-information-item">
          <h3 className="profile-information-title">Joined Communities:</h3>
          <p className="user-profile-information-item">{profile?.joinedGroups?.length}</p>
        </div>
        {isUserPage &&
          <Link to="/settings">Edit Profile</Link>
        }
      </div>
      <div className="user-profile-bottom-container">
        <div className="user-profile-bottom-left-container">
          <MemberOfContainer username={username} profile={profile} />
        </div>
        <div className="user-profile-bottom-right-container">
          {renderUserBox()}
        </div>
      </div>
    </div>
  )
}

export default UserProfile