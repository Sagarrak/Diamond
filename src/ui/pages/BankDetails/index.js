import React, { useState, useEffect, Fragment } from 'react';
import { Card, CardBody, Button, Form, Label, Spinner, Input, FormFeedback, Row, Col } from 'reactstrap';
import { useMutation, useQuery } from "react-apollo";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { toast } from 'react-toastify';

import '@styles/react/libs/editor/editor.scss';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { BANK_DETAILS } from './Query';
import { UPDATE_BANK_DETAILS } from './mutation';
import { Controller, useForm } from 'react-hook-form';
import { FormatError } from '../../../@core/components/common/FormatError';

// components




function index() {
    const [bankData, setbankData] = useState("")
    // console.log("🚀 ~ file: index.js:24 ~ index ~ bankData:", bankData)
    const [Loader, setLoader] = useState("")

    // query
    const { loading, data, refetch } = useQuery(BANK_DETAILS, {
        variables: {
            page: 1,
            limit: 1000,
        },
        fetchPolicy: "cache-and-network"
    });

    const {
        control,
        reset,
        setError,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({});


    useEffect(() => {
        if (data?.getAllBankDetails) {
            setbankData(data?.getAllBankDetails?.data[0])
        }
    }, [data])

    useEffect(() => {
        if (bankData) {
            reset({ ...bankData })
        }
    }, [data])

    // mutation
    const [updateTopBar] = useMutation(UPDATE_BANK_DETAILS);


    const updateUser = (data) => {
        let input = {
            id: bankData?.id || null,
            bankName: data?.bankName,
            accountNumber: data?.accountNumber,
            IFSCCode: data?.IFSCCode,
        };

        setLoader(true);
        updateTopBar({ variables: { input } })
            .then(({ data }) => {
                if (data?.updatebankDetails) {
                    refetch();
                    setLoader(false);
                    toast.success("Bank Details updated successfully");
                } else {
                    setLoader(false);
                    toast.warn(data?.updatebankDetails?.message);
                }
            })
            .catch((error) => {
                toast.warn(FormatError(error));
                setLoader(false);
            });
    }
    return (
        <>
            <Form className='mt-2 pt-50' onSubmit={handleSubmit(updateUser)}>
                <div className="container profile-container">

                    <div className='d-flex justify-content-center'>
                        <div className='align-items-center mb-5 mb-md-3 accordion-input'>
                            <div className='my-2 ml-1 d'>
                                <Row sm={12}>
                                    <Col sm={6} className="p-0">
                                        <Label className='form-label  input-label' htmlFor='firstName'> Bank Name </Label>
                                        <Controller
                                            id='bankName'
                                            name='bankName'
                                            defaultValue=''
                                            {...register("bankName", { required: true })}
                                            control={control}
                                            render={({ field }) => (
                                                <Input type='text' style={{width:"90%"}} className='profile-input-filed' {...field} placeholder='Bank Name' invalid={errors.bankName && true} />
                                            )}
                                        />
                                        {errors?.bankName && <FormFeedback>Full Name is required</FormFeedback>}

                                    </Col>
                                    <Col sm={6} className="p-0">
                                        <Label className='form-label  input-label' htmlFor='firstName'>IFSC Code </Label>
                                        <Controller
                                            id='IFSCCode'
                                            name='IFSCCode'
                                            defaultValue=''
                                            {...register("IFSCCode", { required: true })}
                                            control={control}
                                            render={({ field }) => (
                                                <Input type='text' style={{width:"90%"}} className='profile-input-filed' {...field} placeholder='IFSC Code' invalid={errors.IFSCCode && true} />
                                            )}
                                        />
                                        {errors?.IFSCCode && <FormFeedback>IFSC Code is required</FormFeedback>}

                                    </Col>
                                </Row>
                                <Row className='mt-1 '>
                                    <Label className='form-label  input-label' htmlFor='firstName'>Account Number </Label>
                                    <Controller
                                        id='accountNumber'
                                        name='accountNumber'
                                        defaultValue=''
                                        {...register("accountNumber", { required: true })}
                                        control={control}
                                        render={({ field }) => (
                                            <Input type='text' className='profile-input-filed' {...field} placeholder='Account Number' invalid={errors.accountNumber && true} />
                                        )}
                                    />
                                    {errors?.accountNumber && <FormFeedback>Account Number  is required</FormFeedback>}


                                </Row>
                            </div>
                        </div>

                    </div>


                    <div className='justify-content-center d-flex'>
                        <Button className="common-button" type='submit'>UPDATE BANK DETAILS</Button>
                    </div>
                </div>
            </Form >
        </>
    )
}

export default index