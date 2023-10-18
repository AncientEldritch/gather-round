import React, { useState, useEffect } from 'react';
import "./MemberOfContainer.css";
import { auth } from "../../config/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDoc,  doc } from "firebase/firestore";
import { db } from '../../config/firebaseConfig';

function MemberOfContainer({ profile }) {
    const [user] = useAuthState(auth);
    const [communityData, setCommunityData] = useState([]);

    const fetchData = async (communityId) => {
        const communityRef = doc(db, 'communities', communityId);
        try {
            const docSnapshot = await getDoc(communityRef);
            if (docSnapshot.exists()) {
                const community = docSnapshot.data();
                setCommunityData(prevData => [...prevData, community]);
            } else {
                // Handle the case where no document is found
                console.log("Community document not found.");
            }
        } catch (error) {
            // Handle errors if any occur during the query
            console.error("Error fetching community data:", error);
        }
    };

    useEffect(() => {
        if (profile?.joinedGroups && profile.joinedGroups[0]) {
            profile.joinedGroups.forEach(community => {
                fetchData(community);
            });
        }
    }, [profile]);

    return (
        <div>
            {(communityData.length != 0) ? (
                communityData.map((community, index) => (
                    <h1 key={index}>{community.Name}</h1>
                ))
            ) : (
                <p>{profile?.username} has not joined any groups.</p>
            )}
        </div>
    );
}

export default MemberOfContainer;