import React from 'react'
import Header from "../Home/Header/Header";

// scss
import "../../pages/Home/homev2.scss";
import "./style.scss";

// images
import aboutColImg from "../../../assets/images/pages/about-col-img.png";
import aboutColSecImg from "../../../assets/images/pages/about-col-2.jpg";
import rightAerrow from "../../../assets/images/pages/right_arrow.svg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Footer from '../../components/Footer';

const index = () => {
    return (
        <div className='home-page about-page' style={{ background: "#fff" }}>
            <div className="banner-img-wrap">
                {/* Start: about-banner-sec */}
                <div className="about-banner d-flex align-items-center justify-content-center flex-column">
                    <Header />
                    <div className='about'>
                        <div className="container-sm">
                            <div className="row about-us">
                                <div className="col-7 col-xxl-7 col-xl-7 col-lg-6 col-md-12 col-sm-12 col-x-12 about-row">
                                    <div>
                                        <p className='about-us-col outfit-bold'>About Us</p>
                                        <p className='about-us-col1'>Cvdmart.com, an online diamond and jewellery marketplace, offers a convenient and reliable platform for customers to browse and purchase a wide range of stunning diamonds and exquisite jewellery pieces. With its user-friendly interface and extensive collection, CVD Mart aims to provide a seamless shopping experience for both seasoned buyers and first-time customers.
<br/>Our vast selection includes various cuts, colors, and carat weights to suit every individual's unique preferences and budget. Whether you're in search of a dazzling engagement ring, a timeless necklace, or a pair of elegant earrings, we've got you covered. Additionally, CVD Mart ensures the authenticity and quality of each item by partnering with reputable suppliers and industry experts. So why wait? Explore the captivating world of diamonds and jewellery at CVD Mart today and make a statement with your next purchase.</p>
                                    </div>
                                </div>
                                <div className="col-5 col-xxl-5 col-xl-5 col-lg-5 col-md-12 col-sm-12 col-x-12">
                                    <div className='col-about-img'>
                                        <img src={aboutColImg} alt="aboutColImg" />
                                        <div className='col-about-img-after'></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* End: about-banner-sec  */}

                {/* Start: about-detail-sec */}
                <div className='about-detail text-center'>
                    <div className='container-sm'>
                        <div className='about-detail-content'>
                            <p className='head-bold outfit-bold'>One-Stop Solution Dedicated to Lab-Grown Diamonds and Jewelry</p>
                            <p className='text-sm-content mt-1'>Are you searching for a convenient and comprehensive solution to purchase diamonds and jewelry at competitive prices? Look no further! Our all-in-one platform offers a wide range of options, ensuring you find the perfect piece to suit your style and budget. With just a few clicks, you can explore a vast collection of dazzling diamonds and exquisite jewelry, all available at the most competitive prices in the market. Our user-friendly interface makes the entire process smooth and hassle-free, allowing you to easily navigate through different categories and filter options. We also provide detailed product descriptions and high-resolution images, enabling you to make an informed decision. Don't miss out on this opportunity to own the jewelry of your dreams at unbeatable prices.
 </p>
                        </div>
                    </div>
                </div>
                {/* End: about-detail-sec  */}

                <div className='about-us-sec'>
                    <div className="container-sm">
                        <div className="row align-items-center justify-content-center">

                            <div className='col-5 col-xl-5 col-lg-6 col-md-12 col-sm-12 col-x-12'>
                                <div className='about-col-img ColSecImg'>
                                    <img src={aboutColSecImg} alt="aboutColSecImg" />
                                </div>
                            </div>

                            <div className='col-7 col-xl-7 col-lg-6 col-md-12 col-sm-12 col-x-12 about-row'>
                                <div className='about-col'>
                                    <p className='head-bold mb-1 outfit-bold'>Why CVD MART ?</p>
                                    <p className='text-sm-content'>When it comes to making a purchase, there are countless options available. So, why should you buy from us? Well, let me tell you. Firstly, our company prides itself on providing top-quality products. We go above and beyond to ensure that each item we offer meets the highest standards of excellence. Secondly, our customer service is unparalleled. Our dedicated team is always ready to assist you with any questions or concerns you may have, guiding you through the entire buying process. Thirdly, we offer competitive prices. We understand that value for money is important to our customers, and we strive to provide the best possible deals. Lastly, we have a proven track record of satisfied customers. Don't just take our word for it, check out the glowing reviews and testimonials from our happy clients. So, if you're looking for a reliable, customer-focused company, look no further. Buy from us and experience the difference.
<br/>Lab-grown diamond - once you have it, you love it! 💎
                                        {/* <br></br>
                                        <br></br>
                                        The company has unique grading system which comply with the International Standards, It can also provide certification from laboratories like GIA, IGI, HRD, AGS or other of Customer choice in 0.20 to 5 cts. in all shapes, colour and clarity.
                                        <br></br>
                                        <br></br>
                                        Our specialty is GIA triple Excellent Round diamonds & artistically cut fancy shapes like Princess, Cushion, Heart, Pears, & Aschers.“ 
                                         */}
                                        </p>
                                   
                                    {/* <ul className='about-list mt-1 row'>
                                        <li className='col-5 col-xl-5 col-lg-12 text-sm-content outfit-bold'>
                                            <img src={rightAerrow}></img>
                                            Manufacturing expertise
                                        </li>

                                        <li className='col-7 col-xl-7 col-lg-12 text-sm-content outfit-bold'>
                                            <img src={rightAerrow}></img>
                                            International standard grading system
                                        </li>
                                        <li className='col-7 col-xl-7 col-lg-12 text-sm-content outfit-bold'>
                                            <img src={rightAerrow}></img>
                                            Strong presence on E-Commerce platform
                                        </li>
                                        <li className='col-5 col-xl-5 col-lg-6 text-sm-content outfit-bold'>
                                            <img src={rightAerrow}></img>
                                            Right size company
                                        </li>
                                        <li className='col-4 col-xl-4 col-lg-6 text-sm-content outfit-bold'>
                                            <img src={rightAerrow}></img>
                                            Niche in fancy shapes
                                        </li>
                                        <li className='col-4 col-xl-4 col-lg-6 text-sm-content outfit-bold'>
                                            <img src={rightAerrow}></img>
                                            One stop destination
                                        </li>
                                        <li className='col-4 col-xl-4 col-lg-6 text-sm-content outfit-bold'>
                                            <img src={rightAerrow}></img>
                                            Global presence
                                        </li>
                                    </ul> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className='about-say'>
                        <p className='about-be outfit-bold'>THATS WHY WE SAY BUY FROM US, BE ASSURED</p>
                    </div> */}
                </div>
            </div>
            <Footer showNewsLetter={true} />
        </div>
    )
}

export default index    