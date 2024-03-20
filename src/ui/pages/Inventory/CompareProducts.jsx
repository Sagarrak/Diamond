import React, { useContext } from 'react'
import { UncontrolledTooltip } from 'reactstrap';
import Header from '../Home/Header/Header'
import BackArrow from "../../components/Back";
import { useHistory, Link } from 'react-router-dom';
import { GET_COMPARE_PRODUCTS } from '../Products/query';
import { useQuery } from 'react-apollo';
import { CompareContext } from "../../../context/CompareContext";
import { Button, Col, Row } from 'reactstrap';
import { X } from 'react-feather';
import ImageComp from '../../components/ImageComp';
import { AddToCompare } from '../../functions/commonFunctions';
import SeoContent from './SeoContent';
import Footer from '../../components/Footer';
import SpinnerComponent from '../../../@core/components/spinner/Fallback-spinner';
const CompareProducts = () => {
    const token = localStorage.getItem("token");
    const isLogin = token && token != undefined && token != null ? true : false;
    const history = useHistory();
    const COMPARE = useContext(CompareContext);
    const { loading, data } = useQuery(GET_COMPARE_PRODUCTS, {
        variables: { getCompareProductsId: COMPARE?.compareProducts },
        fetchPolicy: "cache-and-network",
    });

    const setProductDetails = (product, param, type) => {
        let index = product?.productDetails?.findIndex((p) => p.parameter == param);
        if (index >= 0 && index != undefined) {
            if (type === "number") return parseFloat(product?.productDetails[index].value || 0)?.toFixed(2);
            else return product?.productDetails[index].value;
        } else { return "-"; }
    };

    const ProductCardComp = ({ product }) => {
        return (
            <div className="product-main-card">
                <div className="main-information">
                    {
                        product?.id ?
                            <div className="primary-info">
                                <span onClick={() => { AddToCompare(product?.id, COMPARE, history) }} >
                                    <X role="button" style={!product?.id ? { opacity: 0 } : {} } className="mt-1" /></span>
                                <ImageComp src={product?.image} alt={"Product Image"} width={200} />
                                <h2 className='outfit-bold'>{setProductDetails(product, "WEIGHT", "string")} Carat {product?.shapeId?.shapeName} Lab Diamond</h2>
                                <p className='outfit-bold'><span>{setProductDetails(product, "CUT", "string")} | {setProductDetails(product, "COLOR", "string")} | {setProductDetails(product, "CLARITY", "string")} </span><span style={{ marginLeft: "2px" }}>{product?.reportNo}</span></p>
                                {isLogin && <p className="price outfit-bold">${product?.netValue?.toFixed(2)}</p>}
                            </div>
                            :
                            <div className="emptyInfo">
                                <p>Add up to 4 Diamonds to Compare</p>
                                <Button className="outfit-bold" onClick={() => history?.push("/inventory/diamonds")}>Choose Product</Button>
                            </div>
                    }
                </div>
                <div className={`all-information ${product?.id ? 'outfit-bold' : "normal-style"}`}>
                    <p><span>Carat</span><span>{setProductDetails(product, "WEIGHT", "string")}</span></p>
                    <p><span>Color</span><span>{setProductDetails(product, "COLOR", "string")}</span></p>
                    <p><span>Clarity</span><span>{setProductDetails(product, "CLARITY", "string")}</span></p>
                    <p><span>Polish</span><span>{setProductDetails(product, "POLISH", "string")}</span></p>
                    <p><span>Symm</span><span>{setProductDetails(product, "SYMMETRY", "string")}</span></p>
                    <p><span>Ratio</span><span>{setProductDetails(product, "RATIO", "string")}</span></p>
                    {
                        product?.id ?
                            product?.productDetails?.filter(d => d?.parameter === "MEASUREMENTS")?.map((product, index) => {
                                return (
                                    <>
                                        {/* <p><span>Measurement</span><span className='measurement-data'>{setProductDetails(product, "MEASUREMENTS", "string")}</span></p> */}
                                        <p key={product?.id + index} ><span>Measurement</span><span className='measurement-data' id={`Measurement_${product?.id}`}>{product?.value}</span></p>
                                        <UncontrolledTooltip placement="top" target={`Measurement_${product?.id}`} className={`${product.value ? "d-flex" : "d-none"}`}>
                                            {/* {setProductDetails(product, "MEASUREMENTS", "string")} */}
                                            {product?.value}
                                        </UncontrolledTooltip>
                                    </>
                                )
                            })
                            :
                            <p><span>Measurement</span><span className='measurement-data'>{setProductDetails(product, "MEASUREMENTS", "string")}</span></p>
                    }
                    <p><span>Depth(%)</span><span>{setProductDetails(product, "DEPTH %", "string")}</span></p>
                    <p><span>Table(%)</span><span>{setProductDetails(product, "TABLE %", "string")}</span></p>
                    <p><span>Lab</span><span>{setProductDetails(product, "LAB", "string")}</span></p>
                    <p><span>Certificate</span><span className='measurement-data' id={`Certificate_${product?.id}`}>{product?.reportNo || "-"}</span></p>
                    <UncontrolledTooltip placement="top" target={`Certificate_${product?.id}`} className={`${product?.reportNo ? "d-flex" : "d-none"}`}>
                        {product?.reportNo || "-"}
                    </UncontrolledTooltip>
                </div>
                <Button type='button' className={`view-diamond ${product?.id ? 'bg-dark' : 'bg-secondary'}`} onClick={() => { product?.id && history?.push(`/products/${product?.handle}`) }}>View Diamond</Button>
            </div>
        )
    }
    return (
        loading ? <SpinnerComponent /> :
            <div className='home-page certified-diamond'>
                <div className='certified-diamond-data'>
                    <Header />
                </div>
                <div className='compare-container'>
                    <div className="d-flex align-items-center mb-2 mt-5 ms-1 container">
                        <BackArrow history={history} />
                        <div aria-label="breadcrumb">
                            <ol className="breadcrumb" style={{ alignItems: "baseline" }}>
                                <li className="breadcrumb-item breadcrumb">
                                    <Link to="#">Compare Products</Link>
                                </li>
                            </ol>
                        </div>
                    </div>
                    <Row className="compared-products container">
                        <Col sm={6} lg={4} xl={3} > <ProductCardComp product={data?.getCompareProducts?.[0]} /> </Col>
                        <Col sm={6} lg={4} xl={3} > <ProductCardComp product={data?.getCompareProducts?.[1]} /> </Col>
                        <Col sm={6} lg={4} xl={3} > <ProductCardComp product={data?.getCompareProducts?.[2]} /> </Col>
                        <Col sm={6} lg={4} xl={3} > <ProductCardComp product={data?.getCompareProducts?.[3]} /> </Col>
                    </Row>
                </div >
                <SeoContent />
                <Footer />
            </div>
    )
}

export default CompareProducts