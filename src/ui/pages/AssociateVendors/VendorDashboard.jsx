import React from "react";
import { useHistory } from "react-router-dom";
import "../Dashboard/dashboard.scss";

const vendorDashboard = () => {
  const history = useHistory();
  const userData = JSON?.parse(localStorage?.getItem("UserRes"));
  const userName = userData?.fullName || userData?.userName;
  const Square = (props) => {
    return (
      <div
        className="square cursor-pointer"
        onClick={() => {
          history?.push("/" + props?.url);
        }}
      >
        <p className="title">{props?.title}</p>
        <p className="description">{props?.description}</p>
      </div>
    );
  };
  return (
    <div className="container">
      <div className="dash-board mt-2" >
        <div className="header-text d-flex justify-content-center align-items-center flex-column">
          <h1 className="mainHeading buttler-heading">My Account</h1>
          <div className="lowerText">
            <p className="p-0 m-0 text-center">
              <strong>Welcome {userName}</strong>
            </p>
            <p className="p-0 m-0 text-center">you can manage your shopping experience at CVD online store.</p>
          </div>
          <div className="vendor-dashboard">
            <div className="dashSquares">
              <div className="line1">
                <Square title="UPLOAD STOCKS" description="Upload your stocks" url="UploadStock" />
                <Square title="VIEW/EDIT MY STOCKS" description="View or update your stocks" url="vendor-products" />
              </div>
              <div className="line2">
                <Square
                  title="ORDER HISTORY"
                  description="Check your past orders, order numbers and track current deliveries."
                  url="OrderHistory"
                />
                <Square title="HOLD REQUESTS" description="Check your past and current requests" url="hold-Request" />
              </div>
              <div className="line2">
                <Square title="REPORTS" description="View parameter wise report" url="product-reports" />
                <Square title="UPLOAD HISTORY" description="View your upload history" url="UploadHistory" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default vendorDashboard;
