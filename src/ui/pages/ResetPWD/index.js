// ** Third Party Components
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import InputPasswordToggle from '@components/input-password-toggle'
import { Link, useHistory, useParams } from 'react-router-dom'
import foreveryLogo from '../../../assets/images/icons/logo.svg';
import vectors from '../../../assets/images/illustration/vectors.svg'
import { useMutation } from 'react-apollo';
import { RESET_PWD } from "../../components/Session/mutations";
import { useSkin } from '@hooks/useSkin'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import Header from '../Home/Header/Header';
// ** Styles
import '@styles/react/pages/page-authentication.scss'



// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Button, Form, Label, Input, FormFeedback, Spinner, Card } from 'reactstrap'
import { ChevronLeft } from 'react-feather'
import { FormatError } from '../../../@core/components/common/FormatError';

const ResetPassword = () => {
    const history = useHistory()
    const { skin } = useSkin()
    const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
        source = require(`@src/assets/images/pages/${illustration}`)

    //get userid and code from url
    const parameter = useParams();
    const userIdAndCode = parameter?.id;
    const splitParams = parameter?.id?.split("_")
    const code = splitParams[splitParams?.length - 1]
    const resetPasswordId = userIdAndCode?.replace(`_${code}`, '')
    // Mutation
    const [resetPassword, { data, loading, error }] = useMutation(RESET_PWD);
    const ResetSchema = yup.object().shape({
        password: yup.string().min(8).required(),
        cpassword: yup.string().required("Confirm password is required").oneOf([yup.ref('password'), null], "Password Must Match"),
    })

    // ** Hooks
    const {
        reset,
        control,
        handleSubmit,
        register,
        formState: { errors }
    } = useForm({ mode: 'onChange', resolver: yupResolver(ResetSchema) })

    const onSubmit = data => {
        if (Object.values(data).every(field => field.length > 0)) {
            if (data?.password !== data?.cpassword) {
                toast.error("Confirm password doesn't match")
            } else {
                resetPassword({ variables: { resetPasswordId, code, password: data?.password } }).then((response) => {
                    if (response?.data?.resetPassword) {
                        handleReset();
                        toast.success("Password reset successfully");
                        history.push('/')
                    }
                }).catch((err) => { toast(FormatError(err)) });
            }
        }
    }

    const handleReset = () => {
        reset({
            password: '',
            cpassword: ""
        })
    }

    return (
        <div className='auth-wrapper auth-cover'>

            <div className='auth-wrapper auth-basic px-2'>
                <div className='auth-inner my-2 auth-verify-width'>
                    <div className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
                        <Card className='mb-0'>
                            <div className='d-flex align-items-center auth-bg px-2 p-lg-5 flex-column'>
                                <CardTitle tag='h4' className='text-center mb-4 buttler-heading'>
                                    Reset Password 🔒
                                </CardTitle>
                                <CardText className='mb-2 text-center'>Your new password must be different from previously used passwords</CardText>
                                <Form className='auth-reset-password-form mt-2 w-100' onSubmit={handleSubmit(onSubmit)}>
                                    <div className='mb-1'>
                                        <Label className='form-label' htmlFor='password'>
                                            Password
                                        </Label>
                                        <Controller
                                            name="password"
                                            control={control}
                                            {...register("password", {
                                                required: true,
                                            })}
                                            render={({ field: { onChange, value } }) => {
                                                return (
                                                    <InputPasswordToggle
                                                        required
                                                        invalid={errors?.password && true}
                                                        value={value}
                                                        onChange={(e) => onChange(e?.target?.value)}
                                                    />
                                                );
                                            }}
                                        />
                                        {errors.password && <FormFeedback>Please enter a valid password</FormFeedback>}
                                    </div>

                                    <div className='mb-1'>
                                        <Label className='form-label' htmlFor='cpassword'>
                                            Confirm Password
                                        </Label>
                                        <Controller
                                            name="cpassword"
                                            control={control}
                                            {...register("cpassword", {
                                                required: true,
                                            })}
                                            render={({ field: { onChange, value } }) => {
                                                return (
                                                    <InputPasswordToggle
                                                        required
                                                        invalid={errors?.cpassword && true}
                                                        value={value}
                                                        onChange={(e) => onChange(e?.target?.value)}
                                                    />
                                                );
                                            }}
                                        />
                                        {errors.cpassword && <FormFeedback>Please enter a valid confirm password</FormFeedback>}
                                    </div>

                                    <Button color='primary' block type='submit' className='common-button'>
                                        Reset Password &nbsp; {loading && <Spinner color='light' size='sm' className='mr-2' />}
                                    </Button>
                                </Form>
                                <p className='text-center mt-2'>
                                    <Link to='/'>
                                        <ChevronLeft className='rotate-rtl me-25' size={14} />
                                        <span className='align-middle'>Back to login</span>
                                    </Link>
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            <div id="recaptcha-container"></div>

        </div>
    )
}

export default ResetPassword
