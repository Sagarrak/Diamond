import React, { useState, useEffect } from "react";
import { Button, Card, CardBody, Col, Row } from "reactstrap";
import { useQuery } from "react-apollo";
import { GET_PRODUCT_REPORT } from "./query";
import { GET_ALL_PARAMETERS } from "../Parameters/query";
import { GET_ALL_SHAPES } from "../Shapes/query";
import "./style.scss";
import Select from "../../components/Select";
import StatsCard from "./StatsCard";
import { toast } from "react-toastify";

const Index = () => {
    const [filter, setFilter] = useState({});
    const [products, setProducts] = useState([]);
    const [parameters, setParameters] = useState([]);
    const [paramFilter, setParamFilter] = useState([]);
    const [caratRangeOptions, setCaratRangeOptions] = useState([]);
    const [shapeOptions, setShapeOptions] = useState([]);

    const { loading, data, refetch } = useQuery(GET_PRODUCT_REPORT, {
        variables: {
            filter: JSON.stringify(filter),
        },
        fetchPolicy: "cache-and-network",
    });
    const { loading: paramLoading, data: paramData } = useQuery(GET_ALL_PARAMETERS, {
        variables: {
            page: 1,
            limit: 100,
            sort: { key: "createdAt", type: -1 },
            filter: JSON.stringify({ isActive: true }),
            search: "",
        },
    });

    const { loading: shapeLoading, data: shapeData } = useQuery(GET_ALL_SHAPES, {
        variables: {
            page: 1,
            limit: 1000,
            sort: { key: "sortOrder", type: 1 },
            filter: "{}",
            search: "",
        },
    });

    useEffect(() => {
        if (shapeData?.getAllShapes) {
            const items = shapeData?.getAllShapes?.data?.map((d) => {
                return { label: d?.shapeName, value: d?.id };
            });
            setShapeOptions(items);
        }
    }, [shapeData]);

    useEffect(() => {
        if (data?.getProductReports) {
            setProducts(data?.getProductReports);
        }
    }, [data]);

    useEffect(() => {
        if (paramData?.getAllParameter?.data) {
            setParameters(paramData?.getAllParameter?.data);
            paramData?.getAllParameter?.data?.map((item) => {
                if (item?.paramName === "CARATS RANGE") {
                    let items = item?.value?.map((d) => {
                        return { label: d, value: d };
                    });
                    setCaratRangeOptions(items);
                }
            });
        }
    }, [paramData]);

    const FilterData = (field, value) => {

        if (value) {
            setParamFilter({ ...paramFilter, [field]: value });
        } else {
            delete paramFilter[field];
            setParamFilter(paramFilter);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Object.keys(paramFilter)?.length > 0) setFilter(paramFilter);
        else toast.warning("Please select at least one filter");
    };

    let sum = 0;
    let verticalSum = 0;
    let total = 0;

    return (
        <div>
            <StatsCard />
            <Card className="w-100 h-100">
                <CardBody style={{ flex: " unset", height: "inherit", padding: "0px" }}>
                    <h2 className="text-center mt-2"> Color & Clarity Wise Report </h2>
                    <div className="mb-5">
                        <form className="auth-login-form mt-2">
                            <Row className="d-flex justify-content-center mb-2">
                                <Col key={"carat"} md={"6"}>
                                    <div className="d-flex justify-content-center align-items-center mb-2 mt-4">
                                        <h5 className="text-center">
                                            Select Carat's Range<span className="text-danger">&#42;</span>
                                        </h5>
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div className="mx-2 w-50">
                                            <Select
                                                className="react-select"
                                                value={caratRangeOptions?.find((d) => d?.label === parameters?.value)}
                                                options={caratRangeOptions}
                                                isClearable={true}
                                                isMulti={true}
                                                // onChange={(e) => FilterData("carats", e?.value)}
                                                onChange={(e) =>
                                                    FilterData(
                                                        "carats",
                                                        e?.map((d) => d?.value)
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </Col>
                                <Col key={"shape"} md={"6"}>
                                    <div className="d-flex justify-content-center align-items-center mb-2 mt-4">
                                        <h5 className="text-center">
                                            Select Shape<span className="text-danger">&#42;</span>
                                        </h5>
                                    </div>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div className="mx-2 w-50">
                                            <Select
                                                className="react-select"
                                                value={shapeOptions?.find((d) => d?.value === parameters?.value)}
                                                options={shapeOptions}
                                                isClearable={true}
                                                //isMulti={true}
                                                onChange={(e) => FilterData("shape", e?.value)}
                                            // onChange={(e) =>
                                            //   FilterData(
                                            //     "shape",
                                            //     e?.map((d) => d?.value)
                                            //   )
                                            // }
                                            />
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Button className="filter-btn" onClick={(e) => handleSubmit(e)}>
                                Apply Filter
                            </Button>
                        </form>
                    </div>

                    {products?.length > 0 && (
                        <div className="graph" >
                            <div className="container">
                                <table className="table product-table" style={{ border: "2px" }}>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            {parameters?.map((item) => {
                                                return item?.paramName === "CLARITY" ? item?.value?.map((d, i) => <th key={i}>{d}</th>) : "";
                                            })}
                                            <th style={{ fontFamily: "GothamBold" }}>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parameters?.map((item) => {
                                            return item?.paramName === "COLOR"
                                                ? item?.value?.map((d, j) => {
                                                    return (
                                                        <tr>
                                                            <td className="fw-bold">{d}</td>
                                                            {products?.map((p, i) => {
                                                                return p?.color === d ? (
                                                                    sum += p.total,
                                                                    <td td key={i} style={{ fontFamily: p?.total !== 0 && "GothamBold" }} >
                                                                        {p?.total}
                                                                    </td>
                                                                ) : (
                                                                    ""
                                                                );
                                                            })}
                                                            <td style={{ fontFamily: sum !== 0 && "GothamBold" }} >{sum}
                                                                <span className="d-none">{sum = 0}</span>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                                : "";
                                        })}
                                        <tr>
                                            <td>Total</td>
                                            {parameters?.map((item) => {
                                                return item?.paramName === "CLARITY" ? item?.value?.map((d, i) => <td key={i}>
                                                    {parameters?.map((item) => {
                                                        item?.paramName === "COLOR" ? item?.value?.map((d, j) => { verticalSum += products[Number(`${j}${i}`)]?.total }) : "";
                                                    })}
                                                    <span style={{ fontFamily: verticalSum !== 0 && "GothamBold" }} >{verticalSum}</span>
                                                    <span className="d-none">{verticalSum = 0}</span>
                                                </td>) : "";
                                            })}
                                            <td style={{ fontFamily: "GothamBold" }} >
                                                {products?.map((p, i) => {
                                                    total += p.total
                                                })}
                                                {total}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div >
    );
};

export default Index;
