//library
import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Row, Col, Form, Label, Input, FormFeedback } from "reactstrap";
import { useMutation, useQuery } from "react-apollo";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import Select from "../../components/Select";
import _ from "lodash";

//components
import Table from "../../components/Table";
import { parameterTableColumns } from "../../components/Constant"; //
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import CommanModal from "../../components/Modal"; //
import { ConfirmationModal } from "../../components/Alert"; //
import { FormatError } from "../../../@core/components/common/FormatError"; //
import { ADD_PARAMETER, UPDATE_PARAMETER, DELETE_PARAMETER } from "./mutation"; //
import { GET_ALL_PARAMETERS, GET_PARAMETER } from "./query"; //
import Header from "../../components/Header"; //
import { MinusCircle, PlusCircle } from "react-feather";
// import Bankform from "./bankForm";//
const Index = () => {
  // initial states
  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({ key: "createdAt", type: -1 });
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [allParams, setAllParams] = useState([]);

  const [paramName, setParamName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [defaultType, setDefaultType] = useState("");
  const [defaultCategory, setDefaultCategory] = useState("");
  const [value, setValue] = useState([]);
  const [fields, setFields] = useState([{ value: null }]);

  // ** Validation modules
  const {
    control,
    reset,
    setError,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({});

  //query
  const { loading, data, refetch } = useQuery(GET_ALL_PARAMETERS, {
    variables: {
      page: currentPage + 1,
      limit: limit,
      sort: sort,
      filter: null,
      search: searchText,
    },
    fetchPolicy: "cache-and-network",
  });

  //mutation
  const [addParameter] = useMutation(ADD_PARAMETER);
  const [updateParameter] = useMutation(UPDATE_PARAMETER);
  const [deleteParameter] = useMutation(DELETE_PARAMETER);

  useEffect(() => {
    setLoader(loading);
  }, [loading]);

  useEffect(() => {
    if (data?.getAllParameter) {
      setLoader(false);
      setAllParams(data?.getAllParameter);
    }
  }, [data]);

  if (!parameterTableColumns?.find((d) => d?.name === "Active")) {
    parameterTableColumns.push({
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
              updateParameter({
                variables: {
                  input: {
                    id: row?.id,
                    isActive: e.target.checked,
                  },
                },
              })
                .then((response) => {
                  if (response?.data?.updateParameter) {
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

  const resetData = () => {
    setParamName("");
    setDisplayName("");
    setType("");
    setCategory("");
    setValue([]);
    setDefaultType("");
    setDefaultCategory("");
    setFields([{ value: null }]);
  };

  // function for  open and close model
  const toggleHandler = () => {
    setModal(!modal);
    resetData();
    reset({});
  };
  // function for add bank
  const addBankData = () => {
    setModal(true);
    reset({});
  };
  // function for edit bank
  const editBankData = (data) => {
    setModal(true);
    reset(data);
    setParamName(data?.paramName);
    setDisplayName(data?.displayName);
    setType({ label: data?.type, value: data?.type });
    setCategory({ label: data?.category, value: data?.category });
    setDefaultType({ label: data?.type, value: data?.type });
    setDefaultCategory({ label: data?.category, value: data?.category });
    if (data?.type == "List") {
      const newData = data?.value?.map((d) => {
        return { value: d };
      });
      setFields(newData);
    } else {
      setValue(data?.value);
    }
  };
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
  //function for handling sort
  const handleSort = (e) => {
    setLoader(true);
    const type = sort.type == -1 ? 1 : -1;
    setSort({ key: e?.sortField, type });
  };
  //function is being called on delete of shape
  const deleteProdcut = async (shapeId) => {
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
          deleteParameterId: shapeId,
        },
      })
        .then(async ({ data }) => {
          if (data?.deleteParameter) {
            refetch();
            setLoader(false);
            await ConfirmationModal("success", "Deleted!", "Parameter has been deleted.", "");
          } else {
            toast.error("Shape not deleted");
            setLoader(false);
          }
        })
        .catch((error) => {
          // toast.error(FormatError(error));
          setLoader(false);
        });
    }
  };
  //function is being called on Edit of branchForm
  const EditSubmitHandler = (data) => {
    let newVal = [];
    fields.map(function (e) {
      if (!_.isEmpty(e.value)) {
        newVal.push(e?.value);
      }
    });
    setLoader(true);
    updateParameter({
      variables: {
        input: {
          id: data?.id,
          paramName: data?.paramName,
          displayName:data?.displayName,
          type: data?.type,
          value: type?.value == "List" ? newVal : value,
          category: data?.category,
        },
      },
    })
      .then(({ data }) => {
        if (data?.updateParameter?.status) {
          refetch();
          resetData();
          setModal(false);
          setLoader(false);
          toast.success("Parameter updated successfully");
          reset({});
        } else {
          setModal(false);
          setLoader(false);
          toast.warn(data?.updateParameter?.message);
          // toast.success("Something went wrong!");
        }
      })
      .catch((error) => {
        // toast.warn(FormatError(error));
        setLoader(false);
      });
  };
  //function is being called on submit of branchForm
  const AddSubmitHandler = (data) => {
    let newVal = [];
    fields.filter(function (e) {
      if (!_.isEmpty(e.value)) {
        newVal.push(e?.value);
      }
    });

    if (!Object.values(data).includes(undefined)) {
      addParameter({
        variables: {
          input: {
            paramName: data?.paramName,
            displayName,
            type: data?.type,
            value: type?.value == "List" ? newVal : value,
            category: data?.category,
          },
        },
      })
        .then(({ data }) => {
          if (data?.addParameter?.status) {
            refetch();
            resetData();
            setLoader(false);
            toast.success("Parameter added successfully");
            setModal(false);
            reset({});
          } else {
            setModal(false);
            setLoader(false);
            toast.warn(data?.addParameter?.message);
            reset({});
            resetData();
          }
        })
        .catch((error) => {
          // toast.warn(FormatError(error));
          setLoader(false);
        });
    } else {
      for (const key in data) {
        if (!data[key]) {
          setError(key, {
            type: "manual",
          });
        }
      }
    }
  };

  // <===================================== Handle Input For Specific Option Method =====================================>

  function handleChange(text, i) {
    const values = [...fields];
    values[i].value = text;
    setFields(values);
  }

  // <===================================== Add New Option Method =====================================>

  function handleAdd() {
    const values = [...fields];
    values.push({ value: null });
    setFields(values);
  }

  // <===================================== Remove Option Method =====================================>

  function handleRemove(i) {
    const values = [...fields];
    values.splice(i, 1);
    setFields(values);
  }

  const typeOptions = [
    { label: "Number", value: "Number" },
    { label: "String", value: "String" },
    { label: "List", value: "List" },
  ];
  const categoryOptions = [
    { label: "Advanced", value: "Advanced" },
    { label: "General", value: "General" },
    { label: "Global", value: "Global" },
    { label: "Inclusion", value: "Inclusion" },
  ];

  return (
    <Fragment>
      <Card className="w-100 h-100">
        {loader && <ComponentSpinner />}
        <CardBody style={{ flex: "unset", height: "inherit" }}>
          <Header
            limit={limit}
            // changeLimit={(e) => changeLimit(e)}
            title={"Parameter"}
            addData={() => addBankData()}
            // SearchHandling={(e) => SearchHandling(e)}
            setLimit={setLimit}
            setSearchText={setSearchText}
            setCurrentPage={setCurrentPage}
          />
          <Table
            columns={parameterTableColumns}
            data={allParams?.data || []}
            currentPage={currentPage}
            totalRecords={allParams?.count || 0}
            limit={limit}
            editData={editBankData}
            deleteData={deleteProdcut}
            onSort={handleSort}
            handlePagination={handlePagination}
          />
        </CardBody>
        <CommanModal
          modal={modal}
          setModal={setModal}
          updateButtonHandler={handleSubmit(EditSubmitHandler)}
          addButtonHandler={handleSubmit(AddSubmitHandler)}
          toggleHandler={toggleHandler}
          loading={false}
          updateId={control._defaultValues?.id ? true : false}
          modalTitle={control._defaultValues?.id ? "Update " : "Add "}
        >
          <Form className="auth-login-form mt-2">
            <div className="mb-1">
              <Label className="form-label" htmlFor="login-fname">
                Parameter Name<span className="text-danger">&#42;</span>
              </Label>
              <Controller
                name="paramName"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      type="text"
                      {...register("paramName", {
                        required: true,
                      })}
                      invalid={errors?.paramName && true}
                      required
                      {...field}
                      placeholder="Parameter Name"
                    />
                  );
                }}
              />
              {errors.paramName && <FormFeedback>Parameter Name is required</FormFeedback>}
              {/* <Input type='text' id='login-fname' placeholder='Parameter Name' value={paramName} autoFocus onChange={(e) => { setParamName(e.target.value) }} /> */}
            </div>
            {/* <div className='mb-1'>
                            <Label className='form-label' htmlFor='login-lname'>
                                Display Name
                            </Label>
                            <Input type='text' id='login-lname' placeholder='Display Name' value={displayName} onChange={(e) => { setDisplayName(e.target.value) }} />
                        </div> */}
            <div className="mb-1">
              <Label className="form-label" htmlFor="login-fname">
                Select Category<span className="text-danger">&#42;</span>
              </Label>

              <Controller
                name="category"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Select
                      type="text"
                      {...register("category", {
                        required: true,
                      })}
                      invalid={errors?.category && true}
                      required
                      onChange={(e) => onChange(e?.value)}
                      value={value && { label: value, value: value }}
                      placeholder="Select category"
                      options={categoryOptions}
                      classNamePrefix="select"
                    />
                  );
                }}
              />
              {errors?.category ? <FormFeedback>Please Select Parameter Category</FormFeedback> : ""}

              {/* <Select
                                options={categoryOptions}
                                placeholder="Select category"
                                onChange={(e) => setCategory(e)}
                                value={category}
                            /> */}
            </div>
            <div className="mb-1">
              <Label className="form-label" htmlFor="login-fname">
                Select Type<span className="text-danger">&#42;</span>
              </Label>

              <Controller
                name="type"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Select
                      type="text"
                      {...register("type", {
                        required: true,
                      })}
                      invalid={errors?.type && true}
                      required
                      onChange={(e) => {
                        onChange(e?.value);
                        setType(e);
                      }}
                      value={value && { label: value, value: value }}
                      placeholder="Select Type"
                      options={typeOptions}
                      classNamePrefix="select"
                    />
                  );
                }}
              />
              {errors?.type ? <FormFeedback>Please Select Parameter Type</FormFeedback> : ""}
              {/* <Select
                                options={typeOptions}
                                placeholder="Select type"
                                onChange={(e) => setType(e)}
                                value={type}
                            /> */}
            </div>
            {type != "" ? (
              <div className="mb-1">
                <Label className="form-label" htmlFor="param-list">
                  Value{" "}
                  {type?.value == "List" && fields?.length === 0 && (
                    <PlusCircle className="cursor-pointer" onClick={(e) => handleAdd(e)} style={{ marginLeft: 5 }} />
                  )}
                </Label>
                <Row>
                  {type?.value == "List" ? (
                    fields?.map((item, index) => {
                      return (
                        <Col key={index} sm="6">
                          <div className="d-flex justify-content-center align-items-center mb-1">
                            <Input
                              type="text"
                              id="param-list"
                              placeholder="list item"
                              value={item?.value}
                              onChange={(e) => {
                                handleChange(e.target.value, index);
                              }}
                            />
                            {fields?.length - 1 == index ? (
                              <PlusCircle
                                className="cursor-pointer"
                                onClick={(e) => handleAdd(e)}
                                style={{ marginLeft: 10 }}
                              />
                            ) : null}
                            {fields?.length > 1 ? (
                              <MinusCircle
                                className="cursor-pointer"
                                onClick={() => handleRemove(index)}
                                style={{ marginLeft: 10 }}
                              />
                            ) : null}
                          </div>
                        </Col>
                      );
                    })
                  ) : (
                    <div className="mb-1">
                      <Input
                        type={type?.value == "String" ? "text" : "number"}
                        id="param-list"
                        placeholder="value"
                        value={value}
                        onChange={(e) => {
                          setValue(e.target.value);
                        }}
                      />
                    </div>
                  )}
                </Row>
              </div>
            ) : null}
          </Form>
        </CommanModal>
      </Card>
    </Fragment>
  );
};
export default Index;
