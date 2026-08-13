import React from 'react'
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
 
function WishList() {
    const wishList  = useSelector((state)=> state.cartreducer.wishlist);
  return (
    <div>
        <div className="container">
        <h2 className="text-center mb-4 mt-4 pb-5 ">Wishlist Page</h2>
         <div className="row"> 
          {
            wishList?.map((item,id)=>{
              
              return (
                <>
                  
                 <Card key= {id} style={{ width: '18rem',marginRight:10,marginBottom:10 }}>
                 <div className="d-flex align-items-center justify-content-between">
                   {/* <i  id="basic-button"
                     onClick={()=>handleWishList(item)}
                    aria-haspopup="true"
                   className={`${isInWishList(item.id) ? "text-danger" : "text-dark"} fa-sharp fa-solid fa-heart`} style={{fontSize: 25,cursor:"pointer"}}></i>
                   <Badge  badgeContent={item.availabilityStatus} color={item.availabilityStatus === "In Stock" ? "success" : "error"}>
                    
                </Badge> */}
                  
                 </div>
                    <div className="card-image-wrap">
                      <Card.Img variant="top" src={item.images} />
                    </div>
                  <Card.Body>
                    <Card.Title> <li key={item.id}><Link className="underline-none" to={`/cart/${item.id}`}>{item.title}</Link></li></Card.Title>
                    <Card.Text>
                      <label>Price: ₹{item?.price}</label>
                      <br/>
                      <label>{item?.address}</label>
                    </Card.Text>

                    
                    {/* <Button onClick={()=>send(item)}  variant="primary">Add to Cart</Button> */}
                  </Card.Body>
                   
                 
                </Card>         
                </>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default WishList