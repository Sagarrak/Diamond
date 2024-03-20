
import React, { useEffect, useMemo, useState } from "react";
import Header from "../../Home/Header/Header";
import "../../Home/home.scss";
import "../../../scss/common.scss";
import { Link, useHistory, useParams } from "react-router-dom";
import BackArrow from "../../../components/Back";
import rightCheck from "../../../../assets/images/icons/right-mark.png";
import confirmed from "../../../../assets/images/icons/confirmed-icon.png";
import shipReady from "../../../../assets/images/icons/ship-ready.png";
import transit from "../../../../assets/images/icons/transit .png";
import delivered from "../../../../assets/images/icons/delivered.png";
import FooterBottom from "../../../components/FooterBottom";
import styled from "styled-components";
import { useQuery, useSubscription } from "react-apollo";
import { GET_SINGLE_ENQUIRY } from "../query";
import { ORDER_NOTIFICATIONS } from "../../Home/query";
import moment from "moment";
import { digitalOceanURL } from "../../../common/common";


const index = () => {
	const history = useHistory();
	const { id } = useParams();
	const [activeStep, setActiveStep] = useState(2)
	const { data, loading, refetch } = useQuery(GET_SINGLE_ENQUIRY, { variables: { getEnquiryId: id }, fetchPolicy: "cache-and-network", });
	const enquiry = useMemo(() => { return data?.getEnquiry || {}; }, [data]);
	const { data: notification } = useSubscription(ORDER_NOTIFICATIONS);

	const convertTextToFormat = (text) => {
		let formattedText = text.replace(/([A-Z])/g, ' $1');
		formattedText = formattedText.charAt(0).toUpperCase() + formattedText.slice(1);
		return formattedText;
	}
	useEffect(() => {
		if (notification?.orderStatusChange?.status) {
			refetch();
		}
	}, [notification]);
	useEffect(() => {
		if (["inQC", "accepted", "paymentVerification", null, undefined]?.includes(enquiry?.orderTrackingStatus)) {
			setActiveStep(0)
			history?.push(`/view-detail/${id}`)
		} else {
			switch (enquiry?.orderTrackingStatus) {
				case "confirmed": setActiveStep(2); break;
				case "readyToShip": setActiveStep(3); break;
				case "inTransit": setActiveStep(4); break;
				case "delivered": setActiveStep(5); break;
				default: setActiveStep(0);
			}
		}
	}, [enquiry])
	const steps = [
		{
			label: 'New Order',
			step: 1,
			icon: rightCheck,
		},
		{
			label: 'Confirmed',
			step: 2,
			icon: confirmed,
		},
		{
			label: 'Ready to Ship',
			step: 3,
			icon: shipReady,
		},
		{
			label: 'In Transit',
			step: 4,
			icon: transit,
		},
		{
			label: 'Delivered',
			step: 5,
			icon: delivered,
		},
	]
	const totalSteps = steps.length
	const width = `${(100 / (totalSteps - 1)) * (activeStep - 1)}%`
	return (
		<div className="history-page view-detail home-page">
			<div className="banner-img-wrap">
				<div className="banner-img d-flex align-items-center justify-content-center flex-column">
					<Header />

					<div className="container w-100 view-detail-content">
						<p className="head-bold text-center outfit-bold pb-5">My Order/ Tracking</p>
						<div className="d-flex align-items-center mb-2">
							<BackArrow history={history} />
							<h3 className="product-desc-title m-0 outfit-bold">Back</h3>
						</div>

						<div className="tracking-bar d-flex align-items-center justify-content-between">
							<div className="w-33">
								<p className="text-grey-dark out-fit-regular">Status :</p>
								<p>{convertTextToFormat(enquiry?.orderTrackingStatus)}</p>
							</div>
							<div className="w-33">
								<p className="text-grey-dark out-fit-regular w-33">Shipping By :</p>
								<p>Fedex</p>
							</div>
							<div className="w-33">
								<p className="text-grey-dark out-fit-regular w-33">Tracking</p>
								<p>Tracking-{enquiry?.enquiryNo}</p>
							</div>
						</div>

						{
							activeStep > 1 &&
							<MainContainer className=".tracking-bar">
								<StepContainer width={width}>
									{steps.map(({ step, label, icon }) => (
										<StepWrapper key={step}>
											<StepStyle step={activeStep >= step ? 'completed' : 'incomplete'}>
												<img src={icon} alt="err" />
											</StepStyle>
											<StepsLabelContainer>
												<StepLabel key={step}>{label}</StepLabel>
											</StepsLabelContainer>
										</StepWrapper>
									))}
								</StepContainer>
							</MainContainer>

						}

						<div className="view-invoice-detail">
							<div>
								<div className="d-flex align-items-center">
									<p className="text-grey-black f-24 outfit-light">Order :</p>
									<p className="text-grey-black f-24 outfit-light">#{enquiry?.enquiryNo}</p>
								</div>
								<p className="text-light-grey mt-1">{moment(enquiry?.createdAt).format("DD/MM/YYYY")}</p>
								<div className="d-md-flex align-items-center justify-content-between mt-2">
									<div>
										<a href={digitalOceanURL + (enquiry?.invoiceUrl || enquiry?.proformaInvoiceUrl)} target="_blank"><button className="outline-border-btn mb-lg-0 mb-2">View Invoice</button></a>
									</div>
									<div>
										<Link className="common-button mt-md-0 mt-5" to={`/view-detail/${id}`}>VIEW ORDER DETAILS</Link>
									</div>
								</div>
							</div>
						</div>

					</div>


				</div>
			</div>

			<FooterBottom />
		</div>
	);

};

