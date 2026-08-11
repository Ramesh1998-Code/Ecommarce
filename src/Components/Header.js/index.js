import React, { useEffect, useState } from 'react'
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
import AuthButtons from '../Auth/AuthButtons.jsx';
import { useAuth0 } from "@auth0/auth0-react";
import Login from '../Login/index.js';
function Header() {
    const getdata = useSelector((state)=> state.cartreducer.carts);
    const[price,setPrice] = useState(0)
    const [userAnchor, setUserAnchor] = useState(null);
    
    
     const [anchorEl, setAnchorEl] = useState(null);
     const dispatch = useDispatch();
  const open = Boolean(anchorEl);
  const openUser = Boolean(userAnchor);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

    const handleUserClose = () => {
     setUserAnchor(null);
    };

  const handleUserClick = (event) => {

  setUserAnchor(event.currentTarget);
};
  const handleClose = () => {
    setAnchorEl(null);
    setUserAnchor(null);
  };

  const dlt = (id)=>{
    dispatch(DLT(id));
  }

  const total = ()=>{
    let price = 0;
    getdata.map((item,k)=>{
        price = item.price * item.qnty + price;
    })

    setPrice(price);
  }

  useEffect(()=>{
    total();
  },[total])


  const loginuser =  localStorage.getItem("access_token");

  const { loginWithRedirect, logout, isAuthenticated, isLoading, user, error } = useAuth0();

 

  return (
    <div> 
      <TopHeader />
          <Navbar style={{height:"60px"}} bg="dark" data-bs-theme="dark">
        <Container>
          <NavLink to="/" className="text-decoration-none text-light ">Home</NavLink>
          <Nav className="">
            <NavLink to="/card" className="text-decoration-none text-light mx-3">Product</NavLink>
          </Nav>
          <Nav className="me-auto gap-2">
            <NavLink to="/category" className="text-decoration-none text-light ">Category</NavLink>
             <NavLink to="/vendor" className="text-decoration-none text-light">Vendor</NavLink>
             
          </Nav>
         

          
            <div className='d-flex gap-3'>
               <Badge badgeContent={getdata.length} color="success">
                <i  id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick} className="fa-sharp fa-solid fa-cart-shopping text-light" style={{fontSize: 25,cursor:"pointer"}}></i>
            </Badge>
               <Link to="/wishlist">
                <i className="fa-solid fa-heart text-light" style={{fontSize: 25,cursor:"pointer"}}></i>
               </Link>

                <i id="basic-menulist"
                aria-controls={open ? 'basic-menulist' : undefined}
                aria-haspopup="true"
                aria-expanded={openUser ? 'true' : undefined}
                onClick={handleUserClick} className="fa-solid fa-user text-light" style={{fontSize: 25,cursor:"pointer"}}></i>
                
            </div>

           <Menu
              id="user-menu"
              anchorEl={userAnchor}
              open={openUser}
              onClose={handleUserClose}
            >
               <i  onClick={handleClose} className='fas fa-close smallclose mb-2'></i>
               {isAuthenticated &&  <MenuItem className='mt-2' component={Link} to="/myaccount" >My Account</MenuItem> }
             


              {!isAuthenticated &&  <MenuItem onClick={() =>
                                loginWithRedirect({
                                    authorizationParams: {
                                        screen_hint: "signup",
                                    },
                                })
                      } className='' component={Link} to="/" >Register</MenuItem>}
             
              {
                isAuthenticated ? <MenuItem onClick={logout} >Logout</MenuItem> : <MenuItem onClick={handleClose}  onClick={() => loginWithRedirect()} component={Link} to="/">Login</MenuItem>
              }

            </Menu>

          <Menu
        id="basic-menus"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button',
          },
        }}
      >
       <div className='px-3 '>
        <i onClick={handleClose} className='fas fa-close smallclose'></i>
       
        <div className='d-flex py-4 align-items-center'>
        
        {!getdata.length ? <><p className='mb-0' style={{fontSize:18}}>  Your Cart is Empty</p>
        <img width={40} src='/cart.gif' alt="cart" /></>: <div className='card_details' style={{width:"24rem", padding:"10px"}}>
            <Table>
                <thead>
                    <tr>
                        <th>Photo</th>
                         <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {
                       getdata?.map((item)=>{
                        return (
                            <>
                            <tr>
                                <td>
                                   <NavLink  onClick={handleClose} to={`/cart`}><img src={item?.images} style={{width:"5rem",height:"5rem"}} /></NavLink> 
                                </td>
                                <td>
                                    <p>{item.title}</p>
                                    <p>Price: {item.price}</p>
                                    <p>Quantity: {item.qnty}</p>
                                     <p onClick={()=>dlt(item.id)} className=' d-sm-none d-block' style={{color:"red",fontSize:"20px",cursor:"pointer"}}><i className='fas fa-trash '></i></p>
                                </td>
                                <td style={{borderBottom:'none'}} className=' d-sm-block d-none'>
                                     <p onClick={()=>dlt(item.id)} style={{color:"red",fontSize:"20px",cursor:"pointer"}}><i className='fas fa-trash'></i></p>
                                </td>
                            </tr>
                            </>
                        )
                       }) 
                    }
                    <p className='text-center'>Total: {price}</p>
                </tbody>
            </Table>
            </div>}

        </div>
       </div>
          </Menu>
        </Container>
      </Navbar>
      
    </div>
  )
}

export default Header