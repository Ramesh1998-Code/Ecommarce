import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ADD, ADD_whisList, DLT, REMOVE } from '../../redux/action/action';
import { useNavigate, useParams } from 'react-router-dom';
import { loadStripe } from "@stripe/stripe-js";
import DeliverySlotBooking from '../Slots';
import ProductCard from '../Share';
import LocationPicker from '../Loctions';
const stripePromise = loadStripe("pk_test_51SzY7811MKIvxiNzwhKMUsrTZ27ppiqsa5FoIxlH3NNS4WDy49UzsZ9NEx3wntA98uwsjNB7GqhAcJyMZw63tyZ000uH3tmpOl"); 
function CartPage() {
     const [location, setLocation] = useState("");
    const isInWishList = (id) => {
    return wishList?.some((item) => item.id === id);
  }
 const wishList = useSelector((state) => state.cartreducer.wishlist);

 const getdata = useSelector(
  (state) => state.cartreducer.carts
);

 
  const dispatch = useDispatch();
   
    const totalPrice = getdata.reduce((total, item) => total + item.price * item.qnty, 0);
    const dlt = (id)=>{
    dispatch(DLT(id));
    }
    const remove =(item)=>{
        dispatch(REMOVE(item))
    }
    const send = (item)=>{
        dispatch(ADD(item)); 
    }

 
  const handleCheckout = async () => {
    const res = await fetch("http://localhost:5000/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems: getdata })
    });

    const data = await res.json();

    window.location.href = data.url;
  };

  if(getdata.length === 0){
    return (
      <div>
        <h2 style={{textAlign:'center',marginTop:'50px'}}>Your Cart is Empty</h2>
      </div>
    )
  }


  const handleWishList = (item) => {
    // if(wishList.some((wishItem)=> wishItem.id === item.id)){
    //   setWishList(wishList.filter((wishItem)=> wishItem.id !== item.id));
    //   setIsWishListOpen(!isWishListOpen);
    // }else{
    //   setWishList([...wishList,item]);
    // }

    dispatch(ADD_whisList(item));
    

  }
    
 


  return (
    
    <div>
  <section class="h-100 gradient-custom cart-page">
  <div class="container py-5">
    <div class="row d-flex justify-content-center my-4">
      <div class="col-md-8">
        <div class="card mb-4">
          <div class="card-header py-3">
            <h5 class="mb-0">Cart - {getdata?.length} items</h5>
          </div>
          <div class="card-body">
           

           {
            getdata?.map((item,index)=>(
               <div class="row">
              <div class="col-lg-3 col-md-12 mb-4 mb-lg-0">
               
                <div class="bg-image hover-overlay hover-zoom ripple rounded" data-mdb-ripple-color="light">
                  <img src={item?.images}
                    class="w-100" alt="Blue Jeans Jacket" />
                  <a href="#!">
                    <div class="mask" style={{backgroundColor: 'rgba(251, 251, 251, 0.2)'}}></div>
                  </a>
                </div>
               
              </div>

              <div class="col-lg-5 col-md-6 mb-4 mb-lg-0">
                
                <p><strong>{item.title}</strong></p>
                <p>Brand: {item.brand}</p>
                <p>Discount: {item.discountPercentage}%</p>
                <p>Shipping: {item.shippingInformation}</p>
              <div className='d-flex justify-content-center gap-2'>
                  <button onClick={()=>dlt(item.id)}  type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-sm me-1 mb-2 trash-btn" data-mdb-tooltip-init
                  title="Remove item">
                  <i  class="fas fa-trash"></i>
                </button>
                <button  type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-danger btn-sm mb-2 heart-btn" data-mdb-tooltip-init
                  title="Move to the wish list">
                  <i id="basic-button"
                        onClick={() => handleWishList(item)}
                        aria-haspopup="true"
                        className={`${isInWishList(item.id) ? "text-danger" : "text-dark"} fas fa-heart`} style={{ fontSize: 25, cursor: "pointer" }}></i>
                </button>
               <ProductCard prices={item?.price} title={item.brand} desc={item?.description}  productUrl={`https://dummyjson.com/products/${item.id}`} />
              </div>
              </div>

              <div class="col-lg-4 col-md-6 mb-4 mb-lg-0">
               
                <div class="d-flex mb-4" style={{maxWidth: '300px'}}>
                  <button onClick={item.qnty <=1 ?()=>dlt(item.id) : ()=>remove(item)} data-mdb-button-init data-mdb-ripple-init class="btn qty-btn btn-primary px-3 me-2"
                    onclick="this.parentNode.querySelector('input[type=number]').stepDown()">
                    <i class="fas fa-minus"></i>
                  </button>

                  <div data-mdb-input-init class="form-outline">
                    <input id="form1" min="0" name="quantity" value={item.qnty} type="number" class="form-control" />
                    <label class="form-label" for="form1">Quantity</label>
                  </div>

                  <button onClick={()=>send(item)} data-mdb-button-init data-mdb-ripple-init class="btn qty-btn btn-primary px-3 ms-2"
                    onclick="this.parentNode.querySelector('input[type=number]').stepUp()">
                    <i class="fas fa-plus"></i>
                  </button>

                 
                </div>
               

                
                <p class="text-start text-md-center">
                  <strong>${item.price * item.qnty}</strong>
                </p>
              
              </div>
            </div>
            ))
           }
            
           
            
            <hr class="my-4" />
            
          </div>
           <LocationPicker setLocation={setLocation} />
           <div className='d-flex justify-content-center'><DeliverySlotBooking location={location} /></div>
        </div>
        <div class="card mb-4">
          <div class="card-body">
            <p><strong>Expected shipping delivery</strong></p>
            <p class="mb-0">12.10.2020 - 14.10.2020</p>
          </div>
        </div>
        <div class="card mb-4 mb-lg-0">
          <div class="card-body">
            <p><strong>We accept</strong></p>
            <img class="me-2" width="45px"
              src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg"
              alt="Visa" />
            <img class="me-2" width="45px"
              src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg"
              alt="American Express" />
            <img class="me-2" width="45px"
              src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg"
              alt="Mastercard" />
            <img class="me-2" width="45px"
              src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce/includes/gateways/paypal/assets/images/paypal.png"
              alt="PayPal acceptance mark" />
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card mb-4">
          <div class="card-header py-3">
            <h5 class="mb-0">Summary</h5>
          </div>
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li
                class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                Products
                <span>{totalPrice}</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                Shipping
                <span>Gratis</span>
              </li>
              <li
                class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                <div>
                  <strong>Total amount</strong>
                  <strong>
                    <p class="mb-0">(including VAT)</p>
                  </strong>
                </div>
                <span><strong>${totalPrice}</strong></span>
              </li>
            </ul>

            <button  onClick={handleCheckout}  type="button" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-lg btn-block">
              Go to checkout
            </button>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</section>

    </div>
  )
}

export default CartPage