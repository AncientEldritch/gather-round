import React, {useEffect, useState} from 'react'
import './FeaturedSlider.css'
import { getDocs, collection, query, where} from "firebase/firestore";
import { db } from "../../config/firebaseConfig"; 
import { Link } from 'react-router-dom';

function FeaturedSlider() {
    const [featuredCommunities, setFeaturedCommunities] = useState([]);
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
        console.log(featuredCommunities)
    }, [featuredCommunities])

    const handleRight = () => {
      setIndex(index+1);
    if(index === featuredCommunities.length-1){
        setIndex(0)
    };
  }

    const handleLeft = () => {
      setIndex(index-1);
    if(index === 0){
        setIndex(featuredCommunities.length-1)
    };
    }

  return (
      <div style={{backgroundImage: `url(${featuredCommunities?.[index]?.Banner})`}} className="featured-container">
        <button className="arrow-button arrow-left" onClick={handleLeft}>{`<`}</button>
        <Link className="featured-community" to={`/group/${featuredCommunities?.[index]?.id}`}>
          <h2 className="featured-community-name featured-item">{featuredCommunities[index]?.Name}</h2>
          <p className="featured-community-blurb featured-item">{featuredCommunities[index]?.Blurb}</p>
          {featuredCommunities[index]?.Open && <p className="group-open-flag  featured-item">Currently accepting new members.</p> }
        </Link>
        <button className="arrow-button arrow-right"  onClick={handleRight}>{`>`}</button>
      </div>
    
  )
}

export default FeaturedSlider