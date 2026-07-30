import React, { useEffect, useState } from 'react'
import NewsCategory from '../NewsCategory'
import Cards from '../Card';
import { useDispatch, useSelector } from "react-redux";
import Loader from "react-js-loader";
function Category() {
  const [data, setData] = useState([])
  const [product, setProduct] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [maxPrice, setMaxPrice] = useState(2000);
  async function productsCategory() {
    const response = await fetch('https://dummyjson.com/products/categories');
    const data = await response.json();
    setData(data);
  }

  //  async function products() {
  //   const response = await fetch('https://dummyjson.com/products');
  //   const data = await response.json();

  //   setProduct(data?.products || []);
  // }

  useEffect(() => {
    productsCategory();
  }, [])


  if(data.length === 0) {
    return (
       <Loader type="spinner-default" bgColor={"orange"} color={"#ffffff"} title={"spinner-default"} size={100} />
    )
  }

  return (
    <div className='container '>
    <div className='row'>
      <div className='col-md-3  mb-4 mt-5 pt-5 pb-5'>
        <h1 className="text-left">Filter</h1>
        
        <NewsCategory data={data} />
      </div>
      <div className='col-md-9'>
        <Cards product={product} />
      </div>
    </div>
  </div>    

  )
}

export default Category