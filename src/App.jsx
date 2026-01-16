import React from 'react'
import { Routes, Route } from "react-router-dom";
import Data from './components/Data';
import OtpPage from './components/OtpPage';
import Login from './components/Login';
import OtpVerifying from './components/OtpVerifying';
import Dashboard from './components/Dashboard';
import ProductDetails from './components/ProductDetails';


function App() {
  return (
    <div>

 <Routes>
  <Route path='/' element={<Data/>}/>
  <Route path='/otp' element={<OtpPage/>}/>
  <Route path='/Login' element={<Login/>}/>
  <Route path='/OtpVerifying' element={<OtpVerifying/>}/>
  <Route path='/Dashboard' element={<Dashboard/>}/>
        <Route path="/ProductDetails" element={<ProductDetails />} />  ✅ ADD THIS
 </Routes>


   
    </div>
  )
}

export default App