import React, { useEffect, useRef, useState } from 'react';
import logo from '../image/Tmarket-logo.png';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/action/productAction';
import { Link } from 'react-router-dom';

function TopHeader() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchText, setSearchText] = useState("");
  const searchRef = useRef(null);

  const dispatch = useDispatch();
  const products = useSelector(state => state?.product?.products || []);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle click outside to auto-close live search dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (value) => {
    setSearchText(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    const filtered = products.filter(item =>
      item.title.toLowerCase().includes(value.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(value.toLowerCase())) ||
      (item.brand && item.brand.toLowerCase().includes(value.toLowerCase()))
    );

    setSearchResults(filtered);
  };

  const handleClearSearch = () => {
    setSearchText("");
    setSearchResults([]);
  };

  return (
    <header className="top-header">
      <div className="container">
        <div className="row align-items-center py-2">
          {/* Logo Section */}
          <div className="col-lg-3 col-md-4 col-6">
            <div className="logo">
              <Link to="/">
                <img src={logo} alt="Tmarket Logo" />
              </Link>
            </div>
          </div>

          {/* Redesigned Search Bar Section */}
          <div className="col-lg-6 col-md-5 col-12 my-2 my-md-0">
            <div className="top-header-search-wrapper" ref={searchRef}>
              <div className="search-input-group">
                <i className="fa-solid fa-magnifying-glass search-leading-icon"></i>
                <input
                  value={searchText}
                  onChange={(e) => handleSearch(e.target.value)}
                  type="text"
                  placeholder="Search products, brands, categories..."
                  aria-label="Search"
                />
                {searchText && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={handleClearSearch}
                    title="Clear search"
                  >
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                )}
                <button type="button" className="search-submit-btn" aria-label="Search">
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>

              {/* Live Search Predictions Dropdown */}
              {searchResults.length > 0 && (
                <div className="serach-box-wrap search-results-dropdown">
                  <div className="search-results-header">
                    <span>
                      Found <strong>{searchResults.length}</strong> items for "{searchText}"
                    </span>
                  </div>
                  <ul className="search-results-list">
                    {searchResults.map(item => (
                      <li key={item.id}>
                        <Link
                          to={`/subcategory/${item.category}`}
                          className="search-result-item"
                          onClick={() => setSearchResults([])}
                        >
                          <img
                            src={item.thumbnail || (item.images && item.images[0]) || '/logo.svg'}
                            alt={item.title}
                            className="search-item-thumb"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/logo.svg';
                            }}
                          />
                          <div className="search-item-info">
                            <div className="search-item-title">{item.title}</div>
                            {item.category && (
                              <span className="search-item-category">{item.category}</span>
                            )}
                          </div>
                          {item.price && (
                            <div className="search-item-price">${item.price}</div>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Social Links Section */}
          <div className="col-lg-3 col-md-3 col-6 d-none d-md-block">
            <div className="social-links-wrapper">
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-icon-btn twitter" title="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon-btn facebook" title="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon-btn linkedin" title="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon-btn instagram" title="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-icon-btn youtube" title="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default TopHeader;