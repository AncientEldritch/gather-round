import React from 'react'
import "./Footer.css"

function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-section">
        <p>Code of Conduct</p>
        <p>Contact Us</p>
        <p>Report a Bug</p>
      </div>
      <div className="footer-section">
        <p className="acknowledgement">Gather-Round © <a href="/user/AncientEldritch">AncientEldritch</a></p>
        <p className="acknowledgement">Campfire icon by <a href="https://icons8.com">icons8</a></p>
      </div>
    </div>
  )
}

export default Footer