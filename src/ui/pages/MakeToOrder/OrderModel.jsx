import React from 'react'
import { Badge, Card, CardBody, Modal, ModalBody, ModalHeader } from 'reactstrap'
import ImageComp from "../../components/ImageComp"
import "./index.scss";
const OrderModel = ({ modal, setModal, data }) => {

    const toggleHandler = () => setModal(!modal);

    return (
        <div>
            <Modal
                isOpen={modal}
                toggle={toggleHandler}
                className={"modal-dialog-centered order-view-modal"}
                backdrop={"static"}
            >
                <ModalHeader toggle={toggleHandler}></ModalHeader>
                <ModalBody className='text-center'>
                    <div className="d-flex justify-content-center info">
                        <Card style={{ marginRight: "40px" }}>
                            <CardBody>
                                <div className="userInfo">
                                    <h2> User Details </h2>
                                    <div className="details">
                                        <p> <span>Name :</span> <span>{data?.firstName + " " + data?.lastName}</span></p>
                                        <p> <span>Email :</span> <span>{data?.email}</span></p>
                                        <p> <span>Country :</span> <span>{data?.country}</span></p>
                                        <p> <span>Phone No :</span> <span>{data?.phoneNo}</span></p>
                                        <p> <span>Company Name :</span> <span>{data?.companyName || "N/A"}</span></p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardBody>
                                <div className="userInfo">
                                    <h2> Product Details </h2>
                                    <div className="details">
                                        <p> <span>Shape :</span> <span>{data?.shape} {data?.image && <Badge color='success'>New Shape</Badge>}</span></p>
                                        <p> <span>Size(in ct.) :</span> <span>{data?.size}</span></p>
                                        <p> <span>Color :</span> <span>{data?.color}</span></p>
                                        <p> <span>Clarity :</span> <span>{data?.clarity}</span></p>
                                        <p> <span>Measurement :</span> <span>{data?.measurement}</span></p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                    {
                        data?.image &&
                        <Card>
                            <CardBody>
                                <h2>New Shape Image</h2>
                                <ImageComp src={data?.image} width={200} />
                            </CardBody>
                        </Card>
                    }
                    <div className="notes">
                        <Card>
                            <CardBody>
                                <h2>Notes</h2>
                                <p>{data?.notes}</p>
                            </CardBody>
                        </Card>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default OrderModel