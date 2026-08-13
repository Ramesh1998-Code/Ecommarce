import React, { useEffect, useRef, useState } from "react";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useDispatch, useSelector } from "react-redux";
import { ADD, ADD_whisList } from '../../redux/action/action';
import Badge from '@mui/material/Badge';
import { Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Loader from "react-js-loader";
import ReactPaginate from "react-paginate";
import Barcode from "react-barcode";
function Cards({ product = [] }) {
  const notify = () => toast("Product added to cart!", {
    theme: "dark",
  });
   const AddWishlist = () => toast("Product added to wishlist!", {
    theme: "dark",
  });


  const RemoveWishlist = () => toast("Product removed from wishlist!", {
    theme: "dark",
  });

  
  const productss = useSelector(
    (state) => state.product?.products || []
  );

  const productsToShow = product?.length ? product : productss;
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 8;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = productsToShow.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(productsToShow.length / itemsPerPage);

  useEffect(() => {
    setItemOffset(0);
  }, [productsToShow]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % productsToShow.length;
    setItemOffset(newOffset);
  }


  const handleWishList = (item) => {
   
    const exists = isInWishList(item.id);
    dispatch(ADD_whisList(item));
    if(exists){
      RemoveWishlist();
    }else {
      AddWishlist();
    }
    
  }


  const getdata = useSelector((state) => state.cartreducer.carts);

  const wishList = useSelector((state) => state.cartreducer.wishlist);



  const isInCart = (id => {
    return getdata.some((item) => item.id === id);
  })


  const dispatch = useDispatch();

  const send = (item) => {
    dispatch(ADD(item));
    notify();
  }

  const isInWishList = (id) => {
    return wishList?.some((item) => item.id === id);
  }



  return (
    <div >

      <ToastContainer theme="light" />
      <div className="container mb-4 mt-5 pt-5 pb-5">
        {
          currentItems?.length <= 0 && (
            <Loader type="spinner-default" bgColor={"orange"} color={"#ffffff"} title={"spinner-default"} size={100} />
          )
        }
        <div className="row d-flex align-items-center justify-content-start">
          {
            currentItems?.map((item, id) => {
              const added = isInCart(item.id);

              return (
                <>

                  <Card key={id} style={{ width: '18rem', marginRight: 10, marginBottom: 10 }}>
                    <div className="d-flex align-items-center justify-content-between">
                      <i id="basic-button"
                        onClick={() => handleWishList(item)}
                        aria-haspopup="true"
                        className={`${isInWishList(item.id) ? "text-danger" : "text-dark"} fa-sharp fa-solid fa-heart`} style={{ fontSize: 25, cursor: "pointer" }}></i>
                      <Badge badgeContent={item.availabilityStatus} color={item.availabilityStatus === "In Stock" ? "success" : "error"}>

                      </Badge>

                    </div>
                    <div className="card-image-wrap">
                      <Card.Img variant="top" src={item.images} />
                    </div>
                    <Card.Body>
                      <Card.Title> <li key={item.id}><Link className="underline-none" to={`/cart/${item.id}`}>{item.title}</Link></li></Card.Title>
                      <Card.Text>
                        <label>Price: ₹{item?.price}</label>
                        <br />
                        <label>{item?.address}</label>
                      </Card.Text>
                      <div className="barcode-section mb-3">
                        <Barcode value={item?.meta?.barcode} />

                      </div>
                      {
                        added ? <Button onClick={() => send(item)} variant="primary" disabled>Added to Cart</Button> : <Button onClick={() => send(item)} variant="primary">Add to Cart</Button>
                      }

                      {/* <Button onClick={()=>send(item)}  variant="primary">Add to Cart</Button> */}
                    </Card.Body>


                  </Card>
                </>
              )
            })
          }
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next >"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="< Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          activeClassName="active"
        />
      </div>

    </div>
  );
}

export default Cards;
