import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../image/Tmarket-logo.png';

function Footer() {
  return (
    <footer className="footer-master-wrapper bg-dark text-white pt-5">
      {/* Top Features Value Bar */}
      <div className="footer-features-section pb-5 border-bottom border-secondary border-opacity-25">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-sm-6">
              <div className="footer-feature-item d-flex align-items-center gap-3 p-3 rounded-4 bg-secondary bg-opacity-10 border border-secondary border-opacity-10">
                <div className="feature-icon-circle">
                  <i className="fa-solid fa-truck-fast"></i>
                </div>
                <div>
                  <h6 className="m-0 fw-bold text-white">Free Express Shipping</h6>
                  <small className="text-secondary">On orders over $50</small>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="footer-feature-item d-flex align-items-center gap-3 p-3 rounded-4 bg-secondary bg-opacity-10 border border-secondary border-opacity-10">
                <div className="feature-icon-circle">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
                <div>
                  <h6 className="m-0 fw-bold text-white">100% Secure Checkout</h6>
                  <small className="text-secondary">Protected by SSL</small>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="footer-feature-item d-flex align-items-center gap-3 p-3 rounded-4 bg-secondary bg-opacity-10 border border-secondary border-opacity-10">
                <div className="feature-icon-circle">
                  <i className="fa-solid fa-rotate-left"></i>
                </div>
                <div>
                  <h6 className="m-0 fw-bold text-white">30 Days Returns</h6>
                  <small className="text-secondary">Hassle-free money back</small>
                </div>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="footer-feature-item d-flex align-items-center gap-3 p-3 rounded-4 bg-secondary bg-opacity-10 border border-secondary border-opacity-10">
                <div className="feature-icon-circle">
                  <i className="fa-solid fa-headset"></i>
                </div>
                <div>
                  <h6 className="m-0 fw-bold text-white">24/7 Dedicated Support</h6>
                  <small className="text-secondary">Always here to help</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer Columns */}
      <div className="footer-main-columns py-5">
        <div className="container">
          <div className="row g-4">
            {/* Column 1: Brand & Contact Info */}
            <div className="col-lg-4 col-md-6 col-12">
              <div className="footer-brand-widget">
                <Link to="/" className="d-inline-block mb-3">
                  <img src={logo} alt="Tmarket Logo" className="footer-logo-img" />
                </Link>
                <p className="text-secondary small leading-relaxed mb-4">
                  Tmarket is your premier destination for high-quality electronics, trending fashion, top gadgets, and everyday essentials with lightning-fast delivery.
                </p>

                <div className="contact-list small text-secondary">
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <i className="fa-solid fa-location-dot text-indigo"></i>
                    <span>123 Commerce Way, Tech City, NY 10001</span>
                  </div>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <i className="fa-solid fa-phone text-indigo"></i>
                    <span>+1 (800) 555-8627</span>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <i className="fa-solid fa-envelope text-indigo"></i>
                    <span>support@tmarket.express</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="col-lg-2 col-md-6 col-6">
              <div className="footer-widget">
                <h6 className="widget-title fw-bold text-white mb-3">Quick Links</h6>
                <ul className="list-unstyled footer-links-list small">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/card">Products Shop</Link></li>
                  <li><Link to="/category">Categories</Link></li>
                  <li><Link to="/vendor">Vendor Stores</Link></li>
                  <li><Link to="/wishlist">My Wishlist</Link></li>
                  <li><Link to="/cart">Shopping Cart</Link></li>
                </ul>
              </div>
            </div>

            {/* Column 3: Customer Service */}
            <div className="col-lg-3 col-md-6 col-6">
              <div className="footer-widget">
                <h6 className="widget-title fw-bold text-white mb-3">Customer Service</h6>
                <ul className="list-unstyled footer-links-list small">
                  <li><Link to="/myaccount">My Account</Link></li>
                  <li><a href="#shipping">Shipping & Delivery</a></li>
                  <li><a href="#returns">Returns & Refunds</a></li>
                  <li><a href="#faq">Help Center & FAQ</a></li>
                  <li><a href="#terms">Terms & Conditions</a></li>
                  <li><a href="#privacy">Privacy Policy</a></li>
                </ul>
              </div>
            </div>

            {/* Column 4: Top Categories & Social */}
            <div className="col-lg-3 col-md-6 col-12">
              <div className="footer-widget">
                <h6 className="widget-title fw-bold text-white mb-3">Popular Categories</h6>
                <div className="d-flex flex-wrap gap-2 mb-4">
                  <Link to="/subcategory/smartphones" className="badge bg-secondary bg-opacity-25 text-light text-decoration-none py-2 px-3 rounded-pill">Smartphones</Link>
                  <Link to="/subcategory/laptops" className="badge bg-secondary bg-opacity-25 text-light text-decoration-none py-2 px-3 rounded-pill">Laptops</Link>
                  <Link to="/subcategory/fragrances" className="badge bg-secondary bg-opacity-25 text-light text-decoration-none py-2 px-3 rounded-pill">Fragrances</Link>
                  <Link to="/subcategory/groceries" className="badge bg-secondary bg-opacity-25 text-light text-decoration-none py-2 px-3 rounded-pill">Groceries</Link>
                  <Link to="/subcategory/home-decoration" className="badge bg-secondary bg-opacity-25 text-light text-decoration-none py-2 px-3 rounded-pill">Home Decor</Link>
                </div>

                <h6 className="widget-title fw-bold text-white mb-2">Connect With Us</h6>
                <div className="footer-social-wrapper d-flex gap-2">
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-social-btn" title="Twitter"><i className="fab fa-twitter"></i></a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-social-btn" title="Facebook"><i className="fab fa-facebook-f"></i></a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="footer-social-btn" title="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-social-btn" title="Instagram"><i className="fab fa-instagram"></i></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Payment Badges Bar */}
      <div className="footer-bottom-bar py-3 border-top border-secondary border-opacity-25">
        <div className="container">
          <div className="row align-items-center g-2">
            <div className="col-md-6 text-center text-md-start">
              <p className="m-0 text-secondary small">
                © {new Date().getFullYear()} <strong className="text-white">Tmarket Express</strong>. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="payment-icons-group d-inline-flex gap-3 text-secondary fs-5">
                <i className="fa-brands fa-cc-visa" title="Visa"></i>
                <i className="fa-brands fa-cc-mastercard" title="Mastercard"></i>
                <i className="fa-brands fa-cc-paypal" title="PayPal"></i>
                <i className="fa-brands fa-cc-apple-pay" title="Apple Pay"></i>
                <i className="fa-brands fa-google-pay" title="Google Pay"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

