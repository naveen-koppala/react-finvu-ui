import React from 'react'
import FailLogo from './assets/fail.svg'
const AccountAggregatorFailed = () => {
    return (
        <div className='my-40'>
            <img className='align-middle mx-auto' src={FailLogo} />
            <h2 className='mt-10 mx-16 my-6 text-center consentaccepted'>Account aggregator failed. Please try with other options</h2>
        </div>
    )
}

export default AccountAggregatorFailed