//library
import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Row, Col, CardTitle, CardText, Form, Label, Input, Button, FormFeedback } from "reactstrap";
import { useMutation, useQuery } from "react-apollo";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import Select from "react-select";
import { selectThemeColors } from "@utils";
//components
import Table from "../../components/Table";
import { shapeTableColumns } from "../../components/Constant"; //
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import CommanModal from "../../components/Modal"; //
import { ConfirmationModal } from "../../components/Alert"; //
import { BASE_URL } from "../../../config";
import { FormatError } from "../../../@core/components/common/FormatError"; //
import { ADD_SHAPE, UPDATE_SHAPE, DELETE_SHAPE } from "./mutation"; //
import { GET_ALL_SHAPES, GET_SHAPE, GET_ALL_CATEGORIES } from "./query"; //
import Header from "../../components/Header"; //
import makeAnimated from "react-select/animated";
import { MinusCircle, PlusCircle } from "react-feather";
import _ from "lodash";
import { digitalOceanURL } from "../../common/common";
// import Bankform from "./bankForm";//

const Index = () => {
  // initial states
  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({ key: "sortOrder", type: 1 });
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [allShapes, setAllShapes] = useState([]);

  const [shapeName, setShapeName] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [shapeImage, setShapeImage] = useState("");
  const [certyType, setCertyType] = useState("");
  const [OrderIndex, setOrderIndex] = useState("");
  const [OldIndex, setOldIndex] = useState("");
  const [Index, setIndex] = useState(false);
  const [isEditing, _isEditing] = useState(false);
  const [catOptions, _catOptions] = useState({});
  const [shapeCategory, _shapeCategory] = useState([]);
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
  const { loading, data, refetch } = useQuery(GET_ALL_SHAPES, {
    variables: {
      page: currentPage + 1,
      limit: limit,
      sort: sort,
      filter: "{}",
      search: searchText,
    },
    fetchPolicy: "cache-and-network",
  });

  const {
    loading: cLoading,
    data: cData,
    refetch: cRefetch,
  } = useQuery(GET_ALL_CATEGORIES, {
    variables: {
      page: 1,
      limit: 1000,
      sort: { key: "createdAt", type: -1 },
      filter: "{}",
      search: "",
    },
    fetchPolicy: "cache-and-network",
  });

  //mutation
  const [addShape] = useMutation(ADD_SHAPE);
  const [updateShape] = useMutation(UPDATE_SHAPE);
  const [deleteShape] = useMutation(DELETE_SHAPE);

  const animatedComponents = makeAnimated();

  const handelShapeCategory = (res) => {
    let arr = [];
    res?.map((d) => arr.push(d?.value));
    _shapeCategory(arr);
  };
  useEffect(() => {
    setLoader(loading);
  }, [loading]);

  useEffect(() => {
    if (cData?.getAllCategories) {
      let arr = [];
      cData?.getAllCategories?.data?.map((d) => {
        arr.push({ value: d?.id, label: d?.name, id: d?.id });
      });
      _catOptions(arr);
    }
  }, [cData]);

  useEffect(() => {
    if (data?.getAllShapes) {
      setLoader(false);
      setAllShapes(data?.getAllShapes);
    }
  }, [data]);


  if (!shapeTableColumns?.find((d) => d?.name === "Active")) {
    shapeTableColumns?.push({
      name: "Active",
      sortable: true,
      minWidth: "150px",
      sortField: "isCommon",
      cell: (row) => (
        <div className="form-check form-switch">
          <Input
            className="custom-control-success"
            type="switch"
            id={row?.id}
            name={row?.id}
            style={{ zIndex: 0 }}
            checked={row?.isCommon}
            onChange={(e) => {
              e.preventDefault();
              updateShape({
                variables: {
                  input: {
                    id: row?.id,
                    isCommon: e.target.checked,
                  },
                },
              })
                .then((response) => {
                  if (response) {
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
      )
    })
  };


  const resetData = () => {
    setShapeName("");
    setDescription("");
    setSortOrder("");
    setShapeImage("");
    setCertyType("");
    _shapeCategory([]);
    setFields([{ value: null }]);
  };

  // function for  open and close model
  const toggleHandler = () => {
    setModal(!modal);
    resetData();
    reset({});
  };
  // function for add bank
  const addShapeData = () => {
    setIndex(true)
    setModal(true);
    _isEditing(false);
    reset({});
    resetData();
  };
  // function for edit bank
  const editShapeData = (data) => {
    let arr = [];
    _isEditing(true);
    setModal(true);
    reset(data);
    setOldIndex(data?.sortOrder)
    setShapeName(data?.shapeName);
    setDescription(data?.description);
    setSortOrder(data?.sortOrder);
    data?.categoryId?.map((d) => arr.push({ value: d?.id, label: d?.name }));
    _shapeCategory(arr);
    const newData = data?.alias?.map((d) => {
      return { value: d };
    });
    setFields(newData);
    setShapeImage(`${digitalOceanURL}${data?.shapeImage}`)
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
      deleteShape({
        variables: {
          deleteShapeId: shapeId,
        },
      })
        .then(async ({ data }) => {
          if (data?.deleteShape) {
            refetch();
            setLoader(false);
            await ConfirmationModal("success", "Deleted!", "Shape has been deleted.", "");
          } else {
            toast.error("Shape not deleted");
            setLoader(false);
          }
        })
        .catch((error) => {
          toast.error(FormatError(error));
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
    let arr = [];
    data?.categoryId?.map((d) => ("id" in d ? arr.push(d?.id) : arr.push(d?.value)));
    data.sortOrder=OrderIndex
    let input = {
      id: data?.id,
      shapeName: data?.shapeName,
      description,
      shapeImage,
      isCertified: false,
      alias: newVal,
      oldIndex:OldIndex,
      sortOrder: parseInt(data?.sortOrder),
      categoryId: arr,
    };

    setLoader(true);
    updateShape({ variables: { input } })
      .then(({ data }) => {
        if (data?.updateShape?.status) {
          toast.success("Shape updated successfully");
          refetch();
          setModal(false);
          setLoader(false);
          // resetData()
          // reset({});
        } else {
          setModal(false);
          setLoader(false);
          toast.warn(data?.updateShape?.message);
        }
      })
      .catch((error) => {
        toast.warn(FormatError(error));
        setLoader(false);
      });
  };
  //function is being called on submit of branchForm
  const AddSubmitHandler = (data) => {
    data.sortOrder=OrderIndex
    if (!Object.values(data).includes(undefined)) {
      let arr = [];

      let newVal = [];
      fields.filter(function (e) {
        if (!_.isEmpty(e.value)) {
          newVal.push(e?.value);
        }
      });
      data?.categoryId?.map((d) => arr.push(d?.value));
      addShape({
        variables: {
          input: {
            shapeName: data?.shapeName,
            description,
            shapeImage: data?.shapeImage,
            isCertified: false,
            sortOrder: parseInt(data?.sortOrder),
            categoryId: shapeCategory,
            alias: newVal,
          },
        },
      })
        .then(({ data }) => {
          if (data?.addShape?.status) {
            refetch();
            resetData();
            setLoader(false);
            toast.success("Shape added successfully");
            setModal(false);
            setIndex(false)
            reset({});
          } else {
            setModal(false);
            setLoader(false);
            toast.warn(data?.addShape?.message);
            // toast.success("Something went wrong!");
          }
        })
        .catch((error) => {
          toast.warn(FormatError(error));
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

  const getBase64 = (e, onChange) => {
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

  return (
    <Fragment>
      <Card className="w-100 h-100">
        {loader && <ComponentSpinner />}
        <CardBody style={{ flex: "unset", height: "inherit" }}>
          <Header
            limit={limit}
            // changeLimit={(e) => changeLimit(e)}
            title={"Shape"}
            addData={() => addShapeData()}
            // SearchHandling={(e) => SearchHandling(e)}
            setLimit={setLimit}
            setSearchText={setSearchText}
            setCurrentPage={setCurrentPage}
          />
          <Table
            columns={shapeTableColumns}
            data={allShapes?.data || []}
            currentPage={currentPage}
            totalRecords={allShapes?.count || 0}
            limit={limit}
            editData={editShapeData}
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
          loading={loader}
          updateId={control._defaultValues?.id ? true : false}
          modalTitle={control._defaultValues?.id ? "Update " : "Add "}
        >
          {/* <Bankform control={control} errors={errors} /> */}
          <Form className="auth-login-form mt-2">
            <div className="mb-1">
              <Label className="form-label" htmlFor="login-fname">
                Shape Name<span className="text-danger">&#42;</span>
              </Label>

              <Controller
                name="shapeName"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      type="text"
                      {...register("shapeName", {
                        required: true,
                      })}
                      invalid={errors?.shapeName && true}
                      required
                      {...field}
                      placeholder="Shape Name"
                    />
                  );
                }}
              />
              {errors.shapeName && <FormFeedback>Shape Name is required</FormFeedback>}

              {/* <Input type='text' id='login-fname' placeholder='Shape Name' value={shapeName} autoFocus onChange={(e) => { setShapeName(e.target.value) }} readOnly={isEditing} /> */}
            </div>
            <div className="mb-1">
              <Label className="form-label" htmlFor="login-lname">
                Description
              </Label>
              <Input
                type="text"
                id="login-lname"
                placeholder="Description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </div>
            <div className="mb-1">
              <Label className="form-label">
                Shape Image<span className="text-danger">&#42;</span>
              </Label>{" "}
              <br />
              <Controller
                name="shapeImage"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => {
                  return (
                    <>
                      <Input
                        type="file"
                        {...register("shapeImage", { required: true })}
                        accept="image/*"
                        invalid={errors?.shapeImage && true}
                        onChange={(e) => {
                          getBase64(e, onChange);
                        }}
                        {...rest}
                      />
                    </>
                  );
                }}
              />
              {errors?.shapeImage && <FormFeedback>Shape Image is required</FormFeedback>}
              {shapeImage != "" ? (
                shapeImage?.includes("base64") ? (
                  <img src={shapeImage} height={100} width={100} alt="shape" className="my-1" />
                ) : (
                  <img src={`${digitalOceanURL}${shapeImage}`} className="my-1" />
                )
              ) : null}
            </div>
            {/* <div className='mb-1'>
                            <label className="login-label" htmlFor="">Is Certified?<span className="text-primary font-weight-bold" > * </span></label>
                            <Select defaultValue={certyType} onChange={(select) => { setCertified(select?.value) }} options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
                        </div> */}
            <div className="mb-1">
              <label className="login-label" htmlFor="">
                Category<span className="text-danger">&#42;</span>
              </label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field: { onChange, value } }) => {
                  return (
                    <Select
                      type="text"
                      {...register("categoryId", {
                        required: true,
                      })}
                      invalid={errors?.categoryId && true}
                      onChange={(e) => {
                        onChange(e && e?.map((d) => ("id" in d ? { label: d?.label, value: d?.id } : d)));
                        handelShapeCategory(e);
                      }}
                      value={value && value?.map((d) => ("id" in d ? { label: d?.name, value: d?.id } : d))}
                      placeholder="Select Category"
                      isClearable={false}
                      closeMenuOnSelect={false}
                      components={animatedComponents}
                      isMulti
                      options={catOptions}
                      className="react-select"
                      classNamePrefix="select"
                      theme={selectThemeColors}
                    />
                  );
                }}
              />
              {errors?.categoryId ? <FormFeedback>Please select at least one shape category</FormFeedback> : ""}
            </div>
            <div className="mb-1">
              <Label className="form-label" htmlFor="sortOrder">
                Sort Order<span className="text-danger">&#42;</span>
              </Label>
             
              <Controller
                name="sortOrder"
                control={control}
                {...register("sortOrder", {})}
                render={({ field: { onChange, value } }) => {
                  setOrderIndex(Index ? allShapes?.count + 1 : value);
                  return (
                    <Input
                      type="number"
                      min="1"
                      disabled={Index || !control?._defaultValues?.id}
                      invalid={errors.sortOrder && true}
                      onChange={(e) => {
                        onChange(e?.target?.value);
                      }}
                      value={Index ? allShapes?.count + 1 : value}
                    />
                  );
                }}
              />
              {errors && errors.sortOrder && <FormFeedback>Sort Order is required</FormFeedback>}
              {/* <Input type='number' id='sortOrder' min={0} placeholder='Sort Order' value={sortOrder} autoFocus onChange={(e) => setSortOrder(e.target.value)} /> */}
            </div>
            <div className="mb-1">
              <Label className="form-label" htmlFor="login-fname">
                Alias{" "}
                {fields?.length === 0 && (
                  <PlusCircle className="cursor-pointer" onClick={(e) => handleAdd(e)} style={{ marginLeft: 5 }} />
                )}
              </Label>
              <Row>
                {fields?.map((item, index) => {
                  return (
                    <Col sm="6">
                      <div className="d-flex justify-content-center align-items-center mb-1">
                        <Input
                          type="text"
                          id="param-list"
                          placeholder="alias name"
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
                })}
              </Row>
              {/* <Input type='text' id='login-fname' placeholder='Shape Name' value={shapeName} autoFocus onChange={(e) => { setShapeName(e.target.value) }} readOnly={isEditing} /> */}
            </div>
          </Form>
        </CommanModal>
      </Card>
    </Fragment>
  );
};
export default Index;
