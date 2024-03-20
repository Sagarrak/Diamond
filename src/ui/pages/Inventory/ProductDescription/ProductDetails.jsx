import React, { useEffect, useState } from 'react'
import { Button, Col, Collapse, Row } from 'reactstrap'
import { ChevronDown, ChevronUp } from 'react-feather'

const ProductDetails = ({ productData, matchingPairData, pairLimit }) => {
    const [limit, setLimit] = useState(4);
    useEffect(() => { setLimit(pairLimit) }, [pairLimit])
    return (
        <div className={`${productData?.matchingPairId || matchingPairData ? 'tableView_match' : 'tableView'}`}>
            <Row>
                {
                    productData?.productDetails?.map((parameter, i) => {
                        if (limit === 4 && parameter?.parameter !== "CERTIFICATE COMMENT" && i < limit) {
                            return (<Col key={parameter?.id} className={`${productData?.matchingPairId ? "col-lg-6 col-md-12 col-sm-12 col-12" : "col-lg-3 col-md-3 col-sm-6 col-12"}`}>
                                <div className="productData">
                                    <div className="data d-flex">
                                        <p className="product-para text-capitalize">{parameter?.parameter?.toLowerCase()}</p>
                                        <p className='justify-content-end'> {parameter?.value || "-"}</p>
                                    </div>
                                </div>
                            </Col>)
                        }
                    })
                }
            </Row>
            <Collapse isOpen={limit !== 4 && true}>
                <Row className='productData-row'>
                    {
                        productData?.productDetails?.map((parameter) => {
                            if (parameter?.parameter !== "CERTIFICATE COMMENT") {
                                return (<Col key={parameter?.id} className={`product-Col ${productData?.matchingPairId ? "col-lg-6 col-md-12 col-sm-12 col-12 matchingPairId_data" : "col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12"}`}>
                                    <div className="productData certificate-productdata">
                                        <div className="data d-flex">
                                            <p className="product-para text-capitalize">{parameter?.parameter?.toLowerCase()}</p>
                                            <p className='justify-content-end'> {parameter?.value || "-"}</p>
                                        </div>
                                    </div>
                                </Col>)
                            }
                        })
                    }
                </Row>
            </Collapse>
            <Row>
                {
                    matchingPairData?.productDetails?.map((parameter, i) => {
                        if (limit === 4 && parameter?.parameter !== "CERTIFICATE COMMENT" && i < limit) {
                            return (<Col key={parameter?.id} className={`${matchingPairData ? "col-lg-6 col-md-12 col-sm-12 col-12" : "d-none"}`}>
                                <div className="productData">
                                    <div className="data d-flex">
                                        <p className="product-para text-capitalize">{parameter?.parameter?.toLowerCase()}</p>
                                        <p className='justify-content-end'> {parameter?.value || "-"}</p>
                                    </div>
                                </div>
                            </Col>)
                        }
                    })}
            </Row>
            <Collapse isOpen={limit !== 4 && true}>
                <Row className='productData-row'>
                    {matchingPairData?.productDetails?.map((parameter) => {
                        if (parameter?.parameter !== "CERTIFICATE COMMENT") {
                            return (
                                <Col key={parameter?.id} className={`product-Col ${matchingPairData ? "col-lg-6 col-md-12 col-sm-12 col-12 matchingPairId_data" : "d-none"}`}>
                                    <div className="productData certificate-productdata">
                                        <div className="data d-flex">
                                            <p className="product-para text-capitalize">{parameter?.parameter?.toLowerCase()}</p>
                                            <p className='justify-content-end'> {parameter?.value || "-"}</p>
                                        </div>
                                    </div>
                                </Col>)
                        }
                    })
                    }
                </Row>
            </Collapse>
            {!pairLimit &&
                <Row>
                    <Col className='d-flex justify-content-center mt-2'>
                        <Button type='button' className='show-data outfit-bold' onClick={() => { limit === 4 ? setLimit(500) : setLimit(4) }}>
                            {
                                limit === 4 ?
                                    <div className='d-flex'><p style={{ padding: "2px 2px 0 0" }}>Show More</p><ChevronDown /></div>
                                    :
                                    <div className='d-flex'><p style={{ padding: "2px 2px 0 0" }}>Show Less</p><ChevronUp /></div>}
                        </Button>
                    </Col>
                </Row>
            }
        </div>
    )
}

export default ProductDetails