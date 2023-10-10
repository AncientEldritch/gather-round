import React, {useEffect, useState} from 'react'
import './FeaturedSlider.css'
import { getDocs, collection, query, where} from "firebase/firestore";
import { db } from "../../config/firebaseConfig"; 

function FeaturedSlider() {
    const [featuredCommmunities, setFeaturedCommunities] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        //create variable to reference communities 
        const communityRef = collection(db, "communities")
        //set up query to get featured communities
        const q = query(communityRef, where("Featured", "==", true));
        //get communities from database 
        getDocs(q, communityRef)
        .then((res) => {
            
    
            const communities = res.docs.map((community) => ({
              ...community.data(),
              id: community.id,
            }));
            setFeaturedCommunities(communities);
          })
          .catch((err) => console.log(err));

    },[])

    useEffect(() => {
        console.log(featuredCommmunities)
    }, [featuredCommmunities])

  return (
    <div>{featuredCommmunities[0]?.Name} {featuredCommmunities[0]?.Description}</div>
  )
}

export default FeaturedSlider