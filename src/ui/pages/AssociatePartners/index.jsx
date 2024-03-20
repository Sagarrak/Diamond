//library
import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Modal, ModalHeader, ModalBody, Input, Form, Label, FormFeedback } from "reactstrap";
import { useMutation, useQuery } from "react-apollo";
import { Controller, useForm } from "react-hook-form";
import Select from "../../components/Select";
import _ from "lodash";

//components
import Table from "../../components/Table";
import CommanModal from "../../components/Modal"; //
import { associatePartnerTableColumns } from "../../components/Constant"; //
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import { GET_ASSOCIATE_PARTNERS } from "./query"; //
import { ADD_PARTNER, UPDATE_PARTNER, DELETE_PARTNER } from "./mutation";
import Header from "../../components/Header"; //
import { toast } from "react-toastify";
import { FormatError } from "../../../@core/components/common/FormatError";
import { ConfirmationModal } from "../../components/Alert";

const Index = () => {
  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({ key: "createdAt", type: -1 });
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [allUsers, setAllUsers] = useState([]);
  const [addVendor] = useMutation(ADD_PARTNER);
  const [updateVendor] = useMutation(UPDATE_PARTNER);
  const [deletePartnerMutation, { data: deleteData, loading: deleteLoading, error }] = useMutation(DELETE_PARTNER);

  const statusOption = [
    { label: "Pending", value: "pending" },
    { label: "Approve", value: "approved" },
    { label: "Reject", value: "rejected" },
  ];
  const categoryOption = [
    { label: "B2B", value: "B2B" },
    { label: "Jewellery", value: "JEWELLERY" },
    { label: "Marketing", value: "Marketing" },
  ];

  const {
    control,
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm();
  //query
  const { loading, data, refetch } = useQuery(GET_ASSOCIATE_PARTNERS, {
    variables: {
      page: currentPage + 1,
      limit: limit,
      sort: sort,
      filter: "{}",
      search: searchText,
    },
    fetchPolicy: "cache-and-network",
  });

  if (!associatePartnerTableColumns?.find((d) => d?.name === "Active")) {
    associatePartnerTableColumns.push({
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
            inline
            style={{ zIndex: 0 }}
            checked={row?.isActive}
            onChange={(e) => {
              e.preventDefault();
              updateVendor({
                variables: {
                  input: {
                    id: row?.id,
                    isActive: e.target.checked,
                  },
                },
              })
                .then((response) => {
                  if (response?.data?.updateVendor) {
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

  // Mutation
  useEffect(() => {
    setLoader(loading);
  }, [loading]);

  useEffect(() => {
    if (data?.getAssociatePartners) {
      setLoader(false);
      setAllUsers(data?.getAssociatePartners || []);
    }
  }, [data]);

  // function for  open and close model
  const toggleHandler = () => {
    setModal(!modal);
  };

  // function for edit invoice

  // const handleOnClick = (data) => {
  //     setModal(true);
  //     setInvoiceData(data)
  // }

  //function is being called on limit change
  const changeLimit = (e) => {
    e.preventDefault();
    setLoader(true);
    setLimit(parseInt(e?.target?.value));
    setCurrentPage(0);
  };

  //function is being called on change page
  const handlePagination = (page) => {
    setLoader(true);
    setCurrentPage(page?.selected);
  };

  //function is being called on search of value
  const SearchHandling = (e) => {
    setSearchText(e?.target?.value);
    setCurrentPage(0);
  };

  const handleSort = (e, sortDirection) => {
    const type = sortDirection === "asc" ? 1 : -1;
    setSort({ key: e?.sortField, type });
  };

  const addData = () => {
    setModal(true);
    setIsEdit(false);
    reset({});
  };

  const editUserData = (data) => {
    setIsEdit(true);
    setModal(true);
    reset(data);
  };

  const onSubmit = (data) => {
    if (!Object.values(data).includes(undefined)) {
      setLoader(true);
      addVendor({
        variables: {
          input: { ...data, vendorCategory: data?.vendorCategory?.value, commission: parseFloat(data?.commission) },
        },
      })
        .then((response) => {
          if (response?.data?.addPartner?.id) {
            setLoader(false);
            setModal(false);
            handleReset();
            toast.success("Associate partner added successfully.");
            refetch();
          } else {
            setLoader(false);
            setModal(false);
            handleReset();
            refetch();
            toast.error("Associate partner not added");
          }
        })
        .catch((err) => {
          toast.error(FormatError(err));
          handleReset();
          setModal(false);
          setLoader(false);
        });
    }
  };

  const EditSubmitHandler = (data) => {
    if (!Object.values(data)?.includes(undefined)) {
      const input = {
        id: data?.id,
        fullName:data?.fullName,
        email:data?.email,
        companyName:data?.companyName,
        commission: parseFloat(data?.commission),
        approvedStatus: data?.approvedStatus?.value,
        vendorCategory: data?.vendorCategory?.value,
      };
      setLoader(true);
      updateVendor({ variables: { input } })
        .then((response) => {
          if (response?.data?.updatePartner?.id) {
            setLoader(false);
            setModal(false);
            setIsEdit(false);
            handleReset();
            toast.success("Associate partner updated successfully.");
            refetch();
          } else {
            setLoader(false);
            setModal(false);
            setIsEdit(false);
            handleReset();
            toast.error("Something went wrong");
          }
        })
        .catch((err) => {
          toast.error(FormatError(err));
          handleReset();
          setModal(false);
          setIsEdit(false);
          setLoader(false);
        });
    }
  };

  const handleReset = () => {
    reset({
      fullName: "",
      email: "",
      companyName: "",
    });
  };

  //function is being called on delete of shape
  const deleteVendor = async (userId) => {
    let Status = await ConfirmationModal(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, delete it!"
    );
    if (Status) {
      setLoader(true);
      deletePartnerMutation({
        variables: {
          deleteUserId: userId,
        },
      })
        .then(async ({ data }) => {
          if (data?.deleteUser) {
            refetch();
            setLoader(false);
            await ConfirmationModal("success", "Deleted!", "Associate Partner has been deleted.", "");
          } else {
            toast.error("Associate partner not deleted");
            setLoader(false);
          }
        })
        .catch((error) => {
          toast.error(FormatError(error));
          setLoader(false);
        });
    }
  };

  return (
    <Fragment>
      <Card className="w-100 h-100">
        {deleteLoading && <ComponentSpinner />}
        <CardBody style={{ flex: "unset", height: "inherit" }}>
          <Header
            limit={limit}
            // changeLimit={(e) => changeLimit(e)}
            title={"Associate Partner"}
            // SearchHandling={(e) => SearchHandling(e)}
            addData={() => addData()}
            setLimit={setLimit}
            setSearchText={setSearchText}
            setCurrentPage={setCurrentPage}
          />
          <Table
            columns={associatePartnerTableColumns}
            data={allUsers?.data || []}
            currentPage={currentPage}
            totalRecords={allUsers?.count || 0}
            limit={limit}
            deleteData={deleteVendor}
            editData={editUserData}
            onSort={handleSort}
            handlePagination={handlePagination}
          />
        </CardBody>
        <CommanModal
          modal={modal}
          setModal={setModal}
          updateButtonHandler={handleSubmit(EditSubmitHandler)}
          addButtonHandler={handleSubmit(onSubmit)}
          toggleHandler={toggleHandler}
          loading={loader}
          updateId={control._defaultValues?.id ? true : false}
          modalTitle={control._defaultValues?.id ? "Update " : "Add "}
        >
          <Form>
            <div className="mb-1">
              <Label className="form-label" htmlFor="fullName">
                Full Name<span className="text-danger">&#42;</span>
              </Label>
              <Controller
                id="fullName"
                name="fullName"
                defaultValue=""
                {...register("fullName", {
                  required: true,
                })}
                control={control}
                render={({ field }) => (
                  <Input type="text" placeholder="Enter full name" invalid={errors.fullName && true} {...field} />
                )}
              />
              {errors && errors?.fullName && <FormFeedback>Please enter a valid full name</FormFeedback>}
            </div>
            <div className="mb-1">
              <Label className="form-label" htmlFor="email">
                Email<span className="text-danger">&#42;</span>
              </Label>
              <Controller
                id="email"
                name="email"
                defaultValue=""
                control={control}
                {...register("email", {
                  required: true,
                })}
                render={({ field }) => (
                  <Input type="email" placeholder="Enter email" invalid={errors.email && true} {...field} />
                )}
              />
              {errors && errors?.email && <FormFeedback>Please enter a valid email</FormFeedback>}
            </div>
            <div className="mb-1">
              <Label className="form-label" htmlFor="companyName">
                Company Name<span className="text-danger">&#42;</span>
              </Label>
              <Controller
                id="companyName"
                name="companyName"
                defaultValue=""
                {...register("companyName", {
                  required: true,
                })}
                control={control}
                render={({ field }) => (
                  <Input type="text" placeholder="Enter company name" invalid={errors.companyName && true} {...field} />
                )}
              />
              {errors && errors?.companyName && <FormFeedback>Please enter a valid company name</FormFeedback>}
            </div>
            <div className="mb-1">
              <Label className="form-label" htmlFor="vendorCategory">
                Category<span className="text-danger">&#42;</span>
              </Label>
              <Controller
                name="vendorCategory"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Select
                    {...register("vendorCategory", {
                      required: true,
                    })}
                    value={categoryOption?.find((category) => category?.value === value) || value}
                    options={categoryOption}
                    placeholder="Select category"
                    onChange={onChange}
                  />
                )}
              />
              {errors && errors?.vendorCategory && <FormFeedback>Please select category</FormFeedback>}
            </div>
            {!isEdit && (
              <div className="mb-1">
                <Label className="form-label" htmlFor="password">
                  Password<span className="text-danger">&#42;</span>
                </Label>
                <Controller
                  id="password"
                  name="password"
                  defaultValue=""
                  control={control}
                  {...register("password", {
                    required: true,
                    value: "",
                  })}
                  render={({ field }) => (
                    <Input type="password" placeholder="Enter password" invalid={errors.email && true} {...field} />
                  )}
                />
                {errors && errors?.email && <FormFeedback>Please enter a password</FormFeedback>}
              </div>
            )}
            {isEdit && (
              <div className="mb-1">
                <Label className="form-label" htmlFor="commission">
                  Commission (%)<span className="text-danger">&#42;</span>
                </Label>
                <Controller
                  id="commission"
                  name="commission"
                  defaultValue=""
                  {...register("commission", {
                    required: true,
                  })}
                  control={control}
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Enter commission"
                      invalid={errors.commission && true}
                      {...field}
                    />
                  )}
                />
                {errors && errors?.commission && <FormFeedback>Please enter a valid commission</FormFeedback>}
              </div>
            )}
            {isEdit && (
              <div className="mb-1">
                <Label className="form-label" htmlFor="approvedStatus">
                  Approved Status
                </Label>
                <Controller
                  name="approvedStatus"
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      {...register("approvedStatus", {
                        required: true,
                      })}
                      value={statusOption?.find((status) => status?.value === value) || value}
                      options={statusOption}
                      placeholder="Select status"
                      onChange={onChange}
                    />
                  )}
                />
              </div>
            )}
          </Form>
        </CommanModal>
      </Card>
    </Fragment>
  );
};
export default Index;
