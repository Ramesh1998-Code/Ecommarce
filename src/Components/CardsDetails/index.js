import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { DLT, ADD, REMOVE } from '../../redux/action/action';

function CardDetails() {
    const { id } = useParams();
    const [data, setData] = useState([]);
    const getdata = useSelector((state) => state.cartreducer.carts);
    const dispatch = useDispatch();
    const compare = () => {
        let comparedata = getdata?.filter((item) => {
            return item.id ===id
        });
        setData(comparedata);
    }

    const history = useNavigate();


    const send = (item) => {
        dispatch(ADD(item));
    }


    const dlt = (id) => {

        dispatch(DLT(id));
        history("/")
    }

    const remove = (item) => {
        dispatch(REMOVE(item))
    }

    async function singleProduct() {
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        const data = await response.json();
        setData([data]);
    }

    useEffect(() => {
        singleProduct();
    }, [])



    useEffect(() => {
        compare();
    }, [id])


    return (
        <div className='container mt-4'>
            <h2 className='text-center mb-5'>Item Details Page</h2>
            <section className='conatiner mt-3'>
                <div className='items-details '>

                    {
                        data.map((item) => {
                            return (
                                <>
                                    <div>
                                        <div className='img-section'>
                                            <img src={item?.images} alt="items" />
                                        </div>

                                        <div className='thubnail-img'>
                                            <img src={item?.thumbnail} alt="items" />
                                        </div>
                                    </div>
                                    <div className='info-section'>
                                        <Table>
                                            <tr>
                                                <td>
                                                    <p>
                                                        <strong>Restaurant</strong> : {item.title}
                                                    </p>
                                                    <p>
                                                        <strong>Price</strong> :{item?.price}
                                                    </p>
                                                    <p>
                                                        <strong>Available</strong> :{item?.availabilityStatus}
                                                    </p>

                                                    {/* <p>
                        <strong>Total</strong> :{item?.price * item.qnty}
                    </p> */}
                                                    <div className='qty-btn mt-5 d-flex justify-content-center align-items-center' style={{ width: 100, cursor: 'pointer' }}>
                                                        <button className='button ' onClick={item.qnty <= 1 ? () => dlt(item.id) : () => remove(item)} style={{ fontSize: 24 }}>-</button>
                                                        <input type="number" value={item.qnty} style={{ width: 40, textAlign: 'center' }} />
                                                        <button className='button' onClick={() => send(item)} style={{ fontSize: 24 }}>+</button>
                                                    </div>
                                                </td>
                                                <td>
                                                    <p>
                                                        <strong>Rating:<span> {item?.rating}</span></strong>
                                                    </p>
                                                    <p>
                                                        <strong>returnPolicy:<span> {item?.returnPolicy}</span></strong>
                                                    </p>

                                                    <p>
                                                        <strong> shipping Information:<span> {item?.shippingInformation} </span></strong>
                                                    </p>
                                                    <p>
                                                        <strong>Remove:<span> <i onClick={() => dlt(item.id)} className='fas fa-trash' style={{ color: 'red', cursor: "pointer" }}></i></span></strong>
                                                    </p>
                                                </td>
                                            </tr>
                                        </Table>


                                    </div>

                                </>
                            )
                        })
                    }

                </div>
            </section>
            <div className='mt-5'>
                {
                    data[0]?.reviews?.length > 0 && <h1 className='mb-5'>Review Section</h1>
                }
                <div className='d-flex gap-4'>
                    {data[0]?.reviews?.map((review, index) => (
                        <div key={index} className="review-card">
                            <p><strong>{review.reviewerName}</strong></p>
                            <p>{"⭐".repeat(review.rating)}</p>
                            <p>{review.comment}</p>
                            <small>{new Date(review.date).toDateString()}</small>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CardDetails