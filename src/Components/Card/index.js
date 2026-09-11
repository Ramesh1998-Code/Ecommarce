import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ADD, ADD_whisList } from '../../redux/action/action';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Loader from "react-js-loader";
import ReactPaginate from "react-paginate";

function Cards({ product = [] }) {
  const dispatch = useDispatch();

  const notifyCart = () => toast.success("Added to cart!", { theme: "dark", autoClose: 2000 });
  const notifyWishlistAdd = () => toast.info("Added to wishlist!", { theme: "dark", autoClose: 2000 });
  const notifyWishlistRemove = () => toast.warn("Removed from wishlist!", { theme: "dark", autoClose: 2000 });

  const reduxProducts = useSelector((state) => state.product?.products || []);
  const cartItems = useSelector((state) => state.cartreducer?.carts || []);
  const wishList = useSelector((state) => state.cartreducer?.wishlist || []);

  const productsToShow = product?.length ? product : reduxProducts;

  // Filter & Search & Sort states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'

  const categories = [
    { id: "all", label: "All Items", icon: "fa-solid fa-layer-group" },
    { id: "beauty", label: "Beauty", icon: "fa-solid fa-wand-magic-sparkles" },
    { id: "fragrances", label: "Fragrances", icon: "fa-solid fa-spray-can-sparkles" },
    { id: "furniture", label: "Furniture", icon: "fa-solid fa-couch" },
    { id: "groceries", label: "Groceries", icon: "fa-solid fa-basket-shopping" }
  ];

  // Derive filtered and sorted list
  const filteredProducts = useMemo(() => {
    let result = productsToShow;

    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (item) => item.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.category?.toLowerCase().includes(q) ||
          item.brand?.toLowerCase().includes(q)
      );
    }

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [productsToShow, selectedCategory, searchQuery, sortBy]);

  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 8;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredProducts.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

  useEffect(() => {
    setItemOffset(0);
  }, [filteredProducts]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };

  const isInCart = (id) => cartItems.some((item) => item.id === id);
  const isInWishList = (id) => wishList.some((item) => item.id === id);

  const handleWishList = (item) => {
    const exists = isInWishList(item.id);
    dispatch(ADD_whisList(item));
    if (exists) {
      notifyWishlistRemove();
    } else {
      notifyWishlistAdd();
    }
  };

  const handleAddToCart = (item) => {
    dispatch(ADD(item));
    notifyCart();
  };

  const getProductImage = (item) => {
    if (!item) return '/logo.svg';
    if (item.thumbnail) return item.thumbnail;
    if (Array.isArray(item.images) && item.images.length > 0) return item.images[0];
    if (typeof item.images === 'string') return item.images;
    return '/logo.svg';
  };

  return (
    <section className="product-cards-section py-5">
      <ToastContainer theme="light" />
      <div className="container">
        {/* Redesigned Premium Section Header (d-flex flex-wrap gap-3 align-items-center mb-4) */}
        <div className="section-toolbar-card d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4 p-3 rounded-4 shadow-sm border bg-white">
          {/* Section Brand & Title */}
          <div className="d-flex align-items-center gap-3">
            <div className="section-icon-badge">
              <i className="fa-solid fa-sparkles fs-5"></i>
            </div>
            <div>
              <span className="badge badge-featured-pill mb-1">Our Collection</span>
              <h3 className="fw-bold text-dark m-0 fs-4">Explore Trending Products</h3>
            </div>
          </div>

          {/* Quick Category Filter Pills */}
          <div className="d-flex flex-wrap gap-2 align-items-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`filter-pill-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              >
                {cat.icon && <i className={`${cat.icon} me-1`}></i>}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Action Controls: Search, Sort & View Toggle */}
          <div className="d-flex flex-wrap gap-2 align-items-center ms-auto">
            {/* Inline Quick Search */}
            <div className="toolbar-search-box position-relative">
              <i className="fa-solid fa-magnifying-glass search-icon text-muted"></i>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-control toolbar-search-input"
                style={{ width: '170px' }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="btn-clear-search"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
            </div>

            {/* Sort Select Menu */}
            <div className="sort-select-wrap">
              <i className="fa-solid fa-arrow-down-short-wide text-indigo me-1"></i>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select sort-select-input"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Rating: High to Low</option>
              </select>
            </div>

            {/* Grid / List View Mode Toggle */}
            <div className="view-mode-toggle">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                title="Grid View"
              >
                <i className="fa-solid fa-border-all"></i>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                title="List View"
              >
                <i className="fa-solid fa-list-ul"></i>
              </button>
            </div>

            {/* Item Counter Badge */}
            <span className="badge bg-indigo-subtle text-indigo rounded-pill px-3 py-2 fw-semibold ms-1">
              Showing {currentItems.length} of {filteredProducts.length}
            </span>
          </div>
        </div>

        {/* Loader when items are empty */}
        {productsToShow.length === 0 && (
          <div className="text-center py-5">
            <Loader type="spinner-default" bgColor={"#6366f1"} color={"#ffffff"} size={80} />
            <p className="text-muted mt-3 fw-medium">Loading products...</p>
          </div>
        )}

        {/* No results placeholder */}
        {productsToShow.length > 0 && filteredProducts.length === 0 && (
          <div className="text-center py-5 bg-white rounded-4 border p-4">
            <i className="fa-solid fa-box-open text-muted fs-1 mb-3"></i>
            <h5 className="fw-bold text-dark">No products found</h5>
            <p className="text-secondary small mb-3">Try adjusting your category filter or search terms</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setSortBy('featured');
              }}
              className="btn btn-sm btn-outline-indigo rounded-pill px-4"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Responsive Card Grid / List */}
        {viewMode === 'grid' ? (
          <div className="row g-4">
            {currentItems.map((item) => {
              const added = isInCart(item.id);
              const wished = isInWishList(item.id);
              const imageSrc = getProductImage(item);

              return (
                <div className="col-lg-4 col-xl-3 col-md-6 col-sm-6 col-12" key={item.id}>
                  <div className="product-card h-100">
                    {/* Top Action Overlay (Wishlist & Stock Badge) */}
                    <div className="product-card-top-actions">
                      <button
                        type="button"
                        className={`wishlist-toggle-btn ${wished ? 'active' : ''}`}
                        onClick={() => handleWishList(item)}
                        title={wished ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <i className={`fa-solid fa-heart ${wished ? 'text-danger' : 'text-secondary'}`}></i>
                      </button>
                      {item.availabilityStatus && (
                        <span className={`stock-status-pill ${item.availabilityStatus === "In Stock" ? "in-stock" : "low-stock"}`}>
                          {item.availabilityStatus}
                        </span>
                      )}
                    </div>

                    {/* Image Container */}
                    <Link to={`/cart/${item.id}`} className="product-img-link">
                      <div className="product-img-wrapper">
                        <img
                          src={imageSrc}
                          alt={item.title}
                          className="product-card-img"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                    </Link>

                    {/* Card Body Content */}
                    <div className="product-card-body">
                      {item.category && (
                        <span className="product-card-category">{item.category}</span>
                      )}

                      <h5 className="product-card-title">
                        <Link to={`/cart/${item.id}`} title={item.title}>
                          {item.title}
                        </Link>
                      </h5>

                      {/* Rating Bar */}
                      <div className="product-card-rating">
                        <div className="stars">
                          <i className="fa-solid fa-star text-warning"></i>
                          <span className="rating-value">{item.rating || '4.5'}</span>
                        </div>
                        {item.brand && <span className="product-brand-text">{item.brand}</span>}
                      </div>

                      {/* Price & CTA Section */}
                      <div className="product-card-footer">
                        <div className="price-tag-wrap">
                          <span className="currency-symbol">$</span>
                          <span className="price-amount">{item.price}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          disabled={added}
                          className={`btn btn-add-cart ${added ? 'added' : ''}`}
                        >
                          {added ? (
                            <>
                              <i className="fa-solid fa-check me-1"></i> Added
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-cart-plus me-1"></i> Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="row g-3">
            {currentItems.map((item) => {
              const added = isInCart(item.id);
              const wished = isInWishList(item.id);
              const imageSrc = getProductImage(item);

              return (
                <div className="col-12" key={item.id}>
                  <div className="product-card-list">
                    <Link to={`/cart/${item.id}`} className="product-img-link me-3">
                      <div className="product-img-wrapper h-100">
                        <img
                          src={imageSrc}
                          alt={item.title}
                          className="product-card-img h-100 object-fit-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                    </Link>

                    <div className="product-card-body">
                      <div>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            {item.category && (
                              <span className="product-card-category me-2">{item.category}</span>
                            )}
                            {item.availabilityStatus && (
                              <span className={`stock-status-pill ${item.availabilityStatus === "In Stock" ? "in-stock" : "low-stock"}`}>
                                {item.availabilityStatus}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            className={`wishlist-toggle-btn border-0 ${wished ? 'active' : ''}`}
                            onClick={() => handleWishList(item)}
                          >
                            <i className={`fa-solid fa-heart ${wished ? 'text-danger' : 'text-secondary'}`}></i>
                          </button>
                        </div>

                        <h4 className="fw-bold mb-2">
                          <Link to={`/cart/${item.id}`} className="text-dark text-decoration-none">
                            {item.title}
                          </Link>
                        </h4>
                        <p className="text-secondary small mb-3 line-clamp-2">
                          {item.description || "High quality product with premium craftsmanship and standard warranty."}
                        </p>
                      </div>

                      <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                        <div className="d-flex align-items-center gap-3">
                          <div className="price-tag-wrap">
                            <span className="currency-symbol">$</span>
                            <span className="price-amount fs-4">{item.price}</span>
                          </div>
                          <div className="stars ms-2">
                            <i className="fa-solid fa-star text-warning"></i>
                            <span className="rating-value text-dark fw-bold ms-1">{item.rating || '4.5'}</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          disabled={added}
                          className={`btn btn-add-cart ${added ? 'added' : ''}`}
                        >
                          {added ? (
                            <>
                              <i className="fa-solid fa-check me-1"></i> Added
                            </>
                          ) : (
                            <>
                              <i className="fa-solid fa-cart-plus me-1"></i> Add to Cart
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modern Styled Pagination */}
        {pageCount > 1 && (
          <div className="pagination-wrapper mt-5 d-flex justify-content-center">
            <ReactPaginate
              breakLabel="..."
              nextLabel="Next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              pageCount={pageCount}
              previousLabel="< Prev"
              renderOnZeroPageCount={null}
              containerClassName="pagination custom-pagination"
              activeClassName="active"
            />
          </div>
        )}
      </div>
    </section>
  );
}

export default Cards;
