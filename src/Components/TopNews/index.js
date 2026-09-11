import React from 'react';
import { Link } from 'react-router-dom';

function TopNews({ product }) {
  const products = product?.products || [];

  if (!products || products.length === 0) {
    return null;
  }

  const mainFeatured = products[0];
  const sideFeatured = products.slice(1, 5);

  const getProductImage = (item) => {
    if (!item) return '/logo.svg';
    if (item.thumbnail) return item.thumbnail;
    if (Array.isArray(item.images) && item.images.length > 0) return item.images[0];
    if (typeof item.images === 'string') return item.images;
    return '/logo.svg';
  };

  return (
    <section className="top-news-section py-4">
      <div className="container">
        {/* Section Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="section-title-wrap">
            <span className="badge badge-featured-pill mb-1">Top Pick Spotlight</span>
            <h3 className="fw-bold text-dark m-0 section-heading">Featured Highlights</h3>
          </div>
          <Link to="/card" className="btn-explore-link">
            Explore All Products <i className="fa-solid fa-arrow-right ms-1"></i>
          </Link>
        </div>

        <div className="row g-3">
          {/* Main Left Featured Hero Card */}
          {mainFeatured && (
            <div className="col-lg-6 col-md-12">
              <div className="tn-card tn-card-hero">
                <Link to={`/subcategory/${mainFeatured.category}`} className="tn-card-link">
                  <div className="tn-img-wrapper">
                    <img
                      src={getProductImage(mainFeatured)}
                      alt={mainFeatured.title}
                      className="tn-hero-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="tn-card-overlay">
                      <div className="tn-card-badges">
                        <span className="tn-badge category-badge">{mainFeatured.category || 'Featured'}</span>
                        <span className="tn-badge price-badge">${mainFeatured.price}</span>
                      </div>
                      <div className="tn-card-content">
                        {mainFeatured.rating && (
                          <div className="tn-rating text-warning small mb-1">
                            <i className="fa-solid fa-star"></i> {mainFeatured.rating} Rating
                          </div>
                        )}
                        <h2 className="tn-hero-title">{mainFeatured.title}</h2>
                        {mainFeatured.description && (
                          <p className="tn-hero-desc d-none d-sm-block">
                            {mainFeatured.description.length > 90
                              ? `${mainFeatured.description.substring(0, 90)}...`
                              : mainFeatured.description}
                          </p>
                        )}
                        <span className="btn btn-hero-cta">
                          Shop Now <i className="fa-solid fa-chevron-right ms-1 fs-6"></i>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          )}

          {/* Right Side 2x2 Grid Showcase */}
          <div className="col-lg-6 col-md-12">
            <div className="row g-3">
              {sideFeatured.map((item) => (
                <div className="col-6" key={item.id}>
                  <div className="tn-card tn-card-grid">
                    <Link to={`/subcategory/${item.category}`} className="tn-card-link">
                      <div className="tn-img-wrapper">
                        <img
                          src={getProductImage(item)}
                          alt={item.title}
                          className="tn-grid-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80';
                          }}
                        />
                        <div className="tn-card-overlay">
                          <div className="tn-card-badges">
                            <span className="tn-badge price-badge-sm">${item.price}</span>
                          </div>
                          <div className="tn-card-content p-2">
                            <span className="tn-grid-category">{item.category}</span>
                            <h4 className="tn-grid-title">{item.title}</h4>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TopNews;