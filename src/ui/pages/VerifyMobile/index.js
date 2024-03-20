// ** React Imports
import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Button, Form, Input, Spinner, CardBody, Card, ModalHeader, ModalBody, Modal } from 'reactstrap'
import foreveryLogo from '../../../assets/images/icons/logo.svg';
import vector from "../../../assets/images/pages/two-steps-verification-illustration.svg"
import { SIGN_IN_WITH_MOBILE } from '../../components/Session/mutations'
// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/react-hooks';
import { FormatError } from '../../../@core/components/common/FormatError';
import _ from 'lodash';
// import firebase from '../../../firebase'
import Header from '../Home/Header/Header';
import yesIcon from "../../../../src/assets/images/icons/yes-icon.png";

const VerifyMobile = () => {
    // ** Hooks
    const [otp, setOtp] = useState({
        num1: '',
        num2: '',
        num3: '',
        num4: '',
        num5: '',
        num6: '',
    })
    const [modal, setModal] = useState(false);
    const toggleHandler = () => { setModal(!modal) }

    const [signInWithMobile, { data, loading, error }] = useMutation(SIGN_IN_WITH_MOBILE);
    const mobile = localStorage.getItem('umobile')
    const { skin } = useSkin()
    const history = useHistory()
    const illustration =
        skin === 'dark' ? 'two-steps-verification-illustration-dark.svg' : 'two-steps-verification-illustration.svg',
        source = require(`@src/assets/images/pages/${illustration}`).default


    // useEffect(() => {
    //     window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    //         "recaptcha-container", {
    //         size: "invisible",
    //         callback: function (response) { },
    //     }
    //     );
    // }, []);

    const handleChange = (value1, event) => {
        setOtp({ ...otp, [value1]: event.target.value });
    }

    const inputFocus = (elmnt) => {
        if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
            const next = elmnt.target.tabIndex - 2;
            if (next > -1) {
                elmnt.target.form.elements[next].focus()
                elmnt.target.form.elements[next].select()
            }
        } else {
            const next = elmnt.target.tabIndex;
            if (next < 6) {
                elmnt.target.form.elements[next].focus()
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const opt_number = Object.values(otp).join("")

        if (!window?.confirmationResult) {
            toast.error("Code is expired or invalid")
            setOtp(_.mapValues(otp, () => ""))
        } else {
            window.confirmationResult
                .confirm(opt_number)
                .then(() => {
                    // signInWithMobile({ variables: { mobile } })
                    //     .then((response) => {
                    //         const userType = response?.data?.LoginInWithMobile?.user?.userType
                    //         if (response?.data?.LoginInWithMobile?.token) {
                    //             setOtp(_.mapValues(otp, () => ""))
                    //             toast.success("Mobile Verified Successfully")
                    //             // localStorage.setItem("UserRes", JSON.stringify(response?.data?.LoginInWithMobile?.user))
                    //             // localStorage.setItem('token', response?.data?.LoginInWithMobile?.token)
                    //             // localStorage.setItem('utype', userType)
                    //             // history.push("/user-dashboard")
                    //             history.push("/login")
                    //         }
                    //     }).catch((error) => {
                    //         toast.error(FormatError(error))
                    //         setOtp(_.mapValues(otp, () => ""))
                    //     })
                    setModal(true);
                })
                .catch(() => {
                    toast.error("Code is expired or invalid")
                    setOtp(_.mapValues(otp, () => ""))
                });
        }
    }

    const handleResend = (e) => {
        e.preventDefault()
        // firebase.auth().signInWithPhoneNumber(`+${mobile}`, window.recaptchaVerifier)
        //     .then((confirmationResult) => {
        //         window.confirmationResult = confirmationResult
        //         toast.success("Otp sent successfully")
        //     }).catch(err => {
        //         toast.error("Otp failed to send")
        //     })
    }

    return (
        <div>
            {/* <Header /> */}
            <div className='auth-wrapper auth-basic px-2'>
                <div className='auth-inner my-2 auth-verify-width'>
                    {/* <Link className='brand-logo' to='/' onClick={e => e.preventDefault()}>
                        <img src={foreveryLogo} className="mt-1" alt="login" style={{ width: "15%", paddingLeft: 50 }} />
                    </Link> */}
                    {/* <Col className='d-none d-lg-flex align-items-center p-5 bg-login' lg='8' sm='12'>
                        <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
                            <img className='img-fluid' src={vector} alt='Login Cover' />
                        </div>
                    </Col> */}
                    <div className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
                        <Card className='mb-0'>
                            <CardBody className='p-1'>
                                <div className='d-flex auth-bg flex-column p-lg-3 p-1' lg='4' sm='12'>
                                    <CardTitle tag='h2' className='text-center mb-4 buttler-heading'>
                                        Two Step Verification 💬
                                    </CardTitle>
                                    <CardText className='mb-75'>
                                        We sent a verification code to your mobile. Enter the code from the mobile in the field below.
                                    </CardText>
                                    <CardText className='fw-bolder mb-2'>{mobile?.replace(/.(?=.{4})/g, '*')}</CardText>
                                    <Form className='mt-2' onSubmit={e => e.preventDefault()}>
                                        <h6 className='mb-1'>Type your 6 digit security code</h6>
                                        <div className='auth-input-wrapper d-flex align-items-center justify-content-between'>
                                            <Input
                                                autoFocus
                                                className='auth-input height-50 text-center numeral-mask mx-25 mb-1'
                                                value={otp.num1}
                                                onChange={e => handleChange("num1", e)}
                                                maxLength='1'
                                                tabIndex="1"
                                                onKeyUp={e => inputFocus(e)}
                                            />
                                            <Input
                                                className='auth-input height-50 text-center numeral-mask mx-25 mb-1'
                                                value={otp.num2}
                                                onChange={e => handleChange("num2", e)}
                                                maxLength='1'
                                                tabIndex="2"
                                                onKeyUp={e => inputFocus(e)}
                                            />
                                            <Input
                                                className='auth-input height-50 text-center numeral-mask mx-25 mb-1'
                                                value={otp.num3}
                                                onChange={e => handleChange("num3", e)}
                                                maxLength='1'
                                                tabIndex="3"
                                                onKeyUp={e => inputFocus(e)}
                                            />
                                            <Input
                                                className='auth-input height-50 text-center numeral-mask mx-25 mb-1'
                                                value={otp.num4}
                                                onChange={e => handleChange("num4", e)}
                                                maxLength='1'
                                                tabIndex="4"
                                                onKeyUp={e => inputFocus(e)}
                                            />
                                            <Input
                                                className='auth-input height-50 text-center numeral-mask mx-25 mb-1'
                                                value={otp.num5}
                                                onChange={e => handleChange("num5", e)}
                                                maxLength='1'
                                                tabIndex="5"
                                                onKeyUp={e => inputFocus(e)}
                                            />
                                            <Input
                                                className='auth-input height-50 text-center numeral-mask mx-25 mb-1'
                                                value={otp.num6}
                                                onChange={e => handleChange("num6", e)}
                                                maxLength='1'
                                                tabIndex="6"
                                                onKeyUp={e => inputFocus(e)}
                                            />
                                        </div>
                                    </Form>
                                    <div className='d-flex align-items-center justify-content-center mt-5'>
                                        <button to='/' className='common-button cursor-pointer' onClick={(e) => handleSubmit(e)} disabled={Object.values(otp).join("")?.length !== 6 ? true : false}>
                                            Sign in {loading && <Spinner color='light' size='sm' className='ms-1' />}
                                        </button>
                                    </div>
                                    <p className='text-center mt-2'>
                                        <span>Didn’t get the code?</span>{' '}
                                        <a href="#" onClick={e => handleResend(e)}>
                                            Resend
                                        </a>
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                </div>
            </div>
            <div id="recaptcha-container"></div>
            <div>
                <Modal
                    isOpen={modal}
                    toggle={toggleHandler}
                    className={"modal-dialog-centered general-modal-thankyou thank-you-modal"}
                >
                    <ModalHeader toggle={toggleHandler}></ModalHeader>
                    <ModalBody className='text-center'>
                        <h2>Thank you for verifying your mobile number. admin verification for account login activation pending, we will notify you soon once it's done. </h2>
                        <div className='my-2'>
                            <img src={yesIcon} alt="yesIcon" height={100} width={100} />
                        </div>
                        <a href={"/"} className='common-button' onClick={() => { setModal(false) }} >Back to home</a>
                    </ModalBody>
                </Modal>
            </div>
        </div>
    )
}

export default VerifyMobile
