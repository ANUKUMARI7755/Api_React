import React from 'react'

function OtpVerifying() {
  return (
    //=====================
    <div className='min-h-screen flex justify-center items-center bg-gray-100'>
        <form className='bg-white p-6 rounded shadow-md w-80'>
            <h2 className='text-xl font-semibold mb-4'>Enter OTP</h2>
            <input type='text' placeholder='Enter 6 digit OTP' className='w-s'/>
            <button >Verified opt</button>
        </form>
    </div>
  )
}

export default OtpVerifying


