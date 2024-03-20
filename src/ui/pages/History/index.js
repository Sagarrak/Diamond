import Header from "../Home/Header/Header";
import "../Home/home.scss";
import "../../scss/common.scss";
import CurrencySymbolContext from "../../../context/CurrencySymbolContext";
import { GET_INVOICES } from "./query";
import { useEffect, useState, useContext } from "react";
import { useMutation, useQuery, useSubscription } from "react-apollo";
import { UncontrolledTooltip } from "reactstrap";
import BackArrow from "../../components/Back";
import { Link, useHistory } from "react-router-dom";
import FooterBottom from "../../components/FooterBottom";
import moment from "moment";
import exclaimination from "../../../assets/images/svg/exclaimination-icon.svg";
import { ACCEPT_INVOICE } from "./mutation";
import { ORDER_NOTIFICATIONS } from "../Home/query";

const History = () => {
  const [invoiceData, _invoiceData] = useState([]);
  const currencyData = useContext(CurrencySymbolContext);
  const history = useHistory();
  const inputVar = {
    page: 1,
    limit: 1000,
    sort: { key: "createdAt", type: -1 },
    filter: "{}",
    search: "",
  };
  const convertTextToFormat = (text) => {
    let formattedText = text.replace(/([A-Z])/g, " $1");
    formattedText =
      formattedText.charAt(0).toUpperCase() + formattedText.slice(1);
    return formattedText;
  };

  const { data: enquiries, refetch } = useQuery(GET_INVOICES, {
    variables: inputVar,
    fetchPolicy: "cache-and-network",
  });
  const { data: notification } = useSubscription(ORDER_NOTIFICATIONS);

  useEffect(() => {
    if (notification?.orderStatusChange?.status) {
      refetch();
    }
  }, [notification]);

  useEffect(() => {
    if (enquiries?.getAllEnquiries) {
      _invoiceData(enquiries?.getAllEnquiries);
    }
  }, [enquiries]);

  useEffect(() => {
    if (enquiries?.getAllEnquiries) {
      _invoiceData(enquiries?.getAllEnquiries);
    }
  }, [enquiries]);

  const OrderStatus = ({ enquiry }) => {
    if (enquiry?.orderTrackingStatus === "inQC") {
      return <span className="text-success">In Quality Checking</span>;
    } else if (enquiry?.orderTrackingStatus === "accepted") {
      if (enquiry?.acceptStatus === "pending") {
        return <span>Please Accept/Reject Order</span>;
      } else if (enquiry?.acceptStatus === "rejected") {
        return <span className="text-danger">Rejected By You</span>;
      } else {
        return <span className="mt-lg-2 text-danger">Pending Payment</span>;
      }
    } else if (enquiry?.orderTrackingStatus === "paymentVerification") {
      if (enquiry?.isPaymentApprovedByAdmin === "rejected") {
        return <span className="text-danger">Payment Rejected</span>;
      } else {
        if (enquiry?.paymentSlip) {
          return (
            <span className="text-success">
              Your Payment is Being Confirmed By Owner
            </span>
          );
        } else {
          return <span className="text-warning mt-lg-2">Pending Payment</span>;
        }
      }
    } else if (enquiry?.orderTrackingStatus === "confirmed") {
      return <span className="text-success">Confirmed</span>;
    } else {
      return (
        <span className="text-success">
          {convertTextToFormat(enquiry?.orderTrackingStatus) || ""}
        </span>
      );
    }
  };

  return (
    <div className="history-page home-page">
      <div className="banner-img-wrap">
        <div className="banner-img d-flex align-items-center justify-content-center flex-column">
          <Header />
          <div className="view-detail-content">
            <p className="head-bold text-center outfit-bold">Your Order</p>
          </div>

          <div className="container history-wrap d-flex">
            <div className="d-flex align-items-center mb-2 back-btn">
              <BackArrow history={history} />
              <h3 className="product-desc-title m-0 outfit-bold">Back</h3>
            </div>
            {/* <p>fdtsfts</p> */}
          </div>
          {/* history-page-detail */}
          <div className="history-page-detail w-100">
            <div className="container">
              <div className="history-page-col mt-0">
                <div className="d-flex history-row overflow-auto">
                  <div className="accordion w-100" id="accordionExample">
                    <div className="order-history-wrap mb-2">
                      <div className="order-history-header d-md-flex align-items-center">
                        <div className="listed-box d-flex align-items-center justify-content-center w-25per">
                          <div>Orders</div>
                        </div>
                        <div className="listed-box d-flex align-items-center justify-content-center w-17">
                          <div>Items</div>
                        </div>
                        <div className="listed-box d-flex align-items-center justify-content-center w-25per">
                          <div>Order Placed</div>
                        </div>
                        <div className="listed-box d-flex align-items-center justify-content-center w-15">
                          <div>Status</div>
                        </div>
                        <div className="listed-box d-flex align-items-center justify-content-center">
                          <div></div>
                        </div>
                      </div>
                      {invoiceData?.data?.length > 0 &&
                        invoiceData?.data?.map((res, index) => {
                          return (
                            <div className="view-order-product " key={res?.id}>
                              <div className="view-product-content buttler-heading text-md-start text-center mt-lg-0 mt-sm-0 mt-2  d-md-flex align-items-center flex-wrap">
                                <h1 className="ogg-regular view-detail-body d-flex align-items-center justify-content-center w-25per">
                                  <div>{res?.enquiryNo}</div>
                                </h1>
                                <div className="view-detail-body d-flex align-items-center justify-content-center  w-17">
                                  <div> {res?.items?.length || 0}</div>
                                </div>
                                <div className="view-detail-body d-flex align-items-center justify-content-center w-25per">
                                  <div>
                                    {moment(res?.createdAt).format(
                                      "DD-MM-YYYY"
                                    )}
                                  </div>
                                </div>
                                <div className="view-detail-body d-flex align-items-center justify-content-center  w-15">
                                  <div>
                                    <OrderStatus enquiry={res} />
                                  </div>
                                </div>
                                <Link
                                  to={`/view-detail/${res?.id}`}
                                  className="text-black view-detail-body d-flex align-items-center justify-content-center w-15"
                                >
                                  View details
                                  {/* <UncontrolledTooltip placement="top" target={`toolTip-${res?.id}`}	>
																		Hey there
																	</UncontrolledTooltip>
																	<img src={exclaimination} id={`toolTip-${res?.id}`} className="ms-3" /> */}
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                    </div>
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
export default History;
