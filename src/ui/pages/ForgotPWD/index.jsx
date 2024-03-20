import React, { useRef, useState, useEffect } from 'react'
import Header from '../Home/Header/Header'
import { Row, Col, Form, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback, Accordion, AccordionItem, AccordionHeader, AccordionBody } from 'reactstrap'
import { Controller, useForm } from 'react-hook-form'
import { BASE_URL } from '../../../config';
import { useMutation, useLazyQuery } from "react-apollo";
import { UPDATE_USER } from './mutation';
import { GET_ME } from '../../components/Session/queries';
import { toast } from 'react-toastify';
import { FormatError } from '../../../@core/components/common/FormatError';
import { useHistory } from "react-router-dom"
import MyProfile from '../../../assets/images/icons/profile.png'
import './UseProfile.scss'
import { ApolloConsumer } from 'react-apollo';
import { digitalOceanURL } from '../../common/common';

const index = () => {
    const history = useHistory();

    // const { loading, data, refetch } = useQuery(GET_ME, {
    //     // fetchPolicy: "network-only",
    // });

    const [getUserDetails, { loading, data }] = useLazyQuery(GET_ME);
    // const userdata = JSON?.parse(localStorage?.getItem('UserRes'));
    const [userResponse, setUserResponse] = useState({})
    const [companyName, _companyName] = useState("")
    const [gender, setGender] = useState("")
    const [profile, _profile] = useState("")
    const [male, setMale] = useState(false)
    const [female, setFemale] = useState(false)
    const [other, setOther] = useState(false)
    const [doc1, _doc1] = useState('');
    const [doc2, _doc2] = useState('');
    const [doc3, _doc3] = useState('');

    useEffect(() => {
        getMe()
    }, [])

    const [open, setOpen] = useState('0')

    const toggle = id => {
        open === id ? setOpen() : setOpen(id)
    }

    const getMe = () => {
        getUserDetails({
            fetchPolicy: "cache-and-network",
        })
    }
    useEffect(() => {
        if (data?.me) {
            setUserResponse(data?.me)
            _companyName(data?.me?.companyName)
            setGender(data?.me?.gender)
            _profile(data?.me?.profilePicture)
            setMale(userResponse?.gender && userResponse?.gender?.toUpperCase() === "MALE" ? true : false)
            setFemale(userResponse?.gender && userResponse?.gender?.toUpperCase() === "FEMALE" ? true : false)
            setOther(userResponse?.gender && userResponse?.gender?.toUpperCase() === "OTHER" ? true : false)
        }
    }, [data, userResponse])
    // ** Hooks
    const {
        control,
        reset,
        setError,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({});


    useEffect(() => {
        reset(userResponse);
    }, [userResponse])




    // Mutation
    const [updateSingleUser] = useMutation(UPDATE_USER);

    const DiscardItems = () => {
        reset(userdata);
        _companyName(userResponse?.companyName)
        setGender(userResponse?.gender)
        _profile(userResponse?.profilePicture)
    }

    const updateUser = (data) => {

        if (!Object.values(data).includes(undefined)) {
            const input = {
                fullName: data?.fullName,
                companyName: companyName,
                email: data?.email,
                mobile: data?.mobile,
                userName: data?.userName,
                gender: gender?.toUpperCase(),
                profilePicture: profile?.includes('base64') ? profile : '',
                kycDocument1: doc1,
                kycDocument2: doc2,
                kycDocument3: doc3
            }

            updateSingleUser({ variables: { input } })
                .then(async (data) => {
                    if (data?.data?.updateUser?.id) {
                        localStorage?.setItem('UserRes', JSON.stringify(data?.data?.updateUser))
                        getMe();
                        toast?.success('Your Details has been updated')
                    }
                })
                .catch((err) => {
                    return toast.warn(FormatError(err));
                });
        }
    }

    const getBase64 = (e, type) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.readAsDataURL(file)
        reader.onloadend = async () => {
            let result = await reader.result
            await _profile(result);
        }
    }
    const getBase64Kyc = (e, type) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.readAsDataURL(file)
        reader.onloadend = async () => {
            let result = await reader.result
            if (type === "doc1") await _doc1(result);
            if (type === "doc2") await _doc2(result);
            if (type === "doc3") await _doc3(result);
        }
    }

    const signOut = (client) => {
        localStorage.clear();
        client.cache.reset();
        history.push("/");
        client.clearStore();
        // dispatch(handleLogout());
        // CartData?.cartRefetch();
        // _allCartItems([]);
        toast.success("Logout successfully");
    };

    return (
        <div className='home-page' >
            < Header />
            <Form className='mt-2 pt-50' onSubmit={handleSubmit(updateUser)}>
                <div className="container">
                    <div className="my-profile align-items-center text-center">
                        <h1>My Profile</h1>
                        <img src={profile ? profile?.includes('base64') ? profile : `${digitalOceanURL}${profile}` : MyProfile} />
                        <p><Button className='edit-link' tag={Label}>
                            EDIT
                            <Input type='file' hidden accept='image/*' onChange={e => getBase64(e)} />
                        </Button></p>
                    </div>
                    <div className='d-lg-flex'>
                        <div className='align-items-center mb-5 accordion-input'>
                            <div className='my-2'>
                                <Label className='form-label  input-label' htmlFor='firstName'> Full Name </Label>
                                <Controller
                                    id='fullName'
                                    name='fullName'
                                    defaultValue=''
                                    {...register("fullName", { required: true })}
                                    control={control}
                                    render={({ field }) => (
                                        <Input type='text' className='profile-input-filed' {...field} placeholder='Full Name' invalid={errors.fullName && true} />
                                    )}
                                />
                                {errors?.fullName && <FormFeedback>Full Name is required</FormFeedback>}
                            </div>
                            <div className='my-2'>
                                <Label className='form-label  input-label' htmlFor='company'>User Name </Label>
                                <Controller
                                    id='userName'
                                    name='userName'
                                    defaultValue=''
                                    {...register("userName", { required: true })}
                                    control={control}
                                    render={({ field }) => (
                                        <Input type='text' {...field} className='profile-input-filed ' placeholder='User Name' invalid={errors.userName && true} />
                                    )}
                                />
                                {errors?.userName && <FormFeedback>User Name is required</FormFeedback>}
                            </div>
                            <div className='my-2'>
                                <Label className='form-label  input-label' htmlFor='company'> Mobile No </Label>
                                <Controller
                                    id='mobile'
                                    name='mobile'
                                    defaultValue=''
                                    {...register("mobile", { required: true, minLength: 10, maxLength: 10 })}
                                    control={control}
                                    render={({ field }) => (
                                        <Input type='text' {...field} className='profile-input-filed ' placeholder='Mobile No' invalid={errors.mobile && true} />

                                    )}
                                />
                                {(errors?.mobile?.type === "minLength" || errors?.mobile?.type === "maxLength") ? <FormFeedback>Enter Valid Phone No.</FormFeedback> : errors?.mobile && <FormFeedback>Mobile No is required</FormFeedback>}
                            </div>
                            <div className='my-2'>
                                <Label className='form-label  input-label' htmlFor='company'>Company Name </Label>
                                <Input value={companyName} id='company' className='profile-input-filed ' name='company' placeholder='Company Name' onChange={e => _companyName(e?.target?.value)} />
                            </div>
                            <div className='my-2'>
                                <Label className='form-label  input-label' htmlFor='emailInput'> E-mail </Label>
                                <Controller
                                    id='email'
                                    name='email'
                                    defaultValue=''
                                    {...register("email", { required: true, pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ })}
                                    control={control}
                                    render={({ field }) => (
                                        <Input type='email' className='profile-input-filed ' {...field} placeholder='Email' invalid={errors.email && true} />
                                    )}
                                />
                                {errors?.email?.type === "pattern" ? <FormFeedback>Enter Valid Email</FormFeedback> : errors?.email && <FormFeedback>Email is required</FormFeedback>}
                            </div>
                        </div>

                        <div className='accordion-input my-4'>

                            {
                                userResponse?.isKyc ?
                                    <div className='UserKycTitle text-center'> <h3> Your Kyc has been completed...! </h3> </div>
                                    :
                                    <>
                                        <Accordion open={open} toggle={toggle}>
                                            <AccordionItem>
                                                <AccordionHeader className='profile-input-filed py-0 mb-1' targetId='1'>Upload Your KYC Documents</AccordionHeader>
                                                <AccordionBody accordionId='1'>
                                                    <div className='mb-2 align-items-center'>
                                                        <Label className='form-label  input-label' htmlFor='aadharCard'>
                                                            Document 1
                                                        </Label>
                                                        <Input
                                                            className='profile-input-filed '
                                                            type="file"
                                                            accept=".png,.jpg,.jpeg"
                                                            onChange={(e) => getBase64Kyc(e, "doc1")}
                                                        />
                                                    </div>
                                                    <div className='mb-2 align-items-center'>
                                                        <Label className='form-label  input-label' htmlFor='panCard'>
                                                            Document 2
                                                        </Label>
                                                        <Input
                                                            className='profile-input-filed '
                                                            type="file"
                                                            accept=".png,.jpg,.jpeg"
                                                            onChange={(e) => getBase64Kyc(e, "doc2")}
                                                        />
                                                    </div>
                                                    <div className='mb-2 align-items-center'>
                                                        <Label className='form-label  input-label' htmlFor='incorporateCertificate'>
                                                            Document 3
                                                        </Label>
                                                        <Input
                                                            className='profile-input-filed '
                                                            type="file"
                                                            accept=".png,.jpg,.jpeg"
                                                            onChange={(e) => getBase64Kyc(e, "doc3")}
                                                        />
                                                    </div>
                                                </AccordionBody>
                                            </AccordionItem>
                                        </Accordion>
                                    </>
                            }
                        </div>
                    </div>

                    <div className='save-btn-wrap align-items-center text-center my-3 d-flex align-items-center justify-content-between'>
                        <Button className="common-button" type='submit'>SAVE CHANGES</Button>
                        <ApolloConsumer>
                            {(client) => (
                                <button className='forgot-link text-right cursor-pointer' onClick={() => {
                                    signOut(client);
                                }}>Sign Out</button>
                            )}
                        </ApolloConsumer>
                    </div>
                </div>
            </Form >
        </div >
    )
}

export default index
