import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function OtpPage() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const location = useLocation();
  const { name, email, number } = location.state || {};
  const navigate = useNavigate();
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setMessage("Enter 6 digit OTP");
      return;
    }
    if (!number) {
      setMessage("Mobile number missing");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        number: number, 
      };
      // =====================

      const res = await axios.post(
        "http://13.203.212.97:3000/auth/login",payload);

      console.log(res.data);
     setMessage(res.data?.message || "✅ OTP Verified");
     navigate('/Dashboard')

    } catch (error) {
      console.log(error.response?.data);
      setMessage(error.response?.data?.message || "❌ Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleVerifyOtp} className="bg-white p-6 w-80 rounded">
        <h2 className="text-xl font-bold mb-4 text-center">Verify OTP</h2>

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full p-2 border mb-3 text-center"
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {message && <p className="text-center mt-3">{message}</p>}
      </form>
    </div>
  );
}

export default OtpPage;
