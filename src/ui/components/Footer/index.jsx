import React from 'react'
import telephoneIcon from '../../../assets/images/svg/telephone-icon.svg'
import mapIcon from '../../../assets/images/svg/mapicon.svg'
import mailIcon from '../../../assets/images/svg/mail-icon.svg'
import footerLogo from '../../../assets/images/pages/footer-cvd-logo.png'

import fbIcon from '../../../assets/images/svg/fb-2.svg'
import instraIcon from '../../../assets/images/svg/instagram-icon.svg'
import twitterIcon from '../../../assets/images/svg/twitter-icon.svg'
import ytIcon from '../../../assets/images/svg/ytIcon.svg'
import googlePlay from '../../../assets/images/icons/google-play.png'
import appStore from '../../../assets/images/icons/app-store.png'
import newsEmailSec from "../../../assets/images/pages/news-email-sec.png";
import { SEND_NOTIFICATION } from '../../pages/Jewellery/FE/GQL/mutations'
import { Button, Col, FormFeedback, Row } from 'reactstrap';
// import { NavHashLink as Link } from "react-router-hash-link";
import { Link } from 'react-router-dom'
import "./footer.scss"
// import "../../../ui/pages/Home/footer-bottom-cols"
import { Controller, useForm } from 'react-hook-form'
import { useMutation } from 'react-apollo'
import { toast } from 'react-toastify'


