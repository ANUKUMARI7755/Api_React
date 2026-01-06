import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!number) {
      alert("Please enter mobile number");
      return;
    }

    const cleanNumber = number.replace(/\D/g, "");

    if (cleanNumber.length !== 10) {
      alert("Enter valid 10 digit mobile number");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('http://13.203.212.97:3000/auth/request-login-otp',
        { number: cleanNumber }

      );
      console.log(">>>>>>>>>>", res)
      alert(res.data.message || "OTP sent ")
      // navigate("/otp", { state: { number } });
      navigate("/otp", { state: { number: cleanNumber } });
    }
    catch (error) {

      if (error.response?.status === 400) {
        alert(error.response?.data.message)
      }
      const errorMessage =
        error.response?.data?.message?.[0] || // array case
        error.response?.data.message ||      // string case
        "OTP send failed";
      console.log(">>>>>>>>>>>>>>>>>>>>>>", error)
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className='min-h-screen flex items-center justify-center '>
      <div className='bg-amber-100 p-6 rounded w-80' >
        <h1 className='text-xl mb-2'>Loging Page</h1>
        <form onSubmit={handleSendOtp} className="space-y-3  p-2">
          <input type="tel" placeholder='Enter mobile number' className='border rounded text-[18px]' value={number} onChange={(e) => setNumber(e.target.value)} />
          <button
            type="submit" disabled={loading}
            className="bg-blue-400 p-2 text-amber-50 rounded-xl w-20 h-12 whitespace-nowrap self-center"
          > {loading ? "Sending..." : "Send OTP"}

          </button>
        </form>
      </div>
    </div>
  )
}

export default Login