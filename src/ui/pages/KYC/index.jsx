// ** Third Party Components
import { toast } from 'react-toastify'
import { Link, useHistory } from 'react-router-dom'
import cvdLogo from '../../../assets/images/icons/favicon.ico';
import vectors from '../../../assets/images/illustration/vector-1.svg'
import { ApolloConsumer, useMutation } from 'react-apollo';
import { UPDATE_KYC } from "./mutation";
import { useSkin } from '@hooks/useSkin'


// ** Reactstrap Imports
import { Row, Col, CardTitle, CardText, Button, Form, Label, Input, FormFeedback, Spinner } from 'reactstrap'
import { FormatError } from '../../../@core/components/common/FormatError';
import { useState } from 'react';
import { handleLogout } from '../../../redux/authentication';
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';

const UpdateKYC = () => {
    const history = useHistory()
    const dispatch = useDispatch();
    const { skin } = useSkin()
    const illustration = skin === 'dark' ? 'login-v2-dark.svg' : 'login-v2.svg',
        source = require(`@src/assets/images/pages/${illustration}`)

    // Mutation
    const [updateKYCMutation, { loading }] = useMutation(UPDATE_KYC);

    const signOut = client => {
        localStorage.clear()
        client?.cache?.reset()
        history.push('/login');
        // client?.clearStore()
        dispatch(handleLogout())
    };

    // ** Validation modules	
    const {
        control,
        reset,
        setError,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({});

    const onSubmit = (data, client) => {
        updateKYCMutation({ variables: { input: data } }).then((response) => {
            if (response?.data?.updateVendor) {
                reset({})
                toast("Your document has been submitted successfully, Please wait for your account approval");
                signOut(client);
            } else {
                toast("Something went wrong");
                reset({})
            }
        }).catch((err) => {
            toast(FormatError(err))
            reset({})
        });
    }

    const getBase64 = (e, onChange) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.readAsDataURL(file)
        reader.onloadend = async () => {
            let result = await reader.result
            await onChange(result);
        }
    }

    return (
        <div className='auth-wrapper auth-cover'>
            <Row className='auth-inner m-0'>
                <Link className='brand-logo' to='/home'>
                    <img src={cvdLogo} className="mt-1" alt="login" style={{ width: "10%", paddingLeft: 50 }} />
                </Link>
                <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
                    <div className='w-100 d-lg-flex align-items-center justify-content-center px-5 bg-login'>
                        <img className='img-fluid' src={vectors} alt='Login Cover' width={"83%"} />
                    </div>
                </Col>
                <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
                    <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
                        <CardTitle tag='h4' className='mb-1'>
                            Update Your KYC Details
                        </CardTitle>
                        <ApolloConsumer>
                            {(client) => (
                                <Form className='auth-reset-password-form mt-2'>
                                    <div className='mb-1'>
                                        <Label className='form-label' htmlFor='aadharCard'>
                                            Aadhar Card
                                        </Label>
                                        <Controller
                                            name='aadharCard'
                                            control={control}
                                            render={({ field: { onChange, value, ...rest } }) => {
                                                return <>
                                                    <Input
                                                        type="file"
                                                        {...register("aadharCard", { required: true })}
                                                        accept=".png,.jpg,.jpeg"
                                                        invalid={errors?.aadharCard && true}
                                                        onChange={(e) => getBase64(e, onChange)}
                                                        {...rest}
                                                    />
                                                </>
                                            }}
                                        />
                                        {errors.aadharCard && <FormFeedback>Aadhar Card is required</FormFeedback>}
                                    </div>
                                    <div className='mb-1'>
                                        <Label className='form-label' htmlFor='panCard'>
                                            Pan Card
                                        </Label>
                                        <Controller
                                            name='panCard'
                                            control={control}
                                            render={({ field: { onChange, value, ...rest } }) => {
                                                return <>
                                                    <Input
                                                        type="file"
                                                        {...register("panCard", { required: true })}
                                                        accept=".png,.jpg,.jpeg"
                                                        invalid={errors?.panCard && true}
                                                        onChange={(e) => getBase64(e, onChange)}
                                                        {...rest}
                                                    />
                                                </>
                                            }}
                                        />
                                        {errors.panCard && <FormFeedback>Pan Card is required</FormFeedback>}
                                    </div>
                                    <div className='mb-1'>
                                        <Label className='form-label' htmlFor='incorporateCertificate'>
                                            Incorporate Certificate
                                        </Label>
                                        <Controller
                                            name='incorporateCertificate'
                                            control={control}
                                            render={({ field: { onChange, value, ...rest } }) => {
                                                return <>
                                                    <Input
                                                        type="file"
                                                        {...register("incorporateCertificate", { required: true })}
                                                        accept=".png,.jpg,.jpeg"
                                                        invalid={errors?.incorporateCertificate && true}
                                                        onChange={(e) => getBase64(e, onChange)}
                                                        {...rest}
                                                    />
                                                </>
                                            }}
                                        />
                                        {errors.panCard && <FormFeedback>Incorporate Certificate is required</FormFeedback>}
                                    </div>
                                    <Button color='primary' block type='submit' onClick={handleSubmit(onSubmit)}>
                                        Submit &nbsp; {loading && <Spinner color='light' size='sm' className='mr-2' />}
                                    </Button>
                                </Form>
                            )}
                        </ApolloConsumer>
                    </Col>
                </Col>
            </Row>
        </div>
    )
}

export default UpdateKYC
