import React, { useEffect, useMemo, useState } from "react";
import { Bell } from "react-feather";
import { Modal } from "reactstrap";
import closes from "../../../../src/assets/images/icons/close.svg";
import "../../pages/Home/home.scss";
import { Link } from "react-router-dom";

const RightModel = ({
  openSideModal,
  handleSideModal,
  setOpenSideModal,
  Heading,
  TitleLogo,
  ContentComponent,
  icon
}) => {
  const [backdrop, setBackdrop] = useState(false);
  const user = localStorage?.getItem("UserRes") && JSON?.parse(localStorage?.getItem("UserRes"));

  return (
    <div>
      <Modal
        isOpen={openSideModal}
        toggle={handleSideModal}
        className={`${Heading === "Explore Here" ? "header-lg" : "sidebar-lg"}`}
        contentClassName="p-0"
        modalClassName="modal-slide-in sidebar-todo-modal nav-modal-content"
        backdrop={backdrop ? "static" : undefined}
      >
        <div
          className={`d-flex pe-3 ps-2 py-2 ${Heading === "Explore Here" ? "border-bottom-0" : "border-bottom-1"}`}
          style={{ justifyContent: "space-between", borderBottom: "1px solid #656565", }}
        >
          <div className="d-flex align-items-center">
            {icon ? <Bell /> : <img className='header-profileicon' src={TitleLogo} />}
            <h3 className={`ms-xxl-2 ms-1 mb-0 align-items-center outfit-thin`}>{Heading === "Explore Here" ? <div className="header_profile">{user?.fullName ? <p>{user?.fullName}</p> : <Link to="/login">Login</Link>}</div> : <p>{Heading}</p>}</h3>
          </div>
          <div className="cursor-pointer">

            <img
              style={{ marginTop: '5px' }}
              src={closes}
              width={"20px"}
              onClick={() => {
                setOpenSideModal(false);
              }}
            />
          </div>
        </div >

        <div className="modal-content p-0">
          <ContentComponent setBackdrop={setBackdrop} />
        </div>

      </Modal >
    </div >
  );
};

export default RightModel;
