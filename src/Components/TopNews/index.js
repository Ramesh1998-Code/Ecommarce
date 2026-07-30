import React from 'react'

function TopNews({product}) {

    const {products} = product;

    return (
        <div>
            <div className="top-news">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6 tn-left">
                        <div className="tn-img">
                            {/* <img height={100} width={100} src={products?.images} /> */}
                            <div className="tn-content">
                                <div className="tn-content-inner">
                                    {/* <a className="tn-date" href=""><i className="far fa-clock"></i>{products?.creationAt?.split("T")[0]}</a>
                                    <a className="tn-title" href="">{products[0]?.title}</a>
                                    */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 tn-right">
                        <div className="row">
                          {
                            products?.map((product,index)=>{
                                if(index > 0 && index < 5){ 
                                    return (
                                        <div className="col-md-6" key={index}>
                                            <div className="tn-img">        
                                                <img  src={product?.images}
                                                    onError={(e) => {
                                                    e.target.closest(".col-md-6").style.display = "none";
                                                    }}
                                                    alt="" />
                                                <div className="tn-content">
                                                    <div className="tn-content-inner">
                                                        <a className="tn-date" href=""><i className="far fa-clock"></i>{product?.publishedAt?.split("T")[0]}</a>
                                                        <a className="tn-title" href="">{product?.title}</a>
                                                    </div>
                                                </div>
                                            </div>  
                                        </div>
                                    )
                                }
                            })
                          }
                        </div>
                    </div>                      
                    </div>
                </div>
            </div>
          </div>
                )
            }

export default TopNews