import React from 'react'
import './Homepage.css'
import FeaturedSlider from '../../components/FeaturedSlider/FeaturedSlider'


function Homepage() {
  return (
    <div  className="homepage-container">
      <div className="homepage-top-container">
        <div className="homepage-welcome-container">
          <h2 className="welcome-title">Welcome!</h2>
          <p className="welcome-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>
        <div className="homepage-featured-container">
          <div className="featured-container-info">
            <h2 className="featured-container-title">Featured Communities</h2>
            <p className="featured-container-description"></p>
          </div>
          <FeaturedSlider />
        </div>
      </div>
    </div>
  )
}

export default Homepage
