import React, { useEffect } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { SiPhonepe } from 'react-icons/si'
import { MdOutlineArrowRightAlt } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
const SelectAggActList = () => {
  const navigate = useNavigate()
 
   useEffect(() => {
        getData();
    },[])

    const getData = async () => {
        try {
        const res = await window.finvuClient.userLinkedAccounts();
        console.log(res);
            
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='p-4'>
      <div><IoIosArrowBack size={"1rem"} /></div>
      <div className=''>
        <h2 className="headingStyle ">Select your back from Account Aggregator list</h2>
        <p className='paddingStyle mt-4 '>Please provide your main bank account statement so that we can you further</p>
      </div>
      <div className="backgrou  rounded-md my-6 p-4">
        <p className="aggregat py-4">Account aggregator registered banks</p>
        <div className="flex flex-row justify-between ">
          <div className='flex flex-col items-center justify-between h-16'>
            <SiPhonepe size={"2rem"} />
            <p className="">HDFC</p>
          </div>
          <div className='flex flex-col items-center justify-between h-16'>
            <SiPhonepe size={"2rem"} />
            <p className="">AXIS</p>
          </div>
          <div className='flex flex-col items-center justify-between h-16'>
            <SiPhonepe size={"2rem"} />
            <p className="">ICICI</p>
          </div>
          <div className='flex flex-col items-center justify-between h-16'>
            <SiPhonepe size={"2rem"} />
            <p className="">SBI</p>
          </div>
          <div className='flex flex-col items-center justify-between h-16'>
            <SiPhonepe size={"2rem"} />
            <p className="">Kotak</p>
          </div>
        </div>
      </div>
      <div className="mt-20 text-center">
        <p className="cantseebank">Cant see you bank in the list?</p>
      </div>
      <div className="buttoncontinue rounded-full flex text-white justify-center p-2 w-11/12">
        <button onClick={(  )=>{navigate("/otp")}}>CONTINUE </button>
        <MdOutlineArrowRightAlt className="absolute right-5 bottom-1" size={'2rem'} />
      </div>
    </div>
  )
}

export default SelectAggActList