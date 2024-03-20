import React from 'react'
import navLogo from '../../../assets/images/images/logoNav.svg';
const CommonHeader = () => {
    return (
        <div className="headSection pt-lg-5 pt-2 px-lg-0 px-md-2">
            <div className='nav-logo'>
                <img src={navLogo} alt="navLogo" />
            </div>
            <p className='headTitle buttler-heading my-lg-2 my-1'>Certified Diamonds</p>
            <p className='headDesc text-lg-start text-center'>Explore our curated collection of unique diamonds selected and verified by experts.</p>
        </div>
    )
}

export default CommonHeader