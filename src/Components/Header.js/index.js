import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link, NavLink } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { useDispatch, useSelector } from 'react-redux';
import Table from 'react-bootstrap/Table';
import { DLT } from '../../redux/action/action';
import TopHeader from '../TopHeader/index.js';
import { useAuth0 } from "@auth0/auth0-react";

function Header() {
  const getdata = useSelector((state) => state.cartreducer.carts || []);
  const [price, setPrice] = useState(0);
  const [userAnchor, setUserAnchor] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const openUser = Boolean(userAnchor);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserClick = (event) => {
    setUserAnchor(event.currentTarget);
  };

  const handleUserClose = () => {
    setUserAnchor(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setUserAnchor(null);
  };

  const dlt = (id) => {
    dispatch(DLT(id));
  };

  const calculateTotal = () => {
    let totalPrice = 0;
    getdata.forEach((item) => {
      totalPrice += item.price * item.qnty;
    });
    setPrice(totalPrice);
  };

  useEffect(() => {
    calculateTotal();
  }, [getdata]);

  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();

  return (
    <div className="header-master-wrapper">
      <TopHeader />

      <Navbar className="main-navbar" expand="lg" variant="dark">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-lg-none brand-mobile-title">
            T-Market
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar-nav" className="custom-nav-toggler" />

          <Navbar.Collapse id="main-navbar-nav">
            <Nav className="me-auto nav-links-container align-items-center">
              <NavLink
                to="/"
                className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}
              >
                Home
              </NavLink>
              <NavLink
                to="/card"
                className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}
              >
                Products
              </NavLink>
              <NavLink
                to="/category"
                className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}
              >
                Category
              </NavLink>
              <NavLink
                to="/vendor"
                className={({ isActive }) => isActive ? "nav-link-item active" : "nav-link-item"}
              >
                Vendor
              </NavLink>
            </Nav>
          </Navbar.Collapse>

          {/* Right Action Icons Group */}
          <div className="nav-actions-group">
            {/* Cart Icon Button */}
            <div
              className="action-icon-pill"
              onClick={handleClick}
              title="Shopping Cart"
              role="button"
              tabIndex={0}
            >
              <Badge
                badgeContent={getdata.length}
                color="secondary"
                sx={{
                  '& .MuiBadge-badge': {
                    backgroundColor: '#6366f1',
                    color: '#fff',
                    fontWeight: 700,
                    boxShadow: '0 0 8px rgba(99, 102, 241, 0.6)',
                  }
                }}
              >
                <i className="fa-solid fa-cart-shopping action-icon"></i>
              </Badge>
            </div>

            {/* Wishlist Link Icon */}
            <Link to="/wishlist" className="action-icon-pill wishlist-pill" title="Wishlist">
              <i className="fa-solid fa-heart action-icon heart-icon"></i>
            </Link>

            {/* User Account Button */}
            <div
              className="action-icon-pill user-pill"
              onClick={handleUserClick}
              title="Account Menu"
              role="button"
              tabIndex={0}
            >
              {isAuthenticated && user?.picture ? (
                <img src={user.picture} alt="User Avatar" className="user-avatar-img" />
              ) : (
                <i className="fa-solid fa-user action-icon"></i>
              )}
            </div>
          </div>

          {/* User Account MUI Menu */}
          <Menu
            id="user-menu"
            anchorEl={userAnchor}
            open={openUser}
            onClose={handleUserClose}
            PaperProps={{
              className: 'custom-mui-menu-paper',
              elevation: 4,
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <div className="menu-header-bar px-3 py-2 border-bottom d-flex justify-content-between align-items-center">
              <span className="fw-semibold text-dark small">
                {isAuthenticated ? `Hi, ${user?.given_name || user?.name || 'User'}` : 'Account Settings'}
              </span>
              <i onClick={handleUserClose} className="fas fa-xmark close-menu-btn"></i>
            </div>

            {isAuthenticated && (
              <MenuItem onClick={handleUserClose} component={Link} to="/myaccount" className="py-2">
                <i className="fa-solid fa-user-gear me-2 text-primary"></i> My Account
              </MenuItem>
            )}

            {!isAuthenticated && (
              <MenuItem
                onClick={() => {
                  handleUserClose();
                  loginWithRedirect({
                    authorizationParams: {
                      screen_hint: "signup",
                    },
                  });
                }}
                className="py-2"
              >
                <i className="fa-solid fa-user-plus me-2 text-success"></i> Register
              </MenuItem>
            )}

            {isAuthenticated ? (
              <MenuItem
                onClick={() => {
                  handleUserClose();
                  logout({ logoutParams: { returnTo: window.location.origin } });
                }}
                className="py-2 text-danger"
              >
                <i className="fa-solid fa-right-from-bracket me-2"></i> Logout
              </MenuItem>
            ) : (
              <MenuItem
                onClick={() => {
                  handleUserClose();
                  loginWithRedirect();
                }}
                className="py-2"
              >
                <i className="fa-solid fa-right-to-bracket me-2 text-indigo"></i> Login
              </MenuItem>
            )}
          </Menu>

          {/* Cart Dropdown MUI Menu */}
          <Menu
            id="cart-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              className: 'custom-mui-menu-paper cart-dropdown-paper',
              elevation: 5,
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <div className="cart-menu-container p-3">
              <div className="d-flex justify-content-between align-items-center pb-2 mb-2 border-bottom">
                <h6 className="m-0 fw-bold text-dark">
                  <i className="fa-solid fa-bag-shopping me-2 text-indigo"></i> Your Cart ({getdata.length})
                </h6>
                <i onClick={handleClose} className="fas fa-xmark close-menu-btn"></i>
              </div>

              {!getdata.length ? (
                <div className="text-center py-4 px-3">
                  <img width={60} src="/cart.gif" alt="empty cart" className="mb-3 opacity-75" />
                  <p className="fw-semibold text-secondary mb-3" style={{ fontSize: 15 }}>
                    Your Shopping Cart is Empty
                  </p>
                  <Link to="/card" onClick={handleClose} className="btn btn-sm btn-indigo px-3 rounded-pill">
                    Explore Products
                  </Link>
                </div>
              ) : (
                <div className="cart-items-preview-wrap">
                  <Table borderless size="sm" className="align-middle mb-2">
                    <thead>
                      <tr className="text-muted small border-bottom">
                        <th>Product</th>
                        <th className="text-center">Qty</th>
                        <th className="text-end">Price</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {getdata.map((item) => (
                        <tr key={item.id} className="cart-item-row">
                          <td style={{ minWidth: '160px' }}>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={item?.images || item?.thumbnail || '/logo.svg'}
                                alt={item.title}
                                className="cart-preview-img"
                              />
                              <div className="cart-item-title-text" title={item.title}>
                                <NavLink onClick={handleClose} to="/cart" className="text-decoration-none text-dark fw-semibold small">
                                  {item.title}
                                </NavLink>
                              </div>
                            </div>
                          </td>
                          <td className="text-center fw-medium small">x{item.qnty}</td>
                          <td className="text-end fw-semibold text-indigo small">${item.price * item.qnty}</td>
                          <td className="text-end ps-2">
                            <i
                              onClick={() => dlt(item.id)}
                              className="fas fa-trash-can text-danger cart-remove-icon"
                              title="Remove item"
                            ></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <div className="cart-menu-footer pt-3 mt-2 border-top">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted small fw-semibold">Subtotal:</span>
                      <span className="fw-bold text-dark fs-5">${Math.floor(price)}</span>
                    </div>
                    <Link
                      to="/cart"
                      onClick={handleClose}
                      className="btn btn-indigo-gradient w-100 py-2 rounded-3 text-center fw-semibold text-black d-block text-decoration-none"
                    >
                      View Cart & Checkout
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </Menu>
        </Container>
      </Navbar>
    </div>
  );
}

export default Header;
