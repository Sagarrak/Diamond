//library
import React, { Fragment, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  CardTitle,
  CardHeader,
  CardText,
  Form,
  Label,
  Input,
  Button,
  FormFeedback,
} from "reactstrap";
import { useMutation, useQuery } from "react-apollo";
import { toast } from "react-toastify";
import { Controller, useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import Select from "../../components/Select";

//components
import Table from "../../components/Table";
import { exDesignTableColumns } from "../../components/Constant";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import CommanModal from "../../components/Modal";
import { ConfirmationModal } from "../../components/Alert";
import { FormatError } from "../../../@core/components/common/FormatError";
import { ADD_PRODUCT, UPDATE_PRODUCT } from "../Products/mutation";
import { GET_ALL_PRODUCTS, GET_ALL_SHAPE, GET_ALL_CATEGORIES } from "../Products/query";
import { GET_ALL_PARAMETERS } from "../Parameters/query";
import { DELETE_EXCLUSIVE_DESIGN } from "./mutation";

import Header from "../../components/Header";

const Index = () => {
  // initial states
  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({ key: "createdAt", type: -1 });
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [image, setImage] = useState("");
  const [allProducts, setAllProducts] = useState([]);

  const [shapeArr, setShapeArr] = useState([]);
  const [filterData, setFilterData] = useState({});
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState();
  const [discount, setDiscount] = useState();
  const [labComment, setLabComment] = useState("");
  const [certificateNumber, setCertificateNumber] = useState();
  const [certificateURL, setCertificateURL] = useState("");
  const [video, setVideo] = useState("");
  const [impCategory, setImpCategory] = useState();
  const [impData, setImpData] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [_vendor, _setVendor] = useState("");
  const [_status, _setStatus] = useState("");
  const [productDetails, _productDetails] = useState([]);
  const [productCategories, _productCategories] = useState([]);
  const [productName, setProductName] = useState("");
  const [shapeId, setShapeId] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [status, setStatus] = useState("");
  const [type, _setType] = useState("");
  const [location, setLocation] = useState("");

  const StatusOptions = [
    { value: "AVAILABLE", label: "AVAILABLE" },
    { value: "HOLD", label: "HOLD" },
    { value: "IN LAB", label: "IN LAB" },
  ];

  const typeOption = [
    { value: "CVD", label: "CVD" },
    { value: "HPHT", label: "HPHT" },
  ];

  const {
    control,
    reset,
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { loading, data, refetch } = useQuery(GET_ALL_PRODUCTS, {
    variables: {
      page: currentPage + 1,
      limit: limit,
      sort: sort,
      filter: JSON.stringify({ isExclusiveDesign: true }),
      search: searchText,
    },
    fetchPolicy: "network-only",
  });
  //query
  const {
    loading: shapeLoading,
    data: shapeData,
    refetch: shapeRefetch,
  } = useQuery(GET_ALL_SHAPE, {
    variables: {
      page: 1,
      limit: 100,
      sort: { key: "sortOrder", type: 1 },
      filter: "{}",
      search: "",
    },
    fetchPolicy: "cache-and-network",
  });
  // -------- query ------------
  const {
    loading: paramLoading,
    data: paramData,
    refetch: paramRefetch,
  } = useQuery(GET_ALL_PARAMETERS, {
    variables: {
      page: 1,
      limit: 100,
      sort: { key: "createdAt", type: -1 },
      filter: JSON.stringify({ isActive: true }),
      search: "",
    },
  });
  const {
    loading: catLoading,
    data: catData,
    refetch: catRefetch,
  } = useQuery(GET_ALL_CATEGORIES, {
    variables: {
      page: 1,
      limit: 100,
      sort: { key: "sortOrder", type: -1 },
      filter: "{}",
      search: "",
    },
    fetchPolicy: "cache-and-network",
  });

  //mutation
  const [addExclusiveDesign] = useMutation(ADD_PRODUCT);
  const [updateExclusiveDesign] = useMutation(UPDATE_PRODUCT);
  const [deleteExclusiveDesign] = useMutation(DELETE_EXCLUSIVE_DESIGN);
  // const [addProduct] = useMutation(ADD_PRODUCT);

  useEffect(() => {
    setLoader(loading);
  }, [loading]);

  const resetData = () => {
    setProductName("");
    setDescription("");
    setImage("");
    setShapeId("");
    _productDetails([]);
    setDiscount("");
    setTotalPrice("");
    setLabComment("");
    setQuantity("");
    setCertificateNumber("");
    setCertificateURL("");
    setVideo("");
    setStatus("");
    _setType("");
    setLocation("");
  };
  useEffect(async () => {
    if (data?.getAllProducts) {
      setLoader(false);
      await setAllProducts(data?.getAllProducts);
    }
  }, [data]);
  useEffect(() => {
    let newArr = [];
    shapeData?.getAllShapes?.data?.map((res) => {
      let data = {
        label: res?.shapeName,
        value: res?.id,
      };
      newArr.push(data);
    });

    setShapeArr(newArr);
  }, [shapeData]);

  useEffect(() => {
    let newArr = [];
    paramData?.getAllParameter?.data?.map((res) => {
      let data = {
        parameter: "",
        value: "",
        type: "",
      };
      newArr.push(data);
    });
    _productDetails(newArr);
  }, [paramData]);
  useEffect(() => {
    let arr = [];
    if (catData?.getAllCategories) {
      catData?.getAllCategories?.data?.map((d) => arr.push({ label: d?.name, value: d?.id }));
      _productCategories(arr);
    }
  }, [catData]);
  // function for  open and close model
  const toggleHandler = () => {
    setModal(!modal);
    resetData();
    // reset({});
  };
  // function for add bank
  const addShapeData = () => {
    setModal(true);
    reset({});
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

  const editExDesignData = (data) => {
    setModal(true);
    const productData = data?.productDetails.filter((d) => {
      return delete d.__typename;
    });
    reset(data);
    setStatus(data?.status);
    _setType(data?.type);
    setLocation(data?.location);
    _productDetails(productData);
    setCertificateNumber(data?.certificateNumber);
    setCertificateURL(data?.certificateURL);
    setVideo(data?.video);
    setProductName(data?.productName);
    setDescription(data?.description);
    setShapeId({ label: data?.shapeId?.shapeName, value: data?.shapeId?.id });
    setDiscount(data?.discount);
    setTotalPrice(data?.totalPrice);
    setLabComment(data?.labComment);
    setQuantity(data?.quantity);
    // _productCat({ label: data?.categoryId?.name, value: data?.categoryId?.id })
  };

  // function is being called on delete of shape
  const deleteExDesign = async (pId) => {
    let Status = await ConfirmationModal(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, delete it!"
    );
    if (Status) {
      setLoader(true);
      deleteExclusiveDesign({
        variables: {
          deleteExclusiveProductId: pId,
        },
      })
        .then(async ({ data }) => {
          if (data?.deleteExclusiveProduct) {
            refetch();
            setLoader(false);
            await ConfirmationModal("success", "Deleted!", "Design has been deleted.", "");
          } else {
            toast.error("Design not deleted");
            setLoader(false);
          }
        })
        .catch((error) => {
          toast.error(FormatError(error));
          setLoader(false);
        });
    }
  };

  // function is being called on Edit of branchForm
  const EditSubmitHandler = (data) => {
    if (image != "") {
      data.image = image;
    }
    setLoader(true);
    const newProductDetails = productDetails.filter((d) => d.value != "" && d.value != 0);
    updateExclusiveDesign({
      variables: {
        input: {
          id: data?.id,
          productName: data?.productName,
          description,
          certificateNumber,
          certificateURL,
          categoryId: data?.categoryId?.value,
          video,
          image,
          type,
          status,
          location,
          shapeId: data?.shapeId?.value,
          productDetails: newProductDetails,
          discount,
          totalPrice: data?.totalPrice,
          labComment,
          quantity,
        },
      },
    })
      .then(({ data }) => {
        if (data?.updateExclusiveDesign?.status) {
          setModal(false);
          setLoader(false);
          toast.success("Exclusive design updated successfully");
          refetch();
          // resetData()
          reset({});
        } else {
          setModal(false);
          setLoader(false);
          toast.error("Something went wrong");
        }
      })
      .catch((error) => {
        toast.warn(FormatError(error));
        setLoader(false);
      });
  };
  //function is being called on submit of branchForm
  const AddSubmitHandler = (data) => {
    if (!Object.values(data).includes(undefined)) {
      const newProductDetails = productDetails.filter((d) => d.value != "");
      addExclusiveDesign({
        variables: {
          input: {
            productName: data?.productName,
            description,
            image,
            certificateNumber,
            certificateURL,
            categoryId: data?.categoryId?.value,
            video,
            status,
            location,
            type,
            shapeId: data?.shapeId?.value,
            productDetails: newProductDetails,
            discount,
            totalPrice: data?.totalPrice,
            labComment,
            quantity,
            isExclusiveDesign: true,
          },
        },
      })
        .then(({ data }) => {
          if (data?.addExclusiveDesign?.status) {
            setModal(false);
            setLoader(false);
            toast.success("Exclusive design  added successfully");
            refetch();
            resetData();
            // reset({});
          } else {
            setModal(false);
            setLoader(false);
            toast.warn(data?.addExclusiveDesign?.message);
          }
        })
        .catch((error) => {
          toast.warn(FormatError(error.message));
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
      await setImage(result);
      await onChange(result);
    };
  };
  const handleParam = (data, i, name, type) => {
    let values = [...productDetails];
    const ind = values?.findIndex((p) => p.parameter == name);
    if (ind != undefined && ind > 0) {
      values[ind].value = data;
      values[ind].parameter = name;
      values[ind].type = type;
    } else {
      const flag = {
        value: data,
        parameter: name,
        type: type,
      };
      values.push(flag);
    }
    // }
    _productDetails(values);
  };

  return (
    <Fragment>
      <Card className="w-100 h-100">
        {loader && <ComponentSpinner />}
        <CardBody style={{ flex: "unset", height: "inherit" }}>
          <Header
            limit={limit}
            // changeLimit={(e) => changeLimit(e)}
            title={"On Sale Design"}
            addData={() => addShapeData()}
            // SearchHandling={(e) => SearchHandling(e)}
            setLimit={setLimit}
            setSearchText={setSearchText}
            setCurrentPage={setCurrentPage}
          />
          <Table
            columns={exDesignTableColumns}
            data={allProducts?.data || []}
            currentPage={currentPage}
            totalRecords={allProducts?.count || 0}
            limit={limit}
            editData={editExDesignData}
            deleteData={deleteExDesign}
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
          <Row>
            <Col sm="12">
              <Form className="auth-login-form mt-2">
                <Row>
                  <Col sm="6">
                    <div className="mb-1">
                      <Label className="form-label" htmlFor="login-fname">
                        Product Name<span className="text-danger">&#42;</span>
                      </Label>
                      <Controller
                        name="productName"
                        control={control}
                        render={({ field }) => {
                          return (
                            <Input
                              type="text"
                              {...register("productName", {
                                required: true,
                              })}
                              invalid={errors?.productName && true}
                              required
                              {...field}
                              placeholder="Product Name"
                            />
                          );
                        }}
                      />
                      {errors.productName && <FormFeedback>Product Name is required</FormFeedback>}
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mb-1">
                      <Label className="form-label" htmlFor="login-lname">
                        Description
                      </Label>
                      <Input
                        type="text"
                        id="login-lname"
                        placeholder="Description"
                        defaultValue={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mb-1">
                      <Label className="form-label">Select Product Image</Label> <br />
                      <Input
                        type="file"
                        className=""
                        name="profile-picture"
                        onChange={(e) => {
                          getBase64(e);
                        }}
                      />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mb-1">
                      <label className="login-label" htmlFor="">
                        Select Shape<span className="text-danger">&#42;</span>
                      </label>
                      <Controller
                        name="shapeId"
                        control={control}
                        render={({ field: { onChange, value } }) => {
                          return (
                            <Select
                              type="text"
                              {...register("shapeId", {
                                required: true,
                              })}
                              invalid={errors?.shapeId && true}
                              required
                              onChange={(e) => onChange(e)}
                              value={value && ("id" in value ? { label: value?.shapeName, value: value?.id } : value)}
                              placeholder="Select shape"
                              options={shapeArr}
                              classNamePrefix="select"
                            />
                          );
                        }}
                      />
                      {errors?.shapeId ? <FormFeedback>Please Select Product Shape</FormFeedback> : ""}
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mb-1">
                      <Label className="form-label" htmlFor="login-uname">
                        Total Quantity
                      </Label>
                      <Input
                        type="number"
                        id="total_qty"
                        placeholder="Total Quantity"
                        value={quantity}
                        onChange={(e) => {
                          setQuantity(e.target.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mb-1">
                      <Label className="form-label" htmlFor="login-mobile">
                        Discount
                      </Label>
                      <Input
                        type="number"
                        id="login-mobile"
                        placeholder="Discount"
                        value={discount}
                        onChange={(e) => {
                          setDiscount(e.target.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mb-1">
                      <Label className="form-label" htmlFor="login-uname">
                        Total Price<span className="text-danger">&#42;</span>
                      </Label>
                      <Controller
                        name="totalPrice"
                        control={control}
                        render={({ field }) => {
                          return (
                            <Input
                              type="text"
                              {...register("totalPrice", {
                                required: true,
                              })}
                              invalid={errors?.totalPrice && true}
                              required
                              {...field}
                              placeholder="Total Price"
                            />
                          );
                        }}
                      />
                      {errors.totalPrice && <FormFeedback>Price is required</FormFeedback>}
                      {/* <Input type='number' id='login-uname' placeholder='Total Price' value={totalPrice} onChange={(e) => { setTotalPrice(e.target.value) }} /> */}
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mb-1">
                      <Label className="form-label" htmlFor="login-uname">
                        Lab Comment
                      </Label>
                      <Input
                        type="text"
                        id="login-uname"
                        placeholder="Lab Comment"
                        value={labComment}
                        onChange={(e) => {
                          setLabComment(e.target.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mb-1">
                      <label className="login-label" htmlFor="">
                        Product Category<span className="text-danger">&#42;</span>
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
                              onChange={(e) => {
                                onChange(e);
                              }}
                              value={value && ("id" in value ? { label: value?.name, value: value?.id } : value)}
                              invalid={errors?.categoryId && true}
                              placeholder="Select category"
                              options={productCategories}
                              classNamePrefix="select"
                            />
                          );
                        }}
                      />
                      {errors?.categoryId ? <FormFeedback>Please Select Product Category</FormFeedback> : ""}
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mb-1">
                      <Label className="form-label" htmlFor="cert-no">
                        Certificate Number
                      </Label>
                      <Input
                        type="text"
                        id="cert-no"
                        placeholder="Certificate Number"
                        value={certificateNumber}
                        onChange={(e) => {
                          setCertificateNumber(e.target.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mb-1">
                      <Label className="form-label" htmlFor="certificateURL">
                        Certificate Link
                      </Label>
                      <Input
                        type="text"
                        id="certificateURL"
                        placeholder="Certificate Link"
                        value={certificateURL}
                        onChange={(e) => {
                          setCertificateURL(e.target.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mb-1">
                      <Label className="form-label" htmlFor="link-video">
                        Video Link
                      </Label>
                      <Input
                        type="text"
                        id="link-video"
                        placeholder="Video Link"
                        value={video}
                        onChange={(e) => {
                          setVideo(e.target.value);
                        }}
                      />
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="mb-1">
                      <Label htmlFor="role-select">Type</Label>
                      <Select
                        isClearable={true}
                        options={typeOption}
                        placeholder="Select type"
                        onChange={(e) => _setType(e?.value)}
                        value={typeOption?.find((d) => d?.label === type)}
                      />
                    </div>
                  </Col>
                  <Col sm="6">
                    <Label htmlFor="role-select">Status</Label>
                    <Select
                      isClearable={true}
                      options={StatusOptions}
                      placeholder="Select status"
                      onChange={(e) => {
                        setStatus(e?.value);
                      }}
                      value={StatusOptions?.find((d) => d?.label === status)}
                    />
                  </Col>
                  <Col sm="6">
                    <div className="mb-1">
                      <Label className="form-label" htmlFor="link-video">
                        Location
                      </Label>
                      <Input
                        type="text"
                        id="location"
                        placeholder="location"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                        }}
                      />
                    </div>
                  </Col>

                  {/* <---------> Adding Dynamic Fields <---------> */}
                  {paramData?.getAllParameter?.data?.map((data, index) => {
                    const newData = productDetails.filter((a) => data.paramName == a.parameter);

                    if (data?.type === "String") {
                      return (
                        <Col sm="6">
                          <div className="mb-1" key={index}>
                            <Label className="form-label">{data?.paramName}</Label>
                            <Input
                              type="text"
                              placeholder={data?.type}
                              onChange={(e) => handleParam(e.target.value, index, data.paramName, data?.type)}
                              defaultValue={newData[0]?.value ? newData[0]?.value : ""}
                            />
                          </div>
                        </Col>
                      );
                    } else if (data?.type === "Number") {
                      return (
                        <Col sm="6">
                          <div className="mb-1" key={index}>
                            <Label className="form-label">{data.paramName} </Label>
                            <Input
                              type="number"
                              placeholder={data?.type}
                              onChange={(e) => handleParam(e.target.value, index, data.paramName, data?.type)}
                              defaultValue={newData[0]?.value ? newData[0]?.value : 0}
                            />
                          </div>
                        </Col>
                      );
                    } else {
                      let optionData = [];
                      data?.value?.map((res) => {
                        let val = {
                          label: res,
                          value: res,
                        };
                        optionData.push(val);
                      });
                      return (
                        <Col sm="6">
                          <div className="mb-1" key={index}>
                            <Label className="form-label">{data?.paramName}</Label>
                            <Select
                              options={optionData}
                              placeholder={`Select ${data?.paramName}`}
                              onChange={(e) => handleParam(e?.value, index, data?.paramName, data?.type)}
                              value={
                                newData.length > 0
                                  ? { label: newData[0]?.value, value: newData[0]?.value }
                                  : { label: "select", value: "" }
                              }
                            />
                          </div>
                        </Col>
                      );
                    }
                  })}
                </Row>
              </Form>
            </Col>
          </Row>
        </CommanModal>
      </Card>
    </Fragment>
  );
};
export default Index;
