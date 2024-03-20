import React, { useEffect, useMemo } from 'react';
import Header from '../../Home/Header/Header';
import "./jewellery.scss";
import Footer from '../../../components/Footer';
import Slider from 'react-slick';
import Heading from './Components/Heading';
import JewelleryCategory from './Components/JewelleryCategory';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ExploreOne from "../FE/images/explore-1.png";
import ExploreTwo from "../FE/images/explore-2.png";
import ExploreThree from "../FE/images/explore-3.png";
import ExploreFour from "../FE/images/explore-4.png";
import ExploreFive from "../FE/images/explore-5.png";
import { Col, Row } from 'reactstrap';
import emptyCart from "../../../../../src/assets/images/icons/Frame.svg";
import { toast } from 'react-toastify';


function index() {
    const isHidden = true;
    // const [notifyMe] = useMutation(SEND_NOTIFICATION);
    // const SampleNextArrow = ({ currentSlide, slideCount, className, style, onClick, ...props }) => {
    //     return <ArrowRightCircle onClick={onClick} {...props} />;
    // };
    // const { data, loading } = useQuery(JewelryCategories)
    // const jewelryCategories = useMemo(() => data?.jewelryCategoriesWithoutPaginations, [data])
    // const SamplePrevArrow = ({ currentSlide, slideCount, className, style, onClick, ...props }) => {
    //     return <ArrowLeftCircle onClick={onClick} {...props} />;
    // };
    const exploreJwellery = {
        infinite: true,
        slidesToShow: 5,
        slidesToScroll: 1,
        centerMode: false,
        variableWidth: true,
        // dots: false,
        // infinite: true,
        // slidesToShow: 5,
        // slidesToScroll: 1,
        // autoplay: false,
        // speed: 500,
        // arrows: true,
        // responsive: [{ breakpoint: 992, settings: { slidesToShow: 1, margin: 50 } }],
    };

    const JwelleryProductSlider = {
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: false,
        variableWidth: true,
    };

    if (isHidden) {
        return <div className='home-page'>
            <div className="banner-img-wrap">
                <div className="banner-img d-flex align-items-center justify-content-center flex-column">
                    <Header />
                    <div className="container">
                        <div class="jewellery d-flex flex-column justify-content-center align-items-center">
                            <div><img src={emptyCart} alt="jwellery-icon" /></div>
                            <h1 class="mt-2 mb-1 head-bold outfit-bold">Jwellery</h1>
                            <p class="txt-sm text-center">Discover exciting jewellery with CVD MART. Notify when site is ready?</p>
                            <form onSubmit={(e) => { e?.preventDefault(); toast?.success("Thankyou..! We will notify you") }}>
                                <div class="notify-input" >
                                    <input class="form-control" placeholder="Enter your mail" name="email" type="email" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-lg" required />
                                    <button class="input-group-text common-button d-block" id="inputGroup-sizing-lg" type="submit" >Notify Me</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div >

    }
    return (

        <div className='home-page'>
            <div className="banner-img-wrap">
                <div className="banner-img d-flex align-items-center justify-content-center flex-column">
                    <Header />
                    <div className="container">
                        <div className="jewellery d-flex flex-column justify-content-center align-items-center">
                            <Heading />
                            <div>
                                <div className='mt-2'>
                                    <JewelleryCategory />
                                </div>
                                <div className='mt-4 '>

                                    <h1 className='explore-content mb-2'>Explore more jewellery</h1>


                                    <Slider {...exploreJwellery} className='explore-slider'>
                                        <Row className='slider-box'>
                                            <Col className='d-flex align-items-center justify-content-center slider-img h-100 w-100'>
                                                <img src={ExploreOne} alt="err" className="w-100 h-100" />
                                            </Col>
                                            <div className="slider-content-txt">
                                                Earrings
                                            </div>
                                        </Row>
                                        <Row className='slider-box'>
                                            <Col className='d-flex align-items-center justify-content-center slider-img h-100 w-100'>
                                                <img src={ExploreTwo} alt="err" className="w-100 h-100" />
                                            </Col>
                                            <div className="slider-content-txt">
                                                Necklace
                                            </div>
                                        </Row>
                                        <Row className='slider-box'>
                                            <Col className='d-flex align-items-center justify-content-center slider-img h-100 w-100'>
                                                <img src={ExploreThree} alt="err" className="w-100 h-100" />
                                            </Col>
                                            <div className="slider-content-txt">
                                                Bracelets
                                            </div>
                                        </Row>
                                        <Row className='slider-box'>
                                            <Col className='d-flex align-items-center justify-content-center slider-img h-100 w-100'>
                                                <img src={ExploreFour} alt="err" className="w-100 h-100" />
                                            </Col>
                                            <div className="slider-content-txt">
                                                Vintage Jewelery
                                            </div>
                                        </Row>
                                        <Row className='slider-box'>
                                            <Col className='d-flex align-items-center justify-content-center slider-img h-100 w-100'>
                                                <img src={ExploreFive} alt="err" className="w-100 h-100" />
                                            </Col>
                                            <div className="slider-content-txt  ">
                                                Master Piece
                                            </div>
                                        </Row>
                                        <Row className='slider-box'>
                                            <Col className='d-flex align-items-center justify-content-center slider-img h-100 w-100'>
                                                <img src={ExploreFive} alt="err" className="w-100 h-100" />
                                            </Col>
                                            <div className="slider-content-txt">
                                                Earrings
                                            </div>
                                        </Row>

                                    </Slider>

                                    {/* <Slider {...JwelleryProductSlider} className='jwellery-product-slider'>
                                        <Row className='slider-box'>
                                            <Col className='d-flex align-items-center justify-content-center slider-img h-100 w-100'>
                                                <img src={ExploreOne} alt="err" className="w-100 h-100" />
                                            </Col>
                                            <div className="slider-content-txt">
                                                Earrings
                                            </div>
                                        </Row>
                                        
                                        

                                    </Slider>
                                    <Slider {...JwelleryProductSlider} className='jwellery-product-slider'>
                                        <Row className='slider-box'>
                                            <Col className='d-flex align-items-center justify-content-center slider-img h-100 w-100'>
                                                <img src={ExploreOne} alt="err" className="w-100 h-100" />
                                            </Col>
                                            <div className="slider-content-txt">
                                                Earrings
                                            </div>
                                        </Row>
                                        
                                        

                                    </Slider>
                                    <Slider {...JwelleryProductSlider} className='jwellery-product-slider'>
                                        <Row className='slider-box'>
                                            <Col className='d-flex align-items-center justify-content-center slider-img h-100 w-100'>
                                                <img src={ExploreOne} alt="err" className="w-100 h-100" />
                                            </Col>
                                            <div className="slider-content-txt">
                                                Earrings
                                            </div>
                                        </Row>
                                        
                                        

                                    </Slider> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer contactsLetter={true} />
        </div>
    )
}

export default index