import logo from './logo.svg';
import './App.css';
import Pdf from './Pdf';
import Table from './Components/Table';
import Header from './Components/Header.js';
import { Routes,Route } from 'react-router-dom';
import CardDetails from './Components/CardsDetails';
import Card from './Components/Card/index.js';
import Home from './Components/Home/index.js';
import Category from './Components/Category/index.js';
import SubCategory from './Components/SubCategory/index.js';
import CartPage from './Components/CartPage/index.js';
import Success from './Components/Success/index.js';
import Cancel from './Components/Cancel/index.js';
import WishList from './Components/Wishlist/index.js';
import Login from './Components/Login/index.js';
import MyAccount from './Components/MyAccount/index.js';
import Vendor from './Components/Vendor/index.js';


function App() {
  return (
    <div className="App">
     {/* <Pdf />
     <Card /> */}
     {/* <Table /> */}
     <Header />
     <Routes>
      <Route path='/card' element={<Card />} />
      <Route path='/' element={<Home />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/wishlist' element={<WishList />} />
      <Route path='/category' element={<Category />} />
       <Route path='/cart/:id' element={<CardDetails />} />
       <Route path='/subcategory/:slug' element={<SubCategory />} />
       <Route path="/success" element={<Success />} />
       <Route path="/cancel" element={<Cancel />} />
       <Route path="/login" element={<Login />} />
       <Route path="/myaccount" element={<MyAccount />} />
       <Route path="/vendor" element={<Vendor />} />
        
     </Routes>    
    </div>
  );
}

export default App;
