import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { Col, List, Row } from "reactstrap";
import Header from "../../../Home/Header/Header";
import Footer from "../../../../components/Footer";
import Star from "../images/star-icon.svg";
import Gold from "../../../../components/MetalDropDown/Images/Gold.png";
import Silver from "../../../../components/MetalDropDown/Images/Silver.png";
import Rose from "../../../../components/MetalDropDown/Images/Rose.png";
import Platinum from "../../../../components/MetalDropDown/Images/Platinum.png";
import ShipIcon from "../images/shipping-icon.svg";
import LockIcon from "../images/lock-icon.svg";
import DropHint from "../images/drop-hint.svg";
import Emailus from "../images/email-us.svg";
import Phone from "../images/phone-icon.svg";
import BackArrow from "../../../../components/Back";
import { GetSingleJewellery } from '../../../../functions/commonQuries'

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";

import "../jewellery.scss";
import { Heart } from "react-feather";
import { digitalOceanURL } from "../../../../common/common";
import { AddToCart } from "../../../../functions/commonFunctions";
// import { Star } from 'react-feather';

const JewelryDescription = () => {
  const history = useHistory();
  const [jewelleryData, setjewelleryData] = useState([])

  const { id } = useParams();
  const [open, setOpen] = useState("1");
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };
  const params = useParams()

  const { data, loading, refetch } = GetSingleJewellery(params?.id);

  useEffect(() => {
    if (data?.getJewellery) {
      setjewelleryData(data?.getJewellery)
    }

  }, [data])

  return (
    <div className="home-page jwellery-showcase">
      <div className="banner-img-wrap">
        <div className="banner-img d-flex align-items-center justify-content-center flex-column">
          <Header />

          <div className="container mt-5 mb-5 ">
            <Row className="gx-5 jwelry-description">
              <div className="d-flex align-items-center mb-2">
                <BackArrow history={history} />
                <h3 className="product-desc-title m-0">Back</h3>
              </div>
              <Col lg={6} md={12}>
                <Row className="g-1">
                {jewelleryData?.productImages?.slice(0,4)?.map((d)=>(
                  <Col lg={6} md={12}>                   
                    <div>
                      <img src={`${digitalOceanURL}${d}`} alt="err" className="w-100 h-100" />
                    </div>                  
                  </Col>               
                  ))}
                  </Row>
              </Col>
              <Col lg={6} md={12}>
                <div className="jwelery-content">
                  <p className="black-text">{jewelleryData?.productName}</p>                 
                  <p className="f-26 grey-text my-1">{`$${jewelleryData?.price}`}</p>
                  <div className="d-flex align-items-center my-1">
                    <div>
                      <img src={Star} alt="err" />
                    </div>
                    <div>
                      <img src={Star} alt="err" />
                    </div>
                    <div>
                      <img src={Star} alt="err" />
                    </div>
                    <div>
                      <img src={Star} alt="err" />
                    </div>
                  </div>
                  <p className="cloud-grey f-20 line-height-30 ">
                    {jewelleryData?.description}
                  </p>
                  <div className="d-flex align-items-center my-2">
                    <p className="f-26 grey-text">Metal :</p>
                    <div>
                      <ul className="box-bottom-btn d-flex align-items-center ms-1">
                        {jewelleryData?.metalName === "WHITE_GOLD" &&
                          <li className="border-around me-1">
                            <img src={Silver} alt="err" />
                          </li>
                        }
                        {jewelleryData?.metalName === "GOLD" &&
                          <li className="me-1">
                            <img src={Gold} alt="err" />
                          </li>
                        }
                        {jewelleryData?.metalName === "ROSE_GOLD" &&
                          <li className="me-1">
                            <img src={Rose} alt="err" />
                          </li>
                        }
                        {jewelleryData?.metalName === "PLATINUM" &&
                          <li className="me-1">
                            <img src={Platinum} alt="err" />
                          </li>
                        }
                      </ul>
                    </div>
                    {jewelleryData?.metalName === "ROSE_GOLD" ?
                      <p className="grey-text ms-1 f-18">{"ROSE GOLD"}</p>
                      : ''}
                    {jewelleryData?.metalName === "WHITE_GOLD" ?
                      <p className="grey-text ms-1 f-18">{"WHITE GOLD"}</p>
                      : ''}
                    {jewelleryData?.metalName === "GOLD" ?
                      <p className="grey-text ms-1 f-18">{"GOLD"}</p>
                      : ''}
                    {jewelleryData?.metalName === "PLATINUM" ?
                      <p className="grey-text ms-1 f-18">{"PLATINUM"}</p>
                      : ''}
                  </div>
                
                  <div className="d-flex align-items-center" >
                    <button className={`black-btn d-block f-18 my-2 me-2 ${jewelleryData && jewelleryData?.quantity <= 0 ? 'disabled' : ''}`} >
                      Add to cart
                    </button>
                    <Heart />
                  </div>

                  <div className="d-flex align-items-center line-height-30">
                    <div className="icon-wrap">
                      <img src={ShipIcon} alt="err" />
                    </div>
                    <p className="grey-text f-20">
                      Free Shipping, Free 3D Day Returns
                    </p>
                  </div>
                  <div className="d-flex align-items-center line-height-30">
                    <div className="icon-wrap">
                      <img src={LockIcon} alt="err" />
                    </div>
                    <p className="grey-text f-20">
                      Order now and your order ships by....
                    </p>
                  </div>

                  <div className="d-flex align-items-center my-3">
                    <div className="contact-detail text-center">
                      <img src={DropHint} alt="err" className="mb-1" />
                      <p className="grey-text f-18">Drop Hint</p>
                    </div>
                    <div className="contact-detail text-center mx-2">
                      <img src={Emailus} alt="err" className="mb-1" />
                      <p className="grey-text f-18">Email Us</p>
                    </div>
                    <div className="contact-detail text-center">
                      <img src={Phone} alt="err" className="mb-1" />
                      <p className="grey-text f-18">98789-XXXXX</p>
                    </div>
                  </div>

                  <Accordion open={open} toggle={toggle}>
                    <AccordionItem>
                      <AccordionHeader targetId="1" className="">
                        Ring Details
                      </AccordionHeader>
                      <AccordionBody accordionId="1">
                        <List>
                          <li className="d-flex align-items-center mt-2">
                            <p className="outfit-light grey-text f-20 accordion-drop-text">
                              Style :
                            </p>
                            <p>{jewelleryData?.styleId?.styleName}</p>
                          </li>
                          <li className="d-flex align-items-center mt-2">
                            <p className="outfit-light grey-text f-20 accordion-drop-text">
                              Metal :
                            </p>
                            <p>ddfd</p>
                          </li>
                          {/* <li className="d-flex align-items-center mt-2">
                            <p className="outfit-light grey-text f-20 accordion-drop-text">
                              Shape :
                            </p>
                            <p>ddfd</p>
                          </li> */}
                          <li className="d-flex align-items-center mt-2">
                            <p className="outfit-light grey-text f-20 accordion-drop-text">
                              Backing :
                            </p>
                            <p>{jewelleryData?.backing}</p>
                          </li>
                          <li className="d-flex align-items-center mt-2">
                            <p className="outfit-light grey-text f-20 accordion-drop-text">
                              Rhodium finish :
                            </p>
                            <p>{String(jewelleryData?.isRhodium)}</p>
                          </li>
                          {/* <li className="d-flex align-items-center mt-2">
                            <p className="outfit-light grey-text f-20 accordion-drop-text">
                              Setting :
                            </p>
                            <p>ddfd</p>
                          </li> */}
                        </List>
                      </AccordionBody>
                    </AccordionItem>
                  </Accordion>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default JewelryDescription;