export default index;


const MainContainer = styled.div`
    width: 100%;
    min-width: 970px;
    margin: 0 auto;
    padding: 0 16px;
	@media (max-width:576px) {
		min-width: 380px;
	}
  `

const StepContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 70px;
    position: relative;
    :before {
      content: '';
      position: absolute;
      background: #B3B3B3;
      height: 6px;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
      left: 0;
    }
    :after {
      content: '';
      position: absolute;
      background: #B3B3B3;
      height: 6px;
      width: ${({ width }) => width};
      top: 50%;
      transition: 0.4s ease;
      transform: translateY(-50%);
      left: 0;
    }
  `

const StepWrapper = styled.div`
    position: relative;
    z-index: 1;
  `

const StepStyle = styled.div`
    width: 41px;
    height: 41px;
    border-radius: 50%;
    background-color: ${({ step }) =>
		step === 'completed' ? '#434343' : '#B3B3B3'};
    border: 3px solid ${({ step }) =>
		step === 'completed' ? '#434343' : '#B3B3B3'};
    transition: 0.4s ease;
    display: flex;
    justify-content: center;
    align-items: center;
  `

const StepsLabelContainer = styled.div`
    position: absolute;
    top: 66px;
    left: 50%;
    transform: translate(-50%, -50%);
  `

const StepLabel = styled.span`
    font-size: 18.41px;
    color: #434343;
    font-family: "OutfitRegular" !important;
    min-width: 130px;
    width: 100%;
    display: inline-block;
    margin: 0 auto;
    text-align: center;
    @media (max-width: 768px) {
      font-size: 16px;
    }
	@media (max-width: 576px) {
		font-size: 12px;
	  }
  `

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 -15px;
    margin-top: 100px;
  `

const ButtonStyle = styled.button`
    border-radius: 4px;
    border: 0;
    background: #4a154b;
    color: #ffffff;
    cursor: pointer;
    padding: 8px;
    width: 90px;
    :active {
      transform: scale(0.98);
    }
    :disabled {
      background: #f3e7f3;
      color: #000000;
      cursor: not-allowed;
    }
  `