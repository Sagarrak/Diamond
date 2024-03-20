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
      <div className="dash-board mt-2">
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
                <Square title="EXPORT STOCKS" description="Export stock data as excel sheet" url="partner-api-reference" />
                <Square title="HOW TO USE APIs" description="Check video to api use" url="#" />
              </div>
              <div className="line2">
                <Square title="GENERATE/VIEW API KEY" description="Generate/View api key to use api" url="generate-partner-authkey" />
                <Square
                  title="API DOCUMENTATION"
                  description="Check api documentation"
                  url="partner-api-reference"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

  );
};

export default vendorDashboard;
