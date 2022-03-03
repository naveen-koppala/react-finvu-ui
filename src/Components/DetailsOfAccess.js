import React from 'react'
import { IoIosArrowBack, IoMdAddCircle } from 'react-icons/io'
import { SiPhonepe } from 'react-icons/si'
import { MdOutlineArrowRightAlt, MdDateRange } from 'react-icons/md'
import { BiTimeFive } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'

const DetailsOfAccess = () => {
    const navigate = useNavigate()
    return (
        <div className='p-4'>
            <div><IoIosArrowBack size={"1rem"} /></div>
            <div className='ml-2 my-6'>
                <h2 className="headingStyle ">Details of access</h2>
                <p className='paddingStyle2 mt-4 '>Please provide your main bank account statement.
                    We suggest you to provide all the bank statements for a higher credit limit </p>
            </div>
            <div className='my-8'>

                    <div className='flex'>
                        <BiTimeFive size={"2rem"} />
                        <div className='pl-3 px-2'>
                            <h6 className='detailacch'>Periodic</h6>
                            <p className='detailaccp'>Information will be fetched every quarter</p>
                        </div>
                    </div>
            </div>
                <div className='flex ml-1'>
                    <MdDateRange size={"2rem"} />
                    <div className='pl-3 px-2'>
                        <h6 className='detailacch'>From Feb 2022 till Feb 2023  </h6>
                        <p className='detailaccp'>transactions, profile, summary of the account</p>
                    </div>
                </div>
            <div className='my-10 ml-6'>
                <div className='flex my-5'>
                    <input className='my-4' type="checkbox" />
                    <div className='flex mx-4 justify-around px-2'>
                        <SiPhonepe size={"2.5rem"} />
                        <div className='px-2'>
                            <p>HDFC Bank</p>
                            <p>xxxxxxxx4567</p>
                        </div>
                    </div>
                </div>
                <div className='flex mt-5'>
                    <input className='mt-4' type="checkbox" />
                    <div className='flex mx-4 justify-around px-2'>
                        <SiPhonepe size={"2.5rem"} />
                        <div className='px-2'>
                            <p>ICICI Bank</p>
                            <p>xxxxxxxx4567</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className='ml-2 flex'>
                <IoMdAddCircle size={'3rem'} />
                <div className='px-3 py-3'>
                    <h6 className='detailacch'>Link another bank account</h6>
                </div>
            </div>
            <div className="buttoncontinue rounded-full flex text-white justify-center p-2 w-11/12">
                <button className=" " onClick={()=>{navigate("/select")}}>CONTINUE </button>
                <MdOutlineArrowRightAlt className="absolute right-5 bottom-1" size={'2rem'} />
            </div>
        </div>

    )
}

export default DetailsOfAccess