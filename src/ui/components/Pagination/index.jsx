//library
import React from "react";
import ReactPaginate from "react-paginate";
import { Col, Row } from "reactstrap";

//css
import "./pagination.scss";

export const Pagination = ({
  currentPage,
  handlePagination,
  totalRecords,
  limit,
}) => {
  if (totalRecords === 0) {
    currentPage = currentPage - 1;
  }
  return (
    <div>
      <Row className="mx-0 align-items-center">
        <Col sm="6">
          <p className="ml-1 mb-0 cursor-pointer showing-page-limit">
            showing page {currentPage + 1} of{" "}
            {Math.ceil(totalRecords / limit) == 0
              ? "1"
              : Math.ceil(totalRecords / limit)}
          </p>
        </Col>
        <ReactPaginate
          previousLabel={""}
          nextLabel={""}
          forcePage={currentPage}
          onPageChange={(page) => handlePagination(page)}
          pageCount={totalRecords / limit}
          breakLabel={"..."}
          pageRangeDisplayed={2}
          marginPagesDisplayed={2}
          activeClassName={"active"}
          pageClassName={"page-item"}
          nextLinkClassName={"page-link"}
          nextClassName={"page-item next"}
          previousClassName={"page-item prev"}
          previousLinkClassName={"page-link"}
          pageLinkClassName={"page-link"}
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName={
            "pagination react-paginate separated-pagination pagination-sm pr-1 mt-1 col-sm-6 justify-content-lg-end justify-content-center"
          }
        />
      </Row>
    </div>
  );
};
