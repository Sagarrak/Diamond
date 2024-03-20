//library
import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Modal, ModalHeader, ModalBody, Input, Form, Label, FormFeedback } from "reactstrap";
import { useMutation, useQuery } from "react-apollo";
import { DELETE_USER, UPDATE_USER } from './mutation';
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import _ from 'lodash';
import Select from "../../components/Select"
//components
import Table from "../../components/Table";
import { usersTableColumns } from "../../components/Constant";//
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import { ConfirmationModal } from "../../components/Alert";//
import { GET_ALL_USERS } from "./query";//
import Header from "../../components/Header";//
import CommanModal from "../../components/Modal";//
import { FormatError } from "../../../@core/components/common/FormatError";



const Index = () => {
    const [loader, setLoader] = useState(false);
    const [modal, setModal] = useState(false);
    const [modalKyc, setModalKyc] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sort, setSort] = useState({ key: "createdAt", type: -1 });
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [allUsers, setAllUsers] = useState([])
    const [KYCdata, setKYCdata] = useState([])
    const [invoiceData, setInvoiceData] = useState({})
    const [updateUser] = useMutation(UPDATE_USER)
    const {
        control,
        reset,
        setError,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    //query
    const { loading, data, refetch } = useQuery(GET_ALL_USERS, {
        variables: {
            page: currentPage + 1,
            limit: limit,
            sort: sort,
            filter: "{}",
            search: searchText,
        },
        fetchPolicy: "cache-and-network",
    });

    const userTypeOption = [
        {
            label: 'basic', value: 'basic'
        },
        {
            label: 'premium', value: 'premium'
        }
    ]

    // Mutation
    const [deleteParameter] = useMutation(DELETE_USER);
    if (!usersTableColumns?.find(d => d?.name === 'Active')) {
        usersTableColumns.push({
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
                            updateUser({
                                variables: {
                                    input: {
                                        id: row?.id,
                                        isActive: e.target.checked
                                    },
                                }
                            }).then(response => {
                                if (response?.data?.updateUser) {
                                    refetch()
                                    toast.success("Status updated successfully");
                                } else {
                                    toast.error("Status not updated")
                                }
                            }).catch((error) => {
                                toast.error(FormatError(error))
                            });
                        }}
                    />
                </div>
            ),
        })
    };

    if (!usersTableColumns?.find(d => d?.name === 'Enable Discount')) {
        usersTableColumns.push({
            name: "Enable Discount",
            sortable: true,
            minWidth: "150px",
            sortField: "enableDiscount",
            cell: (row) => (
                <div className="form-check form-switch">
                    <Input
                        className="custom-control-success"
                        type="switch"
                        id={row?.id}
                        name={row?.id}
                        style={{ zIndex: 0 }}
                        checked={row?.enableDiscount}
                        onChange={(e) => {
                            e.preventDefault();
                            updateUser({
                                variables: {
                                    input: {
                                        id: row?.id,
                                        enableDiscount: e.target.checked,
                                    },
                                }
                            }).then(response => {
                                if (response?.data?.updateUser) {
                                    refetch();
                                    toast.success("Status updated successfully");
                                } else {
                                    toast.error("Status not updated");
                                }
                            }).catch((error) => {
                                toast.error(FormatError(error));
                            })
                        }}
                    />
                </div>
            )
        })
    };

    useEffect(() => {
        setLoader(loading);
    }, [loading]);

    useEffect(() => {
        if (data?.getAllUser) {
            setLoader(false);
            setAllUsers(data?.getAllUser || []);
        }
    }, [data]);



    // function for  open and close model
    const toggleHandler = () => {
        setModal(!modal);
    };
    const toggleHandlerKyc = () => {
        setModalKyc(!modalKyc);
    };

    // function for edit invoice

    const handleOnClick = (data) => {
        setModal(true);
        setInvoiceData(data)
    }

    //function is being called on limit change
    // const changeLimit = (e) => {
    //     e.preventDefault();
    //     setLoader(true);
    //     setLimit(parseInt(e?.target?.value));
    //     setCurrentPage(0);
    // };
    //function is being called on change page
    const handlePagination = (page) => {
        setLoader(true);
        setCurrentPage(page?.selected);
    };
    //function is being called on search of value
    // const SearchHandling = (e) => {
    //     setSearchText(e?.target?.value);
    //     setCurrentPage(0);
    // };
    //function for handling sort
    const handleSort = (e) => {
        setLoader(true);
        const type = sort.type == -1 ? 1 : -1;
        setSort({ key: e?.sortField, type });
    };

    //function is being called on delete of user
    const deleteUser = async (userId) => {
        let Status = await ConfirmationModal(
            "warning",
            "Are you sure?",
            "You won't be able to revert this!",
            "Yes, delete it!"
        );
        if (Status) {
            setLoader(true);
            deleteParameter({
                variables: {
                    deleteUserId: userId,
                },
            })
                .then(async ({ data }) => {
                    if (data?.deleteUser) {
                        refetch();
                        setLoader(false);
                        await ConfirmationModal(
                            "success",
                            "Deleted!",
                            "User has been deleted.",
                            ""
                        );
                    } else {
                        toast.error("User not deleted");
                        setLoader(false);
                    }
                })
                .catch((error) => {
                    toast.error(FormatError(error));
                    setLoader(false);
                });
        }
    };

    const editUserData = (data) => {
        setModal(true);
        reset(data);
    }
    const EditSubmitHandler = data => {
        if (!Object.values(data)?.includes(undefined)) {
            const input = {
                id: data?.id,
                fullName:data?.fullName,
                userName:data?.userName,
                email:data?.email,
                category: data?.category?.value
            }
            setLoader(true)
            updateUser({ variables: { input } }).then((response) => {
                if (response?.data?.updateUser?.id) {
                    setLoader(false)
                    setModal(false)
                    handleReset()
                    toast.success("User updated successfully.")
                    refetch()
                } else {
                    setLoader(false)
                    setModal(false)
                    handleReset()
                    toast.success("User not updated")
                }
            }).catch((err) => {
                toast.error(FormatError(err))
                handleReset()
                setModal(false)
                setLoader(false)
            });
        }

    }

    const handleReset = () => {
        reset({
            fullName: '',
            email: '',
            userName: ''
        })
    }


    return (
        <Fragment>
            <Card className="w-100 h-100">
                {loader && <ComponentSpinner />}
                <CardBody style={{ flex: "unset", height: "inherit" }}>
                    <Header
                        limit={limit}
                        // changeLimit={(e) => changeLimit(e)}
                        title={"user"}
                        // SearchHandling={(e) => SearchHandling(e)}
                        setLimit={setLimit}
                        setSearchText={setSearchText}
                        setCurrentPage={setCurrentPage}
                    />
                    <Table
                        columns={usersTableColumns}
                        data={allUsers?.data || []}
                        currentPage={currentPage}
                        totalRecords={allUsers?.count || 0}
                        limit={limit}
                        editData={editUserData}
                        deleteData={deleteUser}
                        onSort={handleSort}
                        handlePagination={handlePagination}
                        // viewData={handleOnClick}
                        setKYCdata={setKYCdata}
                        setModalKyc={setModalKyc}
                    />
                </CardBody>
                <CommanModal
                    modal={modal}
                    setModal={setModal}
                    updateButtonHandler={handleSubmit(EditSubmitHandler)}
                    // addButtonHandler={handleSubmit(AddSubmitHandler)}
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
                                Full Name<span className='text-danger'>&#42;</span>
                            </Label>
                            <Controller
                                id='fullName'
                                name='fullName'
                                defaultValue=''
                                {...register("fullName", {
                                    required: true,
                                })}
                                control={control}
                                render={({ field }) => (
                                    <Input type='text' placeholder='Enter full name' invalid={errors.fullName && true} {...field} />
                                )}
                            />
                            {errors && errors?.fullName && (
                                <FormFeedback>Please enter a valid full name</FormFeedback>
                            )}
                        </div>

                        <div className='mb-1'>
                            <Label className='form-label' htmlFor='userName'>
                                User Name<span className='text-danger'>&#42;</span>
                            </Label>
                            <Controller
                                id='userName'
                                name='userName'
                                defaultValue=''
                                {...register("userName", {
                                    required: true,
                                })}
                                control={control}
                                render={({ field }) => (
                                    <Input type='text' placeholder='Enter full name' invalid={errors.userName && true} {...field} />
                                )}
                            />
                            {errors && errors?.userName && (
                                <FormFeedback>Please enter a valid user name</FormFeedback>
                            )}
                        </div>

                        <div className='mb-1'>
                            <Label className='form-label' htmlFor='email'>
                                Email<span className='text-danger'>&#42;</span>
                            </Label>
                            <Controller
                                id='email'
                                name='email'
                                defaultValue=''
                                {...register("email", {
                                    required: true,
                                })}
                                control={control}
                                render={({ field }) => (
                                    <Input type='text' placeholder='Enter email' invalid={errors.email && true} {...field} />
                                )}
                            />
                            {errors && errors?.email && (
                                <FormFeedback>Please enter a valid user name</FormFeedback>
                            )}
                        </div>

                        <div className='mb-1'>
                            <Label className='form-label' htmlFor='email'>
                                Category<span className='text-danger'>&#42;</span>
                            </Label>
                            <Controller
                                name='category'
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                    <Select
                                        {...register("category", {
                                            required: true,
                                        })}
                                        value={userTypeOption?.find((userType) => userType?.value === value) || value}
                                        options={userTypeOption}
                                        placeholder="Select category"
                                        onChange={onChange}
                                    />
                                )}
                            />
                            {errors && errors?.category && (
                                <FormFeedback>Please enter valid category</FormFeedback>
                            )}
                        </div>


                    </Form>
                </CommanModal>

            </Card>
        </Fragment>
    );
};
export default Index;