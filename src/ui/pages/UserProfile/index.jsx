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
import deshboard from "../../../assets/images/icons/deshbord-icon.svg";
import BackArrow from '../../components/Back';
import { digitalOceanURL } from '../../common/common';
import Select from 'react-select'

const index = () => {
    const history = useHistory();
    const [getUserDetails, { loading, data }] = useLazyQuery(GET_ME);
    const [userResponse, setUserResponse] = useState({})
    const [companyName, _companyName] = useState("")
    const [gender, setGender] = useState("")
    const [profile, _profile] = useState("")
    const [oldProfile, setOldProfile] = useState('');
    const [country, setCountry] = useState()
    const [seller, setseller] = useState()
    const [doc1, _doc1] = useState("");
    const [doc2, _doc2] = useState("");
    const [doc3, _doc3] = useState("");

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
            _profile(`${digitalOceanURL}${data?.me?.profilePicture}`)
            setOldProfile(data?.me?.profilePicture)
            setseller({ label: data?.me?.seller, value: data?.me?.seller })
            setCountry({ label: data?.me?.country, value: data?.me?.country })
           
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
                country: country?.value,
                seller: seller?.value,
                gender: gender?.toUpperCase(),
                profilePicture: profile.includes('base64') ? profile : oldProfile,
                kycDocument1: doc1,
                kycDocument2: doc2,
                kycDocument3: doc3
            }

            updateSingleUser({ variables: { input } })
                .then(async (data) => {
                    if (data?.data?.updateUser?.id) {
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
        toast.success("Logout successfully");
    };

    const countryList = [
        "Afghanistan",
        "Åland Islands",
        "Albania",
        "Algeria",
        "American Samoa",
        "Andorra",
        "Angola",
        "Anguilla",
        "Antarctica",
        "Antigua and Barbuda",
        "Argentina",
        "Armenia",
        "Aruba",
        "Australia",
        "Austria",
        "Azerbaijan",
        "Bahamas (the)",
        "Bahrain",
        "Bangladesh",
        "Barbados",
        "Belarus",
        "Belgium",
        "Belize",
        "Benin",
        "Bermuda",
        "Bhutan",
        "Bolivia (Plurinational State of)",
        "Bonaire, Sint Eustatius and Saba",
        "Bosnia and Herzegovina",
        "Botswana",
        "Bouvet Island",
        "Brazil",
        "British Indian Ocean Territory (the)",
        "Brunei Darussalam",
        "Bulgaria",
        "Burkina Faso",
        "Burundi",
        "Cabo Verde",
        "Cambodia",
        "Cameroon",
        "Canada",
        "Cayman Islands (the)",
        "Central African Republic (the)",
        "Chad",
        "Chile",
        "China",
        "Christmas Island",
        "Cocos (Keeling) Islands (the)",
        "Colombia",
        "Comoros (the)",
        "Congo (the Democratic Republic of the)",
        "Congo (the)",
        "Cook Islands (the)",
        "Costa Rica",
        "Croatia",
        "Cuba",
        "Curaçao",
        "Cyprus",
        "Czechia",
        "Côte d'Ivoire",
        "Denmark",
        "Djibouti",
        "Dominica",
        "Dominican Republic (the)",
        "Ecuador",
        "Egypt",
        "El Salvador",
        "Equatorial Guinea",
        "Eritrea",
        "Estonia",
        "Eswatini",
        "Ethiopia",
        "Falkland Islands (the) [Malvinas]",
        "Faroe Islands (the)",
        "Fiji",
        "Finland",
        "France",
        "French Guiana",
        "French Polynesia",
        "French Southern Territories (the)",
        "Gabon",
        "Gambia (the)",
        "Georgia",
        "Germany",
        "Ghana",
        "Gibraltar",
        "Greece",
        "Greenland",
        "Grenada",
        "Guadeloupe",
        "Guam",
        "Guatemala",
        "Guernsey",
        "Guinea",
        "Guinea-Bissau",
        "Guyana",
        "Haiti",
        "Heard Island and McDonald Islands",
        "Holy See (the)",
        "Honduras",
        "Hong Kong",
        "Hungary",
        "Iceland",
        "India",
        "Indonesia",
        "Iran (Islamic Republic of)",
        "Iraq",
        "Ireland",
        "Isle of Man",
        "Israel",
        "Italy",
        "Jamaica",
        "Japan",
        "Jersey",
        "Jordan",
        "Kazakhstan",
        "Kenya",
        "Kiribati",
        "Korea (the Democratic People's Republic of)",
        "Korea (the Republic of)",
        "Kuwait",
        "Kyrgyzstan",
        "Lao People's Democratic Republic (the)",
        "Latvia",
        "Lebanon",
        "Lesotho",
        "Liberia",
        "Libya",
        "Liechtenstein",
        "Lithuania",
        "Luxembourg",
        "Macao",
        "Madagascar",
        "Malawi",
        "Malaysia",
        "Maldives",
        "Mali",
        "Malta",
        "Marshall Islands (the)",
        "Martinique",
        "Mauritania",
        "Mauritius",
        "Mayotte",
        "Mexico",
        "Micronesia (Federated States of)",
        "Moldova (the Republic of)",
        "Monaco",
        "Mongolia",
        "Montenegro",
        "Montserrat",
        "Morocco",
        "Mozambique",
        "Myanmar",
        "Namibia",
        "Nauru",
        "Nepal",
        "Netherlands (the)",
        "New Caledonia",
        "New Zealand",
        "Nicaragua",
        "Niger (the)",
        "Nigeria",
        "Niue",
        "Norfolk Island",
        "Northern Mariana Islands (the)",
        "Norway",
        "Oman",
        "Pakistan",
        "Palau",
        "Palestine, State of",
        "Panama",
        "Papua New Guinea",
        "Paraguay",
        "Peru",
        "Philippines (the)",
        "Pitcairn",
        "Poland",
        "Portugal",
        "Puerto Rico",
        "Qatar",
        "Republic of North Macedonia",
        "Romania",
        "Russian Federation (the)",
        "Rwanda",
        "Réunion",
        "Saint Barthélemy",
        "Saint Helena, Ascension and Tristan da Cunha",
        "Saint Kitts and Nevis",
        "Saint Lucia",
        "Saint Martin (French part)",
        "Saint Pierre and Miquelon",
        "Saint Vincent and the Grenadines",
        "Samoa",
        "San Marino",
        "Sao Tome and Principe",
        "Saudi Arabia",
        "Senegal",
        "Serbia",
        "Seychelles",
        "Sierra Leone",
        "Singapore",
        "Sint Maarten (Dutch part)",
        "Slovakia",
        "Slovenia",
        "Solomon Islands",
        "Somalia",
        "South Africa",
        "South Georgia and the South Sandwich Islands",
        "South Sudan",
        "Spain",
        "Sri Lanka",
        "Sudan (the)",
        "Suriname",
        "Svalbard and Jan Mayen",
        "Sweden",
        "Switzerland",
        "Syrian Arab Republic",
        "Taiwan (Province of China)",
        "Tajikistan",
        "Tanzania, United Republic of",
        "Thailand",
        "Timor-Leste",
        "Togo",
        "Tokelau",
        "Tonga",
        "Trinidad and Tobago",
        "Tunisia",
        "Turkey",
        "Turkmenistan",
        "Turks and Caicos Islands (the)",
        "Tuvalu",
        "Uganda",
        "Ukraine",
        "United Arab Emirates (the)",
        "United Kingdom of Great Britain and Northern Ireland (the)",
        "United States Minor Outlying Islands (the)",
        "United States of America (the)",
        "Uruguay",
        "Uzbekistan",
        "Vanuatu",
        "Venezuela (Bolivarian Republic of)",
        "Viet Nam",
        "Virgin Islands (British)",
        "Virgin Islands (U.S.)",
        "Wallis and Futuna",
        "Western Sahara",
        "Yemen",
        "Zambia",
        "Zimbabwe"
    ];

    const countryOption = countryList?.map((d) => {
        return { value: d, label: d }
    })

    const sellerOption = [
        {
            value: "WholeSeller",
            label: "WholeSeller"
        },
        {
            value: "Retailer",
            label: "Retailer"
        }
    ]

    return (
        <div className='home-page profile-bannerImg' >
            <div className="banner-img-wrap">
                <div className="banner-img">
                    < Header />
                    <div className='profilerText'>
                        {/* <img src={deshboard} alt='deshboard' /> */}
                        <BackArrow history={history} />
                        <p>Dashboard / <span className='outfit-bold'>My Profile</span></p>
                    </div>
                    <Form className='mt-2 pt-50' onSubmit={handleSubmit(updateUser)}>
                        <div className="container profile-container">
                            <div className="my-profile align-items-center text-center">
                                <h1 className='outfit-bold'>My Profile</h1>
                                <img src={profile ? profile?.includes('base64') ? profile : `${digitalOceanURL}${profile}` : `${digitalOceanURL}${MyProfile}`} />
                                <p><Button className='edit-link outfit-bold' tag={Label}>
                                    EDIT
                                    <Input type='file' hidden accept='image/*' onChange={e => getBase64(e)} />
                                </Button></p>

                            </div>
                            <div className='d-lg-flex'>
                                <div className='align-items-center mb-5 mb-md-3 accordion-input'>
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
                                    {/* <div className='my-2'>
                                        <Label className='form-label  input-label' htmlFor='emailInput'>Country </Label>
                                        <Select options={countryOption} value={country} onChange={(e) => setCountry(e)} />

                                    </div>
                                    <div className='my-2'>
                                        <Label className='form-label  input-label' htmlFor='emailInput'>Seller </Label>
                                        <Select options={sellerOption} onChange={(e) => setseller(e)} value={seller} />
                                    </div> */}
                                </div>

                                <div className='accordion-input my-4 my-md-2'>

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

                            <div className='save-btn-wrap align-items-center text-center my-3 d-flex align-items-center justify-content-end'>
                                <ApolloConsumer>
                                    {(client) => (
                                        <button className='forgot-link text-right cursor-pointer outfit-bold' onClick={() => {
                                            signOut(client);
                                        }}>Sign Out</button>
                                    )}
                                </ApolloConsumer>
                            </div>
                            <div className='justify-content-center d-flex'>
                                <Button className="common-button" type='submit'>SAVE CHANGES</Button>
                            </div>
                        </div>
                    </Form >
                </div >
            </div>
        </div>
    )
}

export default index
