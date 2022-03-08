import React, { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { MdOutlineArrowRightAlt } from 'react-icons/md'
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';

const EnterOtp = () => {
  const navigate = useNavigate()
  const [state,setState] = useState({otp:""})
  const handleChange = (otp) =>{
    console.log(state)
  }
  return (
    <div className='p-4'>
    <div><IoIosArrowBack size={"1rem"} /></div>
    <div className=''>
        <h2 className="headingStyle ">Enter the OTP</h2>
        <p className='paddingStyle mt-4 '>Account aggregator id.<br />
           <b>9999999999@finuv</b> </p>
    </div>
    <div className=' flex justify-around content-around'>
    <OtpInput
        value={state.otp}
        onChange={handleChange}
        numInputs={4}
        inputStyle="border-b-2 border-black text-black m-4 p-4"
      />
    </div>

 
    <div className="buttoncontinue rounded-full flex text-white justify-center p-2 w-11/12">
        <button className=" " onClick={()=>{navigate("/details")}}>CONTINUE </button>
        <MdOutlineArrowRightAlt className="absolute right-5 bottom-1" size={'2rem'} />
    </div>
</div>
  )
}

export default EnterOtp