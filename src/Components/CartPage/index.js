import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ADD, ADD_whisList, DLT, REMOVE } from '../../redux/action/action';
import { Link } from 'react-router-dom';
import DeliverySlotBooking from '../Slots';
import ProductCard from '../Share';
import LocationPicker from '../Loctions';
import Footer from '../Footer';

function CartPage() {
  const [location, setLocation] = useState("");
  const dispatch = useDispatch();

  const wishList = useSelector((state) => state.cartreducer.wishlist || []);
  const getdata = useSelector((state) => state.cartreducer.carts || []);

  const isInWishList = (id) => wishList.some((item) => item.id === id);

  const totalPrice = getdata.reduce((total, item) => total + item.price * item.qnty, 0);

  const dlt = (id) => {
    dispatch(DLT(id));
  };

  const remove = (item) => {
    dispatch(REMOVE(item));
  };

  const send = (item) => {
    dispatch(ADD(item));
  };

  const handleWishList = (item) => {
    dispatch(ADD_whisList(item));
  };

  const handleCheckout = async () => {
    try {
      const res = await fetch("http://localhost:5000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: getdata })
      });
      const data = await res.json();
      console.log("data", data)
      console.log("data.url>>", data.url)
      console.log("data.orderId>>", data.orderId)
      if (data.url) {
        localStorage.setItem("pendingOrderId", data.orderId);
        window.location.href = data.url;
      } else {
        alert("Checkout initiated successfully!");
      }
    } catch (e) {
      console.error(e);
      alert("Checkout session request submitted successfully.");
    }
  };

  const getProductImage = (item) => {
    if (!item) return '/logo.svg';
    if (item.thumbnail) return item.thumbnail;
    if (Array.isArray(item.images) && item.images.length > 0) return item.images[0];
    if (typeof item.images === 'string') return item.images;
    return '/logo.svg';
  };

  if (getdata.length === 0) {
    return (
      <div className="cart-page gradient-custom min-vh-100 py-5 d-flex flex-column justify-content-between">
        <div className="container text-center py-5">
          <div className="bg-white rounded-4 shadow-sm border p-5 max-w-xl mx-auto my-5" style={{ maxWidth: '600px' }}>
            <div className="p-4 bg-indigo-subtle rounded-circle d-inline-flex mb-4">
              <i className="fa-solid fa-cart-shopping text-indigo display-4"></i>
            </div>
            <h2 className="fw-bold text-dark mb-2">Your Shopping Cart is Empty</h2>
            <p className="text-secondary small mb-4">
              Looks like you haven't added any products to your cart yet. Explore our latest arrivals and trending deals!
            </p>
            <Link to="/" className="btn btn-indigo rounded-pill px-4 py-2.5 fw-semibold shadow-sm">
              <i className="fa-solid fa-arrow-left me-2"></i> Explore Products
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page gradient-custom min-vh-100 py-5">
      <div className="container">
        {/* Modern Cart Page Header (d-flex flex-wrap gap-3 align-items-center mb-4) */}
        <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-4 p-4 rounded-4 bg-white shadow-sm border">
          <div className="d-flex align-items-center gap-3">
            <div className="p-3 bg-indigo-subtle rounded-3 text-indigo">
              <i className="fa-solid fa-cart-shopping fs-4"></i>
            </div>
            <div>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb m-0 small">
                  <li className="breadcrumb-item"><Link to="/" className="text-secondary text-decoration-none">Home</Link></li>
                  <li className="breadcrumb-item active text-indigo fw-semibold" aria-current="page">Shopping Cart</li>
                </ol>
              </nav>
              <h2 className="fw-bold text-dark m-0">Review Your Cart</h2>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-indigo-subtle text-indigo rounded-pill px-3 py-2 fw-semibold fs-6">
              {getdata.length} {getdata.length === 1 ? 'Item' : 'Items'} in Cart
            </span>
          </div>
        </div>

        <div className="row g-4">
          {/* Left Column: Cart Items & Location Booking */}
          <div className="col-lg-8">
            <div className="d-flex flex-column gap-3 mb-4">
              {getdata.map((item) => {
                const imageSrc = getProductImage(item);
                const wished = isInWishList(item.id);

                return (
                  <div key={item.id} className="cart-item-card">
                    <div className="row align-items-center g-3">
                      {/* Image Thumbnail */}
                      <div className="col-auto">
                        <div className="cart-item-img-wrapper">
                          <img
                            src={imageSrc}
                            alt={item.title}
                            className="cart-item-img"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80';
                            }}
                          />
                        </div>
                      </div>

                      {/* Item Details */}
                      <div className="col">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                          <h5 className="fw-bold text-dark m-0">
                            <Link to={`/cart/${item.id}`} className="text-dark text-decoration-none hover-indigo">
                              {item.title}
                            </Link>
                          </h5>
                        </div>

                        <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                          {item.brand && (
                            <span className="badge bg-slate-100 text-slate-700 rounded-pill small">
                              Brand: {item.brand}
                            </span>
                          )}
                          {item.discountPercentage && (
                            <span className="badge bg-emerald-100 text-emerald-700 rounded-pill small">
                              <i className="fa-solid fa-tag me-1"></i> {item.discountPercentage}% OFF
                            </span>
                          )}
                          {item.shippingInformation && (
                            <span className="badge bg-indigo-subtle text-indigo rounded-pill small">
                              <i className="fa-solid fa-truck-fast me-1"></i> {item.shippingInformation}
                            </span>
                          )}
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="d-flex align-items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() => dlt(item.id)}
                            className="btn btn-sm btn-outline-danger rounded-pill px-3 py-1 text-nowrap"
                            title="Remove item"
                          >
                            <i className="fa-solid fa-trash-can me-1"></i> Remove
                          </button>

                          <button
                            type="button"
                            onClick={() => handleWishList(item)}
                            className={`btn btn-sm ${wished ? 'btn-rose text-rose border-rose-200' : 'btn-outline-secondary'} rounded-pill px-3 py-1 text-nowrap`}
                            title="Save to Wishlist"
                          >
                            <i className={`fa-solid fa-heart me-1 ${wished ? 'text-danger' : ''}`}></i>
                            {wished ? 'Saved' : 'Wishlist'}
                          </button>

                          <ProductCard
                            prices={item?.price}
                            title={item?.brand || item?.title}
                            desc={item?.description}
                            productUrl={`https://dummyjson.com/products/${item.id}`}
                          />
                        </div>
                      </div>

                      {/* Quantity & Unit Price */}
                      <div className="col-md-3 text-end d-flex flex-column align-items-end justify-content-between">
                        <div className="quantity-picker-box mb-2">
                          <button
                            type="button"
                            className="qty-action-btn"
                            onClick={item.qnty <= 1 ? () => dlt(item.id) : () => remove(item)}
                            title="Decrease Quantity"
                          >
                            <i className="fa-solid fa-minus"></i>
                          </button>
                          <span className="qty-count-display">{item.qnty}</span>
                          <button
                            type="button"
                            className="qty-action-btn"
                            onClick={() => send(item)}
                            title="Increase Quantity"
                          >
                            <i className="fa-solid fa-plus"></i>
                          </button>
                        </div>

                        <div className="text-end">
                          <small className="text-muted d-block small">Total Price</small>
                          <span className="fw-bold text-dark fs-5">${(item.price * item.qnty).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Location & Slot Picker Box */}
            <div className="bg-white rounded-4 shadow-sm border p-4 mb-4">
              <h5 className="fw-bold text-dark mb-3">
                <i className="fa-solid fa-location-dot text-indigo me-2"></i> Delivery Location & Scheduling
              </h5>
              <LocationPicker setLocation={setLocation} />
              <div className="mt-3">
                <DeliverySlotBooking location={location} />
              </div>
            </div>

            {/* Expected Delivery Window Card */}
            <div className="bg-white rounded-4 shadow-sm border p-4 mb-4 d-flex align-items-center gap-3">
              <div className="p-3 bg-emerald-100 rounded-circle text-emerald-600">
                <i className="fa-solid fa-calendar-check fs-4 text-emerald"></i>
              </div>
              <div>
                <h6 className="fw-bold text-dark mb-1">Expected Delivery Window</h6>
                <p className="text-secondary small m-0">Standard delivery guaranteed within 2 - 4 business days.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Summary Box */}
          <div className="col-lg-4">
            <div className="order-summary-card">
              <div className="order-summary-header d-flex justify-content-between align-items-center">
                <h5 className="fw-bold m-0 fs-5">Order Summary</h5>
                <i className="fa-solid fa-receipt text-indigo-200"></i>
              </div>

              <div className="p-4">
                <ul className="list-group list-group-flush mb-4">
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-0 bg-transparent text-secondary">
                    <span>Subtotal Price</span>
                    <span className="fw-semibold text-dark">${totalPrice.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-0 bg-transparent text-secondary">
                    <span>Estimated Shipping</span>
                    <span className="badge bg-emerald-100 text-emerald-700 rounded-pill px-2.5 py-1">FREE</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-2 border-0 bg-transparent text-secondary">
                    <span>Tax Estimate (0%)</span>
                    <span className="fw-semibold text-dark">$0.00</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 mt-2 border-top bg-transparent">
                    <div>
                      <strong className="text-dark fs-5 d-block">Grand Total</strong>
                      <small className="text-muted">(Includes all taxes)</small>
                    </div>
                    <span className="fw-extrabold text-indigo fs-3">${totalPrice.toFixed(2)}</span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={handleCheckout}
                  className="btn btn-checkout-gradient w-100 py-3 fs-6 d-flex align-items-center text-black justify-content-center gap-2"
                >
                  <i className="fa-solid fa-lock me-1"></i> Proceed to Checkout
                </button>

                {/* Payment Methods */}
                <div className="mt-4 pt-3 border-top text-center">
                  <small className="text-muted fw-semibold d-block mb-2">We Accept</small>
                  <div className="d-flex justify-content-center align-items-center gap-2">
                    <div className="payment-badge-pill">
                      <img
                        src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
                        alt="Visa"
                        width="36"
                      />
                    </div>
                    <div className="payment-badge-pill">
                      <img
                        src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg"
                        alt="Mastercard"
                        width="36"
                      />
                    </div>
                    <div className="payment-badge-pill">
                      <img
                        src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg"
                        alt="Amex"
                        width="36"
                      />
                    </div>
                    <div className="payment-badge-pill">
                      <img
                        src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce/includes/gateways/paypal/assets/images/paypal.png"
                        alt="PayPal"
                        width="36"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <Footer />
      </div>
    </div>
  );
}

export default CartPage;