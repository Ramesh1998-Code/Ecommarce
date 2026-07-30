import React, { useEffect } from 'react'
import logo from '../image/Tmarket-logo.png'
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/action/productAction';
import { Link } from 'react-router-dom';
function TopHeader() {

 const [searchResults, setSearchResults] = React.useState([]);
 const [searchText, setSearchText] = React.useState("");
    const handleSearch = (value)=>{
        setSearchText(value);

        if (!value) {
            setSearchResults([]);
            return;
        }
        const filtered = products.filter(item =>
                item.title.toLowerCase().includes(value.toLowerCase())
            );

     setSearchResults(filtered);
    }


  const dispatch = useDispatch();

  const products = useSelector(state => state?.product?.products);
    useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);



  

  return (
    <div>
        <div class="top-header">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-lg-3 col-md-4">
                        <div class="logo">
                            <a href="/">
                                <img src={logo} alt="Logo" />
                            </a>
                        </div>
                    </div>
                    <div class="col-lg-6 col-md-4">
                        <div class="search">
                            <input onChange={(e)=>handleSearch(e.target.value)} type="text" placeholder="Search" />
                            <button><i class="fa fa-search"></i></button>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-4">
                        <div class="social">
                            <a href=""><i class="fab fa-twitter"></i></a>
                            <a href=""><i class="fab fa-facebook"></i></a>
                            <a href=""><i class="fab fa-linkedin"></i></a>
                            <a href=""><i class="fab fa-instagram"></i></a>
                            <a href=""><i class="fab fa-youtube"></i></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

       {
  searchResults.length > 0 && (
    <div className="serach-box-wrap">
      <ul>
        <li>
          Search Result for <b>{searchText}</b>
        </li>

        {
          searchResults.map(item => (
            <li key={item.id}><Link to={`/subcategory/${item.category}`}>{item.title}</Link></li>
          ))
        }
      </ul>
    </div>
  )
}
    </div>
  )
}

export default TopHeader