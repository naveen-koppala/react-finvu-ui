import React, { useState } from 'react'
import { MdOutlineArrowRightAlt } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom';
import { SpinnerDotted } from 'spinners-react';

const EnterOtp = () => {
  const { name } = useParams();
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState('')
  const handleChange = (e) => {
    e.preventDefault()
      setState(e.target.value)
    
  }
  const getData = async () => {

    try {
      let res = await window.finvuClient.userLinkedAccounts()
      console.log("userLinkedAccounts", res)
      if (res.status && res.status == "SUCCESS") {

        navigate("/details")
      } else {
        navigate("/newbanksselect")
      }
    } catch (e) {
      return e
    }
  }
  const sendOtpData = async () => {
    setLoading(true)
    try {
      if (state.length == 6) {
        let res = await window.finvuClient.verifyOTP(state)
        if (res.status == "SUCCESS") {
          getData()
        } else{
          alert("Otp validation failed.")
          navigate('/')
        }
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  return (
    <>
    {loading &&
        <div className='spin'>
          <SpinnerDotted enabled={loading} />
        </div>}
    <div className='p-4  h-full flex flex-col  justify-around '>
      <div className=' h-1/2 flex flex-col justify-center gap-5'>
        <h2 className="headingStyle ">Enter the OTP</h2>
        <p className='paddingStyle mt-4 '>Account aggregator id.<br />
          <b>{name}</b> </p>
        <div className=' flex  justify-center'>
          <input placeholder='Enter OTP' className='border p-2 rounded-lg w-4/6' type="password" maxLength={6} onChange={(e) => { handleChange(e) }} />
        </div>
      </div>
      <div className='flex justify-center'>
        <div onClick={() => { sendOtpData() }} className={state.length == 6 ? "buttoncontinue1 rounded-full flex text-white items-center justify-center my-4 p-2 w-11/12" : "buttoncontinue2 rounded-full flex text-black items-center justify-center my-4 p-2 w-11/12"}>
          <button disabled={state.length !=6}>CONTINUE </button>
          <MdOutlineArrowRightAlt className="absolute right-5 bottom-1" size={'2rem'} />
        </div>
      </div>
    </div>
    </>
  )
}

export default EnterOtp