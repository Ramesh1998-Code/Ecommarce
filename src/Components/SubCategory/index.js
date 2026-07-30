import React, { use, useEffect, useState } from 'react'
import {  Button, Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import  { ADD } from '../../redux/action/action';
import Badge from '@mui/material/Badge';
function SubCategory() {
   const { slug } = useParams();
   const [products,setProducts] =  useState([]);
   const [loading,setLoading] = useState(false);

   useEffect(()=>{
    fetch(`https://dummyjson.com/products/category/${slug}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
   },[slug])
       const dispatch = useDispatch();

       const send = (item)=>{
   
         dispatch(ADD(item)); 
       }


        const getdata = useSelector((state)=> state.cartreducer.carts);

       const isInCart = (id=> {
         return getdata.some((item)=> item.id === id);
       })

  if (loading) return <p>Loading...</p>;
  return (
    <div>
          <div className="container">
      <h2 className="mb-4 mt-4 text-capitalize">{slug}</h2>

      <div className="row mt-4">
        {
          products.map(item => (
             
              <>
                  
                 <Card style={{ width: '18rem',marginRight:10,marginBottom:10 }}>
                    <Badge  badgeContent={item.availabilityStatus} color={item.availabilityStatus === "In Stock" ? "success" : "error"}>
                    <i  id="basic-button"
                  
                    aria-haspopup="true"
                   className="fa-sharp fa-solid fa-cart-shopping text-light" style={{fontSize: 25,cursor:"pointer"}}></i>
                </Badge>
                    <Card.Img variant="top" src={item.images} />
                  <Card.Body>
                    <Card.Title>{item?.title}</Card.Title>
                    <Card.Text>
                      <label>Price: ₹{item?.price}</label>
                      <br/>
                      <label>{item?.address}</label>
                    </Card.Text>

                     {
                        isInCart(item.id) ? (
                            <Button disabled>Added to Cart</Button>
                        ) : (
                            <Button onClick={() => send(item)}>Add to Cart</Button>
                        )
                        }
                    {/* <Button onClick={()=>send(item)}  variant="primary">Add to Cart</Button> */}
                  </Card.Body>
                   
                 
                </Card>         
                </>
          ))
        }
      </div>
    </div>
    </div>
  )
}

export default SubCategory