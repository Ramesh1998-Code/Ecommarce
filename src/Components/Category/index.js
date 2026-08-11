import React, { useEffect, useMemo, useState } from 'react'
import NewsCategory from '../NewsCategory'
import Cards from '../Card';
import Loader from "react-js-loader";

function Category() {
  const [data, setData] = useState([])
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("");
  const [maxPrice, setMaxPrice] = useState(2000);
  const [loading, setLoading] = useState(true);

  async function productsCategory() {
    const response = await fetch('https://dummyjson.com/products/categories');
    const data = await response.json();
    setData(data);
  }

  async function fetchProducts() {
    setLoading(true);
    const response = await fetch('https://dummyjson.com/products?limit=100');
    const data = await response.json();
    setProducts(data?.products || []);
    setLoading(false);
  }

  useEffect(() => {
    productsCategory();
    fetchProducts();
  }, [])

  const filteredProducts = useMemo(() => {
    let result = products;

    if (selectedCategory !== "all") {
      result = result.filter((item) => item.category === selectedCategory);
    }

    result = result.filter((item) => item.price <= maxPrice);

    if (sortBy === "price-asc") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating-desc") {
      result = [...result].sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, selectedCategory, maxPrice, sortBy]);

  if (loading || data.length === 0) {
    return (
      <Loader type="spinner-default" bgColor={"orange"} color={"#ffffff"} title={"spinner-default"} size={100} />
    )
  }

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-3 mb-4 mt-5 pt-5 pb-5'>
          <h1 className="text-left">Filter</h1>

          <NewsCategory
            data={data}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <div className="mt-4">
            <h5>Max price: ₹{maxPrice}</h5>
            <input
              type="range"
              min={0}
              max={2000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="form-range"
            />
          </div>

          <div className="mt-4">
            <h5>Sort</h5>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating-desc">Rating: High to Low</option>
            </select>
          </div>
        </div>

        <div className='col-md-9'>
          <Cards product={filteredProducts} />
        </div>
      </div>
    </div>
  )
}

export default Category