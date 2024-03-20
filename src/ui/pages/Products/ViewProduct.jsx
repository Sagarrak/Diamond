import React, { useState } from 'react'
import { Col, Collapse, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import ImageComp from '../../components/ImageComp';
import styles from './ViewProduct.module.scss';

const ViewProduct = ({ modal, setModal, data }) => {

    const toggleHandler = () => setModal(!modal);
    const [open, setOpen] = useState(true)
    const [openSecond, setOpenSecond] = useState(false)
    const DetailsOf = (param) => {
        return data?.matchingPairId?.productDetails?.filter(d => d?.parameter === param)?.[0]?.value || "-";
    }
    const DetailsOfSecond = (param) => {
        return data?.productDetails?.filter(d => d?.parameter === param)?.[0]?.value || "-";
    }
    return (
        <Modal
            isOpen={modal}
            toggle={toggleHandler}
            className={"modal-dialog-centered order-view-modal"}
            size="xl"
            backdrop={"static"}
        >
            <ModalHeader toggle={toggleHandler}>Product Details</ModalHeader>
            {data?.matchingPairId ?
            <ModalBody>               
                    <div className="allInfo">
                        <p className='cursor-pointer d-flex' onClick={() => { setOpen(!open) }}>{open ? "Hide  First Diamond Details" : "View First Diamond Details"}</p>
                        <Collapse isOpen={open}>
                            <div className={styles?.productDetails}>
                                <div className="upperDetails d-flex align-items-center">
                                    <div className="images">
                                        <ImageComp src={data?.matchingPairId?.image} width={200} className="d-block" />
                                        {
                                            data?.matchingPairId?.DiamondVideoMp4 &&
                                            <video autoPlay loop >
                                                <source src={data?.matchingPairId?.DiamondVideoMp4} type="video/mp4" />
                                            </video>
                                        }
                                    </div>
                                    <div className={styles?.otherDetails}>
                                        <h2 className={styles?.heading}>{`${data?.matchingPairId?.shapeId?.shapeName} ${DetailsOf("CLARITY")} ${DetailsOf("COLOR")} ${DetailsOf("CARATS")} Lab Diamond`}</h2>
                                        <p className='text-start'>{`${DetailsOf("CUT")} | ${DetailsOf("COLOR")} | ${DetailsOf("CLARITY")} `}</p>


                                        <div className='text-start'>
                                            <h2 className={styles?.subHeading}>Description:<span className={styles.description}>{data?.matchingPairId?.description}</span></h2>
                                            {/* <p className={styles.description}>{data?.matchingPairId?.description}</p> */}
                                        </div>
                                        <div className="allInfo">
                                            <Row className='productData-row mt-2'>
                                                {
                                                    data?.matchingPairId?.productDetails?.map((parameter) => {
                                                        if (parameter?.parameter !== "CERTIFICATE COMMENT") {
                                                            return (<Col key={parameter?.id} className={`product-Col ${data?.matchingPairId ? "col-lg-6 col-md-12 col-sm-12 col-12 matchingPairId_data" : "col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12"}`}>
                                                                <div>
                                                                    <div className={styles?.data}>
                                                                        <p className={styles?.productPara}>{parameter?.parameter?.toLowerCase()}</p>
                                                                        <p className={styles?.productText}> {parameter?.value || "-"}</p>
                                                                    </div>
                                                                </div>
                                                            </Col>)
                                                        }
                                                    })
                                                }
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                                <div className="allDetails"></div>
                            </div>
                        </Collapse>
                    </div>
                  
                    <div className="allInfo">
                        <p className='cursor-pointer' onClick={() => { setOpenSecond(!openSecond) }}>{openSecond ? "Hide Second Diamond Details" : "View Second Diamond Details"}</p>
                        <Collapse isOpen={openSecond}>
                            <div className={styles?.productDetails}>
                                <div className="upperDetails d-flex align-items-center">
                                    <div className="images">
                                        <ImageComp src={data?.image} width={200} className="d-block" />
                                        {
                                            data?.DiamondVideoMp4 &&
                                            <video autoPlay loop >
                                                <source src={data?.DiamondVideoMp4} type="video/mp4" />
                                            </video>
                                        }
                                    </div>
                                    <div className={styles?.otherDetails}>
                                        <h2 className={styles?.heading}>{`${data?.shapeId?.shapeName} ${DetailsOfSecond("CLARITY")} ${DetailsOfSecond("COLOR")} ${DetailsOfSecond("CARATS")} Lab Diamond`}</h2>
                                        <p className='text-start'>{`${DetailsOfSecond("CUT")} | ${DetailsOfSecond("COLOR")} | ${DetailsOfSecond("CLARITY")} `}</p>


                                        <div className='text-start'>
                                            <h2 className={styles?.subHeading}>Description: <span className={styles.description}>{data?.description}</span></h2>
                                            {/* <p className={styles.description}>{data?.description}</p> */}
                                        </div>
                                        <div className="allInfo">
                                            <Row className='productData-row mt-2'>
                                                {
                                                    data?.productDetails?.map((parameter) => {
                                                        if (parameter?.parameter !== "CERTIFICATE COMMENT") {
                                                            return (<Col key={parameter?.id} className={`product-Col ${data?.matchingPairId ? "col-lg-6 col-md-12 col-sm-12 col-12 matchingPairId_data" : "col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12"}`}>
                                                                <div>
                                                                    <div className={styles?.data}>
                                                                        <p className={styles?.productPara}>{parameter?.parameter?.toLowerCase()}</p>
                                                                        <p className={styles?.productText}> {parameter?.value || "-"}</p>
                                                                    </div>
                                                                </div>
                                                            </Col>)
                                                        }
                                                    })
                                                }
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                                <div className="allDetails"></div>
                            </div>
                        </Collapse>
                    </div>
                
            </ModalBody>
            :
            <ModalBody className='text-center'>
                <div className={styles?.productDetails}>
                    <div className="upperDetails d-flex align-items-center">
                        <div className="images">
                            <ImageComp src={data?.image} width={200} className="d-block" />
                            {
                                data?.DiamondVideoMp4 &&
                                <video autoPlay loop >
                                    <source src={data?.DiamondVideoMp4} type="video/mp4" />
                                </video>
                            }
                        </div>
                        <div className={styles?.otherDetails}>
                            <h2 className={styles?.heading}>{`${data?.shapeId?.shapeName} ${DetailsOfSecond("CLARITY")} ${DetailsOfSecond("COLOR")} ${DetailsOfSecond("CARATS")} Lab Diamond`}</h2>
                            <p className='text-start'>{`${DetailsOfSecond("CUT")} | ${DetailsOfSecond("COLOR")} | ${DetailsOfSecond("CLARITY")} `}</p>
                          

                            <div className='text-start'>
                                <h2 className={styles?.subHeading}>Description: <span className={styles.description}>{data?.description}</span></h2>
                                {/* <p className={styles.description}>{data?.description}</p> */}
                            </div>
                            <div className="allInfo">
                                <p className='cursor-pointer' onClick={() => { setOpen(!open) }}>{open ? "Hide All Details" : "View All Details"}</p>
                                <Collapse isOpen={open}>
                                    <Row className='productData-row mt-2'>
                                        {
                                            data?.productDetails?.map((parameter) => {
                                                if (parameter?.parameter !== "CERTIFICATE COMMENT") {
                                                    return (<Col key={parameter?.id} className={`product-Col ${data?.matchingPairId ? "col-lg-6 col-md-12 col-sm-12 col-12 matchingPairId_data" : "col-xxl-3 col-xl-4 col-lg-6 col-md-6 col-sm-6 col-12"}`}>
                                                        <div>
                                                            <div className={styles?.data}>
                                                                <p className={styles?.productPara}>{parameter?.parameter?.toLowerCase()}</p>
                                                                <p className={styles?.productText}> {parameter?.value || "-"}</p>
                                                            </div>
                                                        </div>
                                                    </Col>)
                                                }
                                            })
                                        }
                                    </Row>
                                </Collapse>
                            </div>
                        </div>
                    </div>
                    <div className="allDetails"></div>
                </div>
            </ModalBody> 
}
        </Modal>
    )
}

export default ViewProduct