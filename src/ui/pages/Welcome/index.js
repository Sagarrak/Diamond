import React from 'react'
import { NavHashLink as Link } from "react-router-hash-link";
import Logo from "../../../assets/images/pages/header-logo.png";
import './style.scss'

const WelcomePage = () => {
    return (
        // <div className='home-page'>
        //     <div className="modalWelcome position-relative">
        //         <video width="100%" height="100%" autoPlay muted>
        //             <source src={video} type="video/mp4" ></source>
        //         </video>
        //         <div className="modal-hidden-btn position-absolute">
        //             <Link to={"/#searchInventory"} smooth={+true} className="primary-btn" >Search Diamond</Link>
        //             <Link to="/jewellery" smooth={+true} className="secondary-btn" > Jewellery </Link>
        //         </div>
        //     </div>
        // </div>
        <>
            <div className='home-page'>
                <div className='background-img position-relative'>
                    <div className='main-logo position-absolute'>
                        <h2>WELCOME TO</h2>
                        <div >
                            <img src={Logo} alt="logo" />
                        </div>

                    </div>
                    <div className='button-div position-absolute'>
                        <Link to={"/"} smooth={+true} className="common-button" >DISCOVER DIAMONDS</Link>
                        <Link to="/jewelry" smooth={+true} className="common-button" > DISCOVER JEWELRY </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
export default WelcomePage;
