import React, { useEffect, useState } from 'react'
import "./Settings.css"
import { auth } from "../../config/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDocs, collection, query, where, updateDoc, doc} from "firebase/firestore";
import { db } from '../../config/firebaseConfig';
import DOMPurify from 'dompurify';
import { FiEdit } from "react-icons/fi"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateProfile } from 'firebase/auth';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';



function Settings() {
    const [user] = useAuthState(auth);
    const [profile, setProfile] = useState(null);
    const [isEditingImage, setIsEditingImage] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [downloadURL, setDownloadURL] = useState("");
    const [ docId, setDocId] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newPronouns, setNewPronouns] = useState("");
    const [newUserPageBox, setNewUserPageBox] = useState(profile?.userPageBox || "");
   
    const storage = getStorage();

    const toolbarOptions = [
        [ 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
      
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'align': [] }],
    
      ];

   
    useEffect(() => {
        const fetchData = async () => {
            // Check if user?.displayName is defined before making the query
            if (user?.displayName) {
                const userRef = collection(db, 'users');
                const q = query(userRef, where("username", "==", user?.displayName));
                try {
                    const querySnapshot = await getDocs(q);
                    if (querySnapshot.size > 0) {
                        // Grab the first document from the query result
                        const userDoc = querySnapshot.docs[0].id;
                        const userData = querySnapshot.docs[0].data();
                        setProfile(userData);
                        setDocId(userDoc);
                        console.log(userData);
                        console.log("document id is", userDoc)
                        
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
    
    

    const handleIconEditClick = () => {
        setIsEditingImage(true);
    }


    const uploadFileToStorage = async (file) => {
        const storageRef = ref(storage, "" + file.name);
    
        try {
            // Upload the file to storage
            await uploadBytes(storageRef, file);
            console.log("File uploaded successfully!");
    
            // Get the download URL of the uploaded file
            const newDownloadUrl = await getDownloadURL(storageRef);
            await setDownloadURL(newDownloadUrl)
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
            setIsProcessing(true);
            try {
                await uploadFileToStorage(selectedIcon);
            } catch (error) {
                console.error("Error uploading file:", error);
                setIsProcessing(false);
                return;
            }
        } else {
            // Handle invalid file type
            alert("Please select a valid image file.");
            return;
        }
    };

    

const updateUsername = async () => {
    const newLowercaseUsername =  newUsername.toLowerCase()
    const usernameQuery = query(
        collection(db, "users"),
        where("lowercaseUsername", "==", newLowercaseUsername) 
      );
      const usernameSnapshot = await getDocs(usernameQuery);
      const allowedCharactersRegex = /^[a-zA-Z0-9._-]{1,20}$/;

      if (!usernameSnapshot.empty) {
        // Handle the case where the username already exists
        alert("Username already exists. Please choose another username.");
        return;
      } else if(!allowedCharactersRegex.test(newUsername)) {
        // Handle the case where the username already exists
        alert("Username must be 20 characters or less and may only contain [a-z] [A-Z] [0-9] . - _"
        );
        return;
       } else {
        try {
            // Update the user's display name
            await updateProfile(auth.currentUser, {
                displayName: newUsername,
            });
            
            // Update the Firestore document
            const userRef = collection(db, 'users');
            const userDocRef = doc(userRef, docId);
            await updateDoc(userDocRef, {
                username: newUsername,
                lowercaseUsername: newLowercaseUsername
            });
            window.location.reload();
            console.log("Profile and Firestore document updated successfully!", newUsername);
        } catch (error) {
            console.error("Error updating profile or Firestore document:", error);
        }
    }
};

const newUsernameInput =  (event) => {
    setNewUsername(event.target.value)
}

const newPronounsInput =  (event) => {
    setNewPronouns(event.target.value)
}

const newUserPageBoxInput = (content, delta, source, editor) => {
    const text = editor.getHTML();
    setNewUserPageBox(text);
}

const updatePronouns = async (field, newValue) => {
    const userRef = collection(db, 'users');
    const userDocRef = doc(userRef, docId);
    const allowedCharactersRegex = /^[a-zA-Z/ ._-]{1,25}$/;
    if (!allowedCharactersRegex.test(newPronouns)) {
        // Handle the case where the username already exists
        alert("Pronouns must be 25 characters or less and may only contain [a-z] [A-Z] / . - _"
        );
        return;
    } else {
        await updateDoc(userDocRef, {
        // Update existing fields or add new fields
            pronouns: newPronouns,
        });
        window.location.reload();
    }
};

const updateUserPageBox = async () => {
    const userRef = collection(db, 'users');
    const userDocRef = doc(userRef, docId);
    const sanitizedInput = DOMPurify.sanitize(newUserPageBox)
    console.log(sanitizedInput)
    await updateDoc(userDocRef, {
        userPageBox: sanitizedInput,
        });
        window.location.reload();
    
};

    useEffect(() => {
        const fetchData = async () => {
            // Check if user?.displayName is defined before making the query
            if (user?.displayName) {
                const userRef = collection(db, 'users');
                const q = query(userRef, where("username", "==", user?.displayName)); // Use user.displayName directly
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

    useEffect(() => {
        //updates profile picture if there is a downloadUrl and handleIconSubmit has run
        const updateProfilePicture = async () => {
            if (downloadURL && isProcessing) {
                try {
                    await updateData("profilePicture", downloadURL);
                    console.log("Profile picture updated successfully!");
                    setIsProcessing(false);
                    // Reload the page after the updateData function is called
                    setDownloadURL("");
                    window.location.reload();
                } catch (error) {
                    console.error("Error updating profile picture:", error);
                }
            }
        };

        updateProfilePicture();
    }, [downloadURL, isProcessing]);

  return (
    <div className="settings-container">
        <div className="settings-top-container">
            <div className="settings-top-left-container">  
                <h2 className="settings-title">Edit User Profile</h2>
    
            </div>
            <p className="community-reminder">Please keep in mind that all profiles must follow our <a href="">Code of Conduct</a></p>
        </div>
        <hr  />
        <div className="settings-main-container">
            <div className="settings-left-container">
                <h3 className="section-title">Profile Picture</h3>
                <div className="settings-icon-container">
                    <img src={profile?.profilePicture} alt="user icon" className="settings-icon-larger" />
                    <div className="icon-edit-container">
                        <div className="settings-edit-image-button" onClick={handleIconEditClick}>
                            <FiEdit /> 
                            <p className="icon-change-text">Change</p>
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
                <div className="settings-right-container">
                    <h3 className="section-title">Basic Information</h3>
                    <div className="profile-options-container">
                        <div className="option-container">
                            <label className="option-label" htmlFor="username">Username</label>
                            <input onChange={newUsernameInput}  placeholder={profile?.username} id="username" type="text" className="options-input" />
                            <button onClick={updateUsername} className="options-submit">Edit</button>
                        </div>
                        <div className="option-container">
                            <label  className="option-label" htmlFor="pronouns">Pronouns</label>
                            <input onChange={newPronounsInput} placeholder={profile?.pronouns}  id="pronouns" type="text" className="options-input" />
                            <button onClick={updatePronouns} className="options-submit">Edit</button>
                        </div>
                        <div className="option-container textarea-option">
                            <label className="option-label information-option-label" htmlFor="information">User Information</label>
                            <ReactQuill
                                modules={{
                                toolbar: toolbarOptions // Set the toolbar options here
                                }}
                                value={newUserPageBox}
                                onChange={newUserPageBoxInput} // Pass your onChange handler here
                                placeholder="Include any other information you'd like. This accepts plaintext and html."
                                id="information"
                                type="textarea"
                                className="options-input quill-textarea"
                                />
                            <button onClick={() => updateUserPageBox()} className="options-submit user-box-submit">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
  )
}

export default Settings