const Footer = ({ showNewsLetter, contactsLetter }) => {

    const {
        reset,
        control,
        handleSubmit,
        register,
        setValue,
        formState: { errors }
    } = useForm()

    const [notifyMe] = useMutation(SEND_NOTIFICATION);

    const onSubmit = data => {
        if (Object.values(data).every(field => field.length > 0)) {
            const input = { email: data?.email }
            notifyMe({ variables: { input }, })
                .then(async ({ data }) => {
                    if (data?.addNotification?.id) {
                        toast?.success("Thankyou..!")
                        setValue("email", "");
                    }
                })
                .catch((error) => {
                    toast?.error(FormatError(error));
                    setValue("email", "");
                });
        }
    }

    return (
        <div>
            <div className={`${showNewsLetter && !contactsLetter ? "join-news-sec d-flex mt-1" : "join-about-news-sec d-none"} `}>
                <div className="join-new-col">
                    <div className="text-center">
                        <div>
                            <img src={newsEmailSec} alt="newsEmailSec" />
                        </div>
                        {/* <p className="head-bold">Join our Newsletter</p> */}
                        <p className="text-sm-content mb-2 mt-1 d-flex justify-content-center head-text">Stay informed by following all the newest offers, trends, and news in the lab-grown diamonds industry.
                        </p>
                        <div className="product-footer" >
                            <div>
                                <div className='mail-cols'>

                                    <div className='mt-2 news-letter'>
                                        <form onSubmit={handleSubmit(onSubmit)} className="row g-0">
                                            <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 me-2 mail-box">
                                                <label htmlFor="mailList" className="visually-hidden">Enter your mail</label>
                                                <input type="mail" className="form-control blog-mail" id="mailList" placeholder="Enter your mail" />
                                                {/* <Controller
                                                                id='email'
                                                                name='email'
                                                                {...register("email", { required: true })}
                                                                defaultValue=''
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <input {...field} type="email" className="form-control blog-mail" id="mailList" placeholder='ENTER YOUR EMAIL' invalid={errors.email && true} aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" />
                                                                )}
                                                            /> */}
                                                {errors.email && <FormFeedback style={{ textAlign: 'left' }}>Please enter a valid email</FormFeedback>}
                                            </div>
                                            <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 mail-box">
                                                <button type="submit" className="mail-box-submit btn-sm mb-3">Submit</button>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`${!showNewsLetter && !contactsLetter ? "product-footer" : "footer"}`} >
                <div>
                    {
                        (!showNewsLetter && !contactsLetter) ?
                            (
                                <div className='footer-bottom-cols'>

                                    <div className="container">
                                        <div className='d-xl-flex align-items-center justify-content-xl-between justify-content-center'>
                                            <div className='footer-logo d-flex justify-content-xl-between justify-content-center'>
                                                <img src={footerLogo} alt="footerLogo" />
                                            </div>

                                            <div className='d-flex justify-content-xlstart justify-content-center my-xl-0 my-2'>
                                                <ul className='flex-wrap d-flex align-items-center mb-0'>
                                                    <li className='me-lg-1 me-2 mt-lg-0 mt-1'>
                                                        <Link to='/aboutUs' className='mb-0 ps-xxl-2 ps-xl-1 ps-xl-1 ps-1 text-grey'>About us</Link>
                                                    </li>

                                                    <li className='me-lg-1 me-2 mt-lg-0 mt-1'>
                                                        <Link to='/inventory/diamonds' smooth={+true} className='mb-0 ps-xxl-2 ps-xl-1 ps-1 text-grey'>Diamonds</Link>
                                                    </li >

                                                    <li className='me-lg-1 me-2 mt-lg-0 mt-1'>
                                                        <Link to='/jewelry' className='mb-0 ps-xxl-2 ps-xl-1 ps-1 text-grey'>Jewelery</Link>
                                                    </li>

                                                    <li className='me-lg-1 me-2 mt-lg-0 mt-1'>
                                                        <Link to='/appointment' className='mb-0 ps-xxl-2 ps-xl-1 ps-1 text-grey'>Contact us</Link>
                                                    </li>

                                                    <li className='me-lg-1 me-2 mt-lg-0 mt-1'>
                                                        <Link to='/blogs' className='mb-0 ps-xxl-2 ps-xl-1 ps-1 text-grey'>Blogs</Link>
                                                    </li>

                                                    <li className='me-lg-1 me-2 mt-lg-0 mt-1'>
                                                        <Link to='#' className='mb-0 ps-xxl-2 ps-xl-1 ps-1 text-grey'>Privacy Policy</Link>
                                                    </li>

                                                    <li className='me-lg-1 me-2 mt-lg-0 mt-1'>
                                                        <Link to='#' className='mb-0 ps-xxl-2 ps-xl-1 ps-1 text-grey'>Term & Condition</Link>
                                                    </li>
                                                </ul >
                                            </div >

                                            <div className="d-flex align-items-center justify-content-center mt-lg-0 mt-2 footer-icon">

                                                <Link to="/" className='me-2 product-footer-icon' >
                                                    <img src={twitterIcon} alt='twitterIcon' />
                                                </Link>

                                                <Link to="/" className='me-2 product-footer-icon' >
                                                    <img src={instraIcon} alt='instraIcon' />
                                                </Link>

                                                <Link to="/" className='me-2 product-footer-icon' >
                                                    <img src={fbIcon} alt='fbIcon' />
                                                </Link>

                                                <Link to="/" className='me-2 product-footer-icon' >
                                                    <img src={ytIcon} alt='ytIcon' />
                                                </Link>
                                            </div>

                                        </div >
                                    </div >
                                </div >
                            )
                            :
                            (
                                <div>
                                    <div className='footer-sec-col'>
                                        <Row className="d-flex footer-sec-row">
                                            <Col lg='4' md='12' sm='12' className="footer-sec order-xxl-1 order-xl-1 order-lg-1 order-md-0 order-sm-0 order-0">
                                                <div className='mt-md-0 mt-2 text-center'>
                                                    <h1 className='head-bold mb-0 outfit-bold'>Get In Touch</h1>
                                                    <p className='mb-2 text-size get-in-text'>Every diamond we make reflects the sparkle of compassion with our craftman.</p>

                                                    {/* <div className="d-flex justify-content-between mx-2">
                                                        <div>
                                                            <img src={googlePlay} alt="err" className='w-full h-full' />
                                                        </div>
                                                        <div>
                                                            <img src={appStore} alt="err" className='w-full h-full' />
                                                        </div>
                                                    </div> */}
                                                    {/* <Button color='primary' className='' onClick={() => { history?.push('/appointment') }}>Contact us</Button> */}
                                                </div>
                                            </Col>
                                            <Col lg='4' md='6' sm='6' className="order-xxl-0 order-xl-0 order-lg-0 order-md-2 order-sm-2 order-2">
                                                <div className='d-flex align-items-center footer-sec-para'>
                                                    <div className='telephone-icon'>
                                                        <img src={mapIcon} alt="mapIcon" className='w-100 h-100' />
                                                    </div>

                                                    <p className='mb-0 ps-2 address-content text-grey text-size'> Hoveniersstraat 30, Office 320,<br /> 2018 Antwerp, Belgium</p>
                                                </div>
                                            </Col>

                                            <Col lg='4' md='6' sm='6' className='order-xxl-2 order-xl-2 order-lg-2 order-md-1 order-sm-1 order-1'>
                                                <div className='m-0 footer-info-sec'>
                                                    <a href='mailto:info@cvdmart.com' className='d-flex align-items-center mb-1'>
                                                        <div className='telephone-icon'>
                                                            <img src={mailIcon} alt="mailIcon" className='w-100 h-100' />
                                                        </div>

                                                        <p className='mb-0 ps-2 text-grey text-size'>cvdmart@gmail.com</p>
                                                    </a>

                                                    <a href='tel:+32489-7915-11' className='d-flex align-items-center'>
                                                        <div className='telephone-icon' >
                                                            <img src={telephoneIcon} alt="telephoneIcon" className='w-100 h-100' />
                                                        </div>
                                                        <p className='mb-0 ps-2 text-grey text-size'>+91 9568459623</p>
                                                    </a>
                                                </div>
                                            </Col>
                                        </Row>

                                    </div>
                                    <div className='footer-bottom-col'>
                                        <div className="container">
                                            <div className='d-lg-flex align-items-center justify-content-lg-between justify-content-center footer-col py-lg-0 py-1'>
                                                <div className='footer-logo d-flex justify-content-xl-start justify-content-center my-xl-0 my-2'>
                                                    <img src={footerLogo} alt="footerLogo" />
                                                </div>

                                                <div className='d-flex  justify-content-xl-start justify-content-center my-xl-0 my-2'>
                                                    <ul className='d-flex align-items-center mb-0 flex-wrap'>
                                                        <li className='me-lg-1 me-2 mt-lg-0 mt-1'>
                                                            <Link to='/aboutUs' className='mb-0 ps-2 text-grey contact-us'>About us</Link>
                                                        </li>

                                                        <li className='me-lg-1 me-2 mt-lg-0 mt-1'>
                                                            <Link to='/inventory/diamonds' smooth={+true} className='mb-0 ps-2 text-grey contact-us'>Diamonds</Link>
                                                        </li>

                                                        <li className='me-lg-1 me-2 mt-lg-0 mt-1'>
                                                            <Link to='/jewelry' className='mb-0 ps-2 text-grey contact-us'>Jewelery</Link>
                                                        </li>

                                                        <li className='me-lg-1 me-2 mt-lg-0 mt-1'>
                                                            <Link to='/appointment' className='mb-0 ps-2 text-grey contact-us'>Contact us</Link>
                                                        </li>

                                                        <li className='me-lg-1 me-2 mt-lg-0 mt-1'>
                                                            <Link to='/blogs' className='mb-0 ps-2 text-grey contact-us'>Blogs</Link>
                                                        </li>

                                                        <li className='me-lg-1 me-2 mt-lg-0 mt-1'>
                                                            <Link to='#' className='mb-0 ps-2 text-grey contact-us'>Privacy Policy</Link>
                                                        </li>

                                                        <li className='me-lg-1 me-2 mt-lg-0 mt-1'>
                                                            <Link to='#' className='mb-0 ps-2 text-grey contact-us'>Term & Condition</Link>
                                                        </li>
                                                    </ul>
                                                </div>

                                                <div className="d-flex align-items-center justify-content-center mt-lg-0 mt-2">

                                                    <Link to="/" className='me-2 footer-icon' >
                                                        <img src={twitterIcon} alt='twitterIcon' />
                                                    </Link>

                                                    <Link to="/" className='me-2 footer-icon' >
                                                        <img src={instraIcon} alt='instraIcon' />
                                                    </Link>

                                                    <Link to="/" className='me-2 footer-icon' >
                                                        <img src={fbIcon} alt='fbIcon' />
                                                    </Link>

                                                    <Link to="/" className='footer-icon' >
                                                        <img src={ytIcon} alt='ytIcon' />
                                                    </Link>
                                                </div>

                                            </div>
                                            {/* <div className='d-flex align-items-center justify-content-between footer-bottom text-white'>
                                                <Link className='text-white'>© Copyright 2022-2023</Link>
                                                <div className='d-flex align-items-center'>
                                                    <p className='me-1'>Developed By  : </p>
                                                    <a href="https://www.scale-team.com/" className='text-white'> Scaleteam Technologies </a>
                                                </div>
                                            </div> */}
                                        </div>


                                    </div>
                                </div>

                            )


                    }

                </div >

            </div >
        </div >
    );
}

export default Footer;