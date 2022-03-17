import React, { useEffect, useState } from 'react'
import { IoMdAddCircle } from 'react-icons/io'
import { MdOutlineArrowRightAlt, MdDateRange } from 'react-icons/md'
import { BiTimeFive } from 'react-icons/bi'
import { useNavigate } from 'react-router-dom'
import Moment from 'react-moment';
import axios from 'axios'
import { SpinnerDotted } from 'spinners-react';

const DetailsOfAccess = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
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
            localStorage.setItem("dateTimeRangeFrom", res.DataDateTimeRange.from)
            localStorage.setItem("dateTimeRangeTo", res.DataDateTimeRange.to)
            setResponse(res)
        } catch (error) {
            console.log(error)
        }
    }

    const consentApprove = async () => {
        setLoading(true)
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
            try {
                setTimeout(async()=>{
                    let consentStatusRes = await consentStatusCheck();
                    console.log("consentStatusRes",consentStatusRes)
                    let actDataRequestRes = await actDataRequestCheck();
                    console.log("actDataRequestRes",actDataRequestRes)
                    let actStatusUpdateRes = await actStatusUpdateCheck();
                    console.log("actStatusUpdateRes",actStatusUpdateRes)
                    let actDataFetchRespone = await actDataFetchRes();
                    console.log("actDataFetchRespone",actDataFetchRespone)
                    navigate("/success")
                },1000)
            }
            catch (error) {
                console.log("Error", error)
            }
        } else {
            navigate("/failed")
        }
    }

    const consentStatusCheck = async () =>{
        const consentStatusReq = {
            "mobileNumber": localStorage.getItem("mobileNumber"),
            "customerId": 1,
            "consentHandle": localStorage.getItem("ConsentHandle")
        }
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                finvutoken: 'eyJraWQiOiJyc2ExIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJjb29raWVqYXIiLCJhdWQiOiJjb29raWVqYXIiLCJleHAiOjE2Nzg5ODUyMzksImp0aSI6Imh0V2xBMGJUcTFEWWhuUE5YWEhBWmciLCJpYXQiOjE2NDc0NDkyMzksIm5iZiI6MTY0NzQ0OTIzOSwic3ViIjoiY2hhbm5lbEBkaGFuYXByYXlvZ2EiLCJhenAiOiJjaGFubmVsQGRoYW5hcHJheW9nYSIsInJvbGVzIjoiY2hhbm5lbCIsInRpZCI6ImZpdUBkaGFuYXByYXlvZ2EifQ.ENbjS35n36j-v_755euFNOfxX18aYs_ledpQiMQ288qZbzeRNqEkV5UPx-Pa0pGC6c2V2nTjmkKH3fw7nckZ4wMmz-jvgkrqYyGJbFMfbdoMIHy4wyBIVp_L3AWx4saC9E35xGhMj_xII7sm4QIpKI4nJEP6ualK2unNfjXA8fntX33lv5QbsATVC5fezXWpxUlZju85u5qjziaC2o0EPonv3nVQkPKSTghjP7vzqiOqNZ4_9nZDhYVJPKhT-mN5vR1jmDByd8FC-p2S0KHLzXHHZbc3nuzmAGZX0WIcKpjYJHSzK9gbbPnwDc6LPJfyDiV7mNpyKs_0xTro_9FlJg',
            }
        }
        let res = await axios.post('http://localhost:30005/account-service/api/v1/consentStatus', consentStatusReq, headers)
        console.log("consentStatus", res)
        localStorage.setItem("consentId", res.data.data.consentId)
        localStorage.setItem("consentStatus", res.data.data.consentStatus)
        return res
    }

    const actDataRequestCheck = async () =>{
        const actDataRequest = {
            "customerId": "1",
            "mobileNumber": localStorage.getItem("mobileNumber"),
            "consentId": localStorage.getItem('consentId'),
            "consentHandleId": localStorage.getItem("ConsentHandle"),
            "dateTimeRangeFrom": localStorage.getItem("dateTimeRangeFrom"),
            "dateTimeRangeTo": localStorage.getItem("dateTimeRangeTo")
        }
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                finvutoken: 'eyJraWQiOiJyc2ExIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJjb29raWVqYXIiLCJhdWQiOiJjb29raWVqYXIiLCJleHAiOjE2NzkwNDE1NDksImp0aSI6Il9QSTFDb3U0a0NEX0E2V1JIeC1seXciLCJpYXQiOjE2NDc1MDU1NDksIm5iZiI6MTY0NzUwNTU0OSwic3ViIjoiY2hhbm5lbEBkaGFuYXByYXlvZ2EiLCJhenAiOiJjaGFubmVsQGRoYW5hcHJheW9nYSIsInJvbGVzIjoiY2hhbm5lbCIsInRpZCI6ImZpdUBkaGFuYXByYXlvZ2EifQ.oIJF3OcE_jkYcMh7-Ye4xF6zjbLmH6P3kTyMyZnhF235_URlx0gHgZVh8EjGe6P5vOxb2I-uHmxDp7o-8Ca0bY6IxUlDmeDpnySXrbDtd2KnfRQHz-J68GPw3ysvXOTn81cqYDkBzWhsXIAygh6m4eFeJg6bCIjJi3-GKpk0h2IApqej8i70ND0UuLX1aHJe6C_KkCYt3zXicNnwrKLu_ooTxdbW83RC1R-sM_vSUhDTnWwXHbnE1I-Nmr7nNuyP5axvTmdMx5bgj_Kn7sSVyRR6SCiIS-pTRrRAreVRY3tsUHuk6_RE7fUg0PdT1vEDPrdPwXdsPAneffrGEtvQ_g',
            }
        }
        let res = await axios.post('http://localhost:30005/account-service/api/v1/actDataRequest', actDataRequest, headers)
        localStorage.setItem("sessionId", res.data.message.session_id)
        console.log("res", res)
        return res
    }

     const actStatusUpdateCheck = async () =>{
        const actStatusUpdateRequest = {
            "consentId": localStorage.getItem('consentId'),
            "consentHandleId": localStorage.getItem("ConsentHandle"),
            "sessionId": localStorage.getItem("sessionId"),
            "mobileNumber": localStorage.getItem("mobileNumber"),
            "customerId": localStorage.getItem("mobileNumber")
        }
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                finvutoken: 'eyJraWQiOiJyc2ExIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJjb29raWVqYXIiLCJhdWQiOiJjb29raWVqYXIiLCJleHAiOjE2NzkwNDE1NDksImp0aSI6Il9QSTFDb3U0a0NEX0E2V1JIeC1seXciLCJpYXQiOjE2NDc1MDU1NDksIm5iZiI6MTY0NzUwNTU0OSwic3ViIjoiY2hhbm5lbEBkaGFuYXByYXlvZ2EiLCJhenAiOiJjaGFubmVsQGRoYW5hcHJheW9nYSIsInJvbGVzIjoiY2hhbm5lbCIsInRpZCI6ImZpdUBkaGFuYXByYXlvZ2EifQ.oIJF3OcE_jkYcMh7-Ye4xF6zjbLmH6P3kTyMyZnhF235_URlx0gHgZVh8EjGe6P5vOxb2I-uHmxDp7o-8Ca0bY6IxUlDmeDpnySXrbDtd2KnfRQHz-J68GPw3ysvXOTn81cqYDkBzWhsXIAygh6m4eFeJg6bCIjJi3-GKpk0h2IApqej8i70ND0UuLX1aHJe6C_KkCYt3zXicNnwrKLu_ooTxdbW83RC1R-sM_vSUhDTnWwXHbnE1I-Nmr7nNuyP5axvTmdMx5bgj_Kn7sSVyRR6SCiIS-pTRrRAreVRY3tsUHuk6_RE7fUg0PdT1vEDPrdPwXdsPAneffrGEtvQ_g',
            }
        }
        let res = await axios.post('http://localhost:30005/account-service/api/v1/actStatusUpdate', actStatusUpdateRequest, headers)
        console.log("res", res)
        return res
     }

     const actDataFetchRes = async () =>{
        const actDataFetch = {
            "customerId" :localStorage.getItem("mobileNumber"),
            "mobileNumber":localStorage.getItem("mobileNumber"),
            "consentId":localStorage.getItem('consentId'),
            "sessionId": localStorage.getItem("sessionId")
        }
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                finvutoken: 'eyJraWQiOiJyc2ExIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJjb29raWVqYXIiLCJhdWQiOiJjb29raWVqYXIiLCJleHAiOjE2NzkwNDE1NDksImp0aSI6Il9QSTFDb3U0a0NEX0E2V1JIeC1seXciLCJpYXQiOjE2NDc1MDU1NDksIm5iZiI6MTY0NzUwNTU0OSwic3ViIjoiY2hhbm5lbEBkaGFuYXByYXlvZ2EiLCJhenAiOiJjaGFubmVsQGRoYW5hcHJheW9nYSIsInJvbGVzIjoiY2hhbm5lbCIsInRpZCI6ImZpdUBkaGFuYXByYXlvZ2EifQ.oIJF3OcE_jkYcMh7-Ye4xF6zjbLmH6P3kTyMyZnhF235_URlx0gHgZVh8EjGe6P5vOxb2I-uHmxDp7o-8Ca0bY6IxUlDmeDpnySXrbDtd2KnfRQHz-J68GPw3ysvXOTn81cqYDkBzWhsXIAygh6m4eFeJg6bCIjJi3-GKpk0h2IApqej8i70ND0UuLX1aHJe6C_KkCYt3zXicNnwrKLu_ooTxdbW83RC1R-sM_vSUhDTnWwXHbnE1I-Nmr7nNuyP5axvTmdMx5bgj_Kn7sSVyRR6SCiIS-pTRrRAreVRY3tsUHuk6_RE7fUg0PdT1vEDPrdPwXdsPAneffrGEtvQ_g',
            }
        }
        let res = await axios.post('http://localhost:30005/account-service/api/v1/actDataFetch', actDataFetch, headers)
        console.log("res", res)
        return res
     }
    useEffect(() => {
        getAccounts();
    }, [])

    return (
        <>
        {loading &&
        <div className='spin'>
          <SpinnerDotted enabled={loading} />
        </div>}
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
        </>
    )
}

export default DetailsOfAccess