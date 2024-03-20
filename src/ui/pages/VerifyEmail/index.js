// ** React Imports
import { Link, useHistory, useParams } from 'react-router-dom'
import { useMutation } from 'react-apollo';
// ** Reactstrap Imports
import { Card, CardBody, CardTitle, CardText, Button, Spinner, ModalHeader, ModalBody, Modal } from 'reactstrap'
import yesIcon from "../../../../src/assets/images/icons/yes-icon.png";
import { VERIFY_EMAIL, RESEND_EMAIL } from "../../components/Session/mutations";
import { useSkin } from '@hooks/useSkin'
// ** Styles
import '@styles/react/pages/page-authentication.scss'
import { FormatError } from '../../../@core/components/common/FormatError';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const VerifyEmail = () => {
    const [loader, setLoader] = useState(false)
    const [modal, setModal] = useState(false)
    const history = useHistory()
    const { skin } = useSkin()
    const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
        source = require(`@src/assets/images/pages/${illustration}`)
    const [verifyEmailMutation] = useMutation(VERIFY_EMAIL)
    const [resendEmailVerification] = useMutation(RESEND_EMAIL)

    //get userid and code from url
    const parameter = useParams();
    const userIdAndCode = parameter?.id;
    const splitParams = parameter?.id?.split("_")
    const code = splitParams[splitParams?.length - 1]
    const userId = userIdAndCode?.replace(`_${code}`, '')

    const toggleHandler = () => { setModal(!modal) }
    useEffect(() => {
        setLoader(loader);
    }, [loader]);

    const handleSubmit = (e) => {
        setLoader(true)
        verifyEmailMutation({ variables: { userId, code } }).then((response) => {
            if (response?.data?.verifyEmail) {
                // setModal(true)
                //  toast.success("Thank you for verifying your email. admin verification for account login activation pending, we will notify you soon once it's done ")
                setLoader(false)
                toast.success("Email verify successfully")
                history.push('/login')
            }
        }).catch((err) => {
            toast.error(FormatError(err))
            setLoader(false)
        });
    }

    const resendVerificationCode = (e) => {
        setLoader(true)
        resendEmailVerification({ variables: { userId } }).then(async (data) => {
            if (data.data.resendVerificationEmailLink) {
                toast.success("Verification code sent successfully")
                setLoader(false)
            } else {
                toast("Something went wrong")
                setLoader(false)
            }
        }).catch((err) => {
            toast.error(FormatError(err))
            setLoader(false)
        });
    }

    return (
        <div className='auth-wrapper auth-basic px-2'>
            <div className='auth-inner my-2'>
                <Card className='mb-0'>
                    <CardBody>
                        <div className='d-flex align-items-center justify-content-center flex-column p-5'>
                            {/* <Link className='brand-logo mt-0 mb-3' to='/home' onClick={e => e.preventDefault()}>
                                <img src={finalForeveryLogo} className="mt-0" alt="login" />
                            </Link> */}
                            <CardTitle className='mb-1 buttler-heading'>
                                Verify your email ✉️
                            </CardTitle>
                            <CardText className='mb-2'>
                                Please click below button to verify your email
                            </CardText>
                            <Button onClick={(e) => handleSubmit(e)} className="common-button">
                                Verify Email {loader && <Spinner color='light' size='sm' className='mr-2' />}
                            </Button>
                            <p className='text-center mt-2'>
                                <span>Didn't receive an email? </span>
                                <a href='#' onClick={e => resendVerificationCode(e)}>
                                    <span>Resend</span>
                                </a>
                            </p>
                        </div>
                    </CardBody>
                </Card>
            </div>
            <div>
                <Modal
                    isOpen={modal}
                    toggle={toggleHandler}
                    className={"modal-dialog-centered general-modal-thankyou thank-you-modal"}
                >
                    <ModalHeader toggle={toggleHandler}></ModalHeader>
                    <ModalBody className='text-center'>
                        <h2>Thank you for verifying your email. admin verification for account login activation pending, we will notify you soon once it's done. </h2>
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

export default VerifyEmail
