// ** React Imports
import React from "react";

// ** Reactstrap Imports
import { Row, Col, Card, CardBody, CardText, Table } from "reactstrap";

// ** Styles
import "react-slidedown/lib/slidedown.css";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/base/pages/app-invoice.scss";
import Logo from "../../../../assets/images/pages/header-logo.png";
import moment from "moment";
import EditHoldRequestAction from "./EditHoldRequestAction";
import TempProductImg from "../../../../@core/assets/images/diamond.png";
import ImageComp from "../../ImageComp";
const HoldRequestEditCard = ({ data, refetch, closeModal, setLoaderData }) => {
  return (
    <div className="invoice-edit-wrapper">
      <Row className="invoice-edit">
        <Col xl={9} md={8} sm={12}>
          <Card className="invoice-preview-card">
            <CardBody className="invoice-padding pb-0">
              <div className="d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0">
                <div>
                  <div className="brand-logo mb-1">
                    <img src={Logo} alt="logo" width={140} />
                  </div>
                  <p className="card-text mb-25">Wallasey Ave, North York,</p>
                  <p className="card-text mb-25">ON M9M 1E1, Canada</p>
                  <p className="card-text mb-0">+1 (613) 630-1301</p>
                </div>
                <div className="invoice-number-date mt-md-0 mt-2">
                  <div className="d-flex align-items-center justify-content-md-end mb-1"></div>
                  <div className="mt-md-0 mt-2">
                    <div className="invoice-date-wrapper">
                      <p className="invoice-date-title">Request Date: </p>
                      <p className="invoice-date">{moment(data?.createdAt).format("DD/MM/YYYY")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>

            <hr className="invoice-spacing" />

            <CardBody className="invoice-padding pt-0">
              <Row className="invoice-spacing">
                <Col className="p-0" xl="8">
                  <h6 className="mb-2">Request by:</h6>
                  <h6 className="mb-25">{data?.createdBy?.fullName}</h6>
                  <CardText className="mb-25">{data?.createdBy?.email}</CardText>
                </Col>
              </Row>
            </CardBody>
            <CardBody className="invoice-padding invoice-product-details">
              <Table responsive>
                <thead>
                  <tr>
                    <th className="py-1">Product</th>
                    <th className="py-1">Price</th>
                    <th className="py-1">Discount</th>
                    <th className="py-1">Total</th>
                    <th className="py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.itemIds?.map((d, i) => {
                    const discountPrice =
                      (parseFloat(d?.discount) * (parseFloat(d?.price) * parseInt(d?.quantity))) / 100;
                    return (
                      <tr key={d?.id}>
                        <td className="py-1">
                          <div className="d-flex align-items-center pb-1">
                            <div style={{ width: "90px", height: "90px" }}>
                              <ImageComp
                                src={d?.image}
                                width="100%"
                                height="100%"
                              />
                            </div>
                            <div>
                              <p className="card-text fw-bold mx-1">{d?.productName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-1">
                          <span className="fw-bold">${d?.totalPrice}</span>
                        </td>
                        <td className="py-1">
                          <span className="fw-bold">
                            {discountPrice ? "$" + discountPrice : 0} ({d?.discount || 0}%)
                          </span>
                        </td>
                        <td className="py-1">
                          <span className="fw-bold">${d?.totalPrice}</span>
                        </td>
                        <td className="py-1">
                          <span className="fw-bold">{d?.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </CardBody>
            <hr className="invoice-spacing mt-0" />
          </Card>
        </Col>
        <Col xl={3} md={4} sm={12}>
          <EditHoldRequestAction refetch={refetch} closeModal={closeModal} setLoaderData={setLoaderData} data={data} />
        </Col>
      </Row>
    </div>
  );
};

export default HoldRequestEditCard;
