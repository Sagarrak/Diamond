import React, { useState, useEffect } from 'react'
import { Button, Col, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from "reactstrap";
import { Controller } from "react-hook-form";
import Countries from "../../Inventory/country";
import CommanModal from "../../../components/Modal";
import { FormFeedback } from "reactstrap";
import { invalid } from 'moment';
import { digitalOceanURL } from '../../../common/common';


function CommonFields(props) {
    const {
        Select,
        IMPloading,
        importModal,
        control,
        errors,
        productCategory,
        importCategoryHandler,
        shapeArr,
        shape,
        setShape,
        AddSubmitHandler,
        EditSubmitHandler,
        handleSubmit,
        loader,
        paramData,
        setMatchingModal,
        setDiamondVideomp4,
        diamondVideomp4,
        diamondVideo,
        setDiamondVideo,
        productDescription,
        setproductDescription,
        stockId,
        setstockId,
        stockIdForPair,
        setstockIdForPair,
        availability,
        setavailability,
        pricePerCarat,
        setpricePerCarat,
        matchingPair,
        setmatchingPair,
        report,
        setreport,
        netValue,
        setnetValue,
        country,
        setcountry,
        matchingPairProductDetails,
        setmatchingPairProductDetails,
        singlediamondVideomp4,
        setsingleDiamondVideomp4,
        matchingdiamondvideomp4,
        setmatchingdiamondvideomp4,
        matchingsingleDiamond,
        setmatchingsinglediamond,
        matchingDiamondvideo,
        setmatchingDiamondvideo,
        matchingDiamondescription,
        setmatchingDiamondescription,
        matchingStockId,
        setmatchingStockId,
        matchingStockIdForPair,
        setmatchingStockIdForPair,
        matchingavailability,
        setmatchingavailability,
        matchingapricepercarat,
        setmatchingapricepercarat,
        matchingnetvalue,
        setmatchingnetvalue,
        matchingnreport,
        setmatchingnreport,
        matchingcountry,
        setmatchingcountry,
        matchingshape,
        setmatchingnshape,
        getBase64,
        nextPage,
        setNextPage,
        Error,
        setError,
        matchingDiamondimage,
        diamondImage

    } = props;

    const [colorOption, setcolorOption] = useState("")
    const [clarityOption, setclarityOption] = useState("")
    const [cutOption, setcutOption] = useState("")
    const [polishOption, setpolishOption] = useState("")
    const [symmetryOption, setsymmetryOption] = useState("")
    const [updateid, setupdateid] = useState(false)
    const [matchingError, setmatchingError] = useState({
        productName: false,
        matchingPair: false,
        PricePerCarat: false,
        netValue: false,
        shapeId: false,
        status: false,
    })


    const onChangeParams = (parameter, value, type) => {
        const values = [...matchingPairProductDetails];
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
        setmatchingPairProductDetails(values);
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
    const PreviousButton = (e) => {
        e.preventDefault()
        setNextPage("Previous")


    }
    const NextButton = (e) => {
        e.preventDefault()
        if (matchingStockId === "" || matchingStockIdForPair === "" || matchingnetvalue === "" || matchingavailability === "" || matchingshape === "" || matchingapricepercarat === "") {
            if (control._defaultValues?.id) {
                setupdateid(true)
            } else {
                setupdateid(false)
            }
            setmatchingError({ productName: matchingStockId === "", matchingPair: matchingStockIdForPair === "", status: matchingavailability === "", shapeId: matchingshape === "", PricePerCarat: matchingapricepercarat === "", netValue: matchingnetvalue === "" })

        }
        else {
            setNextPage("Next")
            if (control._defaultValues?.id) {
                setupdateid(true)
            } else {
                setupdateid(false)
            }

        }

        // resetData()


    }
    const matchingPairData = (parameter, value, type) => {
        const values = [...matchingPair];
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
        setmatchingPair(values);

    }
 
    const clarityValue = matchingPairProductDetails?.find((d) => d?.parameter === "CLARITY")?.value
    const colorValue = matchingPairProductDetails?.find((d) => d?.parameter === "COLOR")?.value
    const cutValue = matchingPairProductDetails?.find((d) => d?.parameter === "CUT")?.value
    const polishValue = matchingPairProductDetails?.find((d) => d?.parameter === "POLISH")?.value
    const symmetryValue = matchingPairProductDetails?.find((d) => d?.parameter === "SYMMETRY")?.value
    const labValue = matchingPairProductDetails?.find((d) => d?.parameter === "LAB")?.value


    const clarityMatching = matchingPair?.find((dd) => dd?.parameter === "CLARITY")?.value
    const colorMatching = matchingPair?.find((d) => d?.parameter === "COLOR")?.value
    const cutMatching = matchingPair?.find((d) => d?.parameter === "CUT")?.value
    const polishMatching = matchingPair?.find((d) => d?.parameter === "POLISH")?.value
    const symmetryMatching = matchingPair?.find((d) => d?.parameter === "SYMMETRY")?.value
    const labMatching = matchingPair?.find((d) => d?.parameter === "LAB")?.value

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
    const ProductArrayMatching = [
        {
            label: "CARATS",
            value: "CARATS"
        }, {
            label: "COLOR",
            value: colorMatching,
            option: colorOption,

        }, {
            label: "CLARITY",
            value: clarityMatching,
            option: clarityOption
        }, {
            label: "POLISH",
            value: polishMatching,
            option: polishOption
        }, {
            label: "CUT",
            value: cutMatching,
            option: cutOption
        }, {
            label: "SYMMETRY",
            value: symmetryMatching,
            option: symmetryOption

        }, {
            label: "FLUORESCENCE INTENSITY",
            value: "FLUORESCENCE INTENSITY",
        },
        {
            label: "LAB",
            value: labMatching,
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
            setModal={setMatchingModal}
            updateButtonHandler={handleSubmit(EditSubmitHandler)}
            addButtonHandler={handleSubmit(AddSubmitHandler)}
            nextButtonHandler={NextButton}
            PreviousButtonHandler={PreviousButton}
            toggleHandler={importCategoryHandler}
            loading={loader}
            updateId={control._defaultValues?.id ? true : false}
            modalTitle={control._defaultValues?.id ? "Edit Matching Pair" : updateid ? "Edit Matching Pair" : "Add Matching Pair"}
            productCategory={productCategory}
            nextPage={nextPage}
            control={control}
            updateid={updateid}
            setupdateid={setupdateid}>

            <Row>
                <Col sm="12">
                    <Form className={`auth-login-form mt-2 ${IMPloading && "pe-none"}`}>
                        <Row>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Diamond Video MP4
                                    </Label>
                                    {nextPage === "Next" ?
                                        <Input
                                            type='text'
                                            key="diamondVideomp4"
                                            value={diamondVideomp4}
                                            onChange={(e) => setDiamondVideomp4(e?.target.value)}
                                            placeholder="Enter diamond video mp4">
                                        </Input>
                                        :
                                        <Input
                                            type='text'
                                            key="matchingdiamondvideomp4"
                                            value={matchingdiamondvideomp4}
                                            onChange={(e) => setmatchingdiamondvideomp4(e?.target.value)}
                                            placeholder="Enter diamond video mp4">
                                        </Input>
                                    }
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Single Diamond Video MP4
                                    </Label>
                                    {nextPage === "Next" ?
                                        <Input
                                            type='text'
                                            key="singlediamondVideomp4"
                                            value={singlediamondVideomp4}
                                            onChange={(e) => setsingleDiamondVideomp4(e?.target.value)}
                                            placeholder="single diamond video mp4">
                                        </Input>
                                        :
                                        <Input
                                            type='text'
                                            value={matchingsingleDiamond}
                                            key="matchingsingleDiamond"
                                            onChange={(e) => setmatchingsinglediamond(e?.target.value)}
                                            placeholder="SingleDiamondVideoMp4 name ">
                                        </Input>
                                    }
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Diamond Video
                                    </Label>
                                    {nextPage === "Next" ?
                                        <Input
                                            type='text'
                                            key="diamondVideo"
                                            value={diamondVideo}
                                            onChange={(e) => setDiamondVideo(e?.target.value)}
                                            placeholder="Enter diamond video">
                                        </Input>
                                        :
                                        <Input
                                            type='text'
                                            key="matchingDiamondvideo"
                                            value={matchingDiamondvideo}
                                            onChange={(e) => setmatchingDiamondvideo(e?.target.value)}
                                            placeholder="video Name">
                                        </Input>
                                    }
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Diamond Image
                                    </Label>
                                    {nextPage === "Next" ?
                                        <>
                                            <Input
                                                type="file"
                                                key="DiamondImage"
                                                className=""
                                                accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
                                                name="profile-picture"
                                                onChange={(e) => {
                                                    getBase64(e, "DiamondImage");
                                                }}
                                            />
                                            {diamondImage != "" ? (
                                                diamondImage?.includes("base64") ? (
                                                    <img src={diamondImage} height={100} width={100} alt="shape" className="my-1" />
                                                ) : (
                                                    <img src={diamondImage?.includes("https") ? diamondImage : `${digitalOceanURL}${diamondImage}`} className="my-1" height={100} width={100} />
                                                )
                                            ) : null}
                                        </>
                                        :
                                        <>
                                            <Input
                                                type="file"
                                                className=""
                                                accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
                                                key="matchingDiamondimage"
                                                name="profile-picture"
                                                onChange={(e) => {
                                                    getBase64(e, "matchingDiamondimage");
                                                }}
                                            />
                                            {matchingDiamondimage != "" ? (
                                                matchingDiamondimage?.includes("base64") ? (
                                                    <img src={matchingDiamondimage} height={100} width={100} alt="shape" className="my-1" />
                                                ) : (
                                                    <img src={matchingDiamondimage?.includes("https") ? matchingDiamondimage : `${digitalOceanURL}${matchingDiamondimage}`} className="my-1" height={100} width={100} />
                                                )
                                            ) : null}

                                        </>
                                    }
                                </div>
                            </Col>

                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Product Description
                                    </Label>
                                    {nextPage === "Next" ?
                                        <Input
                                            type='text'
                                            key="productDescription"
                                            value={productDescription}
                                            onChange={(e) => setproductDescription(e?.target.value)}
                                            placeholder="Enter product description">
                                        </Input>
                                        :
                                        <Input
                                            type='text'
                                            key="matchingDiamondescription"
                                            value={matchingDiamondescription}
                                            onChange={(e) => setmatchingDiamondescription(e?.target.value)}
                                            placeholder="description Name">
                                        </Input>
                                    }
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Stock ID<span className="text-danger">&#42;</span>
                                    </Label>
                                    {nextPage === "Next" ?
                                        <Input
                                            type='text'
                                            name="stockId"
                                            key="stockId"
                                            value={stockId}
                                            invalid={Error?.productName && true}
                                            onChange={(e) => {
                                                e?.target?.name === "stockId" ? setError({ ...Error, productName: false }) : ''
                                                setstockId(e?.target.value)
                                            }}
                                            placeholder="Enter stockid">
                                        </Input>
                                        :
                                        <Input
                                            type='text'
                                            name="productName"
                                            key="matchingStockId"
                                            value={matchingStockId}
                                            invalid={matchingError?.productName && true}
                                            onChange={(e) => {
                                                e?.target?.name === "productName" ? setmatchingError({ ...matchingError, productName: false }) : ''
                                                setmatchingStockId(e?.target.value)
                                            }}
                                            placeholder="StockId">

                                        </Input>
                                    }
                                    {nextPage === "Next" ? Error?.productName && <FormFeedback> Stock Id required </FormFeedback> :
                                        matchingError?.productName && <FormFeedback> Stock Id required </FormFeedback>}

                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Stock ID For Pair<span className="text-danger">&#42;</span>
                                    </Label>
                                    {nextPage === "Next" ?
                                        <Input
                                            type='text'
                                            name="stockIdForPair"
                                            value={stockIdForPair}
                                            invalid={Error?.matchingPair && true}
                                            onChange={(e) => {
                                                e?.target?.name === "stockIdForPair" ? setError({ ...Error, matchingPair: false }) : ''

                                                setstockIdForPair(e?.target.value)
                                            }}
                                            placeholder="Enter stock id for pair">
                                        </Input>
                                        :
                                        <Input
                                            type='text'
                                            name="stockidforpair"
                                            value={matchingStockIdForPair}
                                            invalid={matchingError?.matchingPair && true}
                                            onChange={(e) => {
                                                e?.target?.name === "stockidforpair" ? setmatchingError({ ...matchingError, matchingPair: false }) : ''
                                                setmatchingStockIdForPair(e?.target.value)
                                            }}
                                            placeholder="StockId for pair">
                                        </Input>
                                    }
                                    {nextPage === "Next" ? Error?.matchingPair && <FormFeedback> StockIdForPair required </FormFeedback> :
                                        matchingError?.matchingPair && <FormFeedback> StockIdForPair required </FormFeedback>}
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Availability<span className="text-danger">&#42;</span>
                                    </Label>
                                    {nextPage === "Next" ?
                                        <Select
                                            options={statusOption}
                                            key="availability"
                                            value={availability ? { label: availability, value: availability } : ''}
                                            invalid={Error?.status && true}
                                            onChange={(e) => {
                                                e?.value ? setError({ ...Error, status: false }) : ''
                                                setavailability(e?.value)

                                            }}
                                        />
                                        :
                                        <Select
                                            options={statusOption}
                                            placeholder={"Select availability"}
                                            // value={statusOption?.find((d) => d.value === statusOption)}
                                            invalid={matchingError?.status && true}
                                            key="matchingavailability"
                                            value={matchingavailability ? { label: matchingavailability, value: matchingavailability } : ''}
                                            onChange={(e) => {
                                                e?.value ? setmatchingError({ ...matchingError, status: false }) : ''
                                                // onChange(e?.value)
                                                setmatchingavailability(e?.value)

                                            }}
                                        />
                                    }
                                    {nextPage === "Next" ? Error?.status && <FormFeedback>Status required </FormFeedback> :
                                        matchingError?.status && <FormFeedback> Status required </FormFeedback>}
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Price Per Carat<span className="text-danger">&#42;</span>
                                    </Label>
                                    {nextPage === "Next" ?
                                        <Input
                                            type='text'
                                            name="pricepercarat"
                                            key="pricePerCarat"
                                            value={pricePerCarat}
                                            invalid={Error?.PricePerCarat && true}
                                            onChange={(e) => {
                                                e?.target?.name === "pricepercarat" ? setError({ ...Error, PricePerCarat: false }) : ''
                                                setpricePerCarat(e?.target.value)
                                            }}
                                            placeholder="Enter price per carat">
                                        </Input>
                                        :
                                        <Input
                                            type='text'
                                            name="pricepercarat"
                                            key="matchingapricepercarat"
                                            invalid={matchingError?.PricePerCarat && true}
                                            value={matchingapricepercarat}
                                            onChange={(e) => {
                                                e?.target?.name === "pricepercarat" ? setmatchingError({ ...matchingError, PricePerCarat: false }) : ''
                                                setmatchingapricepercarat(e?.target.value)
                                            }}
                                            placeholder="PricePerCarat">
                                        </Input>
                                    }
                                    {nextPage === "Next" ? Error?.PricePerCarat && <FormFeedback> Pricepercarat required </FormFeedback> :
                                        matchingError?.PricePerCarat && <FormFeedback> Pricepercarat required </FormFeedback>}
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Net Value<span className="text-danger">&#42;</span>
                                    </Label>
                                    {nextPage === "Next" ?
                                        <Input
                                            type='text'
                                            name="netValue"
                                            key="netValue"
                                            value={netValue}
                                            invalid={Error?.netValue && true}
                                            onChange={(e) => {
                                                e?.target?.name === "netValue" ? setError({ ...Error, netValue: false }) : ''
                                                setnetValue(e?.target.value)
                                            }}
                                            placeholder="Enter net value">
                                        </Input>
                                        :
                                        <Input
                                            type='text'
                                            name="netValue"
                                            key="matchingnetvalue"
                                            invalid={matchingError?.netValue && true}
                                            value={matchingnetvalue}
                                            onChange={(e) => {
                                                e?.target?.name === "netValue" ? setmatchingError({ ...matchingError, netValue: false }) : ''
                                                setmatchingnetvalue(e?.target.value)
                                            }}
                                            placeholder="netValue">
                                        </Input>
                                    }
                                    {nextPage === "Next" ? Error?.netValue && <FormFeedback> Netvalue is required </FormFeedback> :
                                        matchingError?.netValue && <FormFeedback> Netvalue is required </FormFeedback>}
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Report
                                    </Label>
                                    {nextPage === "Next" ?
                                        <Input
                                            type='text'
                                            key="report"
                                            value={report}
                                            onChange={(e) => setreport(e?.target.value)}
                                            placeholder="Enter report">
                                        </Input>
                                        :
                                        <Input
                                            type='text'
                                            key="matchingnreport"
                                            value={matchingnreport}
                                            onChange={(e) => setmatchingnreport(e?.target.value)}
                                            placeholder="report Name">
                                        </Input>
                                    }
                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Country
                                    </Label>
                                    {nextPage === "Next" ?
                                        <Select
                                            options={Countries}
                                            key="countrykey"
                                            value={country ? { label: country, value: country } : ""}
                                            // value={Countries?.find((d) => d?.value === Countries)}
                                            onChange={(e) => {
                                                setcountry(e?.label)

                                            }}

                                        />
                                        :
                                        <Select
                                            options={Countries}
                                            key="matchingcountry"
                                            placeholder={"Select country"}
                                            // value={Countries?.find((d) => d?.value === Countries)}
                                            value={matchingcountry ? { label: matchingcountry, value: matchingcountry } : ""}
                                            onChange={(e) => {
                                                // onChange(e?.label)
                                                setmatchingcountry(e?.label)

                                            }}
                                        />
                                    }

                                </div>
                            </Col>
                            <Col sm="6">
                                <div className="mb-1">
                                    <Label className="login-label" style={{ marginBottom: 5 }}>
                                        Shape<span className="text-danger">&#42;</span>
                                    </Label>
                                    {nextPage === "Next" ?
                                        <Select
                                            options={shapeArr}
                                            key="shapekey"
                                            invalid={Error?.shapeId && true}
                                            placeholder={"Select shape"}
                                            value={shape ? { label: shape?.label, value: shape?.value } : ''}
                                            // value={shape ? shapeArr?.find((d) => d?.value === shape?.value) : ''}
                                            onChange={(e) => {
                                                e?.value ? setError({ ...Error, shapeId: false }) : ''
                                                setShape(e)

                                            }}

                                        />
                                        :
                                        <Select
                                            options={shapeArr}
                                            key="matchingshape"
                                            placeholder={"Select shape"}
                                            invalid={matchingError?.shapeId && true}
                                            value={matchingshape ? { label: matchingshape?.label, value: matchingshape?.value } : ''}
                                            // value={shapeArr?.find((shape) => shape?.value === matchingshape?.value)}
                                            onChange={(e) => {
                                                e?.value ? setmatchingError({ ...matchingError, shapeId: false }) : ''
                                                setmatchingnshape(e)
                                            }
                                            }
                                        />
                                    }
                                    {nextPage === "Next" ? Error?.shapeId && <FormFeedback> Shape name required </FormFeedback> :
                                        matchingError?.shapeId && <FormFeedback> Shape name required </FormFeedback>}
                                </div>
                            </Col>
                            {nextPage === "Next" ?
                                ProductArrayMatching?.map((d) => {
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
                                                        key={`matchingDetail${d?.label}`}
                                                        placeholder={`Select ${d?.label}`.toLocaleLowerCase()}
                                                        value={d?.value ? { label: d?.value, value: d?.value } : `Select ${d?.label}`.toLocaleLowerCase()}
                                                        onChange={(e) => matchingPairData(d?.label, e, "Matching Pair")} />
                                                    :

                                                    <Input
                                                        type="text"
                                                        key={`matchingPair${d?.label}`}
                                                        placeholder={`Enter ${d?.label}`.toLocaleLowerCase()}
                                                        value={matchingPair.length ? matchingPair?.find((d) => d?.parameter === label)?.value : ''}
                                                        onChange={(e) => matchingPairData(d?.label, e?.target?.value, "Matching Pair")}
                                                    />
                                                }

                                            </div>
                                        </Col>

                                    )
                                })
                                :
                                ProductArray?.map((d) => {
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
                                                        key={`pairDetailsSelect${d?.label}`}
                                                        placeholder={`Select ${d?.label}`.toLocaleLowerCase()}
                                                        value={d?.value ? { label: d?.value, value: d?.value } : `Select ${d?.label}`.toLocaleLowerCase()}
                                                        onChange={(e) => onChangeParams(d?.label, e, "Matching Pair")} />
                                                    :

                                                    <Input
                                                        type="text"
                                                        key={`pairDetails${d?.label}`}
                                                        placeholder={`Enter ${d?.label}`.toLocaleLowerCase()}
                                                        value={matchingPairProductDetails?.find((d) => d?.parameter == label)?.value}
                                                        onChange={(e) => onChangeParams(d?.label, e.target.value, "Matching Pair")}
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
    );
}

export default CommonFields