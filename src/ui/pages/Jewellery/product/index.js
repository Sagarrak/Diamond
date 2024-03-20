import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Card, CardBody, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from 'reactstrap';
import ComponentSpinner from '../../../../@core/components/spinner/Loading-spinner';
import Header from '../../../components/Header'
import CommanModal from '../../../components/Modal'
import Select from '../../../components/Select'
import { digitalOceanURL } from '../../../common/common'
import { useMutation, useQuery } from 'react-apollo';
import { ADD_PRODUCT_JEWELLERY, UPDATE_PRODUCT_JEWELLERY, DELETE_PRODUCT_JEWELLERY } from './mutation'
import { GET_ALL_JEWELLERY_PRODUCT, GET_ALL_STYLE_BY_CATEGORY } from './query'
import { jewelleryProductColumn } from '../../../components/Constant'
import Table from '../../../components/Table'
import { toast } from 'react-toastify';
import { ConfirmationModal } from '../../../components/Alert';
import { FormatError } from '../../../../@core/components/common/FormatError';
import MetalDropDown from '../../../components/MetalDropDown/MetalDropDown';
import { MinusCircle, PlusCircle } from 'react-feather';
import { JEWELLERY_CATEGORIES } from '../admin/query';
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner';

function index() {
    const [loader, setLoader] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sort, setSort] = useState({ key: "createdAt", type: -1 });
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [modal, setModal] = useState(false);
    const [allJewelleryProductData, setallJewelleryProductData] = useState("");
    const [Index, setIndex] = useState(false);
    const [diamoundDetails, setdiamoundDetails] = useState(false);
    const [metal, setMetal] = useState();
    const [productImages, setProductImages] = useState([]);
    const [categoryOption, setCategoryOptions] = useState([])
    const [category, setcategory] = useState('')
    const [categoryStyleOption, setcategoryStyleOption] = useState([])
    const [styleId, setStyleId] = useState('')
    const [rhodium, setRhodium] = useState(false)
    const [categoryLoader, setCategoryLoader] = useState(false)


    //mutation
    const [addJewelleryProductData] = useMutation(ADD_PRODUCT_JEWELLERY)
    const [updateJewelleryProducData] = useMutation(UPDATE_PRODUCT_JEWELLERY)
    const [deleteJewelleryProductData] = useMutation(DELETE_PRODUCT_JEWELLERY)

    //query
    const { data, loading, refetch } = useQuery(GET_ALL_JEWELLERY_PRODUCT, {
        variables: {
            page: currentPage + 1,
            limit: limit,
            sort: sort,
            filter: "{}",
            search: searchText,
        },
        fetchPolicy: "cache-and-network",
    })

    const { data: styleData, loading: styleloading, refetch: stylerefetch } = useQuery(GET_ALL_STYLE_BY_CATEGORY, {
        variables: {
            getAllStyleByCategoryId: category?.value,
        },
        fetchPolicy: "cache-and-network",
    })

    const { data: categoryies, loading: categoriesLoading, refetch: categoryRefetch } = useQuery(JEWELLERY_CATEGORIES, {
        fetchPolicy: "cache-and-network"
    })
    const {
        control,
        reset,
        setError,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        if (categoryies?.jewelryCategoriesWithoutPaginations) {
            const data = categoryies?.jewelryCategoriesWithoutPaginations?.map((d) => {
                return {
                    value: d?.id,
                    label: d?.name
                }
            })
            setCategoryOptions(data)
        }
    }, [categoryies])

    useEffect(() => {
        if (data?.getAllJewelryProducts) {
            setallJewelleryProductData(data?.getAllJewelryProducts)
        }

    }, [data])

    useEffect(() => {
        if (styleData?.getAllStyleByCategory) {
            const data = styleData?.getAllStyleByCategory?.map((d) => {
                return {
                    value: d?.id,
                    label: d?.styleName
                }
            })
            setcategoryStyleOption(data)
        }

    }, [styleData, category])
    if (!jewelleryProductColumn?.find((d) => d?.name === "Active")) {
        jewelleryProductColumn.push({
            name: "Active",
            sortable: true,
            minWidth: "150px",
            sortField: "isActive",
            cell: (row) => (
                <div className="form-check form-switch">
                    <Input
                        className="custom-control-success"
                        type="switch"
                        id={row?.id}
                        name={row?.id}
                        style={{ zIndex: 0 }}
                        checked={row?.isActive}
                        onChange={(e) => {
                            e.preventDefault();
                            updateJewelleryProducData({
                                variables: {
                                    input: {
                                        id: row?.id,
                                        isActive: e.target.checked,
                                    },
                                },
                            })
                                .then((response) => {
                                    if (response?.data?.updateJewellerProduct) {
                                        refetch();
                                        toast.success("Status updated successfully");
                                    } else {
                                        toast.error("Status not updated");
                                    }
                                })
                                .catch((error) => {
                                    toast.error(FormatError(error));
                                });
                        }}
                    />
                </div>
            ),
        });
    }

    const handleSort = (e) => {
        setLoader(true);
        const type = sort.type == -1 ? 1 : -1;
        setSort({ key: e?.sortField, type });
    };

    const editJewelleryProductData = (data) => {
        setcategory({ value: data?.categoryId?.id })
        setStyleId(data?.styleId?.styleName)
        data?.diamondCarat ? setdiamoundDetails(true) : setdiamoundDetails(false)
        const images = data?.productImages?.map((d) => d)
        setProductImages(images)
        setMetal(data?.metalName)
        setRhodium(data?.isRhodium)
        setModal(true)
        reset(data)
    }
    const EditSubmitHandler = (data) => {
        if (!Object.values(data)?.includes(undefined)) {
            const input = {
                id: data?.id,
                productName: data?.productName,
                quantity:data?.quantity,
                price:data?.price,
                backing:data?.backing,
                categoryId: category?.value,
                description: data?.description,
                width: data?.width,
                length: data?.length,
                isRhodium: rhodium,
                metalName: metal,
                productImages: productImages,
                styleId: styleId?.value,
                diamondCarat: diamoundDetails ? data?.diamondCarat : null,
                diamondClarity: diamoundDetails ? data?.diamondClarity : null,
                diamondColor: diamoundDetails ? data?.diamondColor : null,
                diamondShape: diamoundDetails ? data?.diamondShape : null

            }
            setLoader(true)
            updateJewelleryProducData({ variables: { input } }).then((response) => {
                if (response?.data?.updateJewelryProduct?.id) {
                    toast.success("Jewellery product updated successfully.")
                    refetch()
                    resetData()
                    setLoader(false)
                    setModal(false)
                    // handleReset()
                } else {
                    setLoader(false)
                    setModal(false)
                    resetData()
                    
                    // handleReset()
                    toast.success("Jewellery product not updated")
                }
            }).catch((err) => {
                toast.error(FormatError(err))
                // handleReset()
                setModal(false)
                setLoader(false)
            });
        }

    }
    const addJewelleryProduct = () => {
        setIndex(true)
        setModal(true);
        reset({});
    }
    const AddSubmitHandler = (data) => {
        addJewelleryProductData({
            variables: {
                input: {
                    productName: data?.productName,
                    quantity:data?.quantity,
                    price:data?.price,
                    backing:data?.backing,
                    categoryId: category?.value,
                    description: data?.description,
                    width: data?.width,
                    length: data?.length,
                    isRhodium: rhodium,
                    metalName: metal,
                    productImages: productImages,
                    styleId: styleId?.value,
                    diamondCarat: data?.diamondCarat,
                    diamondClarity: data?.diamondClarity,
                    diamondColor: data?.diamondColor,
                    diamondShape: data?.diamondShape

                },
            },
        })
            .then(({ data }) => {
                if (data?.createJewelryProduct?.id) {
                    refetch();
                    resetData();
                    setLoader(false);
                    toast.success("Jewellery product  added successfully");
                    setIndex(false)
                    setModal(false);
                    reset({});
                } else {
                    setModal(false);
                    setLoader(false);
                    toast.warn("Jewellery product not added");
                    reset({});
                    resetData();
                }
            })
            .catch((error) => {
                // toast.warn(FormatError(error));
                setLoader(false);
            });
        // }
    }
    const toggleHandler = () => {
        setModal(!modal);
        resetData();
        reset({});
    }
    const deleteJewelleryProduct = async (productId) => {
        let Status = await ConfirmationModal(
            "warning",
            "Are you sure?",
            "You won't be able to revert this!",
            "Yes, delete it!"
        );
        if (Status) {
            setLoader(true);
            deleteJewelleryProductData({
                variables: {
                    deleteJewelryProductId: productId,
                },
            })
                .then(async ({ data }) => {
                    if (data?.deleteJewelryProduct) {
                        refetch();
                        setLoader(false);
                        await ConfirmationModal("success", "Deleted!", "Jewellery product has been deleted.", "");
                    } else {
                        toast.error("Jewellery product not deleted");
                        setLoader(false);
                    }
                })
                .catch((error) => {
                    // toast.error(FormatError(error));
                    setLoader(false);
                });
        }


    }
    const handlePagination = (page) => {
        setLoader(true);
        setCurrentPage(page?.selected);
    };
    const resetData = () => {
        setProductImages([])
        setMetal("")
        setRhodium(false)
        

    }
    const getBase64 = async (e, onChange, i) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            let result = await reader.result;
            const values = [...productImages];
            values[i] = result;
            await setProductImages(values);
            await onChange(result);
        };

    };

    const handleAdd = () => {
        const values = [...productImages];
        values.push(null);
        setProductImages(values);

    }
    const handleRemove = (i) => {
        const values = [...productImages];
        values.splice(i, 1);
        setProductImages(values);
    }


    return (
        <Fragment>
            <Card className="w-100 h-100">
                {loader && <ComponentSpinner />}
                <CardBody style={{ flex: "unset", height: "inherit" }}>
                    <Header
                        limit={limit}
                        title={"Jewellery Product"}
                        setLimit={setLimit}
                        setSearchText={setSearchText}
                        setCurrentPage={setCurrentPage}
                        addData={() => addJewelleryProduct()}

                    />
                    <Table
                        columns={jewelleryProductColumn}
                        data={allJewelleryProductData?.data || []}
                        currentPage={currentPage}
                        totalRecords={allJewelleryProductData?.count || 0}
                        limit={limit}
                        deleteData={deleteJewelleryProduct}
                        editData={editJewelleryProductData}
                        onSort={handleSort}
                        handlePagination={handlePagination}
                        modal={modal}
                        setModal={setModal}
                    />
                </CardBody>
                <CommanModal
                    modal={modal}
                    setModal={setModal}
                    updateButtonHandler={handleSubmit(EditSubmitHandler)}
                    addButtonHandler={handleSubmit(AddSubmitHandler)}
                    toggleHandler={toggleHandler}
                    loading={loader}
                    updateId={control._defaultValues?.id ? true : false}
                    modalTitle={control._defaultValues?.id ? "Update " : "Add "}
                >
                    <Form className='auth-login-form mt-2'>
                        <div className='mb-1'>
                            <Label className='form-label' htmlFor='productName'>
                                Product Name <span className='text-danger'>&#42;</span>
                            </Label>
                            <Controller
                                id='productName'
                                name='productName'
                                defaultValue=''
                                {...register("productName", {
                                    required: true,
                                })}
                                control={control}
                                render={({ field }) => (
                                    <Input type='text' placeholder='Enter style productName' invalid={errors.productName && true} {...field} />
                                )}
                            />
                            {errors && errors?.productName && (
                                <FormFeedback>Please enter a valid product name </FormFeedback>
                            )}
                        </div>
                        <div className='mb-1'>
                            <Label className='form-label' htmlFor='fullName'>
                                Quantity
                            </Label>
                            <Controller
                                id='quantity'
                                name='quantity'
                                defaultValue=''
                                {...register("quantity", {
                                    min: 0,
                                    // required: true,
                                })}
                                control={control}
                                render={({ field }) => (
                                    <Input type='number' placeholder='Enter quantity' invalid={errors.quantity && true} {...field} />
                                )}
                            />
                            {errors && errors?.quantity && (
                                <FormFeedback>Please enter a valid quantity </FormFeedback>
                            )}
                        </div>
                        <div className='mb-1'>
                            <Label className='form-label' htmlFor='fullName'>
                                Price
                            </Label>
                            <Controller
                                id='price'
                                name='price'
                                defaultValue=''
                                {...register("price", {
                                   
                                    // required: true,
                                })}
                                control={control}
                                render={({ field }) => (
                                    <Input type='number' placeholder='Enter price' invalid={errors.price && true} {...field} />
                                )}
                            />
                            {errors && errors?.price && (
                                <FormFeedback>Please enter a valid price </FormFeedback>
                            )}
                        </div>
                        <div className='mb-1'>
                            <Label className='form-label' htmlFor='backing'>
                               Backing 
                            </Label>
                            <Controller
                                id='backing'
                                name='backing'
                                defaultValue=''
                                {...register("backing", {
                                    required: true,
                                })}
                                control={control}
                                render={({ field }) => (
                                    <Input type='text' placeholder='Enter style backing' invalid={errors.backing && true} {...field} />
                                )}
                            />
                            {errors && errors?.backing && (
                                <FormFeedback>Please enter a valid backing </FormFeedback>
                            )}
                        </div>
                        <div className='mb-1'>
                            <Label className='form-label' htmlFor='email'>
                                Category<span className='text-danger'>&#42;</span>
                            </Label>
                            <Controller
                                name='categoryId'
                                control={control}
                                render={({ field: { onChange, value } }) => {
                                    return (
                                        <Select
                                            {...register("categoryId", {
                                                required: true,
                                            })}
                                            value={categoryOption?.find((options) => options?.label === value?.name) || value?.name}
                                            options={categoryOption}
                                            placeholder="Select category"
                                            onChange={(e) => {
                                                onChange(e?.value)
                                                setcategory(e)

                                            }
                                            }
                                        />


                                    )
                                }
                                }
                            />
                            {errors && errors?.categoryId && (
                                <FormFeedback>Please enter valid category</FormFeedback>
                            )}
                        </div>

                        <div className='mb-1'>
                            <Label className='form-label' htmlFor='fullName'>
                                Description
                            </Label>
                            <Controller
                                id='description'
                                name='description'
                                defaultValue=''
                                {...register("description", {
                                })}
                                control={control}
                                render={({ field }) => (
                                    <Input type='text' placeholder='Enter style description' invalid={errors.description && true} {...field} />
                                )}
                            />
                            {errors && errors?.description && (
                                <FormFeedback>Please enter a valid description </FormFeedback>
                            )}
                        </div>
                        <div className='mb-1'>
                            <Label className='form-label' htmlFor='fullName'>
                                Width
                            </Label>
                            <Controller
                                id='width'
                                name='width'
                                defaultValue=''
                                {...register("width", {
                                })}
                                control={control}
                                render={({ field }) => (
                                    <Input type='text' placeholder='Enter style width' invalid={errors.width && true} {...field} />
                                )}
                            />
                            {errors && errors?.width && (
                                <FormFeedback>Please enter a valid width name</FormFeedback>
                            )}
                        </div>


                        <div className='mb-1'>
                            <Label className='form-label' htmlFor='fullName'>
                                Length
                            </Label>
                            <Controller
                                id='length'
                                name='length'
                                defaultValue=''
                                {...register("length", {
                                })}
                                control={control}
                                render={({ field }) => (
                                    <Input type='text' placeholder='Enter style length' invalid={errors.length && true} {...field} />
                                )}
                            />
                            {errors && errors?.length && (
                                <FormFeedback>Please enter a valid length name</FormFeedback>
                            )}
                        </div>
                        <div className='mb-1'>
                            <FormGroup
                                check
                                inline>
                                <Label check>
                                    <div>
                                        <Input type="checkbox" onClick={(e) => setRhodium(e?.target?.checked ? true : false)} checked={rhodium} />
                                    </div>
                                    <div>Rhodium</div>
                                </Label>
                            </FormGroup>

                        </div>
                        <div className='mb-1'>
                            <Label className='form-label' htmlFor='fullName'>
                                Metal Name <span className='text-danger'>&#42;</span>
                            </Label>
                            <MetalDropDown
                                setMetal={setMetal}
                                defaultMetal=""
                                metal={metal}
                                errors={errors}
                                control={control}
                                register={register}
                            />
                        </div>
                        <div className='mb-1'>
                            <Label className="form-label" htmlFor="login-fname">
                                Product Images{" "}
                                {productImages?.length === 0 && (
                                    <PlusCircle className="cursor-pointer" onClick={(e) => handleAdd(e)} style={{ marginLeft: 5 }} />
                                )}
                            </Label>
                            <Row>
                                {productImages?.map((item, index) => {
                                    return (
                                        <Col sm="12">
                                            <div className="d-flex justify-content-center align-items-center mb-1">
                                                <Controller
                                                    name='productImages'
                                                    control={control}
                                                    render={({ field: { onChange, value, ...rest } }) => {
                                                        return (
                                                            <Input
                                                                type="file"
                                                                {...register("productImages", {
                                                                    required: index === 0 && !productImages[index]
                                                                })}
                                                                invalid={errors?.productImages?.[index] && true}
                                                                accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG,.webp"
                                                                onChange={(e) => {
                                                                    getBase64(e, onChange, index);
                                                                }}
                                                                {...rest}
                                                            />
                                                        )
                                                    }}
                                                />
                                                {productImages?.length - 1 == index ? (
                                                    <PlusCircle
                                                        className="cursor-pointer"
                                                        onClick={(e) => handleAdd(e)}
                                                        style={{ marginLeft: 10 }}
                                                    />
                                                ) : null}
                                                {productImages?.length >= 1 ? (
                                                    <MinusCircle
                                                        className="cursor-pointer"
                                                        onClick={() => handleRemove(index)}
                                                        style={{ marginLeft: 10 }}
                                                    />
                                                ) : null}

                                            </div>
                                            {errors && errors.productImages && <FormFeedback>productImage is required</FormFeedback>}
                                            {productImages?.[index] !== "" ? (
                                                productImages?.[index]?.includes("base64") ? (
                                                    <img
                                                        src={productImages[index]}
                                                        height={100}
                                                        width={100}
                                                        alt={`advimage-${index}`}
                                                        className="my-1"
                                                    />
                                                ) : (
                                                    productImages[index] && <img
                                                        src={`${digitalOceanURL}${productImages[index]}`}
                                                        className="my-1"
                                                        width={100}
                                                        height={100}
                                                    // alt={`advimage-${index}`}
                                                    />



                                                )
                                            ) : null}
                                        </Col>
                                    );
                                })}
                            </Row>
                        </div>
                        <div className='mb-1'>
                            <Label className="form-label" htmlFor="productCategory">
                                Style ID<span className="text-danger">&#42;</span>
                            </Label>
                            <Controller
                                name="styleId"
                                control={control}
                                render={({ field: { onChange, value } }) => {
                                    return (
                                        <Select
                                            {...register("styleId", {
                                                required: true,
                                            })}
                                            value={categoryStyleOption?.find((options) => options?.label === value?.styleName) || value?.styleName}
                                            options={categoryStyleOption}
                                            placeholder="Select style Id"
                                            onChange={(e) => {
                                                onChange(e?.value)
                                                setStyleId(e)
                                            }
                                            }
                                        />

                                    )
                                }
                                }
                            />
                            {errors && errors?.styleId && <FormFeedback>Please select styleId</FormFeedback>}
                        </div>

                        <Row>
                            <Col sm={6} className="d-flex">
                                <Label className="label-custom me-1 label-padding-top">Diamond Details </Label>
                                <div className="form-check form-switch">
                                    <Input
                                        className="custom-control-success"
                                        type="switch"
                                        checked={diamoundDetails}
                                        onChange={(e) => setdiamoundDetails(e.target.checked)}
                                    />

                                </div>

                            </Col>
                        </Row>
                        {diamoundDetails && (
                            <Row>
                                <Col sm={6} className="mt-2">
                                    <Label className='form-label' htmlFor='fullName'>
                                        Diamond Shape
                                    </Label>
                                    <Controller
                                        id='diamondShape'
                                        name='diamondShape'
                                        defaultValue=''
                                        {...register("diamondShape", {
                                            required: true
                                        })}
                                        control={control}
                                        render={({ field }) => (
                                            <Input type='text' placeholder='Enter style diamondShape' invalid={errors.diamondShape && true} {...field} />
                                        )}
                                    />
                                    {errors && errors?.diamondShape && (
                                        <FormFeedback>Please enter a valid diamon shape </FormFeedback>
                                    )}
                                </Col>
                                <Col sm={6} className="mt-2">
                                    <Label className='form-label' htmlFor='fullName'>
                                        Diamond Carat
                                    </Label>
                                    <Controller
                                        id='diamondCarat'
                                        name='diamondCarat'
                                        defaultValue=''
                                        {...register("diamondCarat", {
                                            required: true
                                        })}
                                        control={control}
                                        render={({ field }) => (
                                            <Input type='text' placeholder='Enter style diamondCarat' invalid={errors.diamondCarat && true} {...field} />
                                        )}
                                    />
                                    {errors && errors?.diamondCarat && (
                                        <FormFeedback>Please enter a valid diamonc Carat </FormFeedback>
                                    )}
                                </Col>
                                <Col sm={6} className="mt-2">
                                    <Label className='form-label' htmlFor='fullName'>
                                        Diamond Color
                                    </Label>
                                    <Controller
                                        id='diamondColor'
                                        name='diamondColor'
                                        defaultValue=''
                                        {...register("diamondColor", {
                                            required: true
                                        })}
                                        control={control}
                                        render={({ field }) => (
                                            <Input type='text' placeholder='Enter style diamondColor' invalid={errors.diamondColor && true} {...field} />
                                        )}
                                    />
                                    {errors && errors?.diamondColor && (
                                        <FormFeedback>Please enter a valid diamond color </FormFeedback>
                                    )}
                                </Col>
                                <Col sm={6} className="mt-2" >
                                    <Label className='form-label' htmlFor='fullName'>
                                        Diamond Clarity
                                    </Label>
                                    <Controller
                                        id='diamondClarity'
                                        name='diamondClarity'
                                        defaultValue=''
                                        {...register("diamondClarity", {
                                            required: true
                                        })}
                                        control={control}
                                        render={({ field }) => (
                                            <Input type='text' placeholder='Enter style diamondClarity' invalid={errors.diamondClarity && true} {...field} />
                                        )}
                                    />
                                    {errors && errors?.diamondClarity && (
                                        <FormFeedback>Please enter a valid diamond clarity </FormFeedback>
                                    )}
                                </Col>
                            </Row>
                        )}

                    </Form>
                </CommanModal>

            </Card>
        </Fragment>
    )
}

export default index