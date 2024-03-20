import React, { useState } from "react";
import { Link, useHistory, } from "react-router-dom";
import Header from "../Home/Header/Header";
import Slider from "react-slick";
import HomeContent from "./HomeContent";
import "../Inventory/inventory.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Row, Col } from "reactstrap";
import roundBG from "../../../assets/images/images/roundBG.png";
import heartBG from "../../../assets/images/images/heartBG.png";
import pearBG from "../../../assets/images/images/pearBG.png";
import marquiseBG from "../../../assets/images/images/marquiseBG.png";
import emeraldBG from "../../../assets/images/images/emeraldBG.png";
import princessBG from "../../../assets/images/images/princessBG.png";
import ovalBG from "../../../assets/images/images/ovalBG.png";
import asscherBG from "../../../assets/images/images/asscherBG.png";
import diamondCutVector from "../../../assets/images/svg/diamond-vector-1.svg";
import featureDiamond from "../../../assets/images/svg/feature-1.svg";
import featureDiamondSecond from "../../../assets/images/svg/feature-2.svg";
import featureDiamondThird from "../../../assets/images/svg/feature-3.svg";
import featureDiamondFourth from "../../../assets/images/svg/feature-4.svg";
import featureDiamondFifth from "../../../assets/images/svg/feature-5.svg";
import featureDiamondsix from "../../../assets/images/svg/feature-6.svg";
import AsscherVector from "../../../assets/images/svg/aschher-vector.svg";
import EmeraldVector from "../../../assets/images/svg/emerald-vector.svg";
import heartVector from "../../../assets/images/svg/heart-vector.svg";
import MarquiseVector from "../../../assets/images/svg/marquise-vector.svg";
import OvalVector from "../../../assets/images/svg/oval-vector.svg";
import pearVector from "../../../assets/images/images/Frame.svg";
import PrincessVector from "../../../assets/images/svg/princess-vector.svg";
import readmoreImg from "../../../assets/images/pages/read-more-img.png";
import readMoreTwise from "../../../assets/images/pages/read-more-2.png";
import _ from "lodash";
import { ChevronLeft, ChevronRight } from "react-feather";
import Footer from "../../components/Footer";
import ImageComp from "../../components/ImageComp";
import { useEffect } from "react";
import axios from "axios";
import { GET_ALL_BLOG } from "../Blog/query";
import { useQuery } from "react-apollo";
import { digitalOceanURL } from "../../common/common";

