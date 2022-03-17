import React, { useState, useEffect } from 'react'
import { MdOutlineArrowRightAlt } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom';

const NewAcAddEnterOtp = () => {
  const navigate = useNavigate()
  const [state, setState] = useState('')
  const handleChange = (e) => {
    if (state.length < 6) {
      setState(e.target.value)
    }
  }
  const sendOtpData = async () => {
    const accountLinkRefNumber = localStorage.getItem("RefNumber")
    try {
      if (state.length == 6) {
        let res = await window.finvuClient.accountConfirmLinking(accountLinkRefNumber, state)
        console.log(res, "res ")
        if (res.status == "SUCCESS") {
          navigate("/details")
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='p-4 mt-14'>
      <h2 className="headingStyle ">Enter the OTP</h2>
      <p className='paddingStyle mt-4 '>Enter the OTP sent to the registered mobile no</p>
      <div className='my-8 flex justify-center'>
        <input className='border p-2 rounded-lg w-4/6 mt-20' type="number" maxLength={6} onChange={(e) => { handleChange(e) }} />
      </div>
      <div className='flex justify-center'>
        <div onClick={() => { sendOtpData() }} className="buttoncontinue1 rounded-full flex text-white justify-center p-2 w-11/12">
          <button>CONTINUE </button>
          <MdOutlineArrowRightAlt className="absolute right-5 bottom-1" size={'2rem'} />
        </div>
      </div>
    </div>
  )
}

export default NewAcAddEnterOtp