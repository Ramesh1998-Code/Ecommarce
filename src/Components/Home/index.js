
import React, { useEffect } from 'react';
import TopNews from '../TopNews';
import Cards from '../Card';
import Footer from '../Footer';
import { Link } from 'react-router-dom';

function Home() {
  const [product, setProduct] = React.useState([]);

  async function news() {
    try {
      const response = await fetch('https://dummyjson.com/products');
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }

  useEffect(() => {
    news();
  }, []);

  return (
    <div className="home-master-page">
      {/* Featured Top Showcase */}
      <TopNews product={product} />

      {/* Modern Hero Promo Banner */}
      <header className="home-hero-banner py-5 my-4">
        <div className="container px-4 px-lg-5 py-4">
          <div className="text-center text-white max-w-2xl mx-auto">
            <span className="badge bg-indigo-subtle text-indigo px-3 py-2 rounded-pill fw-semibold mb-3">
              ✨ Premium Express Shopping
            </span>
            <h1 className="display-4 fw-bolder mb-3 text-white">
              Discover Quality Products with <span className="text-indigo">Tmarket</span>
            </h1>
            <p className="lead fw-normal text-slate-300 mb-4 mx-auto" style={{ maxWidth: '650px' }}>
              Explore curated electronics, trending fashion, top gadgets, and lifestyle items at unbeatable prices.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Link to="/card" className="btn btn-indigo-gradient text-white btn-lg px-4 py-2 rounded-pill fw-semibold">
                Shop Collection <i className="fa-solid fa-arrow-right ms-2"></i>
              </Link>
              <Link to="/category" className="btn btn-outline-light btn-lg px-4 py-2 rounded-pill fw-semibold">
                View Categories
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Product Cards Section */}
      <Cards product={product} />

      {/* Rich Multi-Section Footer */}
      <Footer />
    </div>
  );
}

export default Home;
