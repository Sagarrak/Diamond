// ** Reactstrap Imports
import { Card, CardBody, CardText, Row, Col, Table, Badge, Button, Modal, ModalHeader, ModalBody, Input, Label, Spinner } from 'reactstrap'
import Select from 'react-select';
import Logo from "../../../../assets/images/pages/header-logo.png"
import moment from "moment"
import { useMutation } from 'react-apollo';
import { ManageOrderTrackingStatus, ManagePaymentStatusByAdmin } from '../mutation';
import { FormatError } from '../../../../@core/components/common/FormatError'
import { toast } from 'react-toastify';
import ImageComp from '../../../components/ImageComp';
import { useMemo, useState } from 'react';
import { digitalOceanURL } from '../../../common/common';
import { Edit } from 'react-feather';

const PreviewPayment = ({ data, refetch, modal, setModal, type }) => {
    const [modalReject, setModalReject] = useState(false)
    const [rejectionMessage, setRejectionMessage] = useState("")
    const totalDiscount = data?.invoiceProducts?.map(data => (parseFloat(data?.discount || 0) * (parseFloat(data?.price) * parseInt(data?.quantity))) / 100).reduce((prev, curr) => prev + curr, 0);
    const [edit, setEdit] = useState(false)
    // const subTotal = data?.invoiceProducts?.map(data => parseFloat(data?.price) * parseInt(data?.quantity)).reduce((prev, curr) => prev + curr, 0);

    const [UpdateStatus, { loading }] = useMutation(ManagePaymentStatusByAdmin);
    const [UpdateOrderStatus, { loading: orderStatusLoading }] = useMutation(ManageOrderTrackingStatus);

    const handlePaymentStatus = (status) => {
        const input = {
            invoiceId: data?.invoiceNo,
            status: status,
            rejectionMessage: rejectionMessage
        }
        UpdateStatus({ variables: { ...input } }).then((response) => {
            if (response?.data?.managePaymentStatusByAdmin?.status) {
                refetch();
                toast.success("Payment Status updated successfully")
                setModal(false);
            }
        }).catch(err => {
            toast.error(FormatError(err))
        })
    }

    const handleOrderStatus = () => {
        const input = { invoiceId: data?.invoiceNo, status: trackingStatus?.value, }
        UpdateOrderStatus({ variables: { ...input } }).then((response) => {
            if (response?.data?.manageOrderTrackingStatus?.status) {
                refetch();
                toast.success("Payment Status updated successfully")
                setEdit(false)
            }
        }).catch(err => {
            toast.error(FormatError(err))
        })
    }
    const options = [
        { label: "Ready To Ship", value: "readyToShip" },
        { label: "In Transit", value: "inTransit" },
        { label: "Delivered", value: "delivered" }
    ]
    const defaultStatus = useMemo(() => { return data?.orderTrackingStatus === "confirmed" ? { label: "Confirmed", value: "confirmed" } : options?.find(d => d?.value === data?.orderTrackingStatus) }, [data])
    const [trackingStatus, setTrackingStatus] = useState(defaultStatus)


    return (
        <Card className='invoice-preview-card'>
            <CardBody className='invoice-padding pb-0'>
                {/* Header */}
                <div className='d-flex justify-content-between flex-md-row flex-column invoice-spacing mt-0'>
                    <div>
                        <div className='logo-wrapper'>
                            <img src={Logo} alt="forevery" width={140} />
                        </div>
                    </div>
                    <div className='mt-md-0 mt-2'>
                        <div className='invoice-date-wrapper'>
                            <p className='invoice-title'>Invoice No #{data?.invoiceNo} </p>
                            <p className='invoice-date-title'>Date Issued: {moment(data?.createdAt).format("DD/MM/YYYY")}</p>
                        </div>
                    </div>
                </div>
                {/* /Header */}
            </CardBody>

            <hr className='invoice-spacing' />

            {/* Address and Contact */}
            <CardBody className='invoice-padding pt-0'>
                <Row className='invoice-spacing'>
                    <Col className='p-0' xl='8'>
                        <h6 className='mb-2 out-fit-regular'>Invoice To: {data?.userEmail}</h6>
                        <h6 className='mb-25 out-fit-regular'>{data?.userId?.fullName}</h6>
                    </Col>
                    {
                        type === "tracking" ?
                            <Col className='p-0 mt-xl-0 mt-2' xl='4'>
                                {data?.isPaymentApprovedByAdmin === "accepted" &&
                                    <>
                                        <div className='mb-2'>
                                            <p className='out-fit-regular'> Manage Your Order Status </p>
                                        </div>
                                        <div className='d-flex align-items-center gap-1'>
                                            <Select
                                                options={options}
                                                value={trackingStatus}
                                                isDisabled={!edit}
                                                onChange={d => setTrackingStatus(d)}
                                            />
                                            {!edit && <span className='cursor-pointer' onClick={() => setEdit(true)}><Edit /></span>}
                                            {
                                                edit && <div>
                                                    <Button color='success out-fit-regular me-2' onClick={handleOrderStatus}>Save {loading && <Spinner />}</Button>
                                                    <Button color='danger out-fit-regular' onClick={() => { setTrackingStatus(defaultStatus); setEdit(false); }}>Cancel</Button>
                                                </div>
                                            }
                                        </div>
                                    </>
                                }
                            </Col> :
                            <Col className='p-0 mt-xl-0 mt-2' xl='4'>
                                {
                                    data?.paymentSlip ?
                                        <>
                                            <a href={digitalOceanURL + data?.paymentSlip} target="_blank"><Button color='primary out-fit-regular me-2'>View Payment Slip</Button></a>
                                            <Button color='success out-fit-regular me-2' onClick={d => handlePaymentStatus("accepted")}>Approve Payment {loading && <Spinner />}</Button>
                                            <Button color='danger out-fit-regular' onClick={() => setModalReject(!modalReject)}>Reject Payment</Button>
                                        </>
                                        : <span className='text-warning out-fit-regular'>No Payment Slip Found !</span>
                                }

                            </Col>
                    }
                </Row>
            </CardBody>
            {/* /Address and Contact */}

            {/* Invoice Description */}
            <Table responsive >
                <thead>
                    <tr>
                        <th className='py-1 out-fit-regular'>Products</th>
                        <th className='py-1 out-fit-regular'>Price</th>
                        <th className='py-1 out-fit-regular'>Quantity</th>
                        <th className='py-1 out-fit-regular'>Discount</th>
                        <th className='py-1 out-fit-regular'>Total</th>
                        <th className='py-1 out-fit-regular min-width'>Status</th>
                    </tr>
                </thead>
                <tbody >
                    {
                        data?.invoiceProducts?.map((invoice, i) => {
                            const discountPrice = (parseFloat(invoice?.discount) * (parseFloat(invoice?.price) * parseInt(invoice?.quantity))) / 100;
                            return (
                                <tr key={invoice?.id}>
                                    <td className='py-1'>
                                        <div className="d-flex align-items-center pb-1">
                                            <div style={{ width: '90px', height: '90px' }}>
                                                <ImageComp src={invoice?.productId?.image} width='100%' height='100%' />
                                            </div>
                                        </div>
                                    </td>
                                    <td className='py-1'>
                                        <span className='out-fit-regular'>${invoice?.price}</span>
                                    </td>
                                    <td className='py-1'>
                                        <span className='out-fit-regular'>{invoice?.quantity}</span>
                                    </td>
                                    <td className='py-1'>
                                        <span className='out-fit-regular'>${discountPrice ? discountPrice : 0} ({invoice?.discount || 0}%)</span>
                                    </td>
                                    <td className='py-1'>
                                        <span className='out-fit-regular'>${invoice?.total.toFixed(2)}</span>
                                    </td>
                                    <td className='py-1'>
                                        <Badge className="text-capitalize out-fit-regular" color={data?.productStatus.includes("HOLD") ? "light-warning" : data?.productStatus == "AVAILABLE" ? "light-success" : "light-danger"} pill>
                                            {data?.productStatus}
                                        </Badge>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
            {/* /Invoice Description */}

            {/* Total & Sales Person */}
            <CardBody className='invoice-padding pb-0'>
                <Row className='invoice-sales-total-wrapper'>
                    <Col className='mt-md-0 mt-3' md='6' order={{ md: 1, lg: 2 }}>
                        <CardText className='mb-0'>
                        </CardText>
                    </Col>
                    <Col className='d-flex justify-content-end' md='6' order={{ md: 2, lg: 1 }}>
                        <div className='invoice-total-wrapper'>
                            <div className='invoice-total-item'>
                                <p className='invoice-total-title'>Subtotal:</p>
                                <p className='invoice-total-amount'>${data?.totalAmount.toFixed(2)}</p>
                            </div>

                            <div className='invoice-total-item' hidden={totalDiscount === 0}>
                                <p className='invoice-total-title'>Total discount:</p>
                                <p className='invoice-total-amount'>${totalDiscount}</p>
                            </div>
                            <hr className='my-50' />
                            <div className='invoice-total-item'>
                                <p className='invoice-total-title'>Total:</p>
                                <p className='invoice-total-amount'>${data?.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </CardBody>
            {/* /Total & Sales Person */}

            <hr className='invoice-spacing' />

            {/* Invoice Note */}
            <CardBody className='invoice-padding pt-0'>
                {data?.notes &&
                    <Row>
                        <Col sm='12'>
                            <span >Note: </span>
                            <span> {data?.notes} </span>
                        </Col>
                    </Row>
                }
            </CardBody>
            {/* /Invoice Note */}


            <Modal
                isOpen={modalReject}
                toggle={() => setModalReject(!modalReject)}
                className={'modal-dialog-centered'}
            >
                <ModalHeader toggle={() => setModalReject(!modalReject)} className='out-fit-regular'>Reject User Payment</ModalHeader>
                <ModalBody>
                    <Label htmlFor='rejectPaymentReason'> Please Enter Reason To Reject Payment <span style={{ color: "red" }}>*</span></Label>
                    <Input id="rejectPaymentReason" className='out-fit-regular' type="textarea" placeholder='Enter Reason To Reject the Payment' required
                        onChange={e => setRejectionMessage(e?.target?.value)}
                    />
                    <div className='mt-2 d-flex justify-content-between'>
                        <Button color='success out-fit-regular' outline onClick={() => setModalReject(!modalReject)}>Cancel</Button>
                        <Button color='danger out-fit-regular' onClick={() => {
                            if (rejectionMessage) {
                                handlePaymentStatus("rejected");
                            } else {
                                toast.error("Please Enter Reason To Reject The Payment")
                            }
                        }}>Reject Payment {loading && <Spinner />}</Button>
                    </div>
                </ModalBody>
            </Modal>
        </Card>
    )
}

export default PreviewPayment
