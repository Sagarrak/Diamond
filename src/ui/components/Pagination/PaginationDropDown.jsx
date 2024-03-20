//library
import React from "react";
import { Input, Label } from "reactstrap";

export const PaginationDropDown = ({ title, limit, changeLimit }) => {
  return (
    <>
      <Label htmlFor="sort-select" className="justify-content-sm-end me-1">
        {title}
      </Label>
      <Input
        className="dataTable-select"
        type="select"
        id="sort-select"
        value={limit}
        onChange={(e) => changeLimit(e)}
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={75}>75</option>
        <option value={100}>100</option>
      </Input>
    </>
  );
};
