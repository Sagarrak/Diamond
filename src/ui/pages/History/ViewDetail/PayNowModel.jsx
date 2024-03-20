import React, { useEffect, useState } from 'react'
import { Button, Col, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner } from 'reactstrap'
import memojiImg from "../../../../assets/images/avatars/memoji.png";
import { digitalOceanURL } from '../../../common/common';
import { useMutation,useQuery } from 'react-apollo';
import { MAKE_PAYMENT, REUPLOAD_SLIP } from '../mutation';
import { toast } from 'react-toastify';
import { FormatError } from '../../../../@core/components/common/FormatError';
import { Controller, useForm } from 'react-hook-form';
import { BANK_DETAILS } from '../../BankDetails/Query';

function PayNowModel({ setModal, modal, invoiceUrl, invoiceNo, refetch, isPaymentDoneByUser, paymentSlip }) {

    const {
        control,
        reset,
        setError,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({});
    const [bankData, setbankData] = useState("")

    const [PaymentSlip, setPaymentSlip] = useState("")
    const [MakePayment, { loading }] = useMutation(MAKE_PAYMENT);
    const {data}= useQuery(BANK_DETAILS,{
        variables:{
            page:1,
            limit:1000
        },
        fetchPolicy: "cache-and-network"
    })
    useEffect(() => {
        if (data?.getAllBankDetails) {
            setbankData(data?.getAllBankDetails?.data[0])
        }
    }, [data])
    console.log("bankdata",bankData);
   
    const [ChangePaymentReceipt, { loading: changeReceiptLoading }] = useMutation(REUPLOAD_SLIP);

    const AddSubmitHandler = (data) => {
        if (isPaymentDoneByUser && paymentSlip) {
            ChangePaymentReceipt({
                variables: { input: { invoiceNo: invoiceNo.toString(), paymentSlip: data?.paymentSlip } },
            })
                .then(async (data) => {
                    if (data?.data?.reUploadPaymentSlip?.status) {
                        await refetch();
                        toast.success("Payment reupload successfully");
                        setModal(false)
                    }
                })
                .catch((err) => {
                    return toast.warn(FormatError(err));
                });
        } else {
            MakePayment({
                variables: { input: { invoiceNo: invoiceNo.toString(), paymentSlip: data?.paymentSlip } },
            })
                .then(async (data) => {
                    if (data?.data?.makePayment?.status) {
                        await refetch();
                        toast.success("Payment successfully");
                        setModal(false)
                    }
                })
                .catch((err) => {
                    return toast.warn(FormatError(err));
                });
        }

    }
    const getBase64 = async (e, onChange) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = async () => {
            let result = await reader.result;
            await setPaymentSlip(result);
            await onChange(result);
        };
        reader.readAsDataURL(file);
    };
    return (
        <Modal Modal
            isOpen={modal}
            backdrop="static"
            className={"modal-dialog-centered modal-lg"}>
            <ModalHeader toggle={() => setModal(!modal)} >
                {"Pay Now"}
            </ModalHeader>
            <ModalBody className='p-1'>
                <div>
                    <Form className="auth-login-form mt-1" onSubmit={handleSubmit(AddSubmitHandler)}>
                        <div className="mb-1">
                            <Label className="form-label" htmlFor="login-fname">
                                Upload Pay Slip
                            </Label>
                            <Controller
                                name='paymentSlip'
                                control={control}
                                render={({ field: { onChange, value, ...rest } }) => {
                                    return (
                                        <Input
                                            type="file"
                                            {...register("paymentSlip")}
                                            invalid={errors?.paymentSlip && true}
                                            accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG,.pdf"
                                            onChange={(e) => {
                                                getBase64(e, onChange);
                                            }}
                                            {...rest}
                                        />
                                    )
                                }}
                            />
                            {errors.paymentSlip && <FormFeedback>Payment slip is  required</FormFeedback>}
                            {PaymentSlip !== "" && (
                                <>
                                    {PaymentSlip.includes("base64") ? (
                                        <img src={PaymentSlip} height={100} width={100} alt="advimage" className="my-1" />
                                    ) : (
                                        <Document file={`${digitalOceanURL}${PaymentSlip}`}>
                                            <Page pageNumber={1} width={100} height={100} />
                                        </Document>
                                    )}
                                </>
                            )}
                            {isPaymentDoneByUser ? '' :
                                <>
                                    <Row className='mt-1'>
                                        <Col>
                                            <span>Bank Name</span>
                                        </Col>
                                        <Col>
                                          {bankData ?  <span>{bankData.bankName}</span> : <span>Axis Bank</span>} 
                                        </Col>
                                    </Row>
                                    <Row className='mt-1'>
                                        <Col>
                                            <span>Account Number</span>
                                        </Col>
                                        <Col >
                                           { bankData ?<span>{bankData.accountNumber}</span> : <span>XXXX XXXX XXXX</span>} 
                                        </Col>
                                    </Row>
                                    <Row className='mt-1'>
                                        <Col >
                                            <span>IFSC Code</span>
                                        </Col>
                                        <Col >
                                           {bankData ? <span>{bankData.IFSCCode}</span> : <span>HDFC0005</span>}
                                        </Col>
                                    </Row>

                                </>
                            }
               
                            <Row sm={6} className="d-flex justify-content-end me-1 mt-1 ">
                                {
                                    loading ? <Spinner /> :
                                        <>
                                            {isPaymentDoneByUser ?
                                                <Button color="primary">
                                                    Change Receipt
                                                </Button> :


                                                <Button color="primary">
                                                    Pay Now
                                                </Button>
                                            }

                                        </>
                                }


                            </Row>
                        </div>
                    </Form>
                </div>
            </ModalBody>

        </Modal >
    )
}

export default PayNowModel