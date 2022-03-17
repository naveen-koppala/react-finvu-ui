import React, { useEffect, useState } from 'react'
import { MdOutlineArrowRightAlt } from 'react-icons/md'
import { useNavigate, useParams } from 'react-router-dom'

const LinkAccount = () => {
    const { fipid } = useParams()
    const navigate = useNavigate()
    const [dAccounts, setDAccounts] = useState([])
    const [ac, setAc] = useState({})

    let discoveryAccounts = async () => {
        let identifiers = [
            {
                "category": "STRONG",
                "type": "MOBILE",
                "value": localStorage.getItem('mobileNumber')
            }]
        let res = await window.finvuClient.discoverAccounts(fipid, identifiers)
        if (res.status && res.status == "SUCCESS") {
            if (res.DiscoveredAccounts && res.DiscoveredAccounts.length) {
                setDAccounts(res.DiscoveredAccounts)
            }
        } else {
            console.log("Something went wrong")
        }
    }

    let getData = async () => {
        let fi = fipid;
        const accounts = [ac]
        try {
            let res = await window.finvuClient.accountLinking(fi, accounts)
            console.log("res", res)
            if (res.status && res.status == "SUCCESS") {
                localStorage.setItem("RefNumber", res.RefNumber)
                navigate(`/newacaddenterotp/${fipid}`)
            } else if (res.includes("FAILURE")) {
                alert("Account already added")
                navigate("/newbanksselect")
            }
        } catch (error) {
            return error
        }
    }
    const settingAc = (e) => {
        setAc(JSON.parse(e.target.value))
    }

    useEffect(() => {
        discoveryAccounts();
    }, [])

    return (
        <div className='p-4 mt-6'>
            <h2 className="headingStyle ">Link Account</h2>
            <p className='paddingStyle mt-4 '>Select from below accounts to link your id.
                OTP will send by your institution fror verification</p>

            <div className='my-10'>
                {dAccounts.map((e, i) => {
                    return (
                        <div key={i} className='flex items-center mx-10 my-5'>
                            <input onClick={(e) => { settingAc(e) }} type="checkbox" name="accounts" value={JSON.stringify(e)} />
                            <div className='flex mx-2 justify-around px-2  items-center'>
                                <div className='px-2'>

                                    <p>{e.accType}</p>
                                    <p>{e.maskedAccNumber}</p>
                                </div>

                            </div>

                        </div>
                    )
                })}
            </div>
            <div className='flex justify-center'>
                <div onClick={() => { getData() }} className="buttoncontinue1 rounded-full flex text-white justify-center p-2 w-11/12">
                    <button>CONTINUE </button>
                    <MdOutlineArrowRightAlt className="absolute right-5 bottom-1" size={'2rem'} />
                </div>
            </div>
        </div>
    )
}

export default LinkAccount