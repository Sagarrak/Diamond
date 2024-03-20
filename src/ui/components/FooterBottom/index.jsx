import React, { Component } from 'react'
import { Facebook, Instagram, Linkedin, Twitter } from 'react-feather';
import { NavHashLink as Link } from 'react-router-hash-link';
import fbIcon from "../../../assets/images/svg/fb-icon.png";
import instaIcon from "../../../assets/images/svg/insta-icon.png";
import twitterIcon from "../../../assets/images/svg/twitter.png";
import linkedIcon from "../../../assets/images/svg/linked-in.png";

import "./footer-bottom.scss"
function FooterBottom() {
    return (
        <div className='footer-bottom bg-green'>
            <div className='container'>
                <div className='d-lg-flex align-items-center justify-content-between flex-wrap text-lg-start text-center py-3'>
                    <div className='d-lg-flex align-items-center'>
                        <p className='text-white'>© CVD MART 2022</p>
                        <ul className='d-lg-flex align-items-center mb-0 ms-xl-4 ms-0'>
                            <li className='me-2 mt-lg-0 mt-1 '>
                                <Link to='/' className='mb-0 ps-2 text-white'>HOME</Link>
                            </li>

                            <li className='me-2 mt-lg-0 mt-1'>
                                <Link to='/aboutUs' className='mb-0 ps-2 text-white'>ABOUT US</Link>
                            </li>

                            <li className='me-2 mt-lg-0 mt-1'>
                                <Link to='/inventory/diamonds' className='mb-0 ps-2 text-white'>OUR COLLECTION</Link>
                            </li>

                            {/* <li className='me-2 mt-lg-0 mt-1'>
                                <Link to='/' className='mb-0 ps-2 text-white'>OUR SERVICES</Link>
                            </li> */}

                            <li className='me-2 mt-lg-0 mt-1'>
                                <Link to='/appointment' className='mb-0 ps-2 text-white'>CONTACT US</Link>
                            </li>
                        </ul>
                    </div>

                    <div className='mt-md-0 mt-3'>
                        <div className="d-flex align-items-center justify-content-lg-start justify-content-center mt-lg-0 mt-2">
                            <Link to='#'>
                                <img src={fbIcon} alt="fbIcon" className='me-2  text-white' />
                                {/* <Facebook className='me-2  text-white' /> */}
                            </Link>
                            <Link to='#'>
                                <img src={instaIcon} alt="fbIcon" className='me-2  text-white' />
                            </Link>
                            <Link to='#'>
                                <img src={twitterIcon} alt="fbIcon" className='me-2  text-white' />
                            </Link>
                            <Link to='#'>
                                <img src={linkedIcon} alt="fbIcon" className='me-2  text-white' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FooterBottom;