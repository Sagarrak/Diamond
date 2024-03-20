import React, { Fragment, useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo';
import { Controller, useForm } from 'react-hook-form';
import { Card, CardBody, Form, FormFeedback, Input, Label } from 'reactstrap';
import ComponentSpinner from '../../../../@core/components/spinner/Loading-spinner';
import Header from '../../../components/Header'
import CommanModal from '../../../components/Modal'
import { GET_ALL_JEWELLERY_SHAPE, GET_ALL_SHAPE_PAGINATE } from './query';
import Select from '../../../components/Select'
import { jewelleryDiamondShapecolumn } from '../../../components/Constant';
import { UPDATE_SHAPE } from '../../../pages/Shapes/mutation'
import { toast } from 'react-toastify';
import Table from '../../../components/Table'
import { DELETE_SHAPE_JEWELLERY } from './mutation';
import { ConfirmationModal } from '../../../components/Alert';
import { digitalOceanURL } from '../../../common/common';



function index() {
    const [loader, setLoader] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sort, setSort] = useState({ key: "createdAt", type: -1 });
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [modal, setModal] = useState(false);
    const [ShapeImage, setShapeImage] = useState("");
    const [diamondOption, setdiamondOption] = useState([])
    const [shape, setShape] = useState("")
    const [allJewelleryShape, setallJewelleryShape] = useState("")
    const [updateShape] = useMutation(UPDATE_SHAPE);
    const [deleteShape] = useMutation(DELETE_SHAPE_JEWELLERY);

    const { data, loading, refetch } = useQuery(GET_ALL_JEWELLERY_SHAPE, {
        variables: {
            page: currentPage + 1,
            limit: limit,
            sort: sort,
            filter: "{}",
            search: searchText,
        },
        fetchPolicy: "cache-and-network",

    })

    const { data: shapeData, refetch: ShapeRefetch } = useQuery(GET_ALL_SHAPE_PAGINATE, {
        fetchPolicy: "cache-and-network",
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
        if (data?.getAllJewelryShapes) {
            setallJewelleryShape(data?.getAllJewelryShapes)
        }

    }, [data])

    useEffect(() => {
        if (shapeData?.getAllShapesWithoutPagination) {
            const shape = shapeData?.getAllShapesWithoutPagination?.map((d) => {
                return {
                    value: d?.id,
                    label: d?.shapeName
                }

            })
            setdiamondOption(shape)
        }
    }, [shapeData])

    const handlePagination = (page) => {
        setLoader(true);
        setCurrentPage(page?.selected);
    };
    const getBase64 = async (e, onChange) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            let result = await reader.result;
            await setShapeImage(result);
            await onChange(result);
        };
    };

    const handleSort = (e) => {
        setLoader(true);
        const type = sort.type == -1 ? 1 : -1;
        setSort({ key: e?.sortField, type });
    };

    const AddSubmitHandler = (data) => {
        updateShape({
            variables: {
                input: {
                    id: shape?.value,
                    jewelryShapeImage: data?.jewelryShapeImage,
                    isJewelry: true
                },
            },
        })
            .then(({ data }) => {
                if (data?.updateShape?.status) {
                    refetch();
                    setLoader(false);
                    toast.success("Update data successfully");
                    setModal(false);
                    resetData()
                    reset({});
                } else {
                    setModal(false);
                    setLoader(false);
                    toast.warn("not update");
                    reset({});
                    resetData();
                }
            })
            .catch((error) => {
                setLoader(false);
            });
    }
    const toggleHandler = () => {
        setModal(!modal);
        resetData();
        reset({});
    }
    const resetData = () => {
        setShapeImage("")

    }
    const addCategory = () => {
        setModal(true);
        reset({});
    }

    const deleteDiamond = async (id) => {

        let Status = await ConfirmationModal(
            "warning",
            "Are you sure?",
            "You won't be able to revert this!",
            "Yes, delete it!"
        );
        if (Status) {
            setLoader(true);
            deleteShape({
                variables: {
                    deleteShapeId: id,
                    isJewelry: false

                },
            })
                .then(async ({ data }) => {
                    if (data?.deleteShape) {
                        refetch();
                        setLoader(false);
                        await ConfirmationModal("success", "Deleted!", "Diamond shape has been deleted.", "");
                    } else {
                        toast.error("Diamond not deleted");
                        setLoader(false);
                    }
                })
                .catch((error) => {
                    // toast.error(FormatError(error));
                    setLoader(false);
                });
        }
    }
    const editDiamond = (data) => {
        setShapeImage(data?.jewelryShapeImage)
        setShape({ label: data?.shapeName })
        // setShape({ label: data?.shapeName, value: data?.id })
        setModal(true)
        reset(data)
    }
    const EditSubmitHandler = (data) => {
        updateShape({
            variables: {
                input: {
                    id: data?.id,
                    jewelryShapeImage: data?.jewelryShapeImage,
                    isJewelry: true
                },
            },
        })
            .then(({ data }) => {
                if (data?.updateShape?.status) {
                    refetch();
                    setLoader(false);
                    toast.success("Update data successfully");
                    setModal(false);
                    resetData()
                    reset({});
                } else {
                    setModal(false);
                    setLoader(false);
                    toast.warn("not update");
                    reset({});
                    resetData();
                }
            })
            .catch((error) => {
                setLoader(false);
            });

    }
    return (
        <Fragment>
            <Card className="w-100 h-100">
                {loader && <ComponentSpinner />}
                <CardBody style={{ flex: "unset", height: "inherit" }}>
                    <Header
                        limit={limit}
                        title={"Diamond Shape"}
                        setLimit={setLimit}
                        setSearchText={setSearchText}
                        setCurrentPage={setCurrentPage}
                        addData={() => addCategory()}

                    />
                    <Table
                        columns={jewelleryDiamondShapecolumn}
                        data={allJewelleryShape?.data || []}
                        currentPage={currentPage}
                        totalRecords={allJewelleryShape?.count || 0}
                        limit={limit}
                        deleteData={deleteDiamond}
                        editData={editDiamond}
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
                            <Label className='form-label' htmlFor='email'>
                                DIamond Shape
                            </Label>
                            {control._defaultValues?.id ?
                                <Input value={shape?.label} disabled />
                                :
                                <>
                                    <Controller
                                        name='shapeName'
                                        control={control}
                                        render={({ field: { onChange, value } }) => {

                                            return (
                                                <Select
                                                    {...register("shapeName", {
                                                        // required: true,
                                                    })}
                                                    value={diamondOption?.find((options) => options?.label === value?.shapeName) || value?.shapeName}
                                                    options={diamondOption}
                                                    placeholder="Select diamond shape"
                                                    onChange={(e) => {
                                                        onChange(e?.value)
                                                        setShape(e)

                                                    }
                                                    }
                                                />
                                            )
                                        }
                                        }
                                    />
                                    {errors && errors?.shapeName && (
                                        <FormFeedback>Please select valid shape</FormFeedback>
                                    )}
                                </>

                            }
                        </div>
                        <div className="mb-1" >
                            <Label className='form-image' htmlFor='image' style={{ fontSize: "15px" }}>
                                Image<span className='text-danger'>&#42;</span>
                            </Label>

                            <Controller
                                name='jewelryShapeImage'
                                control={control}
                                render={({ field: { onChange, value, ...rest } }) => {
                                    return (
                                        <Input
                                            type="file"
                                            {...register("jewelryShapeImage", {
                                                required: true
                                            })}
                                            invalid={errors?.jewelryShapeImage && true}
                                            accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG,.webp"
                                            onChange={(e) => {
                                                getBase64(e, onChange);
                                            }}
                                            {...rest}
                                        />
                                    )
                                }}
                            />
                            {errors &&  errors.jewelryShapeImage && <FormFeedback>Image is required</FormFeedback>}

                            {ShapeImage != "" ? (
                                ShapeImage?.includes("base64") ? (
                                    <img src={ShapeImage} height={100} width={100} alt="advimage" className="my-1" />
                                ) : (
                                    <img src={`${digitalOceanURL}${ShapeImage}`} className="my-1" width={100} height={100} />
                                )
                            ) : null}
                        </div>

                       

                    </Form>
                </CommanModal>

            </Card>
        </Fragment>
    )
}

export default index