//library
import React from "react";
import { Controller } from "react-hook-form";
import { Form, Input, Label, Row, Col, FormFeedback } from "reactstrap";

//css
// import "../../scss/common.scss";
import Cityselection from "../City/citySelection";

const Bankform = ({ control, errors }) => {
  return (
    <div>
      <Row>
        <Col sm="12">
          <Form className="mt-2">
            <Row>
              <Col sm="12">
                <div className="mb-2">
                  <Label htmlFor="author" className="label-custom">
                    Bank Name<span className="text-danger">&#42;</span>
                  </Label>
                  <Controller
                    name="bankName"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Input
                          type="text"
                          invalid={errors?.bankName && true}
                          placeholder="Enter bank name"
                          {...field}
                        />
                      );
                    }}
                  />
                  {errors && errors?.bankName && (
                    <FormFeedback>Please enter a valid bank name</FormFeedback>
                  )}
                </div>
                <div className="mb-2">
                  <Label htmlFor="author" className="label-custom">
                    IFSC Code<span className="text-danger">&#42;</span>
                  </Label>
                  <Controller
                    name="IFSCCode"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Input
                          type="text"
                          invalid={
                           ( field?.value &&
                            !/^[A-Za-z]{4}[a-zA-Z0-9]{7}$/.test(field?.value) )||(errors?.IFSCCode && true)
                          }
                          onInput={(e) =>
                            (e.target.value = e?.target?.value?.slice(0, 11))
                          }
                          placeholder="Enter IFSC code"
                          {...field}
                        />
                      );
                    }}
                  />
                  {errors && errors?.IFSCCode && (
                    <FormFeedback>Please enter a valid IFSC code</FormFeedback>
                  )}
                </div>
                <div className="mb-2">
                  <Label htmlFor="title" className="label-custom">
                    Address<span className="text-danger">&#42;</span>
                  </Label>
                  <Controller
                    name="address"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Input
                          type="text"
                          invalid={errors?.address && true}
                          placeholder="Enter address"
                          {...field}
                        />
                      );
                    }}
                  />
                  {errors && errors?.address && (
                    <FormFeedback>Please enter a valid address</FormFeedback>
                  )}
                </div>
                <div className="mb-2">
                  <Controller
                    name="cityId"
                    control={control}
                    render={({ field }) => {
                      return <Cityselection {...field} invalid={errors?.cityId && true} alldata={true} />;
                    }}
                  />
                  {errors && errors?.cityId && (
                    <FormFeedback>Please select a valid city </FormFeedback>
                  )}
                </div>
              </Col>
              <Col sm={12} className="d-flex justify-content-end"></Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Bankform;
