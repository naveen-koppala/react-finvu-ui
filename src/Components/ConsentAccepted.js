import React from 'react'
import DoneLogo from './assets/done.svg'
const ConsentAccepted = () => {
  localStorage.clear()
  return (
    <div className='my-40'>
        <img className='align-middle mx-auto' src={DoneLogo} />
        <h2 className='mt-10 text-center consentaccepted'>Consent accepted</h2>
    </div>
  )
}
export default ConsentAccepted;