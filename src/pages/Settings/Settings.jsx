import React, { useEffect, useState } from 'react'
import "./Settings.css"
import { auth } from "../../config/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDocs, collection, query, where, updateDoc, doc} from "firebase/firestore";
import { db } from '../../config/firebaseConfig';
import DOMPurify from 'dompurify';
import { FiEdit } from "react-icons/fi"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";


function Settings() {
    const [user] = useAuthState(auth);
    const [profile, setProfile] = useState(null);
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [downloadURL, setDownloadURL] = useState("");
    const storage = getStorage();
    

    const handleIconEditClick = () => {
        setIsEditingImage(true);
    }

    const fetchData = async () => {
        // ... (previous code)
    
        if (querySnapshot.size > 0) {
            // Grab the first document from the query result
            const userData = querySnapshot.docs[0].data();
            setProfile(userData);
            setUsername(userData.username); // Set the username state
            console.log(userData);
        } else {
            // Handle the case where no user document is found
            console.log("User document not found.");
        }
    };

    const uploadFileToStorage = async (file) => {
        const storageRef = ref(storage, "" + file.name);
    
        try {
            // Upload the file to storage
            await uploadBytes(storageRef, file);
            console.log("File uploaded successfully!");
    
            // Get the download URL of the uploaded file
            const newDownloadUrl = await getDownloadURL(storageRef);
            setDownloadURL(newDownloadUrl)
            console.log("Download URL:", downloadURL);
    
            // Now, you can use this download URL to update the profilePicture field in Firestore
            // ...
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const handleIconUpload = (event) => {
        const file = event.target.files[0];
        const maxSize = 3.5 * 1024 * 1024; 
    
        if (file) {
            if (file.type.startsWith("")) {
                if (file.size <= maxSize) {
                    // Valid image within size limit
                    setSelectedIcon(file);
                } else {
                    // Image exceeds size limit
                    alert("File size exceeds the allowed limit (3.5MB). Please choose a smaller file.");
                    // Optionally, clear the file input
                    event.target.value = null;
                }
            } else {
                // Invalid file type (non-image)
                setSelectedIcon(null);
                alert("Please select a valid image file.");
                // Optionally, clear the file input
                event.target.value = null;
            }
        } else {
            // No file selected
            setSelectedIcon(null);
        }
    };

    const handleIconSubmit = async (event) => {
        event.preventDefault();
        if (selectedIcon) {
            try {
                uploadFileToStorage(selectedIcon);
    
                // Update the profilePicture field in the document with the correct username
                const userDocRef = doc(db, "users", profile?.username); 
                await updateDoc(userDocRef, {
                    profilePicture: downloadURL
                });
                console.log("Profile picture updated successfully!");
            } catch (error) {
                console.error("Error updating profile picture:", error);
            }
        } else {
            // Handle invalid file type
            alert("Please select a valid image file.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            // Check if user?.displayName is defined before making the query
            if (user?.displayName) {
                const userRef = collection(db, 'users');
                const q = query(userRef, where("username", "==", user.displayName)); // Use user.displayName directly
                try {
                  const querySnapshot = await getDocs(q);
                  if (querySnapshot.size > 0) {
                    // Grab the first document from the query result
                    const userData = querySnapshot.docs[0].data();
                    setProfile(userData);
                    console.log(userData);
                  } else {
                    // Handle the case where no user document is found
                    console.log("User document not found.");
                  }
                } catch (error) {
                  // Handle errors if any occur during the query
                  console.error("Error fetching user data:", error);
                }
            } else {
                // Handle the case where user?.displayName is undefined
                console.log("User displayName is undefined.");
            }
        };
        fetchData();
    }, [user]);

  return (
    <div className="settings-container">
       
        <div className="settings-top-container">
            <div className="settings-top-left-container">  
                <h2 className="settings-title">Edit User Profile</h2>
    
            </div>
            <p className="community-reminder">Please keep in mind that all profiles must follow our <a href="">Code of Conduct</a></p>
        </div>
        <hr  />
        <div className="settings-left-container">
            <h3 className="icon-title">Profile Picture</h3>
            <div className="settings-icon-container">
                <img src={profile?.profilePicture} alt="user icon" className="settings-icon-larger" />
                <div className="icon-edit-container">
                    <div className="settings-edit-image-button" onClick={handleIconEditClick}>
                        <FiEdit /> 
                        <p className="icon-change-text">Change Icon</p>
                    </div>
                    {isEditingImage && 
                        <div className="input-container">
                            <input type="file" onChange={handleIconUpload}/>
                            <div className="button-container">
                                <button className="settings-button" onClick={handleIconSubmit}>Submit</button>
                                <button className="settings-button x-button" onClick={() => setIsEditingImage(false)}>Cancel</button>
                            </div>
                        </div> }
                    </div>
                </div>
            </div>
        </div>
    
  )
}

export default Settings