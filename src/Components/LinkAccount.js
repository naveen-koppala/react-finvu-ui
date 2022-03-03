import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { SiPhonepe } from 'react-icons/si'
import { MdOutlineArrowRightAlt } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const LinkAccount = () => {
    const navigate=useNavigate()
    return (
        <div className='p-4'>
            <div><IoIosArrowBack size={"1rem"} /></div>
            <div className=''>
                <h2 className="headingStyle ">Link Account</h2>
                <p className='paddingStyle mt-4 '>Select from below accounts to link your id.
                    OTP will send by your institution fror verification</p>
            </div>

            <div className='my-10'>
                <div className='flex justify-center items-center my-5'>
                    <input type="checkbox" />
                    <div className='flex mx-2 justify-around px-2  items-center'>
                         <SiPhonepe  size={"2rem"} />
                        <div className='px-2'>
                            <p>HDFC savings account</p>
                            <p>xxxxxxxx4567</p>
                        </div>
                    </div>
                </div>
                <div className='flex justify-center items-center my-5'>
                    <input type="checkbox" />
                    <div className='flex mx-2 justify-around px-2  items-center'>
                         <SiPhonepe  size={"2rem"} />
                        <div className='px-2'>
                            <p>HDFC savings account</p>
                            <p>xxxxxxxx4567</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="buttoncontinue rounded-full flex text-white justify-center p-2 w-11/12">
                <button className=" " onClick={()=>{navigate("/success")}}>CONTINUE </button>
                <MdOutlineArrowRightAlt className="absolute right-5 bottom-1" size={'2rem'} />
            </div>
        </div>
    )
}

export default LinkAccount