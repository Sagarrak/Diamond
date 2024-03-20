import { useEffect, useState } from 'react';
import { useMutation } from 'react-apollo';
import { Controller, useForm } from 'react-hook-form';
import Select from 'react-select';
import "./makeToOrder.scss"
import CreatableSelect from 'react-select/creatable';
import { toast } from 'react-toastify';
import { Button, Col, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap';
import { FormatError } from '../../../../@core/components/common/FormatError';
import { MAKE_TO_ORDER } from '../mutation';
import Countries from '../country';
const MakeToOrderForm = ({ modal, setModal, colors, clarity, shapes }) => {
    const [shapeOptions, setShapeOptions] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [clarityOptions, setClarityOptions] = useState([]);
    const [isNewShape, setIsNewShape] = useState(false);
    const [image, setImage] = useState("");

    useEffect(() => {
        let shapeData = [];
        let colorData = [];
        let clarityData = [];

        shapes?.data?.map(d => { shapeData?.push({ label: d?.shapeName, value: d?.shapeName }) })
        clarity?.map(d => { clarityData?.push({ label: d, value: d }) })
        colors?.map(d => { colorData?.push({ label: d, value: d }) })

        setColorOptions(colorData);
        setShapeOptions(shapeData);
        setClarityOptions(clarityData);
    }, [colors, clarity, shapes])

    // ** Validation modules
    const {
        control,
        reset,
        setError,
        handleSubmit,
        register,
        formState: { errors },
    } = useForm({});



    const [makeToOrder] = useMutation(MAKE_TO_ORDER);

    const maktoToOrderFunc = (data) => {

        // shapeOptions        
        if (!Object.values(data).includes(undefined)) {

            const input = {
                shape: data?.shape?.value,
                clarity: data?.clarity?.value,
                color: data?.color?.value,
                companyName: data?.company,
                country: data?.country?.label,
                email: data?.email,
                image,
                firstName: data?.firstName,
                // lastName: data?.lastName,
                // measurement: data?.measurement,
                notes: data?.notes,
                phoneNo: data?.phoneNo,
                size: data?.size
            }

            makeToOrder({ variables: { input } })
                .then(async (data) => {
                    if (data?.data?.addMakeToOrder?.id) {
                        toast?.success('Your Request has been sent...!')
                        setModal(false);
                    }
                })
                .catch((err) => {
                    return toast.warn(FormatError(err));
                });
        }
    }

    const getBase64 = (e, onChange) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            let result = await reader.result;
            await setImage(result);
        };
    };
    const toggleHandler = () => setModal(!modal);
    return (
        <>
            <div>
                <Modal
                    isOpen={modal}
                    toggle={toggleHandler}
                    className={"modal-dialog-centered  general-modal-thankyou thank-you-modal"}>
                    <ModalHeader className='head-bold text-center outfit-bold ' toggle={toggleHandler} >MAKE TO ORDER</ModalHeader>
                    <p className='fw-semibold fs-5 text-center lh-sm'>unable to find the required size or shape in lab-grown diamonds! <br /> Dont't Worry we can do custom cutting for you</p>
                    <ModalBody className='text-center'>
                        <Form className="auth-login-form mt-2" onSubmit={handleSubmit(maktoToOrderFunc)}>
                            <Row>
                                <Col sm={12}>
                                    <div className='mb-1'>
                                        <Label className='text-start w-100 form-label  input-label' > Enter Custom Order Details </Label>
                                        <Controller
                                            id='notes'
                                            name='notes'
                                            defaultValue=''
                                            {...register("notes", { required: true })}
                                            control={control}
                                            render={({ field }) => (
                                                <Input type='textarea' className='profile-input-filed  height-textarea' invalid={errors.notes && true}  {...field} placeholder='Give us more information about the special order. Please Write here if you require any perticular size or shape in a particular millimetre(mm) nad how much quantity you need' />
                                            )}
                                        />
                                        {errors?.notes && <FormFeedback>Notes is required</FormFeedback>}
                                    </div>
                                </Col>
                            </Row>
                            <Row className='mb-2'>
                                <Col className='col-lg-7 col-12'>
                                    <div className='fs-5 text-start'>You can also upload a picture or graph file below so that We can better understand your requirements</div>
                                </Col>
                                <Col className='col-lg-5 col-12 mt-lg-0 mt-2'>
                                    <Controller
                                        id=''
                                        name=''
                                        defaultValue=''
                                        {...register("", { required: true })}
                                        control={control}
                                        render={({ field }) => (
                                        <Input type='file' className=' '  {...field} placeholder='Upload Image' />
                                        )}
                                    />
                                    {/* <p><Button className='btn px-5 btn-transperant text-border' tag={Label}>
                                        Upload Image
                                        <Input type='file' hidden accept='image/*'/>
                                    </Button></p> */}
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6} >
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='text-start'> Enter Your Name* </Label>
                                        <Controller
                                            id='firstName'
                                            name='firstName'
                                            defaultValue=''
                                            {...register("firstName", { required: true })}
                                            control={control}
                                            render={({ field }) => (
                                                <Input type='text' className='profile-input-filed text-border' {...field} placeholder='Name.' invalid={errors.firstName && true} />
                                            )}
                                        />
                                        {errors?.firstName && <FormFeedback>First Name is required</FormFeedback>}
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='text-start' > Enter Your Company Name* </Label>
                                        <Controller
                                            id='company'
                                            name='company'
                                            defaultValue=''
                                            {...register("company", { required: true })}
                                            control={control}
                                            render={({ field }) => (
                                                <Input type='text' className='profile-input-filed text-border' {...field} placeholder='company..' invalid={errors.company && true} />
                                            )}
                                        />
                                        {errors?.company && <FormFeedback>company is required</FormFeedback>}
                                    </div>
                                </Col>


                            </Row>
                            <Row>
                                <Col lg={6}>
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='text-start w-100  form-label  input-label' > Enter Your Email* </Label>
                                        <Controller
                                            id='email'
                                            name='email'
                                            defaultValue=''
                                            {...register("email", { required: true })}
                                            rules={{
                                                required: 'Email is required',
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                                    message: 'Invalid email address',
                                                },
                                            }}
                                            control={control}
                                            render={({ field }) => (
                                                <Input type='email' className='profile-input-filed text-border' {...field} placeholder='Email.' invalid={errors.email && true} />
                                            )}
                                        />
                                        {/* {errors?.email && <FormFeedback>Email is required</FormFeedback>} */}
                                        {errors?.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='text-start  form-label  input-label'> Enter Your Mobile NO* </Label>
                                        <Controller
                                            id='phoneNo'
                                            name='phoneNo'
                                            defaultValue=''
                                            {...register("phoneNo", { required: true })}
                                            control={control}
                                            rules={{
                                                required: 'PhoneNo is required.',
                                                minLength: {
                                                    value: 10,
                                                    message: 'Mobile number must be 10 characters.',
                                                },
                                                maxLength: {
                                                    value: 10,
                                                    message: 'Mobile number must be 10 characters.',
                                                },

                                            }}
                                            render={({ field }) => (
                                                <Input type='number' className='profile-input-filed text-border' {...field} placeholder='Mobile No..' invalid={errors.phoneNo && true} />
                                            )}
                                        />
                                        {errors?.phoneNo && <FormFeedback>{errors.phoneNo.message}</FormFeedback>}
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6}>
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='form-label  input-label text-start' > Select Shape </Label>
                                        <Controller
                                            id='shape'
                                            name='shape'
                                            defaultValue=''
                                            {...register("shape", { required: true })}
                                            control={control}
                                            render={({ field: { onChange, ...rest } }) => (
                                                <CreatableSelect
                                                    {...rest}
                                                    onChange={(e) => {
                                                        onChange(e);
                                                        setIsNewShape(shapeOptions?.filter(d => d?.value === e.value)?.length == 0)
                                                    }}
                                                    className="basic-single text-border rounded"
                                                    classNamePrefix="select"
                                                    placeholder="Select Shape"
                                                    invalid={errors.shape && true}
                                                    isLoading={false}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    options={shapeOptions}
                                                />
                                            )}
                                        />
                                        {errors?.shape && <FormFeedback>shape is required</FormFeedback>}
                                    </div>
                                </Col>
                                {
                                    isNewShape &&
                                    <Row>
                                        <Col>
                                            <div className="mb-1 d-flex flex-column">
                                                <Label className='form-label  input-label' > Looks Like You Have New Shape Please Enter New Shape Image </Label>
                                                <Input type='file' className='profile-input-filed text-border' onChange={e => getBase64(e)} />
                                            </div>
                                        </Col>
                                    </Row>
                                }

                                <Col lg={6}>
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='form-label  input-label text-start' > Select Color </Label>
                                        <Controller
                                            id='color'
                                            name='color'
                                            defaultValue=''
                                            {...register("color", { required: true })}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    className="basic-single text-border rounded"
                                                    classNamePrefix="select"
                                                    invalid={errors.color && true}
                                                    placeholder="Select Color"
                                                    isLoading={false}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    options={colorOptions}
                                                />
                                            )}
                                        />
                                        {errors?.color && <FormFeedback>Color is required</FormFeedback>}
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6}>
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='form-label  input-label text-start'> Select Size  </Label>
                                        <Controller
                                            id='size'
                                            name='size'
                                            defaultValue=''
                                            {...register("size", { required: true })}
                                            control={control}
                                            rules={{
                                                required: 'Carats are required',
                                                pattern: {
                                                    value: /^\d+\.?\d*$/, // Regular expression to allow positive decimal numbers
                                                    message: 'Carats must be a positive number',
                                                },
                                                validate: (value) => parseFloat(value) > 0 || 'Carats cannot be Zero',
                                            }}
                                            render={({ field }) => (
                                                <Input type='number' className='profile-input-filed text-border' {...field} placeholder='Enter Carats of diamond' invalid={errors.size && true} />
                                            )}
                                        />
                                        {/* {errors?.size && <FormFeedback>Carats is required</FormFeedback>} */}
                                        {errors?.size && <FormFeedback>{errors.size.message}</FormFeedback>}
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='form-label  input-label text-start' > Select Clarity </Label>
                                        <Controller
                                            id='clarity'
                                            name='clarity'
                                            defaultValue=''
                                            {...register("clarity", { required: true })}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    className="basic-single text-border rounded"
                                                    classNamePrefix="select"
                                                    invalid={errors.clarity && true}
                                                    placeholder="Select Clarity"
                                                    isLoading={false}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    options={clarityOptions}
                                                />
                                            )}
                                        />
                                        {errors?.clarity && <FormFeedback>clarity is required</FormFeedback>}
                                    </div>
                                </Col>
                            </Row>
                            {/* <Row>
                                <Col>
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='form-label  input-label' > With Clarity </Label>
                                        <Controller
                                            id='clarity'
                                            name='clarity'
                                            defaultValue=''
                                            {...register("clarity", { required: true })}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                    invalid={errors.clarity && true}
                                                    placeholder="Select Clarity"
                                                    isLoading={false}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    options={clarityOptions}
                                                />
                                            )}
                                        />
                                        {errors?.clarity && <FormFeedback>clarity is required</FormFeedback>}
                                    </div>
                                </Col>
                            </Row> */}
                            {/* <Row>
                                <Col>
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='form-label  input-label'> Measurement </Label>
                                        <Controller
                                            id='measurement'
                                            name='measurement'
                                            defaultValue=''
                                            {...register("measurement", { required: false })}
                                            control={control}
                                            render={({ field }) => (
                                                <Input type='text' className='profile-input-filed text-border' {...field} placeholder='Enter Carats of diamond' invalid={errors.measurement && true} />
                                            )}
                                        />
                                        {errors?.measurement && <FormFeedback>Carats is required</FormFeedback>}
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='form-label  input-label' > First Name </Label>
                                        <Controller
                                            id='firstName'
                                            name='firstName'
                                            defaultValue=''
                                            {...register("firstName", { required: true })}
                                            control={control}
                                            render={({ field }) => (
                                                <Input type='text' className='profile-input-filed text-border' {...field} placeholder='First Name' invalid={errors.firstName && true} />
                                            )}
                                        />
                                        {errors?.firstName && <FormFeedback>First Name is required</FormFeedback>}
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='form-label  input-label' > Last Name </Label>
                                        <Controller
                                            id='lastName'
                                            name='lastName'
                                            defaultValue=''
                                            {...register("lastName", { required: true })}
                                            control={control}
                                            render={({ field }) => (
                                                <Input type='text' className='profile-input-filed text-border' {...field} placeholder='First Name' invalid={errors.lastName && true} />
                                            )}
                                        />
                                        {errors?.lastName && <FormFeedback>Last Name is required</FormFeedback>}
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='form-label  input-label' > Email </Label>
                                        <Controller
                                            id='email'
                                            name='email'
                                            defaultValue=''
                                            {...register("email", { required: true })}
                                            control={control}
                                            render={({ field }) => (
                                                <Input type='email' className='profile-input-filed text-border' {...field} placeholder='Email.' invalid={errors.email && true} />
                                            )}
                                        />
                                        {errors?.email && <FormFeedback>Email is required</FormFeedback>}
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='form-label  input-label' > PhoneNo </Label>
                                        <Controller
                                            id='phoneNo'
                                            name='phoneNo'
                                            defaultValue=''
                                            {...register("phoneNo", { required: true })}
                                            control={control}
                                            render={({ field }) => (
                                                <Input type='number' className='profile-input-filed text-border' {...field} placeholder='PhoneNo..' invalid={errors.phoneNo && true} />
                                            )}
                                        />
                                        {errors?.phoneNo && <FormFeedback>PhoneNo is required</FormFeedback>}
                                    </div>
                                </Col>
                                <Col>
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='form-label  input-label' > Company </Label>
                                        <Controller
                                            id='company'
                                            name='company'
                                            defaultValue=''
                                            {...register("company", { required: true })}
                                            control={control}
                                            render={({ field }) => (
                                                <Input type='text' className='profile-input-filed text-border' {...field} placeholder='company..' invalid={errors.company && true} />
                                            )}
                                        />
                                        {errors?.company && <FormFeedback>company is required</FormFeedback>}
                                    </div>
                                </Col>
                            </Row> */}
                            <Row>
                                <Col>
                                    <div className="mb-1 d-flex flex-column">
                                        <Label className='form-label  input-label text-start ' >Select Country </Label>
                                        <Controller
                                            id='country'
                                            name='country'
                                            defaultValue=''
                                            {...register("country", { required: true })}
                                            control={control}
                                            render={({ field }) => (
                                                <Select
                                                    {...field}
                                                    className="basic-single text-border rounded"
                                                    classNamePrefix="select"
                                                    invalid={errors.country && true}
                                                    // defaultValue={options[0]}
                                                    isLoading={false}
                                                    isClearable={true}
                                                    isSearchable={true}
                                                    options={Countries}
                                                />
                                            )}
                                        />
                                        {errors?.country && <FormFeedback>country is required</FormFeedback>}
                                    </div>
                                </Col>
                                {/* <Col> */}
                                    {/* <div className="mb-1 d-flex flex-column">
                                        <Label className='form-label  input-label text-start' > Notes </Label>
                                        <Controller
                                            id='notes'
                                            name='notes'
                                            defaultValue=''
                                            {...register("notes", { required: true })}
                                            control={control}
                                            render={({ field }) => (
                                                <Input type='textarea' className='profile-input-filed text-border text-border ' {...field} placeholder='notes.' invalid={errors.notes && true} />
                                            )}
                                        />
                                        {errors?.notes && <FormFeedback>Notes is required</FormFeedback>}
                                    </div> */}
                                {/* </Col> */}
                            </Row>
                            <Row>
                                <Col>
                                    <Button type='submit' className='btn px-5 btn-transperant text-border ' style={{ fontSize: "15px", fontWeight: 700 }}>SUBMIT</Button>
                                </Col>
                                <Col>
                                    <Button type='button' color='primary' className='px-3 mt-md-0 mt-2' style={{ fontSize: "15px", fontWeight: 700 }}>SCHEDULE A CALL</Button>

                                </Col>
                            </Row>

                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        </>
    )
}

export default MakeToOrderForm