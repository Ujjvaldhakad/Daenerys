import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="daenerys-footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2>Daenerys</h2>
          <p>Exquisite wedding couture for men and women. Elevating elegance and defining luxury.</p>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <h3>Explore</h3>
            <ul>
              <li><a href="#">Bridal Collection</a></li>
              <li><a href="#">Groom Collection</a></li>
              <li><a href="#">Bespoke Services</a></li>
              <li><a href="#">Lookbook 2026</a></li>
            </ul>
          </div>
          <div className="link-group">
            <h3>Company</h3>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Our Heritage</a></li>
              <li><a href="#">Book Appointment</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-newsletter">
          <h3>Stay Updated</h3>
          <p>Join our newsletter for the latest collections and exclusive invites.</p>
          <div className="input-group">
            <input type="email" placeholder="Your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Daenerys Couture. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
