import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Cards from '../Card';
import Footer from '../Footer';

function WishList() {
  const wishList = useSelector((state) => state.cartreducer.wishlist);

  return (
    <div className="wishlist-page-wrapper bg-slate-50 min-vh-100 py-4">
      <div className="container">
        {/* Wishlist Header Bar (d-flex flex-wrap gap-3 align-items-center mb-4) */}
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4 p-4 rounded-4 bg-white shadow-sm border">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-rose-100 rounded-3 text-rose">
              <i className="fa-solid fa-heart text-danger fs-4"></i>
            </div>
            <div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 small">
                  <li className="breadcrumb-item"><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
                  <li className="breadcrumb-item active text-danger fw-semibold" aria-current="page">Wishlist</li>
                </ol>
              </nav>
              <h2 className="fw-bold text-dark m-0">My Saved Wishlist</h2>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-danger-subtle text-danger rounded-pill px-3 py-2 fw-semibold fs-6">
              {wishList?.length || 0} Saved Items
            </span>
          </div>
        </div>

        {/* Empty Wishlist Placeholder */}
        {!wishList || wishList.length === 0 ? (
          <div className="text-center py-5 bg-white rounded-4 border p-5 shadow-sm my-4">
            <div className="mb-3">
              <i className="fa-regular fa-heart text-muted display-3"></i>
            </div>
            <h4 className="fw-bold text-dark">Your Wishlist is Empty</h4>
            <p className="text-secondary small mb-4">Explore our trending items and click the heart icon to save products for later.</p>
            <Link to="/" className="btn btn-indigo rounded-pill px-4 py-2 fw-semibold">
              <i className="fa-solid fa-bag-shopping me-2"></i> Start Shopping
            </Link>
          </div>
        ) : (
          <Cards product={wishList} />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default WishList;