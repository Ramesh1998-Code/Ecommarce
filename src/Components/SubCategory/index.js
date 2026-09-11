import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cards from '../Card';
import Loader from "react-js-loader";
import Footer from '../Footer';

function SubCategory() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`https://dummyjson.com/products/category/${slug}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  return (
    <div className="subcategory-page-wrapper bg-slate-50 min-vh-100 py-4">
      <div className="container">
        {/* Category Header Bar (d-flex flex-wrap gap-3 align-items-center mb-4) */}
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4 p-4 rounded-4 bg-white shadow-sm border">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-indigo-subtle rounded-3 text-indigo">
              <i className="fa-solid fa-tags fs-4"></i>
            </div>
            <div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 small">
                  <li className="breadcrumb-item"><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
                  <li className="breadcrumb-item"><Link to="/category" className="text-secondary text-decoration-none">Categories</Link></li>
                  <li className="breadcrumb-item active text-indigo fw-semibold text-capitalize" aria-current="page">{slug}</li>
                </ol>
              </nav>
              <h2 className="fw-bold text-dark m-0 text-capitalize">{slug} Collection</h2>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-indigo-subtle text-indigo rounded-pill px-3 py-2 fw-semibold fs-6">
              {products.length} Products Available
            </span>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="text-center py-5">
            <Loader type="spinner-default" bgColor={"#6366f1"} color={"#ffffff"} size={80} />
            <p className="text-muted mt-3 fw-medium">Loading category products...</p>
          </div>
        ) : (
          <Cards product={products} />
        )}
      </div>

      <Footer />
    </div>
  );
}

export default SubCategory;