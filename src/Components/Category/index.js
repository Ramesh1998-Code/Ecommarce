import React, { useEffect, useMemo, useState } from 'react';
import NewsCategory from '../NewsCategory';
import Cards from '../Card';
import Loader from "react-js-loader";
import { Link } from 'react-router-dom';
import Footer from '../Footer';

function Category() {
  const [data, setData] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minDiscount, setMinDiscount] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState("all");

  async function productsCategory() {
    try {
      const response = await fetch('https://dummyjson.com/products/categories');
      const data = await response.json();
      setData(data);
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const response = await fetch('https://dummyjson.com/products?limit=100');
      const data = await response.json();
      setProducts(data?.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    productsCategory();
    fetchProducts();
  }, []);

  // Dynamically extract list of unique brands
  const availableBrands = useMemo(() => {
    const brands = products.map((p) => p.brand).filter(Boolean);
    return Array.from(new Set(brands)).sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = products;

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          (item.brand && item.brand.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    // Brand filter
    if (selectedBrand !== "all") {
      result = result.filter((item) => item.brand === selectedBrand);
    }

    // Price filter
    result = result.filter((item) => item.price <= maxPrice);

    // Minimum rating filter
    if (minRating > 0) {
      result = result.filter((item) => item.rating >= minRating);
    }

    // Discount filter
    if (minDiscount > 0) {
      result = result.filter((item) => (item.discountPercentage || 0) >= minDiscount);
    }

    // In-Stock filter
    if (inStockOnly) {
      result = result.filter((item) => (item.stock || 0) > 0);
    }

    // Sorting
    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating-desc") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "discount-desc") {
      result = [...result].sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedBrand, maxPrice, minRating, minDiscount, inStockOnly, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory("all");
    setSelectedBrand("all");
    setSearchQuery("");
    setMinRating(0);
    setMinDiscount(0);
    setInStockOnly(false);
    setSortBy("");
    setMaxPrice(2000);
  };

  if (loading || data.length === 0) {
    return (
      <div className="text-center py-5 min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <Loader type="spinner-default" bgColor={"#6366f1"} color={"#ffffff"} size={80} />
        <p className="text-muted mt-3 fw-medium">Loading catalog categories...</p>
      </div>
    );
  }

  return (
    <div className="category-page-wrapper bg-slate-50 min-vh-100 py-4">
      <div className="container">
        {/* Top Section Header Bar */}
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4 p-4 rounded-4 bg-white shadow-sm border">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-indigo-subtle rounded-3 text-indigo">
              <i className="fa-solid fa-sliders fs-4"></i>
            </div>
            <div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 small">
                  <li className="breadcrumb-item"><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
                  <li className="breadcrumb-item active text-indigo fw-semibold" aria-current="page">Catalog Filter</li>
                </ol>
              </nav>
              <h2 className="fw-bold text-dark m-0">Browse Catalog</h2>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 align-items-center">
            <span className="badge bg-indigo-subtle text-indigo rounded-pill px-3 py-2 fw-semibold fs-6">
              {filteredProducts.length} Products Found
            </span>
            <button
              type="button"
              onClick={handleResetFilters}
              className="btn btn-sm btn-outline-secondary rounded-pill px-3 ms-2"
            >
              <i className="fa-solid fa-rotate-left me-1"></i> Reset Filters
            </button>
          </div>
        </div>

        <div className="row">
          {/* Left Sidebar Filter Card */}
          <div className="col-lg-3 col-md-4 mb-4">
            <div className="p-4 bg-white rounded-4 shadow-sm border sticky-top" style={{ top: '90px', zIndex: 10, maxHeight: 'calc(100vh - 110px)', overflowY: 'auto' }}>
              
              <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <h5 className="fw-bold text-dark m-0">
                  <i className="fa-solid fa-filter me-2 text-indigo"></i> Filter Options
                </h5>
                <button 
                  onClick={handleResetFilters}
                  className="btn btn-link btn-sm text-indigo p-0 text-decoration-none fw-semibold small"
                >
                  Clear All
                </button>
              </div>

              {/* 1. Keyword Search */}
              <div className="mb-4">
                <label className="fw-semibold text-secondary small mb-2 d-block">Search Keyword</label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control rounded-3 ps-5 py-2 small"
                    placeholder="Search product..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <i className="fa-solid fa-magnifying-glass position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                  {searchQuery && (
                    <button
                      className="btn btn-sm btn-link text-muted position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-decoration-none"
                      onClick={() => setSearchQuery("")}
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* 2. Category List */}
              <div className="mb-4 pt-3 border-top">
                <label className="fw-semibold text-secondary small mb-2 d-block">Category</label>
                <NewsCategory
                  data={data}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>

              {/* 3. Brand Filter */}
              {availableBrands.length > 0 && (
                <div className="mb-4 pt-3 border-top">
                  <label className="fw-semibold text-secondary small mb-2 d-block">Brand</label>
                  <select
                    className="form-select border-slate-200 bg-slate-50 text-dark rounded-3 small"
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  >
                    <option value="all">All Brands ({availableBrands.length})</option>
                    {availableBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* 4. Max Price Range */}
              <div className="mb-4 pt-3 border-top">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label className="fw-semibold text-secondary small m-0">Max Price Limit</label>
                  <span className="badge bg-indigo text-white fw-bold">${maxPrice}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={2000}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="form-range custom-range"
                />
                <div className="d-flex justify-content-between text-muted small mt-1">
                  <span>$0</span>
                  <span>$2,000</span>
                </div>
              </div>

              {/* 5. Rating Filter */}
              <div className="mb-4 pt-3 border-top">
                <label className="fw-semibold text-secondary small mb-2 d-block">Customer Rating</label>
                <div className="d-flex flex-column gap-1">
                  {[
                    { label: "All Ratings", value: 0 },
                    { label: "4★ & Above", value: 4 },
                    { label: "3★ & Above", value: 3 },
                    { label: "2★ & Above", value: 2 },
                  ].map((r) => (
                    <div key={r.value} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="ratingFilter"
                        id={`rating-${r.value}`}
                        checked={minRating === r.value}
                        onChange={() => setMinRating(r.value)}
                      />
                      <label className="form-check-label small text-dark d-flex align-items-center gap-1 cursor-pointer" htmlFor={`rating-${r.value}`}>
                        {r.value > 0 ? (
                          <>
                            <span className="text-warning"><i className="fa-solid fa-star"></i></span>
                            <span>{r.label}</span>
                          </>
                        ) : (
                          <span>{r.label}</span>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. Minimum Discount Filter */}
              <div className="mb-4 pt-3 border-top">
                <label className="fw-semibold text-secondary small mb-2 d-block">Discount Offers</label>
                <div className="d-flex flex-column gap-1">
                  {[
                    { label: "All Discounts", value: 0 },
                    { label: "10% or More", value: 10 },
                    { label: "15% or More", value: 15 },
                    { label: "20% or More", value: 20 },
                  ].map((d) => (
                    <div key={d.value} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="discountFilter"
                        id={`discount-${d.value}`}
                        checked={minDiscount === d.value}
                        onChange={() => setMinDiscount(d.value)}
                      />
                      <label className="form-check-label small text-dark cursor-pointer" htmlFor={`discount-${d.value}`}>
                        {d.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7. Availability / In Stock */}
              <div className="mb-4 pt-3 border-top">
                <div className="form-check form-switch d-flex align-items-center justify-content-between ps-0">
                  <label className="form-check-label fw-semibold text-secondary small cursor-pointer m-0" htmlFor="inStockSwitch">
                    <i className="fa-solid fa-box text-success me-1"></i> In Stock Only
                  </label>
                  <input
                    className="form-check-input ms-0 cursor-pointer"
                    type="checkbox"
                    role="switch"
                    id="inStockSwitch"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                </div>
              </div>

              {/* 8. Sorting */}
              <div className="pt-3 border-top">
                <label className="fw-semibold text-secondary small mb-2 d-block">Sort Order</label>
                <select
                  className="form-select border-slate-200 bg-slate-50 text-dark rounded-3 small"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="">Default Sorting</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating-desc">Rating: High to Low</option>
                  <option value="discount-desc">Biggest Discount</option>
                </select>
              </div>

            </div>
          </div>

          {/* Right Product Grid */}
          <div className="col-lg-9 col-md-8">
            <Cards product={filteredProducts} />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );

}

export default Category;