
import React, { useEffect } from 'react'
import TopNews from '../TopNews'
import Cards from '../Card';

function Home() {
  // const getFlight = ()=>{
  //   fetch('http://localhost:5000/api/flights')
  //   .then((res)=>res.json())
  //   .then((data)=>{
  //     console.log("flights data",data)
  //   })
  // }
 const[product,setProduct] = React.useState([])
 const[categories,setCategories] = React.useState([])
 async function news() {
    const response = await fetch('https://dummyjson.com/products');
    const data = await response.json();
    setProduct(data);
  }


const category = async()=>{
  const response = await fetch('https://dummyjson.com/products/categories');
  const data = await response.json();
  setCategories(data);
}

  useEffect(()=>{
    news();
    category();
  },[])
  return (
    <div>
       <TopNews product={product}/>
       <header class="bg-dark py-5">
            <div class="container px-4 px-lg-5 my-5">
                <div class="text-center text-white">
                    <h1 class="display-4 fw-bolder">Easy Shop </h1>
                    <p class="lead fw-normal text-white-50 mb-0">With Tmarket</p>
                </div>
            </div>
        </header>
         <Cards product={product} />
          <footer class="py-5 bg-dark">
            <div class="container"><p class="m-0 text-center text-white">Copyright &copy; Your Website 2023</p></div>
        </footer>
    </div>
  )
}

export default Home