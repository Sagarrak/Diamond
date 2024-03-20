import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from "reactstrap";
import { Controller } from "react-hook-form";
import Countries from "../../Inventory/country";
import CommanModal from "../../../components/Modal";
import { FormFeedback } from "reactstrap";
import CommonFields from "./CommonFields";
import { digitalOceanURL } from "../../../common/common";

function LooseandLayout(props) {
    const {
        Select,
        IMPloading,
        importModal,
        setLooseLayout,
        control,
        errors,
        register,
        productCategory,
        importCategoryHandler,
        shapeArr,
        AddSubmitHandler,
        EditSubmitHandler,
        handleSubmit,
        loader,
        paramData,
        getBase64,
        looseDiamondDetails,
        setlooseDiamondDetails,
        looseDiamondImage

    } = props;
    const [colorOption, setcolorOption] = useState("")
    const [clarityOption, setclarityOption] = useState("")
    const [cutOption, setcutOption] = useState("")
    const [polishOption, setpolishOption] = useState("")
    const [symmetryOption, setsymmetryOption] = useState("")

    const onChangeParams = (parameter, value, type) => {
        const values = [...looseDiamondDetails];
        const ind = values?.findIndex((p) => {
            return p.parameter == parameter
        })
        if (ind != undefined && ind > -1) {
            values[ind].parameter = parameter;
            parameter === "SHAPE" || "COLOR" || "CLARITY" || "POLISH" || "SYMMETRY" || "CUT" || "LAB"
                ?
                (values[ind].value = value?.label || value) : (values[ind].value = value);
            values[ind].type = type;
        } else {
            let flag;
            parameter === "SHAPE" || "COLOR" || "CLARITY" || "POLISH" || "SYMMETRY" || "CUT" || "LAB"
                ? (flag = {
                    parameter: parameter,
                    value: value?.label || value,
                    type: type,
                })
                :
                flag = {
                    parameter: parameter,
                    value: value,
                    type: type,
                };

            values.push(flag);
        }
        // }
        setlooseDiamondDetails(values);
    };
    useEffect(() => {

        let colorData = [];
        let clarityData = [];
        let cutData = [];
        let polishData = [];
        let symmetryData = [];

        const colorOption = paramData?.getAllParameter?.data.find((d) => d?.paramName == "COLOR")?.value
        const clarityOption = paramData?.getAllParameter?.data.find((d) => d?.paramName == "CLARITY")?.value;
        const cutOption = paramData?.getAllParameter?.data.find((d) => d?.paramName == "CUT")?.value;
        const polishOption = paramData?.getAllParameter?.data.find((d) => d?.paramName == "POLISH")?.value;
        const symmetryOption = paramData?.getAllParameter?.data.find((d) => d?.paramName == "SYMMETRY")?.value;

        colorOption?.map((d) => {
            let ColorValue = {
                label: d,
                value: d,
            };
            colorData.push(ColorValue);
        });
        clarityOption?.map((d) => {
            let clarityValue = {
                label: d,
                value: d
            }
            clarityData.push(clarityValue)
        })
        cutOption?.map((d) => {
            let cutValue = {
                label: d,
                value: d
            }
            cutData.push(cutValue)
        })
        polishOption?.map((d) => {
            let polishValue = {
                label: d,
                value: d
            }
            polishData.push(polishValue)
        })
        symmetryOption?.map((d) => {
            let symmetryValue = {
                label: d,
                value: d
            }
            symmetryData.push(symmetryValue)
        })
        setcolorOption(colorData)
        setclarityOption(clarityData)
        setcutOption(cutData)
        setpolishOption(polishData)
        setsymmetryOption(symmetryData)

    }, paramData);

    const labOption = [
        {
            label: "IGR",
            value: "IGR",
        },
        {
            label: "HRD",
            value: "HRD",
        },
    ];
    const statusOption = [
        {
            label: "AVAILABLE",
            value: "AVAILABLE",
        },
        {
            label: "HOLD",
            value: "HOLD",
        },
        {
            label: "IN LAB",
            value: "IN LAB",
        },
    ];

    const clarityValue = looseDiamondDetails?.find((d) => d?.parameter === "CLARITY")?.value
    const colorValue = looseDiamondDetails?.find((d) => d?.parameter === "COLOR")?.value
    const cutValue = looseDiamondDetails?.find((d) => d?.parameter === "CUT")?.value
    const polishValue = looseDiamondDetails?.find((d) => d?.parameter === "POLISH")?.value
    const symmetryValue = looseDiamondDetails?.find((d) => d?.parameter === "SYMMETRY")?.value
    const labValue = looseDiamondDetails?.find((d) => d?.parameter === "LAB")?.value
    const ProductArray = [
        {
            label: "CARATS",
            value: "CARATS"
        }, {
            label: "COLOR",
            value: colorValue,
            option: colorOption,

        }, {
            label: "CLARITY",
            value: clarityValue,
            option: clarityOption
        }, {
            label: "POLISH",
            value: polishValue,
            option: polishOption
        }, {
            label: "CUT",
            value: cutValue,
            option: cutOption
        }, {
            label: "SYMMETRY",
            value: symmetryValue,
            option: symmetryOption

        }, {
            label: "FLUORESCENCE INTENSITY",
            value: "FLUORESCENCE INTENSITY",
        },
        {
            label: "LAB",
            value: labValue,
            option: labOption

        }, {
            label: "MEASUREMENTS",
            value: "MEASUREMENTS"
        }, {
            label: "SHADE",
            value: "SHADE",
        }, {
            label: "MILKY",
            value: "MILKY",
        }, {
            label: "EYE CLEAN",
            value: "EYE CLEAN",
        }, {
            label: "TREATMENT",
            value: "TREATMENT",
        }, {
            label: "DEPTH",
            value: "DEPTH",
        }, {
            label: "TABLE",
            value: "TABLE",
        },
        {
            label: "GRIDLE THIN",
            value: "GRIDLE THIN",
        }, {
            label: "GRIDLE THICK",
            value: "GRIDLE THICK",
        }, {
            label: "GRIDLE",
            value: "GRIDLE",
        }, {
            label: "GRIDLE CONDITION",
            value: "GRIDLE CONDITION",
        }, {
            label: "CULET SIZE",
            value: "CULET SIZE",
        }, {
            label: "CULET CONDITION",
            value: "CULET CONDITION",
        }, {
            label: "CROWN HEIGHT",
            value: "CROWN HEIGHT",
        }, {
            label: "CROWN ANGEL",
            value: "CROWN ANGEL",
        }, {
            label: "PAVILION DEPTH",
            value: "PAVILION DEPTH",
        }, {
            label: "PAVILION ANGLE",
            value: "PAVILION ANGLE",
        }, {
            label: "INCRIPTION",
            value: "INCRIPTION",
        }, {
            label: "CERTIFICATE COMMENT",
            value: "CERTIFICATE COMMENT",
        }, {
            label: "KEY TO SYMBOLS",
            value: "KEY TO SYMBOLS",
        }, {
            label: "WHITE INCLUSION",
            value: "WHITE INCLUSION",
        }, {
            label: "LACK INCLUSIO",
            value: "LACK INCLUSIO",
        }, {
            label: "OPEN INCLUSION",
            value: "OPEN INCLUSION",
        }, {
            label: "FANCY COLOR OVERTONE",
            value: "FANCY COLOR OVERTONE",
        }, {
            label: "STATE",
            value: "STATE",
        },
        {
            label: "CITY",
            value: "CITY",
        },
        {
            label: "CERTIFICATE FILE",
            value: "CERTIFICATE FILE"
        }

    ]
    const selectField = ["COLOR", "CLARITY", "POLISH", "CUT", "SYMMETRY", "LAB"]

    return (
        <CommanModal
            modal={importModal}
            setModal={setLooseLayout}
            updateButtonHandler={handleSubmit(EditSubmitHandler)}
            addButtonHandler={handleSubmit(AddSubmitHandler)}
            toggleHandler={importCategoryHandler}
            loading={loader}
            updateId={control._defaultValues?.id ? true : false}
            modalTitle={control._defaultValues?.id ? "Edit Loose Diamond" : "Add Loose Diamond"}
            productCategory={productCategory}>
            <Row>
                <Col sm="12">
                    <Form className={`auth-login-form mt-2 ${IMPloading && "pe-none"}`}>
                        <Row>

                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Diamond Image
                                    </Label>

                                    <Input
                                        type="file"
                                        className=""
                                        accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
                                        name="profile-picture"
                                        onChange={(e) => {
                                            getBase64(e);
                                        }}
                                    />
                                    {errors.image && <FormFeedback> image Name is required </FormFeedback>}
                                    {looseDiamondImage != "" ? (
                                        looseDiamondImage?.includes("base64") ? (
                                            <img src={looseDiamondImage} height={100} width={100} alt="shape" className="my-1" />
                                        ) : (
                                            <img src={looseDiamondImage?.includes("https") ? looseDiamondImage : `${digitalOceanURL}${looseDiamondImage}`} className="my-1" height={100} width={100} />
                                        )
                                    ) : null}
                                </div>
                            </Col>

                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Product Description
                                    </Label>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <Input
                                                    type="text"
                                                    {...register("description", {})}
                                                    {...field}
                                                    placeholder="description Name"
                                                />
                                            );
                                        }}
                                    />
                                    {errors.description && <FormFeedback> description Name is required </FormFeedback>}
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Stock ID<span className="text-danger">&#42;</span>
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
                                                    placeholder="StockId "
                                                // onChange={(e) => setOwner(e)}
                                                />
                                            );
                                        }}
                                    />

                                    {errors.productName && <FormFeedback> StockId is required </FormFeedback>}
                                </div>
                            </Col>

                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Availability<span className="text-danger">&#42;</span>
                                    </Label>
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field: { onChange, value } }) => {
                                            return (
                                                <Select
                                                    {...register("status", {
                                                        required: true
                                                    })}
                                                    options={statusOption}
                                                    invalid={errors?.status && true}
                                                    required
                                                    value={value && { label: value, value: value }}
                                                    onChange={(e) => {
                                                        onChange(e?.value)
                                                        // setStatus(e?.value)

                                                    }}
                                                // onChange={(e) => setOwner(e)}
                                                />
                                            );
                                        }}
                                    />


                                    {errors.status && <FormFeedback> Status is required </FormFeedback>}
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
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
                                                    placeholder="PricePerCarat "
                                                // onChange={(e) => setOwner(e)}
                                                />
                                            );
                                        }}
                                    />
                                    {errors.PricePerCarat && <FormFeedback> PricePerCarat is required </FormFeedback>}
                                </div>
                            </Col>

                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
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
                                                    placeholder="netValue "
                                                // onChange={(e) => setOwner(e)}
                                                />
                                            );
                                        }}
                                    />
                                    {errors.netValue && <FormFeedback> netValue is required </FormFeedback>}
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Report
                                    </Label>
                                    <Controller
                                        name="reportNo"
                                        control={control}
                                        render={({ field }) => {
                                            return (
                                                <Input
                                                    type="text"
                                                    {...register("reportNo", {})}
                                                    // invalid={errors?.reportNo && true}
                                                    // required
                                                    {...field}
                                                    placeholder="report Name"
                                                // onChange={(e) => setOwner(e)}
                                                />
                                            );
                                        }}
                                    />
                                    {errors.reportNo && <FormFeedback> report Name is required </FormFeedback>}
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Country
                                    </Label>
                                    <Controller
                                        name="country"
                                        control={control}
                                        render={({ field: { onChange, value } }) => {
                                            return (
                                                <Select
                                                    {...register("country", {
                                                    })}
                                                    required
                                                    options={Countries}
                                                    value={value && { label: value, value: value }}
                                                    onChange={(e) => {
                                                        onChange(e?.label)

                                                    }}
                                                />
                                            );
                                        }}
                                    />

                                </div>
                            </Col>

                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Shape<span className="text-danger">&#42;</span>
                                    </Label>
                                    <Controller
                                        name="shapeId"
                                        control={control}
                                        render={({ field: { onChange, value } }) => {
                                            return (
                                                <Select
                                                    {...register("shapeId", {
                                                        required: true
                                                    })}
                                                    invalid={errors?.shapeId && true}
                                                    required
                                                    options={shapeArr}
                                                    value={shapeArr?.find((shape) => shape?.value === value?.id) || value?.id}
                                                    onChange={onChange}
                                                />
                                            );
                                        }}
                                    />
                                    {errors.shapeId && <FormFeedback> Shape Name is required </FormFeedback>}

                                </div>
                            </Col>


                            {ProductArray?.map((d) => {
                                let label = d.label
                                return (
                                    <Col sm="6">
                                        <div className="mb-1">
                                            <Label className="login-label text-capitalize" style={{ marginBottom: 5 }}>
                                                {d?.label.toLocaleLowerCase()}
                                            </Label>
                                            {(selectField).includes(d?.label) ?
                                                <Select
                                                    options={d?.option}
                                                    placeholder={`Select ${d?.label}`.toLocaleLowerCase()}
                                                    value={d?.value ? { label: d?.value, value: d?.value } : `Select ${d?.label}`.toLocaleLowerCase()}
                                                    onChange={(e) => onChangeParams(d?.label, e, "Loose Diamond")} />
                                                :
                                                <Input
                                                    type="text"
                                                    placeholder={`Enter ${d?.label}`.toLocaleLowerCase()}
                                                    value={looseDiamondDetails?.find((d) => d?.parameter == label)?.value}
                                                    onChange={(e) => onChangeParams(d?.label, e.target.value, "Loose Diamond")}
                                                />
                                            }

                                        </div>
                                    </Col>

                                )
                            })}

                        </Row>

                    </Form>
                </Col>
            </Row>
        </CommanModal>

    )
}

export default LooseandLayout