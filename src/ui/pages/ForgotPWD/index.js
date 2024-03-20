// ** React Imports
import { Fragment } from 'react'

// ** Third Party Components
import * as yup from 'yup'
import { Check, ChevronLeft } from 'react-feather'
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Link, useHistory } from 'react-router-dom'
import foreveryLogo from '../../../assets/images/icons/logo.svg';
import vectors from '../../../assets/images/illustration/vectors.svg'
import { useMutation } from 'react-apollo';
import { FORGOT_PWD } from "../../components/Session/mutations";
import { useSkin } from '@hooks/useSkin'
import { FormatError } from '../../../@core/components/common/FormatError';

// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Button, Form, Label, Input, FormFeedback, Spinner } from 'reactstrap'

const SignIn = ({ refetch }) => {
    const history = useHistory()
    const { skin } = useSkin()
    const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
        source = require(`@src/assets/images/pages/${illustration}`)

    // Mutation
    const [forgotPassword, { data, loading, error }] = useMutation(FORGOT_PWD);

    // ** Hooks
    const {
        control,
        reset,
        register,
        setError,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = data => {
        if (Object.values(data).every(field => field.length > 0)) {
            forgotPassword({ variables: { email: data?.email } }).then((data) => {
                if (data?.data?.forgotPassword) {
                    handleReset();
                    toast.success("We’ve sent you an email to reset your password")
                    // history.push('/reset-password')
                }
            }).catch((err) => {
                toast(FormatError(err))
                handleReset();
            });
        }
    }

    const handleReset = () => {
        reset({ email: "" })
    }

    return (
        // <div className='auth-wrapper auth-cover'>
        //     <Row className='auth-inner m-0'>
        //         <Link className='brand-logo' to='/home'>
        //             <img src={foreveryLogo} className="mt-1" alt="login" style={{ width: "15%", paddingLeft: 50 }} />
        //         </Link>
        //         <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
        //             <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
        //                 <img className='img-fluid' src={vectors} alt='Login Cover' width={"83%"} />
        //             </div>
        //         </Col>
        //         <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
        //             <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
        //                 <CardTitle tag='h2' className='fw-bold mb-1'>
        //                     Forgot Password? 🔒
        //                 </CardTitle>
        //                 <CardText className='mb-2'>Enter your email and we'll send you instructions to reset your password</CardText>
        //                 <Form onSubmit={handleSubmit(onSubmit)}>
        //                     <div className='mb-1'>
        //                         <Label className='form-label'>
        //                             Email
        //                         </Label>
        //                         <Controller
        //                             id='email'
        //                             name='email'
        //                             control={control}
        //                             {...register("email", {
        //                                 required: true,
        //                             })}
        //                             render={({ field }) => (
        //                                 <Input type='text' placeholder='Enter Email' invalid={errors.email && true} {...field} />
        //                             )}
        //                         />
        //                         {errors.email && <FormFeedback>Please enter a valid email</FormFeedback>}
        //                     </div>
        //                     <Button color='primary' block type='submit'>
        //                         Send &nbsp; {loading && <Spinner color='light' size='sm' className='mr-2' />}
        //                     </Button>
        //                 </Form>
        //                 <p className='text-center mt-2'>
        //                     <Link to='/login'>
        //                         <ChevronLeft className='rotate-rtl me-25' size={14} />
        //                         <span className='align-middle'>Back to login</span>
        //                     </Link>
        //                 </p>
        //             </Col>
        //         </Col>
        //     </Row>
        // </div>
        <div>

        </div>
    )
}

export default SignIn
