import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ validations
    if (!email || !number) {
      alert("Email and Mobile number required");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(number)) {
      alert("Enter valid 10-digit Indian mobile number");
      return;
    }

    try {
      setLoading(true);

      await axios.post(
        "http://13.203.212.97:3000/auth/request-signup-otp",
        {
          email: email.trim(),
          number: number.toString(), // ✅ BACKEND FIX
        }
      );

      alert("OTP Sent Successfully");

      navigate("/otp", {
        state: { name, email, number },
      });
    }
     catch (error) {
  const msg = error.response?.data?.message;

  console.log(msg);

  if (msg === "Phone number already exists") {
    alert("Number already registered. Please login.");

    // OPTIONAL: login / otp page redirect
    navigate("/Login", {
      // state: { name, email, number }
    });
  } else {
    alert(msg || "OTP sending failed");
  }
}

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-200">
      <form onSubmit={handleSubmit} className="bg-white p-6 w-96 rounded">
        <h2 className="text-xl font-bold mb-4 text-center">Signup</h2>

        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 border"
        />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border"
        />

        <input
          type="tel"
          maxLength={10}
          placeholder="Mobile Number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full mb-3 p-2 border"
        />

        <button
          disabled={loading}
          className="w-full bg-amber-500 text-white p-2 rounded"
        >
          {loading ? "Sending OTP..." : "Signup"}

        </button>
      </form>
          
    </div>
  );
}

export default Signup;
