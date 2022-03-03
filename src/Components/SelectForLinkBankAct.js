import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { SiPhonepe } from 'react-icons/si'
import { MdOutlineArrowRightAlt } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
const SelectForLinkBankAct = () => {
    const navigate = useNavigate()
    return (
        <div className='p-4'>
            <div className='p-4'>
                <div><IoIosArrowBack size={"1rem"} /></div>
                <div className=''>
                    <h2 className="headingStyle mx-auto ">Link Account</h2>
                    <p className='paddingStyle mt-4 mx-auto '>Select from below accounts to link your id.
                        OTP will send by your institution fror verification</p>
                </div>
            </div>
            <div className='my-10 flex gap-5 items-center	'>
                <div className='backgrou ml-5 p-5'>
                    <SiPhonepe className='ml-5' size={"2.5rem"} />
                    <p className='mt-3'>HDFC Bank</p>
                </div>
                <div className='backgrou  p-5'>
                    <SiPhonepe className='ml-5 mx-auto' size={"2.5rem"} />
                    <p className='mt-3 mx-auto'>ICICI Bank</p>
                </div>
            </div>
            <div className="buttoncontinue rounded-full flex text-white justify-center p-2 w-11/12">
                <button onClick={()=>{navigate("/linkaccount")}}>CONTINUE </button>
                <MdOutlineArrowRightAlt className="absolute right-5 bottom-1" size={'2rem'} />
            </div>
        </div>
    )
}

export default SelectForLinkBankAct