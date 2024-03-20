import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Card, CardBody, Form, FormFeedback, Input, Label } from 'reactstrap';
import ComponentSpinner from '../../../../@core/components/spinner/Loading-spinner';
import Header from '../../../components/Header'
import CommanModal from '../../../components/Modal'
import Select from '../../../components/Select'
import { digitalOceanURL } from '../../../common/common'
import { useMutation, useQuery } from 'react-apollo';
import { ADD_RING_STYLE_DATA, UPDATE_RING_STYLE, DELETE_RING_STYLE } from './mutation'
import { GET_ALL_RING_STYLE_DATA, JEWELLERY_CATEGORIES } from './query'
import { ringStyleTableColumn } from '../../../components/Constant'
import Table from '../../../components/Table'
import { toast } from 'react-toastify';
import { ConfirmationModal } from '../../../components/Alert';
import { FormatError } from '../../../../@core/components/common/FormatError';

function index() {
    const [loader, setLoader] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sort, setSort] = useState({ key: "createdAt", type: -1 });
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [modal, setModal] = useState(false);
    const [StyleImage, setStyleImage] = useState("");
    const [allRingdata, setallRingdata] = useState("");
    const [OrderIndex, setOrderIndex] = useState();
    const [oldIndex, setoldIndex] = useState("");
    const [Index, setIndex] = useState(false);
    const [categoryOption,setCategoryOptions]=useState([])
    const [category,setcategory]=useState('')

    //mutation
    const [addRingStyleData] = useMutation(ADD_RING_STYLE_DATA)
    const [updateRingStyleData] = useMutation(UPDATE_RING_STYLE)
    const [deleteRingStyleData] = useMutation(DELETE_RING_STYLE)

    //query
    const { data, loading, refetch } = useQuery(GET_ALL_RING_STYLE_DATA, {
        variables: {
            page: currentPage + 1,
            limit: limit,
            sort: sort,
            filter: "{}",
            search: searchText,
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
        if (data?.getStyle) {
            setLoader(false)
            setallRingdata(data?.getStyle)
        }

    }, [data])

    useEffect(() => {
        if(categoryies?.jewelryCategoriesWithoutPaginations){
           const data= categoryies?.jewelryCategoriesWithoutPaginations?.map((d)=>{
                return {
                    value:d?.id,
                    label:d?.name
                }
            })
            setCategoryOptions(data)
        }
    }, [categoryies])
    

    if (!ringStyleTableColumn?.find((d) => d?.name === "Active")) {
        ringStyleTableColumn.push({
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
                            updateRingStyleData({
                                variables: {
                                    input: {
                                        id: row?.id,
                                        isActive: e.target.checked,
                                    },
                                },
                            })
                                .then((response) => {
                                    if (response?.data?.updateStyle) {
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

    const deleteRigData = async (ringId) => {
        let Status = await ConfirmationModal(
            "warning",
            "Are you sure?",
            "You won't be able to revert this!",
            "Yes, delete it!"
        );
        if (Status) {
            setLoader(true);
            deleteRingStyleData({
                variables: {
                    deleteStyleId: ringId,
                },
            })
                .then(async ({ data }) => {
                    if (data?.deleteStyle) {
                        refetch();
                        setLoader(false);
                        await ConfirmationModal("success", "Deleted!", "Style has been deleted.", "");
                    } else {
                        toast.error("Style not deleted");
                        setLoader(false);
                    }
                })
                .catch((error) => {
                    // toast.error(FormatError(error));
                    setLoader(false);
                });
        }

    }
    const EditSubmitHandler = (data) => {
        data.index = OrderIndex
        if (!Object.values(data)?.includes(undefined)) {
            const input = {
                id: data?.id,
                styleName: data?.styleName,
                image: data?.image,
                oldIndex: oldIndex,
                index: parseInt(data?.index),
                categoryId: category?.value
            }
            setLoader(true)
            updateRingStyleData({ variables: { input } }).then((response) => {
                if (response?.data?.updateStyle?.id) {
                    toast.success("Style updated successfully.")
                    refetch()
                    setLoader(false)
                    setModal(false)
                    // handleReset()
                } else {
                    setLoader(false)
                    setModal(false)
                    // handleReset()
                    toast.success("Style not updated")
                }
            }).catch((err) => {
                toast.error(FormatError(err))
                // handleReset()
                setModal(false)
                setLoader(false)
            });
        }

    }
    const toggleHandler = () => {
        setModal(!modal);
        resetData();
        reset({});
    }
    const addRingStyle = () => {
        setIndex(true)
        setModal(true);
        reset({});
    }
    const editRingData = (data) => {
        setoldIndex(data?.index)
        setStyleImage(data?.image)          
        setcategory({label:data?.categoryId?.name,value:data?.categoryId?.id})
        setModal(true)
        reset(data)

    }
    const AddSubmitHandler = (data) => {
        data.index = OrderIndex
        // if (!Object.values(data).includes(undefined)) {
        addRingStyleData({
            variables: {
                input: {
                    styleName: data?.styleName,
                    image: data?.image,
                    index: parseInt(data?.index),
                    categoryId:category?.value,
                },
            },
        })
            .then(({ data }) => {
                if (data?.createStyle?.id) {
                    refetch();
                    resetData();
                    setLoader(false);
                    toast.success("Style data added successfully");
                    setIndex(false)
                    setModal(false);
                    reset({});
                } else {
                    setModal(false);
                    setLoader(false);
                    toast.warn("Style data not added");
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
   
    const getBase64 = async (e, onChange) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            let result = await reader.result;
            await setStyleImage(result);
            await onChange(result);
        };
    };
    const resetData = () => {
        setStyleImage("")
    }

    const handlePagination = (page) => {
        setLoader(true);
        setCurrentPage(page?.selected);
    };

    const handleSort = (e) => {
        setLoader(true);
        const type = sort.type == -1 ? 1 : -1;
        setSort({ key: e?.sortField, type });
    };


    return (
        <Fragment>
            <Card className="w-100 h-100">
                {loader && <ComponentSpinner />}
                <CardBody style={{ flex: "unset", height: "inherit" }}>
                    <Header
                        limit={limit}
                        title={"Jewellery"}
                        setLimit={setLimit}
                        setSearchText={setSearchText}
                        setCurrentPage={setCurrentPage}
                        addData={() => addRingStyle()}

                    />
                    <Table
                        columns={ringStyleTableColumn}
                        data={allRingdata?.data || []}
                        currentPage={currentPage}
                        totalRecords={allRingdata?.count || 0}
                        limit={limit}
                        deleteData={deleteRigData}
                        editData={editRingData}
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
                        </div>

                        <div className='mb-1'>
                            <Label className='form-label' htmlFor='fullName'>
                                Style Name<span className='text-danger'>&#42;</span>
                            </Label>
                            <Controller
                                id='styleName'
                                name='styleName'
                                defaultValue=''
                                {...register("styleName", {
                                    required: true,
                                })}
                                control={control}
                                render={({ field }) => (
                                    <Input type='text' placeholder='Enter style name' invalid={errors.styleName && true} {...field} />
                                )}
                            />
                            {errors && errors?.styleName && (
                                <FormFeedback>Please enter a valid style name</FormFeedback>
                            )}
                        </div>
                        <div className="mb-1" >
                            <Label className='form-image' htmlFor='image' style={{ fontSize: "15px" }}>
                                Image
                            </Label> {" "}

                            <Controller
                                name='image'
                                control={control}
                                render={({ field: { onChange, value, ...rest } }) => {
                                    return (
                                        <Input
                                            type="file"
                                            {...register("image")}
                                            invalid={errors?.styleImage && true}
                                            accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG,.webp"
                                            onChange={(e) => {
                                                getBase64(e, onChange);
                                            }}
                                            {...rest}
                                        />
                                    )
                                }}
                            />
                            {errors.image && <FormFeedback>Image is required</FormFeedback>}
                            {StyleImage != "" ? (
                                StyleImage?.includes("base64") ? (
                                    <img src={StyleImage} height={100} width={100} alt="advimage" className="my-1" />
                                ) : (
                                    <img src={`${digitalOceanURL}${StyleImage}`} className="my-1" width={100} height={100} />
                                )
                            ) : null}
                        </div>
                        <div className='mb-1'>
                            <Label className='form-label' htmlFor='fullName'>
                                Index
                            </Label>
                            <Controller
                                name="index"
                                control={control}
                                {...register("index", {})}
                                render={({ field: { onChange, value } }) => {
                                    setOrderIndex(Index ?  allRingdata?.count  : value);
                                    return (
                                        <Input
                                            type="number"
                                            min="1"
                                            disabled={Index || !control?._defaultValues?.id}
                                            invalid={errors.index && true}
                                            onChange={(e) => {
                                                onChange(e?.target?.value);
                                            }}
                                            value={Index ? allRingdata?.count + 1 : value}
                                        />
                                    );
                                }}
                            />

                            {errors && errors?.index && (
                                <FormFeedback>Please enter a valid index name</FormFeedback>
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
                                    return(
                                        <Select
                                            {...register("categoryId", {
                                                required: true,
                                            })}
                                            value={categoryOption?.find((options) => options?.label === value?.name) || value?.name}
                                            options={categoryOption}
                                            placeholder="Select category"
                                            onChange={(e)=>{
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
                    </Form>
                </CommanModal>

            </Card>
        </Fragment>
    )
}

export default index