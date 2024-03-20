import React, { useState } from 'react'
import Header from '../Home/Header/Header'
import { Row, Col, CardTitle, CardText, Button, Form, Label, Input, FormFeedback, Spinner } from 'reactstrap'
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ADD_CONTACT_US } from "../Home/mutation";
import { useMutation } from '@apollo/react-hooks';
import { toast } from 'react-toastify'
import BackArrow from '../../components/Back';
import { useHistory } from "react-router-dom"


const Inquiry = () => {
    const [fname, _fname] = useState("");
    const [lname, _lname] = useState("");
    const [subject, _subject] = useState("");
    const [company, _company] = useState("");
    const [phone, _phone] = useState("");
    const history = useHistory("");


    // ** Validation modules
    const contactUsSchema = yup.object().shape({
        email: yup.string().email().required(),
        message: yup.string().required(),
    })
    // ** Hooks
    const {
        reset,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({ mode: 'onChange', resolver: yupResolver(contactUsSchema) })


    const [addContactUs] = useMutation(ADD_CONTACT_US);
    const onSubmit = data => {
        const userData = {
            fullName: fname,
            email: data?.email,
            companyName: company,
            mobile: phone,
            subject: subject,
            message: data?.message
        }
        if (Object.values(data).every(field => field.length > 0)) {
            addContactUs({ variables: { input: userData } }).then((response) => {
                if (response?.data?.addContactUs?.id) {
                    handleReset();
                    toast.success("Your message has been sent successfully.")
                }
            }).catch(err => {
                toast.error(FormatError(err))
            })
        }
    }

    const handleReset = () => {
        _fname('')
        _phone('')
        _company('')
        _subject('')
        reset({
            email: '',
            message: '',
        })
    }
    return (
        <div className='home-page'>
            <Header />
            <div className="container">
                <div className="d-flex align-items-center mb-2">
                    <BackArrow history={history} />
                    <h3 className="product-desc-title m-0">Back</h3>
                </div>
            </div>
            <section id='contact' className='contact-us'>
                <div className='container'>
                    <div className='contact-detail'>
                        <div className='row justify-content-center'>
                            <div className='col-lg-7 mt-lg-0 mt-3'>
                                <h2 className='my-3 text-center'> Send Requirement </h2>
                                <div className='contact-form'>
                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        <div className='row' style={{ marginTop: 4 }}>
                                            <div className='col-lg-6 input-box mt-0'>
                                                <Input type='text' placeholder='Enter Full Name' onChange={e => _fname(e?.target?.value)} value={fname} />
                                            </div>
                                            <div className='col-lg-6 input-box mt-lg-0 mt-3'>
                                                <Input type='text' placeholder='Enter Company Name' onChange={e => _company(e?.target?.value)} value={company} />
                                            </div>
                                        </div>
                                        <div className='input-box' >
                                            <Input type='number' placeholder='Enter your Mobile No' onChange={e => _phone(e?.target?.value)} value
                                                ={phone} />
                                        </div>
                                        <div className='input-box'>
                                            <Controller
                                                id='email'
                                                name='email'
                                                defaultValue=''
                                                control={control}
                                                render={({ field }) => (
                                                    <Input {...field} type='email' placeholder='Enter your Email' invalid={errors.email && true} />
                                                )}
                                            />
                                            {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                                        </div>
                                        <div className='input-box'>
                                            <Input type='number' placeholder='Your Number' onChange={e => _subject(e?.target?.value)} value={subject} />
                                            {/* <Input type='text' placeholder='Your Subject' invalid={errors.subject && true} onChange={e => _subject(e?.target?.value)} /> */}
                                        </div>
                                        <div className='input-box'>
                                            <Controller
                                                id='message'
                                                name='message'
                                                defaultValue=''
                                                control={control}
                                                render={({ field }) => (
                                                    <Input type='textarea' {...field} style={{ height: 156 }} placeholder='Your Message here' invalid={errors.message && true} />
                                                )}
                                            />
                                            {errors.message && <FormFeedback>{errors.message.message}</FormFeedback>}
                                        </div>
                                        <button className='send-msg' type='submit'>Send Message</button>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Inquiry;