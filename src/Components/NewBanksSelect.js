import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdOutlineArrowRightAlt } from 'react-icons/md'
const NewBanksSelect = () => {
    const navigate = useNavigate()

    let data = [
        {
            name: "Finvu Bank",
            img: "https://finvu.in/cdn/finvu_bank_icon.png",
            fipId: "BARB0KIMXXX"
        },
        {
            name: "IndusInd Bank",
            img: "https://finvu.in/cdn/indusindbank_logo.jpg",
            fipId: "INDUSIND"
        },
        {
            name: "ICICI Bank",
            img: "https://finvu.in/cdn/icicibank_icon.jpg",
            fipId: "ICICI-FIP"
        },
        {
            name: "Acme Bank Ltd.",
            img: "https://finvu.in/cdn/finvu_bank_icon.png",
            fipId: "ACME-FIP"
        },
        {
            name: "HDFC Bank",
            img: "https://finvu.in/cdn/hdfcbank_logo.jpg",
            fipId: "HDFC-FIP"
        },
        {
            name: "Axis Bank",
            img: "https://finvu.in/cdn/axisbank_logo.jpg",
            fipId: "AXIS001"
        },
        {
            name: "Kotak Mahindra Bank",
            img: "https://finvu.in/cdn/kotakbank_app_logo.png",
            fipId: "KOTAK-FIP"
        },
        {
            name: "State Bank of India",
            img: "https://finvu.in/cdn/sbi_logo.png",
            fipId: "sbi-fip-uat"
        },
    ]

    const discoveryAccount = async (fipid) => {
        console.log(fipid)
        let identifiers = [
            {
                "category": "STRONG",
                "type": "MOBILE",
                "value": localStorage.getItem('moblileno')
            }
        ]
        let res = await window.finvuClient.discoverAccounts(fipid, identifiers)
        console.log(res, "newBanks")
        if (res.status && res.status == "SUCCESS") {
            navigate(`/linkaccount/${fipid}`)
        } else {
            alert("No Accounts found")
        }

    }

    useEffect(() => {
    }, [])

    return (
        <div className='p-4 mt-6'>

            <h2 className="headingStyle">Link account</h2>
            <p className='paddingStyle mt-4 mr-14'>Select from below accounts to link your id. OTP will be send by your institution for verification</p>

            <div className="backgrou  rounded-md my-6 p-4 text-center">
                <div className="justify-between ">
                    <div className='grid grid-cols-3 gap-4'>
                        {data.map((e, i) => {
                            return (
                                <div key={i} onClick={() => { discoveryAccount(e.fipId) }} className='flex flex-col items-center justify-between h-16'>
                                    <img src={e.img} alt="banks" className='finvubank' />
                                    <p className="indusindbankfont">{e.name}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className='flex justify-center'>
                <div onClick={() => { navigate('/details') }} className="buttoncontinue1 rounded-full flex text-white items-center justify-center my-4 p-2 w-11/12">
                    <button >Go Back</button>
                </div>
            </div>
        </div>
    )
}

export default NewBanksSelect