const Home = () => {
  const SampleNextArrow = ({ currentSlide, slideCount, className, style, onClick, ...props }) => {
    return <ChevronRight onClick={onClick} {...props} />;
  };

  const SamplePrevArrow = ({ currentSlide, slideCount, className, style, onClick, ...props }) => {
    return <ChevronLeft onClick={onClick} {...props} />;
  };
  const diamondCutSlide = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: (<SampleNextArrow />),
    prevArrow: (<SamplePrevArrow />),
    responsive: [{ breakpoint: 1024, settings: { slidesToShow: 1, margin: 50 } }],
  };
  const [blogs, setBlogs] = useState([]);
  const [currentPage, setcurrentPage] = useState(0)
  const [limit, setlimit] = useState(3)
  const history = useHistory()

  //query
  const { loading, data, refetch } = useQuery(GET_ALL_BLOG, {
    variables: {
      page: currentPage + 1,
      limit: limit,
    },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (data?.getBlogs) {
      // setLoader(false);
      setBlogs(data?.getBlogs?.data);
    }
  }, [data]);

  // useEffect(() => {
  //   const options = {
  //     method: 'POST',
  //     url: 'https://api-ap-south-1.hygraph.com/v2/cl8js79vq11b901t0gyat3sm0/master',
  //     headers: { 'content-type': 'application/json' },
  //     data: {
  //       query: `{
  //         blogs(first:3) {
  //           id
  //           title
  //           tagLine
  //           image { url }
  //           contents { html }
  //         }
  //       }`
  //     }
  //   };
  //   axios
  //     .request(options)
  //     .then(function (response) {
  //       if (response?.data?.data?.blogs) { setBlogs(response?.data?.data?.blogs) }
  //     })
  //     .catch(function (error) { console.error(error); });
  // }, [])


  const SliderComp = ({ fimg, simg, SlidrTitle }) => {
    return (
      <div className="diamond-cut-slider position-relative">
        <div className="diamond-cut-img-wrap">
          <img src={fimg} alt="diamond-cut" className="img-fluid" />
        </div>
        <div className="diamond-vector-box d-flex align-items-center justify-content-center flex-column position-absolute">
          <div className="d-flex align-items-center justify-content-between">
            <div className="diamond-vector-img-wrap mx-3 cursor-pointer" onClick={() => { history?.push("/jewelry"); }}>
              <img src={simg} alt="diamond-vector" className="img-fluid" />
            </div>
          </div>
          <h4 className="text-md mt-2 mb-0 buttler-light">{SlidrTitle}</h4>
        </div>
      </div>
    );
  };


  return (
    <div className="home-page">
      <div className="banner-img-wrap">
        <div className="banner-img d-flex align-items-center justify-content-center flex-column">
          <Header />
          <HomeContent />
          <div className="container-lg">
            <div className="d-flex justify-content-between">
              <p className="home-bg-content">Diamonds</p>
              <p className="home-bg-content">Jewellery</p>
            </div>
          </div>
        </div>
      </div>
      {/* End :banner-img sec */}

      {/* Start: ReadMore sec */}
      <div className="read-more-sec">
        <div className="container">
          <div className="row gx-10">
            <div className='col-xl-7 col-12 read-col' style={{ margin: "5px 0" }}>
              <div className="read-more-content">
                <p className="head-bold outfit-bold">We’re the experts </p>
                <p className="head-bold outfit-bold">so you don’t have to be. </p>
                <p className="text-sm-content pt-1 pb-2 diamond-content">We take pride in offering a vast and expansive inventory of lab-grown diamonds. As a trusted and reliable source for these stunning diamonds, we have carefully curated a collection that is sure to meet your every need and desire. Our commitment to quality and authenticity is unwavering, ensuring that each and every diamond in our inventory is of the highest standard. With our extensive selection, you can explore a variety of sizes, cuts, colors, and different shapes, allowing you to find the perfect lab-grown diamond to suit your unique style and design needs.
                </p>
                <Link className="btn-sm d-flex align-items-center read-content-explore" to={`/inventory/diamonds`}>
                  <span className="line-width"></span>
                  Explore more</Link>
              </div>
            </div>
            <div className='col-xl-5 col-12 read-more-img-col mx-md-auto d-block' >
              <div className="readmore-img-wrap">
                <img src={readmoreImg} alt="readmoreImg" className="readmoreImg" />
                <div>
                  <img src={readMoreTwise} alt="readMoreTwise" className="readMoreTwise" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End: ReadMore sec */}

      {/* Start: home-feature-sec */}
      <div className="home-feature-sec text-white py-4 text-center">
        <div className="container">
          <p className="pb-2 head-bold outfit-bold">Our Features</p>

          <div className="d-flex justify-content-between flex-wrap mb-2 Features-sec">
            <div className="w-11 home-feature-img mt-lg-0 mt-2">
              <div className="feature-img-wrap">
                <img src={featureDiamond} alt="featureDiamond" className="w-full h-full" />
              </div>
              <h3 className="pt-2 text-dark-grey">Trusted and Verified Suppliers</h3>
            </div>

            <div className="w-11 home-feature-img mt-lg-0 mt-2">
              <div className="feature-img-wrap">
                <img src={featureDiamondSecond} alt="featureDiamondSecond" className="w-full h-full" />
              </div>
              <h3 className="pt-2 text-dark-grey">Diverse Inventory of All shapes and sizes</h3>
            </div>

            <div className="w-11 home-feature-img mt-lg-0 mt-2">
              <div className="feature-img-wrap">
                <img src={featureDiamondThird} alt="featureDiamondSecond" className="w-full h-full" />
              </div>
              <h3 className="pt-2 text-dark-grey">Quality check before shipping</h3>
            </div>

            <div className="w-11 home-feature-img mt-lg-0 mt-2">
              <div className="feature-img-wrap">
                <img src={featureDiamondFourth} alt="featureDiamondSecond" className="w-full h-full" />
              </div>
              <h3 className="pt-2 text-dark-grey">Competitive Prices</h3>
            </div>

            <div className="w-11 mt-lg-0 mt-2 home-feature-img">
              <div className="feature-img-wrap">
                <img src={featureDiamondFifth} alt="featureDiamondSecond" className="w-full h-full" />
              </div>

              <h3 className="pt-2 text-dark-grey">BEasy to use Marketplace</h3>
            </div>
            <div className="w-11 mt-lg-0 mt-2 home-feature-img">
              <div className="feature-img-wrap ">
                <img src={featureDiamondsix} alt="featureDiamondSecond" className="w-full h-full" />
              </div>

              <h3 className="pt-2 text-dark-grey">24/7 Customer Support</h3>
            </div>
          </div>
        </div>
      </div>
      {/* End: home-feature-sec  */}

      {/* Start: certified-sec */}
      <div className="certified-sec">
        <div className="diamond-cuts-sec">
          <div className="container">
            <Row className="d-flex align-items-center justify-content-center">
              <Col xl="4" lg="5" md="12">
                <Slider {...diamondCutSlide}>
                  <SliderComp fimg={roundBG} simg={diamondCutVector} SlidrTitle="Round" />
                  <SliderComp fimg={heartBG} simg={heartVector} SlidrTitle="Heart" />
                  <SliderComp fimg={pearBG} simg={pearVector} SlidrTitle="Pear" />
                  <SliderComp fimg={marquiseBG} simg={MarquiseVector} SlidrTitle="Marquise" />
                  <SliderComp fimg={emeraldBG} simg={EmeraldVector} SlidrTitle="Emerald" />
                  <SliderComp fimg={princessBG} simg={PrincessVector} SlidrTitle="Princess" />
                  <SliderComp fimg={ovalBG} simg={OvalVector} SlidrTitle="Oval" />
                  <SliderComp fimg={asscherBG} simg={AsscherVector} SlidrTitle="Asscher" />
                </Slider>
              </Col>
              <Col xl="8" lg="7" md="12">
                <div className="certified-diamond-slider">
                  <p className="pb-2 head-bold outfit-bold">Certified Diamonds</p>
                  <p className="pb-2 text-sm-content diamond-cut">
                    Whether you are searching for a dazzling engagement ring or a breathtaking necklace, our knowledgeable team is ready to guide you through the process and provide you with the information and guidance you need to make an informed decision. Experience the beauty and brilliance of lab grown diamonds with us today.
                  </p>
                  <Link className="btn-sm d-flex align-items-center m-xl-0 diamond-explore" to="/inventory/diamonds">
                    <span className="line-width"></span>
                    See more
                  </Link>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
      {/* <div className="blog-sec">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-2 blog-content">
            <div><p className="head-bold outfit-bold">From Our Blog</p></div>
            <div><Link to="/blogs" className="underline-green-text">View all</Link></div>
          </div>
          <div className="row justify-content-center">
            {
              blogs?.map(data => {
                return <div className="col-xl-4 col-lg-6 mt-2" key={data?.id}>
                  <div className="card blog-card" >
                    <div className="blog-card-img"><ImageComp src={`${digitalOceanURL}${data?.image}`} className="card-img-top w-100 h-100" alt="BlogImgFirst" /></div>
                    <div className="card-body">
                      <h5 className="blog-card-text outfit-bold mb-1">{data?.content}</h5>
                      <div className="mt-3"><Link className="common-button" to={`/blogs/${data?.id}`}>Read more..</Link></div>
                    </div>
                  </div>
                </div>
              })
            }
          </div>
        </div>
      </div> */}
      <Footer showNewsLetter={true} />
    </div>
  );
};

export default Home;
