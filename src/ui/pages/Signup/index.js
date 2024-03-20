// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Third Party Components
import { toast } from 'react-toastify'
import { useForm, Controller } from 'react-hook-form'
import { Link, useHistory } from 'react-router-dom'
import InputPasswordToggle from '@components/input-password-toggle'
import { useMutation } from 'react-apollo';
import { SIGN_UP } from '../../components/Session/mutations'
import { useSkin } from '@hooks/useSkin'
import { FormatError } from '../../../@core/components/common/FormatError';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import '../../scss/datePicker.scss'
import '../../scss/authPages.scss';
import firebase from '../../../firebase'
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";


// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Button, Form, Label, Input, FormFeedback, Spinner } from 'reactstrap'
import _ from 'lodash'
import Header from '../Home/Header/Header'
const SignIn = ({ refetch }) => {
    const history = useHistory()
    const { skin } = useSkin()
    const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
        source = require(`@src/assets/images/pages/${illustration}`)
    const [profilePic, setProfilePic] = useState('');
    const [gender, setGender] = useState('');
    const [mobileLength, setMobileLength] = useState(0)
    const [password, setPassword] = useState("")
    const [picker, setPicker] = useState(new Date())
    // Mutation
    const [signUp, { data, loading, error }] = useMutation(SIGN_UP, { fetchPolicy: "no-cache" });

    const SignupSchema = yup.object().shape({
        email: yup.string().email("email should be valid").required("email is required"),
        password: yup.string().min(8, "password must be more than 8 characters").required("password is required"),
    });

    // ** Hooks
    const {
        reset,
        control,
        handleSubmit,
        register,
        formState: { errors }
    } = useForm({ mode: "onChange", resolver: yupResolver(SignupSchema) });

    // useEffect(() => {
    //     window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    //         "recaptcha-container", {
    //         size: "invisible",
    //         callback: function (response) { },
    //     }
    //     );
    // }, []);


    const onSubmit = (data) => {
        if (Object.values(data).every(field => field.length > 0)) {
            if (data?.mobile?.length !== mobileLength) {
                errors.mobile = true
            } else {
                let inputData = {
                    fullName: data?.fname,
                    email: data?.email,
                    mobile: data?.mobile,
                    userName: data?.uname,
                    password: data?.password,
                    gender: gender,
                    profilePicture: profilePic
                }

                signUp({ variables: { input: inputData } }).then((data) => {
                    if (data?.data?.signUp?.status) {
                        toast.success("You have been successfully registered")
                        history.push('/login')
                        // firebase.auth().signInWithPhoneNumber(`+${inputData?.mobile}`, window.recaptchaVerifier)
                        //     .then((confirmationResult) => {
                        //         window.confirmationResult = confirmationResult
                        //         localStorage.setItem("umobile", data?.data?.signUp?.user?.mobile)
                        //         history.push('/verify-mobile')
                        //         toast.success("You have been successfully registered")
                        //         handleReset();
                        //     }).catch(err => {
                        //         history.push('/login')
                        //         toast.success("You have been successfully registered")
                        //         handleReset();
                        //     })
                    }
                }).catch((err) => { toast.error(FormatError(err)); handleReset(); });
            }
        }
    }
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    const setProfile = (e) => {
        getBase64(e.target.files[0]).then(
            data => setProfilePic(data)
        );
    }
    const handleReset = () => {
        reset({
            fname: '',
            email: '',
            mobile: '',
            uname: '',
            password: '',
            cpassword: '',
            gender: ''
        })
    }

    const onChangeMobile = (value, data, onChange) => {
        const ff = data.format.slice(data.dialCode.length + 1)
        const dd = ff.replace(/[^.]+/g, "")
        setMobileLength(data.dialCode.length + dd?.length)
        onChange(value)
    }

    return (
        <>
            <Header />
            <div className='my-5 container register-page'>
                <div className='text-center'>
                    <h1 className='buttler-heading outfit-bold'>Create Account</h1>
                </div>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col xl='6' lg='6' md='6' sm='12' className='align-items-center text-center pe-lg-4 signUp-side'>
                            <div className='my-2'>
                                {/* <Label className='form-label' htmlFor='email'> Full Name <span className='text-danger'>&#42;</span> </Label> */}
                                <Controller
                                    id='fname'
                                    name='fname'
                                    {...register("fname", { required: true })}
                                    defaultValue=''
                                    control={control}
                                    render={({ field }) => (
                                        <><Input className='input-filed' {...field} type='text' placeholder='Full Name *' invalid={errors.fname && true} /></>
                                    )}
                                />
                                {errors.fname && <FormFeedback>full name is required</FormFeedback>}
                            </div>
                            <div className='my-2'>
                                {/* <Label className='form-label' htmlFor='email'> Email <span className='text-danger'>&#42;</span> </Label> */}
                                <Controller
                                    id='email'
                                    name='email'
                                    {...register("email", { required: true })}
                                    defaultValue=''
                                    control={control}
                                    render={({ field }) => (
                                        <><Input className='input-filed' {...field} type='email' placeholder='Email *' invalid={errors.email && true} /></>
                                    )}
                                />
                                {errors.email && <FormFeedback>Please enter a valid email</FormFeedback>}
                            </div>
                            <div className='my-2'>
                                {/* <Label className='form-label' htmlFor='email'>Mobile No <span className='text-danger'>&#42;</span></Label> */}
                                <Controller
                                    id='mobile'
                                    name='mobile'
                                    {...register("mobile", { required: true })}
                                    defaultValue=''
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <>
                                            <PhoneInput
                                                className="input-filed mobile-Input"
                                                containerClass={errors.mobile ? "is-invalid" : ""}
                                                inputStyle={{
                                                    padding: '0px auto',
                                                    marginLeft: 0,
                                                    background: 'transparent',
                                                    border: 'none',
                                                    borderRadius: '0px',
                                                    lineHeight: '0px',
                                                    height: '100%',
                                                    width: '100%',
                                                    outline: 'none',
                                                    boxShadow: 'none'
                                                }}
                                                country={'in'}
                                                placeholder='Phone Number *'
                                                value={value}
                                                onChange={(value, data) => onChangeMobile(value, data, onChange)}
                                            />
                                        </>
                                    )}
                                />
                                {errors.mobile && <FormFeedback>Please enter a valid mobile</FormFeedback>}
                            </div>
                            <div className='my-xxl-2 my-xl-2 my-lg-2 mt-md-2 mb-sm-0'>
                                {/* <Label className='form-label' htmlFor='email'> User Name </Label> <span className='text-danger'>&#42;</span> */}
                                <Controller
                                    id='uname'
                                    name='uname'
                                    {...register("uname", { required: true })}
                                    defaultValue=''
                                    control={control}
                                    render={({ field }) => (
                                        <Input className='input-filed' {...field} type='text' placeholder='Username *
                                        ' invalid={errors.uname && true} />
                                    )}
                                />
                                {errors.uname && <FormFeedback>username is required</FormFeedback>}
                            </div>
                            {/* <div>                            
                                 <DatePicker
                                    selected={date}
                                    onSelect={handleDateSelect} //when day is clicked
                                    onChange={handleDateChange} //only when value has changed
                                />
                            </div> */}
                        </Col>
                        <Col xl='6' lg='6' md='6' sm='12' className='align-items-center text-center ps-lg-4'>
                            <div className='my-2'>
                                {/* <Label className='form-label' htmlFor='password'> Password <span className='text-danger'>&#42;</span> </Label> */}
                                <Controller
                                    name="password"
                                    control={control}
                                    {...register("password", { required: true })}
                                    render={({ field: { onChange, value } }) => {
                                        return (
                                            <Input className='input-filed' PasswordToggle
                                                placeholder='Password *'
                                                required
                                                invalid={errors?.password && true}
                                                value={value}
                                                onChange={(e) => { onChange(e?.target?.value); setPassword(e?.target?.value) }}
                                            />
                                        );
                                    }}
                                />
                                {errors.password && <FormFeedback>password is required</FormFeedback>}
                            </div>
                            <div className='my-2'>
                                {/* <Label className='form-label' htmlFor='password'> Confirm Password <span className='text-danger'>&#42;</span> </Label> */}
                                <Controller
                                    id='confirm-password'
                                    name='cpassword'
                                    {...register("cpassword", {
                                        required: "Confirm password is required",
                                        validate: value => value === password || "Confirm password did not match"
                                    })}
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Input className='input-filed' PasswordToggle
                                            placeholder='Confirm Password *'
                                            invalid={errors.cpassword && true}
                                            value={value}
                                            onChange={(e) => onChange(e?.target?.value)}
                                        />
                                    )}
                                />
                                {errors.cpassword && <FormFeedback>{errors.cpassword.message}</FormFeedback>}
                            </div>
                            <div className='my-2 text-start'>
                                <Label className=' form-label d-block text-left' style={{ fontSize: '15px', color: '#100f0f', marginBottom: "12px", letterSpacing: "0.9px" }}>Gender*</Label>

                                <Input className='register-input' style={{ borderRadius: '0px' }} name='gender' type='radio' id="rMale" value={'MALE'} onChange={(e) => { setGender(e.target.value) }} />
                                <Label className=' form-check-label' htmlFor='rMale' style={{ paddingLeft: '13px', fontSize: '15px' }}> Male </Label>

                                <Input className='register-input ms-2' style={{ borderRadius: '0px' }} name='gender' id="rFemale" type='radio' value={'FEMALE'} onChange={(e) => { setGender(e.target.value) }} />
                                <Label className=' form-check-label' htmlFor='rFemale' style={{ paddingLeft: '13px', fontSize: '15px' }}> Female </Label>

                                <Input className='register-input ms-2' style={{ borderRadius: '0px' }} type='radio' name='gender' id="rOther" value={'OTHER'} onChange={(e) => { setGender(e.target.value) }} />
                                <Label className=' form-check-label' htmlFor='rOther' style={{ paddingLeft: '13px', fontSize: '15px' }}> Other </Label >
                            </div>
                            <div className='my-2 text-start'>
                                <Label className=' form-label ' style={{ fontSize: '15px', color: '#100f0f', marginBottom: "12px" }}>Select Profile Picture</Label> <br />
                                <Input className='input-filed' type="file" accept="image/*" name="profile-picture" onChange={(e) => { setProfile(e); }} />
                            </div>
                        </Col>
                    </Row>
                    <div className='align-items-center text-center mt-4 mt-sm-2 sing_upbtn'>
                        <Button className='common-button' type='submit'> Sign up {loading && <Spinner color='light' size='sm' className='ms-1' />} </Button>
                        <p className='text-center mt-2' style={{ letterSpacing: "0.9px", color: "#434343" }}>
                            <span className='me-25'>Already Have an account?</span>
                            <Link to='/login'>
                                <span className='underline-green-text' style={{ color: "black", fontWeight: "bolder" }}>Sign in here </span>
                            </Link>
                        </p>
                    </div>
                </Form>
                <div id="recaptcha-container"></div>
            </div>
        </>
    )
}

export default SignIn
