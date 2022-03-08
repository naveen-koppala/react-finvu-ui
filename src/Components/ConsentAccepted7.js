import React, {useEffect} from 'react'
import DoneLogo from './assets/done.svg'
const ConsentAccepted = () => {
  useEffect(() => {
    getData();
},[])



const getData = async () => {
  const FIPDetails = [
    {
      "FIP": {
        "id": "BARB0KIMXXX"
      },
      "Accounts": [
        {
          "linkRefNumber": "86e126fa-fb9c-4084-97a7-8848adc5817e",
          "accType": "SAVINGS",
          "accRefNumber": "REF8421068",
          "maskedAccNumber": "XXXXXX1068",
          "FIType": "DEPOSIT",
          "fipId": "BARB0KIMXXX",
          "fipName": "Finvu Bank"
        }
      ]
    }
  ]
  const handleStatus = "ACCEPT/DENY "
    try {
    const res = await window.finvuClient.consentApproveRequest(FIPDetails,handleStatus)
    console.log(res);
        
    } catch (error) {
        console.log(error)
    }
}
  return (
    <div className='mt-80'>
        <img className='align-middle mx-auto' src={DoneLogo} />
        <h2 className='mt-10 text-center consentaccepted'>Consent accepted</h2>
    </div>
  )
}
export default ConsentAccepted;