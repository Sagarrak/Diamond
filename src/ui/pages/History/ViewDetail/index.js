import React, { useEffect, useMemo } from "react";
import Header from "../../Home/Header/Header";
import "../../Home/home.scss";
import "../../../scss/common.scss";
import { Link, useHistory, useParams } from "react-router-dom";
import BackArrow from "../../../components/Back";
import ImageComp from "../../../components/ImageComp";
import FooterBottom from "../../../components/FooterBottom";
import ConfirmationModel from "./ConfirmationModel";
import { useState } from "react";
import { useQuery, useSubscription } from "react-apollo";
import { GET_SINGLE_ENQUIRY } from "../query";
import { digitalOceanURL } from "../../../common/common";
import moment from "moment";
import PayNowModel from "./PayNowModel";
import { ORDER_NOTIFICATIONS } from "../../Home/query";

const History = () => {
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const [modalPayNow, setModalPayNow] = useState(false);

  const { id } = useParams();
  const { data, loading, refetch } = useQuery(GET_SINGLE_ENQUIRY, {
    variables: { getEnquiryId: id },
    fetchPolicy: "cache-and-network",
  });
  const enquiry = useMemo(() => { return data?.getEnquiry || {}; }, [data]);
  const { data: notification } = useSubscription(ORDER_NOTIFICATIONS);

  useEffect(() => {
    if (notification?.orderStatusChange?.status) {
      refetch();
    }
  }, [notification]);

  const RenderBottom = () => {
    if (enquiry?.orderTrackingStatus === "inQC") {
      return (
        <div>
          <p className="text-light-grey f-20 text-box text-success py-2">
            Your Order is in Quality Checking
          </p>
        </div>
      );
    } else if (enquiry?.orderTrackingStatus === "accepted") {
      if (enquiry?.acceptStatus === "pending" && enquiry?.isPaymentApprovedByAdmin !== "rejected") {
        !loading && setModal(true);
        return "";
      } else if (enquiry?.acceptStatus === "rejected") {
        return (
          <div>
            <p className="text-light-grey f-20 text-box text-danger  py-2">
              Your rejected this Order
            </p>
          </div>
        );
      } else {
        if (enquiry?.isPaymentApprovedByAdmin === "rejected") {
          return (
            <div>
              <p className="text-light-grey f-20 text-box text-danger  py-2">
                Your Payment Is Rejected By Owner{" "}
              </p>
              <p className="text-light-grey f-20 text-box text-danger">
                Reason :{" "}
                {enquiry?.PaymentRejectionMessage ||
                  "No Reason Mentioned from Owner"}{" "}
              </p>
            </div>
          );
        }
        return (
          <div>
            <button
              className="common-button mt-lg-2"
              onClick={() => setModalPayNow(true)}
            >
              Pay Now
            </button>
          </div>
        );
      }
    } else if (enquiry?.orderTrackingStatus === "paymentVerification") {
      if (enquiry?.isPaymentApprovedByAdmin === "rejected") {
        return (
          <div>
            <p className="text-light-grey f-20 text-box text-danger  py-2">
              Your Payment Is Rejected By Owner{" "}
            </p>
            <p className="text-light-grey f-20 text-box text-danger py-2">
              Reason :{" "}
              {enquiry?.PaymentRejectionMessage ||
                "No Reason Mentioned from Owner"}{" "}
            </p>
          </div>
        );
      } else {
        if (enquiry?.paymentSlip) {
          return (
            <div>
              <div className="mb-1">
                <a
                  href={digitalOceanURL + enquiry?.paymentSlip}
                  target="_blank"
                >
                  <button className="common-button mt-lg-2">
                    View Payment Slip
                  </button>
                </a>
                <button
                  className="common-button mt-lg-2 ms-2"
                  onClick={() => setModalPayNow(true)}
                >
                  Change Receipt
                </button>
              </div>
              <p className="text-light-grey  f-20 text-box text-success py-2">
                Your Payment is Being Confirmed By Owner
              </p>
            </div>
          );
        } else {
          return (
            <div>
              <button className="common-button mt-lg-2">Pay Now</button>
            </div>
          );
        }
      }
    } else {
      return (
        <Link to={`/track-order/${id}`}>
          <button className="common-button mt-lg-2">Track Order</button>
        </Link>
      );
    }
  };
  return (
    <div className="history-page view-detail home-page">
      <div className="banner-img-wrap">
        <div className="banner-img d-flex align-items-center justify-content-center flex-column">
          <Header />
          <PayNowModel
            modal={modalPayNow}
            invoiceNo={enquiry?.enquiryNo}
            setModal={setModalPayNow}
            refetch={refetch}
            isPaymentDoneByUser={enquiry?.isPaymentDoneByUser}
            paymentSlip={enquiry?.paymentSlip}
          />
          <ConfirmationModel
            modal={modal}
            invoiceNo={enquiry?.enquiryNo}
            setModal={setModal}
            invoiceUrl={enquiry?.invoiceUrl || enquiry?.proformaInvoiceUrl}
            refetch={refetch}
          />
          <div className="view-detail-content">
            <p className="head-bold text-center outfit-bold">View Details</p>
          </div>
          <div className="container">
            <div className="d-flex align-items-center mb-2">
              <BackArrow history={history} />
              <h3 className="product-desc-title m-0 outfit-bold">Back</h3>
            </div>
          </div>
          <div className="history-page-detail w-100">
            <div className="container">
              <div className="history-page-col">
                <div className="history-row overflow-auto w-100 mb-5">
                  <div className="view-detail-table order-history-wrap">
                    <div className="order-history-header d-md-flex align-items-center flex-wrap justify-content-around">
                      <div className="listed-box d-flex align-items-center justify-content-center">
                        <div className="text-grey-black history-list-header d-flex align-items-center justify-content-center f-20">
                          <p>Order Placed :</p>
                          <p>
                            {moment(enquiry?.createdAt).format("DD/MM/YYYY")}
                          </p>
                        </div>
                      </div>
                      <div className="listed-box d-flex align-items-center justify-content-center ">
                        <div className="text-grey-black history-list-header d-flex align-items-center justify-content-center">
                          <p>Total :</p>
                          <p>
                            {" "}
                            {parseFloat(
                              enquiry?.grandTotal || "0"
                            ).toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="listed-box d-flex align-items-center justify-content-center">
                        <div className="text-grey-black history-list-header d-flex align-items-center justify-content-center">
                          <p>Order :</p>
                          <p> #{enquiry?.enquiryNo}</p>
                        </div>
                      </div>
                    </div>
                    {enquiry?.items?.map((res, index) => {
                      const product = res?.itemId;
                      return (
                        <div
                          className="d-flex align-items-start justify-content-between  order-stone"
                          key={"diamond-" + index}
                        >
                          <div className="d-flex align-items-center">
                            <div className="diamond-view-img">
                              <ImageComp
                                src={product?.image}
                                className="img-fluid w-100 h-100"
                              />
                            </div>

                            <div className="d-flex flex-column ms-2">
                              <h1 className="out-fit-regular text-grey-dark f-20 f-400">
                                {product?.shapeId?.shapeName}{" "}
                                {product?.reportNo}
                                {product?.categoryId?.name ===
                                  "Matching Pair" && (
                                    <span className="out-fit-regular">
                                      (Pair)
                                    </span>
                                  )}
                              </h1>

                              <div className="d-flex align-items-center flex-wrap mt-1 view-product-data">
                                <p className="pe-1 view-items d-flex align-items-center bolder">
                                  Carat:{" "}
                                  <p>
                                    {product?.productDetails?.find(
                                      (d) => d?.parameter === "CARATS"
                                    )?.value || "-"}
                                  </p>
                                </p>
                                <p className="pe-1 view-items d-flex align-items-center bolder">
                                  Color:{" "}
                                  <p>
                                    {product?.productDetails?.find(
                                      (d) => d?.parameter === "COLOR"
                                    )?.value || "-"}
                                  </p>
                                </p>
                                <p className="pe-1 view-items d-flex align-items-center bolder">
                                  Clarity:{" "}
                                  <p>
                                    {product?.productDetails?.find(
                                      (d) => d?.parameter === "CLARITY"
                                    )?.value || "-"}
                                  </p>
                                </p>
                                <p className="pe-1 view-items d-flex align-items-center bolder">
                                  Polish:{" "}
                                  <p>
                                    {product?.productDetails?.find(
                                      (d) => d?.parameter === "POLISH"
                                    )?.value || "-"}
                                  </p>
                                </p>
                                <p className="pe-1 view-items d-flex align-items-center bolder">
                                  Symm:{" "}
                                  <p>
                                    {product?.productDetails?.find(
                                      (d) => d?.parameter === "SYMMETRY"
                                    )?.value || "-"}
                                  </p>
                                </p>
                                <p className="pe-1 view-items d-flex align-items-center bolder">
                                  Ratio:{" "}
                                  <p>
                                    {product?.productDetails?.find(
                                      (d) => d?.parameter === "RATIO"
                                    )?.value || "-"}
                                  </p>
                                </p>
                                <p className="view-items">
                                  {product?.productDetails?.find(
                                    (d) => d?.parameter === "MEASUREMENTS"
                                  )?.value || "-"}
                                </p>
                              </div>

                              <div className="mt-mt-3 mt-1">
                                <Link
                                  to={`/products/${product?.handle}`}
                                  className="out-fit-regular text-grey-dark f-20 f-400 text-decoration"
                                >
                                  View product
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="view-product-content view-btn-content buttler-heading text-md-start text-center mt-lg-0 mt-sm-0 mt-2 d-flex justify-content-between">
                            {index === 0 && (
                              <div>
                                <a
                                  href={
                                    digitalOceanURL +
                                    (enquiry?.invoiceUrl ||
                                      enquiry?.proformaInvoiceUrl)
                                  }
                                  target="_blank"
                                >
                                  <button className="common-button mt-lg-2">
                                    VIEW INVOICE
                                  </button>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <RenderBottom />
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
