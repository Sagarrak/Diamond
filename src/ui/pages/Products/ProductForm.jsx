import React from 'react'
import { Controller } from 'react-hook-form';
import { Col, Form, FormFeedback, Input, Label, Row } from 'reactstrap';
import CommanModal from "../../components/Modal";

const ProductForm = (props) => {
    const { setStatus, AddSubmitHandler, EditSubmitHandler, getBase64, handleSubmit, productCategories, shapeArr, productDetails, paramData, modal, setModal, StatusOptions, toggleHandler, loader, control, errors, register, Select, handleParam } = props;
    return (
        <CommanModal
            modal={modal}
            setModal={setModal}
            updateButtonHandler={handleSubmit(EditSubmitHandler)}
            addButtonHandler={handleSubmit(AddSubmitHandler)}
            toggleHandler={toggleHandler}
            loading={loader}
            updateId={control._defaultValues?.id ? true : false}
            modalTitle={control._defaultValues?.id ? "Edit " : "Add "}
        >
            <Row>
                <Col sm="12">
                    <Form className="auth-login-form mt-2">
                        <Row>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="form-label" htmlFor="login-fname">
                                        Product Name<span className="text-danger">&#42;</span>
                                    </Label>
                                    <Controller
                                        name="productName"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <Input
                                                    type="text"
                                                    {...register("productName", {
                                                        required: true,
                                                    })}
                                                    invalid={errors?.productName && true}
                                                    required
                                                    {...field}
                                                    placeholder="Product Name"
                                                />
                                            );
                                        }}
                                    />
                                    {errors.productName && <FormFeedback>Product Name is required</FormFeedback>}
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="form-label">
                                        Product Description
                                    </Label>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <Input
                                                    type="text"
                                                    {...register("description", {
                                                        required: false
                                                    })}
                                                    invalid={errors?.description && true}
                                                    {...field}
                                                    placeholder="Product Description"
                                                />
                                            );
                                        }}
                                    />
                                    {errors.description && <FormFeedback>Product Description is required</FormFeedback>}
                                </div>
                            </Col>

                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="form-label">Select Product Image</Label> <br />
                                    <Input
                                        type="file"
                                        className=""
                                        name="profile-picture"
                                        onChange={(e) => {
                                            getBase64(e);
                                        }}
                                    />
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <label className="login-label" htmlFor="">
                                        Select Shape<span className="text-danger">&#42;</span>
                                    </label>
                                    <Controller
                                        name="shapeId"
                                        control={control}
                                        render={({ field: { onChange, value } }) => {
                                            return (
                                                <Select
                                                    type="text"
                                                    {...register("shapeId", {
                                                        required: true,
                                                    })}
                                                    invalid={errors?.shapeId && true}
                                                    required
                                                    onChange={(e) => onChange(e)}
                                                    value={value && ("id" in value ? { label: value?.shapeName, value: value?.id } : value)}
                                                    placeholder="Select shape"
                                                    options={shapeArr}
                                                    classNamePrefix="select"
                                                />
                                            );
                                        }}
                                    />
                                    {errors?.shapeId ? <FormFeedback>Please Select Product Shape</FormFeedback> : ""}
                                </div>
                            </Col>

                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="form-label" htmlFor="login-uname">
                                        Net Value<span className="text-danger">&#42;</span>
                                    </Label>
                                    <Controller
                                        name="netValue"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <Input
                                                    type="text"
                                                    {...register("netValue", {
                                                        required: true,
                                                    })}
                                                    invalid={errors?.netValue && true}
                                                    required
                                                    {...field}
                                                    placeholder="Total Price"
                                                />
                                            );
                                        }}
                                    />
                                    {errors.netValue && <FormFeedback>Price is required</FormFeedback>}

                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="form-label" htmlFor="login-uname">
                                        Price Per Carat<span className="text-danger">&#42;</span>
                                    </Label>
                                    <Controller
                                        name="PricePerCarat"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <Input
                                                    type="text"
                                                    {...register("PricePerCarat", {
                                                        required: true,
                                                    })}
                                                    invalid={errors?.PricePerCarat && true}
                                                    required
                                                    {...field}
                                                    placeholder="Total Price"
                                                />
                                            );
                                        }}
                                    />
                                    {errors.PricePerCarat && <FormFeedback>Price is required</FormFeedback>}

                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="form-label">
                                        Lab Comment
                                    </Label>
                                    <Controller
                                        name="labComment"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <Input
                                                    type="text"
                                                    id='labComment'
                                                    // name='labComment'
                                                    {...register("labComment", { required: false })}
                                                    // required={false}
                                                    invalid={errors?.labComment && true}
                                                    {...field}
                                                    placeholder="Lab Comment"
                                                />
                                            );
                                        }}
                                    />
                                    {errors.labComment && <FormFeedback>Lab Comment is required</FormFeedback>}

                                </div>
                            </Col>

                            <Col sm="6">
                                <div className="mb-1">
                                    <label className="login-label" htmlFor="">
                                        Product Category<span className="text-danger">&#42;</span>
                                    </label>
                                    <Controller
                                        name="categoryId"
                                        control={control}
                                        render={({ field: { onChange, value } }) => {
                                            return (
                                                <Select
                                                    type="text"
                                                    {...register("categoryId", {
                                                        required: true,
                                                    })}
                                                    onChange={(e) => {
                                                        onChange(e);
                                                    }}
                                                    value={value && ("id" in value ? { label: value?.name, value: value?.id } : value)}
                                                    invalid={errors?.categoryId && true}
                                                    placeholder="Select category"
                                                    options={productCategories}
                                                    classNamePrefix="select"
                                                />
                                            );
                                        }}
                                    />
                                    {errors?.categoryId ? <FormFeedback>Please Select Product Category</FormFeedback> : ""}
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="form-label"> Certificate No</Label>
                                    <Controller
                                        name="reportNo"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <Input
                                                    type="text"
                                                    {...register("reportNo", {
                                                        required: false
                                                    })}
                                                    invalid={errors?.reportNo && true}

                                                    {...field}
                                                    placeholder="Certificate/Report No"
                                                />
                                            );
                                        }}
                                    />
                                    {errors.reportNo && <FormFeedback>Report No is required</FormFeedback>}

                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="form-label"> certificate URL</Label>
                                    <Controller
                                        name="certificateURL"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <Input
                                                    type="text"
                                                    {...register("certificateURL", {
                                                        required: false
                                                    })}
                                                    invalid={errors?.certificateURL && true}
                                                    {...field}
                                                    placeholder="Certificate/Report Url"
                                                />
                                            );
                                        }}
                                    />
                                    {errors.certificateURL && <FormFeedback>Certificate URL is required</FormFeedback>}

                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="form-label"> Video Link</Label>
                                    <Controller
                                        name="video"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <Input
                                                    type="text"
                                                    {...register("video", {
                                                        required: false
                                                    })}
                                                    invalid={errors?.video && true}
                                                    {...field}
                                                    placeholder="Draggable Video Link"
                                                />
                                            );
                                        }}
                                    />
                                    {errors.video && <FormFeedback>Video is required</FormFeedback>}

                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="form-label"> Mp4 Video Link</Label>
                                    <Controller
                                        name="DiamondVideoMp4"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <Input
                                                    type="text"
                                                    {...register("DiamondVideoMp4", {
                                                        required: false
                                                    })}
                                                    invalid={errors?.DiamondVideoMp4 && true}

                                                    {...field}
                                                    placeholder="Mp4 Video Link"
                                                />
                                            );
                                        }}
                                    />
                                    {errors.DiamondVideoMp4 && <FormFeedback>DiamondVideoMp4 is required</FormFeedback>}

                                </div>
                            </Col>

                            <Col sm="6">
                                <Label htmlFor="role-select">Status</Label>
                                <Select
                                    isClearable={true}
                                    options={StatusOptions}
                                    placeholder="Select status"
                                    onChange={(e) => {
                                        setStatus(e?.value);
                                    }}
                                    value={StatusOptions?.find((d) => d?.label === status)}
                                />
                            </Col>

                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="form-label"> Location </Label>
                                    <Controller
                                        name="location"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <Input
                                                    type="text"
                                                    {...register("location")}
                                                    {...field}
                                                    placeholder="Location"
                                                />
                                            );
                                        }}
                                    />

                                </div>
                            </Col>

                            {/* <---------> Adding Dynamic Fields <---------> */}
                            {paramData?.getAllParameter?.data?.map((data, index) => {
                                const newData = productDetails.filter((a) => data.paramName == a.parameter);

                                if (data?.type === "String") {
                                    return (
                                        <Col key={'d' + index} sm="6">
                                            <div className="mb-1" key={'d' + index}>
                                                <Label className="form-label">{data?.paramName}</Label>
                                                <Input
                                                    type="text"
                                                    placeholder={data?.type}
                                                    onChange={(e) => handleParam(e.target.value, index, data.paramName, data?.type)}
                                                    defaultValue={newData[0]?.value ? newData[0]?.value : ""}
                                                />
                                            </div>
                                        </Col>
                                    );
                                } else if (data?.type === "Number") {
                                    return (
                                        <Col sm="6">
                                            <div className="mb-1" key={index}>
                                                <Label className="form-label">{data.paramName} </Label>
                                                <Input
                                                    type="number"
                                                    placeholder={data?.type}
                                                    onChange={(e) => handleParam(e.target.value, index, data.paramName, data?.type)}
                                                    defaultValue={newData[0]?.value ? newData[0]?.value : 0}
                                                />
                                            </div>
                                        </Col>
                                    );
                                } else {
                                    let optionData = [];
                                    data?.value?.map((res) => {
                                        let val = {
                                            label: res,
                                            value: res,
                                        };
                                        optionData.push(val);
                                    });
                                    if (data?.paramName !== "CARATS RANGE" && data?.paramName !== "PRICE RANGE") {
                                        return (
                                            <Col sm="6">
                                                <div className="mb-1" key={'d' + index}>
                                                    <Label className="form-label">{data?.paramName}</Label>
                                                    <Select
                                                        options={optionData}
                                                        placeholder={`Select ${data?.paramName}`}
                                                        onChange={(e) => handleParam(e?.value, index, data?.paramName, data?.type)}
                                                        value={
                                                            newData.length > 0
                                                                ? { label: newData[0]?.value, value: newData[0]?.value }
                                                                : { label: "select", value: "" }
                                                        }
                                                    />
                                                </div>
                                            </Col>
                                        );
                                    }
                                }
                            })}
                        </Row>
                    </Form>
                </Col>
            </Row>
        </CommanModal>
    )
}

export default ProductForm