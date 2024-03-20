import React from 'react'
import { ChevronLeft } from 'react-feather';
const index = props => {
    const handleGoBack = () => {
        props?.history?.goBack();
    }
    return (
        !(props?.noDisplay) &&
        <div className='back-arrow me-2' title="visit previous page">
            {/* <img src={Back}  /> */}
            <ChevronLeft size={28} className='cursor-pointer' onClick={handleGoBack}/>
        </div>
    )
}

export default index