import React, { useState } from 'react'
import axios from 'axios'
import { MdOutlineArrowRightAlt } from 'react-icons/md'
import { useNavigate } from 'react-router-dom';
import "../App.css"

const ConsentRequestEncrypt = () => {
  const navigate = useNavigate()
  const [state, setState] = useState('')
  const handleChange = (e) => {
    if (state.length < 10) {
      setState(e.target.value)
    }
  }
  const apiRequest = {
    "header": {
      "ts": "2020-05-04T16:59:53.814+0000",
      "channelId": "finsense",
      "rid": "445e7f8c-22eb-4c09-b6d9-677ef59dbc29"
    },
    "body": {
      "custId": `${state}@finvu`,
      "consentDescription": "Wealth Management Service",
      "templateName": "FINVUDEMO_TESTING",
      "userSessionId": "sessionid123"
    }
  }
  const getConsentRequestEncrypt = async () => {
    try {
      let res = await axios.post('https://dhanaprayoga.fiu.finfactor.in/finsense/API/V1/ConsentRequestEncrypt',
        apiRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: 'Bearer eyJraWQiOiJyc2ExIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJjb29raWVqYXIiLCJhdWQiOiJjb29raWVqYXIiLCJleHAiOjE2Nzg5ODUyMzksImp0aSI6Imh0V2xBMGJUcTFEWWhuUE5YWEhBWmciLCJpYXQiOjE2NDc0NDkyMzksIm5iZiI6MTY0NzQ0OTIzOSwic3ViIjoiY2hhbm5lbEBkaGFuYXByYXlvZ2EiLCJhenAiOiJjaGFubmVsQGRoYW5hcHJheW9nYSIsInJvbGVzIjoiY2hhbm5lbCIsInRpZCI6ImZpdUBkaGFuYXByYXlvZ2EifQ.ENbjS35n36j-v_755euFNOfxX18aYs_ledpQiMQ288qZbzeRNqEkV5UPx-Pa0pGC6c2V2nTjmkKH3fw7nckZ4wMmz-jvgkrqYyGJbFMfbdoMIHy4wyBIVp_L3AWx4saC9E35xGhMj_xII7sm4QIpKI4nJEP6ualK2unNfjXA8fntX33lv5QbsATVC5fezXWpxUlZju85u5qjziaC2o0EPonv3nVQkPKSTghjP7vzqiOqNZ4_9nZDhYVJPKhT-mN5vR1jmDByd8FC-p2S0KHLzXHHZbc3nuzmAGZX0WIcKpjYJHSzK9gbbPnwDc6LPJfyDiV7mNpyKs_0xTro_9FlJg',
          }
        }
      )
      localStorage.setItem("moblileno",state)
      localStorage.setItem("ConsentHandle", res.data.data?.ConsentHandle)
      var uname = `${state}@finvu`
      var pname = ""
      var handleID = res?.data?.body?.ConsentHandle
      if (res?.data?.body?.ConsentHandle != null) {
        try {
          await window.finvuClient.open();
          let res = await window.finvuClient.login(handleID, uname, pname)
          if (res.status === "SEND") {
            navigate(`/otp/${uname}`)
          } else {
            alert("Something went wrong please try again")
            console.log("Something went wrong please try again")
          }
        } catch (e) {
          console.log(e)
        }
      }
    } catch (error) {
      console.log("error", error)
    }
  }


  return (
    <div className='p-4  h-full flex flex-col justify-around '>
      <div className=' h-1/2 flex flex-col justify-center gap-5'>
      <div className=' flex  justify-center'>
        <h2 className="headingStyle ">Enter Mobile Number</h2>
        </div>
        <div className=' flex  justify-center'>
        <input placeholder='Mobile number' className='border p-2 rounded-lg w-4/6' type="number" onChange={(e) => { handleChange(e) }} />
        </div>
      </div>
      <div className='flex justify-center'>
        <div onClick={() => { getConsentRequestEncrypt() }} className="buttoncontinue rounded-full flex text-white items-center justify-center my-4 p-2 w-11/12">
          <button>CONTINUE</button>
          <MdOutlineArrowRightAlt className="absolute right-5 bottom-1" size={'2rem'} />
        </div>
      </div>
    </div>
  )
}

export default ConsentRequestEncrypt