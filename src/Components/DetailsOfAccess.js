import React, { useEffect, useState } from 'react'
import { IoMdAddCircle } from 'react-icons/io'
import { MdOutlineArrowRightAlt, MdDateRange } from 'react-icons/md'
import { BiTimeFive } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import Moment from 'react-moment';

const DetailsOfAccess = () => {
    const navigate = useNavigate()
    const [banks, setBanks] = useState([])
    const [response, setResponse] = useState()
    const [fipId, setFipId] = useState('')

    const getAccounts = async () => {
        try {
            let res = await window.finvuClient.userLinkedAccounts()
            if (res.status && res.status == "SUCCESS") {
                if (res.LinkedAccounts && res.LinkedAccounts.length) {
                    setBanks(res.LinkedAccounts)
                    getData()
                }
            }
        } catch (e) {
            return e
        }
    }

    const getData = async () => {
        try {
            let res = await window.finvuClient.consentRequestDetails();
            setResponse(res)
        } catch (error) {
            console.log(error)
        }
    }

    const consentApprove = async () => {
            let bankData = []
            banks.map((e, i) => {
                let temp = {}
                if (fipId == e.fipId) {
                    temp['linkRefNumber'] = e.linkRefNumber;
                    temp['accType'] = e.accType;
                    temp['accRefNumber'] = e.accRefNumber;
                    temp['maskedAccNumber'] = e.maskedAccNumber;
                    temp['FIType'] = e.FIType;
                    temp['fipId'] = e.fipId;
                    temp['fipName'] = e.fipName;
                    bankData.push(temp)
                }
            })
            const FIPDetails = [
                {
                    "FIP": {
                        "id": fipId
                    },
                    "Accounts": bankData
                }
            ]
            const handleStatus = "ACCEPT"
            let res = await window.finvuClient.consentApproveRequest(FIPDetails, handleStatus)
            if (res.status && res.status == "SUCCESS") {
                navigate("/success")
            } else {
                navigate("/failed")
            }
    }

    useEffect(() => {
        getAccounts();
    }, [])

    return (
        <div className='p-4'>
            <div className='ml-2 '>
                <h2 className="headingStyle ">Details of access</h2>
                <p className='paddingStyle2 mt-4 '>Please provide your main bank account statement.
                    We suggest you to provide all the bank statements for a higher credit limit </p>
            </div>
            <div className='my-2'>
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
                    <h6 className='detailacch'>From  <Moment format="MMM YYYY">
                        {response?.DataDateTimeRange?.from}
                    </Moment> till <Moment format="MMM YYYY">
                            {response?.DataDateTimeRange?.to}
                        </Moment>  </h6>
                    <p className='detailaccp'>transactions, profile, summary of the account</p>
                </div>
            </div>
            <div className=' my-4 '>
                {banks.map((e, i) => {
                    return (
                        <div key={i} className='flex my-1  justify-center'>
                            <input className='my-4' type="checkbox" value={e.fipId} onClick={(e) => { setFipId(e.target.value) }} />
                            <div className='flex  justify-around px-2'>
                                {/* <SiPhonepe size={"2.5rem"} /> */}
                                <div className='px-2'>
                                    <p>{e.fipName}</p>
                                    <p>{e.maskedAccNumber}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div onClick={() => { navigate("/newbanksselect") }} className='ml-2 flex justify-center items-center'>
                <IoMdAddCircle size={'3rem'} />

                <div className='px-3'>
                    <h6 className='detailacch' >Link another bank account</h6>
                </div>
            </div>
            <div className='flex justify-center'>
                <div onClick={() => { consentApprove() }} className="buttoncontinue1 rounded-full flex text-white items-center justify-center my-4 p-2 w-11/12">
                    <button>CONTINUE </button>
                    <MdOutlineArrowRightAlt className="absolute right-5 bottom-1" size={'2rem'} />
                </div>
            </div>
        </div>
    )
}

export default DetailsOfAccess