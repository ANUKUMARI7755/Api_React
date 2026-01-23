import React from 'react'
import { Routes, Route, useLocation  } from "react-router-dom";
import Data from './components/Data';
import OtpPage from './components/OtpPage';
import Login from './components/Login';
import OtpVerifying from './components/OtpVerifying';


import AddToCard from './components/AddToCard/AddToCard';
import Dashboard from './components/Dashboard/Dashboard';


function App() {

  const location = useLocation();
  const background = location.state?.background;

  return (
    <div>

 <Routes location={background || location}>
  <Route path='/' element={<Data/>}/>
  <Route path='/otp' element={<OtpPage/>}/>
  <Route path='/Login' element={<Login/>}/>
  <Route path='/OtpVerifying' element={<OtpVerifying/>}/>
  <Route path='/Dashboard' element={<Dashboard/>}/>
  {/* <Route path="/ProductDetails" element={<ProductDetails />} />  ✅ ADD THIS */}
 </Routes>

{/* Modal route */}
      {background && (
        <Routes>
          <Route path="/AddToCard" element={<AddToCard />} />
        </Routes>
      )}
   
    </div>
  );
}

export default App