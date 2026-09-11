import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { DLT, ADD, REMOVE, ADD_whisList } from '../../redux/action/action';
import Footer from '../Footer';
import Loader from 'react-js-loader';
import { ToastContainer, toast } from 'react-toastify';

function CardDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [productItem, setProductItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);

    const cartItems = useSelector((state) => state.cartreducer?.carts || []);
    const wishList = useSelector((state) => state.cartreducer?.wishlist || []);

    const cartItemInStore = cartItems.find((item) => String(item.id) === String(id));
    const isWished = wishList.some((item) => String(item.id) === String(id));

    const notifyCart = () => toast.success("Added to cart!", { theme: "dark", autoClose: 2000 });
    const notifyWishlist = (msg) => toast.info(msg, { theme: "dark", autoClose: 2000 });

    const fetchSingleProduct = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://dummyjson.com/products/${id}`);
            const result = await response.json();
            setProductItem(result);

            // Set initial main image
            const primaryImg = result.thumbnail || (Array.isArray(result.images) && result.images[0]) || '/logo.svg';
            setSelectedImage(primaryImg);
        } catch (error) {
            console.error("Error fetching single product:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSingleProduct();
    }, [id]);

    useEffect(() => {
        if (cartItemInStore) {
            setQuantity(cartItemInStore.qnty || 1);
        }
    }, [cartItemInStore]);

    const handleAddToCart = () => {
        if (productItem) {
            dispatch(ADD(productItem));
            notifyCart();
        }
    };

    const handleRemoveFromCart = () => {
        if (productItem) {
            dispatch(REMOVE(productItem));
        }
    };

    const handleDeleteFromCart = () => {
        if (productItem) {
            dispatch(DLT(productItem.id));
        }
    };

    const handleToggleWishlist = () => {
        if (productItem) {
            dispatch(ADD_whisList(productItem));
            notifyWishlist(isWished ? "Removed from wishlist!" : "Added to wishlist!");
        }
    };

    const imagesList = React.useMemo(() => {
        if (!productItem) return [];
        if (Array.isArray(productItem.images) && productItem.images.length > 0) {
            return productItem.images;
        }
        if (productItem.thumbnail) return [productItem.thumbnail];
        return ['/logo.svg'];
    }, [productItem]);

    if (loading) {
        return (
            <div className="text-center py-5 my-5">
                <Loader type="spinner-default" bgColor={"#6366f1"} color={"#ffffff"} size={80} />
                <p className="text-muted mt-3 fw-medium">Loading product details...</p>
            </div>
        );
    }

    if (!productItem || productItem.message) {
        return (
            <div className="container py-5 text-center my-5">
                <i className="fa-solid fa-triangle-exclamation text-warning display-3 mb-3"></i>
                <h3>Product Not Found</h3>
                <p className="text-muted">The requested item details could not be loaded.</p>
                <Link to="/card" className="btn btn-indigo-gradient px-4 rounded-pill">
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="product-details-master-page bg-slate-50">
            <ToastContainer theme="light" />

            {/* Breadcrumb Navigation */}
            <div className="bg-white border-bottom py-3">
                <div className="container">
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb m-0 small">
                            <li className="breadcrumb-item">
                                <Link to="/" className="text-decoration-none text-secondary">Home</Link>
                            </li>
                            <li className="breadcrumb-item">
                                <Link to="/card" className="text-decoration-none text-secondary">Products</Link>
                            </li>
                            {productItem.category && (
                                <li className="breadcrumb-item">
                                    <Link to={`/subcategory/${productItem.category}`} className="text-decoration-none text-secondary text-capitalize">
                                        {productItem.category}
                                    </Link>
                                </li>
                            )}
                            <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
                                {productItem.title}
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>

            {/* Main Single Product Showcase */}
            <section className="py-5">
                <div className="container">
                    <div className="row g-4 g-lg-5">
                        {/* Left Column: Image Gallery */}
                        <div className="col-lg-6">
                            <div className="product-gallery-container sticky-top" style={{ top: '90px' }}>
                                {/* Main Selected Image */}
                                <div className="product-main-img-box mb-3">
                                    <img
                                        src={selectedImage}
                                        alt={productItem.title}
                                        className="product-main-img"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80';
                                        }}
                                    />
                                    {productItem.discountPercentage && (
                                        <span className="badge badge-discount-floating">
                                            -{Math.round(productItem.discountPercentage)}% OFF
                                        </span>
                                    )}
                                </div>

                                {/* Thumbnail Strip */}
                                {imagesList.length > 1 && (
                                    <div className="d-flex gap-2 overflow-x-auto pb-2 thumbnail-strip">
                                        {imagesList.map((imgUrl, idx) => (
                                            <button
                                                key={idx}
                                                type="button"
                                                className={`thumbnail-btn-box ${selectedImage === imgUrl ? 'active' : ''}`}
                                                onClick={() => setSelectedImage(imgUrl)}
                                            >
                                                <img src={imgUrl} alt={`thumbnail ${idx}`} className="thumb-strip-img" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Details & Actions */}
                        <div className="col-lg-6">
                            <div className="product-details-info-card p-4 p-md-5 bg-white rounded-4 border shadow-sm">
                                {/* Category & Stock Status */}
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <span className="badge category-badge text-capitalize">{productItem.category || 'Electronics'}</span>
                                    <span className={`stock-status-pill ${productItem.availabilityStatus === "In Stock" ? "in-stock" : "low-stock"}`}>
                                        {productItem.availabilityStatus || 'Available'}
                                    </span>
                                </div>

                                {/* Product Title */}
                                <h1 className="fw-bold text-dark mb-2 display-6 fs-3">{productItem.title}</h1>

                                {/* Rating & Brand Bar */}
                                <div className="d-flex align-items-center gap-3 mb-3">
                                    <div className="d-flex align-items-center gap-1 text-warning">
                                        <i className="fa-solid fa-star"></i>
                                        <span className="fw-bold text-dark ms-1">{productItem.rating || '4.5'}</span>
                                    </div>
                                    <span className="text-secondary">•</span>
                                    <span className="text-secondary small fw-medium">
                                        Brand: <strong className="text-dark">{productItem.brand || 'Tmarket Premium'}</strong>
                                    </span>
                                    {productItem.sku && (
                                        <>
                                            <span className="text-secondary">•</span>
                                            <span className="text-secondary small">SKU: {productItem.sku}</span>
                                        </>
                                    )}
                                </div>

                                {/* Price Display */}
                                <div className="product-price-box py-3 px-4 mb-4 rounded-3 bg-slate-100 d-flex align-items-baseline gap-3">
                                    <span className="fs-2 fw-bold text-dark">${productItem.price}</span>
                                    {productItem.discountPercentage && (
                                        <span className="text-muted text-decoration-line-through fs-5">
                                            ${(productItem.price * (1 + productItem.discountPercentage / 100)).toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-secondary leading-relaxed mb-4">
                                    {productItem.description}
                                </p>

                                {/* Specifications Grid */}
                                <div className="row g-3 mb-4 py-3 border-top border-bottom">
                                    <div className="col-6">
                                        <div className="spec-item">
                                            <small className="text-muted d-block mb-1">Shipping Info</small>
                                            <span className="fw-semibold text-dark small">
                                                <i className="fa-solid fa-truck text-indigo me-1"></i> {productItem.shippingInformation || 'Standard 3-5 Days'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <div className="spec-item">
                                            <small className="text-muted d-block mb-1">Return Policy</small>
                                            <span className="fw-semibold text-dark small">
                                                <i className="fa-solid fa-rotate-left text-indigo me-1"></i> {productItem.returnPolicy || '30 Days Return Guarantee'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <div className="spec-item">
                                            <small className="text-muted d-block mb-1">Warranty</small>
                                            <span className="fw-semibold text-dark small">
                                                <i className="fa-solid fa-shield-halved text-indigo me-1"></i> {productItem.warrantyInformation || '1 Year Official Warranty'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="col-6">
                                        <div className="spec-item">
                                            <small className="text-muted d-block mb-1">Weight</small>
                                            <span className="fw-semibold text-dark small">
                                                <i className="fa-solid fa-box text-indigo me-1"></i> {productItem.weight ? `${productItem.weight}g` : 'Standard Package'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Redesigned Quantity & CTA Purchase Group */}
                                <div className="product-purchase-box mb-4">
                                    {/* Quantity Picker & Wishlist Bar */}
                                    <div className="d-flex align-items-center justify-content-between gap-3 mb-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="text-secondary small fw-semibold">Quantity:</span>
                                            <div className="quantity-picker-box">
                                                <button
                                                    type="button"
                                                    className="qty-action-btn"
                                                    onClick={cartItemInStore ? (quantity <= 1 ? handleDeleteFromCart : handleRemoveFromCart) : () => setQuantity(Math.max(1, quantity - 1))}
                                                    title="Decrease quantity"
                                                >
                                                    <i className="fa-solid fa-minus"></i>
                                                </button>
                                                <span className="qty-count-display">{quantity}</span>
                                                <button
                                                    type="button"
                                                    className="qty-action-btn"
                                                    onClick={handleAddToCart}
                                                    title="Increase quantity"
                                                >
                                                    <i className="fa-solid fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Wishlist Icon Button */}
                                        <button
                                            type="button"
                                            className={`btn-wishlist-action ${isWished ? 'active' : ''}`}
                                            onClick={handleToggleWishlist}
                                            title={isWished ? "Remove from Wishlist" : "Add to Wishlist"}
                                        >
                                            <i className={`fa-solid fa-heart ${isWished ? 'text-danger' : ''}`}></i>
                                        </button>
                                    </div>

                                    {/* Action Buttons Row: Add to Cart & Buy Now */}
                                    <div className="row g-2 mb-3">
                                        <div className="col-sm-6 col-12">
                                            <button
                                                type="button"
                                                onClick={handleAddToCart}
                                                className="btn btn-add-to-cart-gradient w-100 py-3 rounded-pill fw-semibold text-black  d-flex align-items-center justify-content-center gap-2"
                                            >
                                                <i className="fa-solid fa-bag-shopping fs-5"></i>
                                                <span>{cartItemInStore ? `In Cart (${cartItemInStore.qnty})` : 'Add to Cart'}</span>
                                            </button>
                                        </div>

                                        <div className="col-sm-6 col-12">
                                            <Link
                                                to="/cart"
                                                onClick={handleAddToCart}
                                                className="btn btn-buy-now-dark w-100 py-3 rounded-pill fw-semibold text-white text-decoration-none d-flex align-items-center justify-content-center gap-2"
                                            >
                                                <i className="fa-solid fa-bolt text-warning fs-5"></i>
                                                <span>Buy Now</span>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Trust Micro Badges Bar */}
                                    <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 pt-2 border-top text-secondary small">
                                        <span className="d-inline-flex align-items-center">
                                            <i className="fa-solid fa-shield-check text-success me-1"></i> In Stock & Ready to Ship
                                        </span>
                                        <span className="d-inline-flex align-items-center">
                                            <i className="fa-solid fa-truck-fast text-indigo me-1"></i> Free Express Shipping
                                        </span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Reviews Section */}
                    {productItem.reviews && productItem.reviews.length > 0 && (
                        <div className="mt-5 pt-4 border-top">
                            <div className="d-flex align-items-center justify-content-between mb-4">
                                <div>
                                    <h3 className="fw-bold text-dark m-0">Verified Customer Reviews</h3>
                                    <p className="text-secondary small m-0">What real buyers think about this product</p>
                                </div>
                                <span className="badge bg-warning bg-opacity-20 text-dark border border-warning fs-6 px-3 py-2 rounded-pill">
                                    <i className="fa-solid fa-star text-warning me-1"></i> {productItem.rating || '4.5'} Average Rating
                                </span>
                            </div>

                            <div className="row g-3">
                                {productItem.reviews.map((review, index) => (
                                    <div className="col-lg-4 col-md-6" key={index}>
                                        <div className="review-card-modern p-4 bg-white rounded-4 border shadow-sm h-100">
                                            <div className="d-flex align-items-center gap-3 mb-3">
                                                <div className="reviewer-avatar-circle">
                                                    {review.reviewerName ? review.reviewerName.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <h6 className="m-0 fw-bold text-dark">{review.reviewerName || 'Anonymous'}</h6>
                                                    <small className="text-success fw-medium">
                                                        <i className="fa-solid fa-circle-check me-1"></i> Verified Purchase
                                                    </small>
                                                </div>
                                            </div>

                                            <div className="text-warning small mb-2">
                                                {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                            </div>

                                            <p className="text-secondary small leading-relaxed mb-3">"{review.comment}"</p>
                                            <small className="text-muted d-block mt-auto">
                                                {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default CardDetails;
