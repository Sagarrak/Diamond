import React, { Fragment, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import ComponentSpinner from "../../../../@core/components/spinner/Loading-spinner";
import Header from "../../../components/Header";
import Table from "../../../components/Table";
import Select from "../../../components/Select";
import CommanModal from "../../../components/Modal";
import {
  jewelleryDiamondShapecolumn,
  jewelleryDiamondsettingcolumn,
} from "../../../components/Constant";
import { MinusCircle, PlusCircle, X } from "react-feather";
import { useMutation, useQuery } from "react-apollo";
import { GET_ALL_METAL } from "../metal/query";
import { JEWELLERY_CATEGORIES } from "../admin/query";
import { GET_ALL_STYLE_BY_CATEGORY } from "../product/query";
import {
  JEWELLERY_DIAMOND_WITHOUT_PAGINATION,
  GET_ALL_JEWELLERY_SETTINGS,
} from "./query";
import MetalDropDown from "../../../components/MetalDropDown/MetalDropDown";
import {
  CREATE_JEWELLERY_SETTING,
  UPDATE_JEWELLERY_SETTINGS,
  DELETE_JEWELLERY_SETTINGS,
} from "./mutation";
import SettingFormBasic from "./Form/SettingFormBasic";
import SettingFormMetalDetails from "./Form/SettingFormMetalDetails";
import { toast } from "react-toastify";
import { ConfirmationModal } from "../../../components/Alert";
import { isValidDate } from "@fullcalendar/core";
import HandRingFilter from "../../HandRingFilter/HandRingFilter";
import Gold from "../../../components/MetalDropDown/Images/Gold.png";
import Silver from "../../../components/MetalDropDown/Images/Silver.png";
import Rose from "../../../components/MetalDropDown/Images/Rose.png";
import Platinum from "../../../components/MetalDropDown/Images/Platinum.png";



function index() {
  const [loader, setLoader] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({ key: "createdAt", type: -1 });
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [modal, setModal] = useState(false);
  const [metalArray, setmetalArray] = useState([]);
  const [dynamicFields, setDynamicFields] = useState([]);
  console.log("🚀 ~ file: index.js:65 ~ index ~ dynamicFields:", dynamicFields)
  const [diamondDetailsArray, setdiamondDetailsArray] = useState([]);
  const [metalOption, setmetalOption] = useState([]);
  const [ImageArray, setImageArray] = useState([]);
  const [alljewelleryData, setAllJewellryData] = useState([]);
  const [diamondImageArray, setdiamondImageArray] = useState([]);
  const [metal, setMetal] = useState();
  const [price, setPrice] = useState();
  const [category, setCategory] = useState();

  const [diamond, setDiamond] = useState();
  const [categoryOption, setCategoryOptions] = useState([]);
  const [shapeDiamondOption, setShapeDiamondOptions] = useState([]);
  const [categoryStyleOption, setcategoryStyleOption] = useState([]);
  const [styleId, setStyleId] = useState("");
  const [pageType, setPageType] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [errorss, setErrorss] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);


  const [CreateJewelrySetting] = useMutation(CREATE_JEWELLERY_SETTING);
  const [UpdateJewelrySetting] = useMutation(UPDATE_JEWELLERY_SETTINGS);
  const [DeleteJewelrySetting] = useMutation(DELETE_JEWELLERY_SETTINGS);

  const { data, loading, refetch } = useQuery(GET_ALL_JEWELLERY_SETTINGS, {
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
    data: categoryies,
    loading: categoriesLoading,
    refetch: categoryRefetch,
  } = useQuery(JEWELLERY_CATEGORIES, {
    fetchPolicy: "cache-and-network",
  });

  const {
    data: jewelleryShape,
    loading: jewelleryLoading,
    refetch: jewelleryRefetch,
  } = useQuery(JEWELLERY_DIAMOND_WITHOUT_PAGINATION, {
    fetchPolicy: "cache-and-network",
  });

  const {
    data: styleData,
    loading: styleloading,
    refetch: stylerefetch,
  } = useQuery(GET_ALL_STYLE_BY_CATEGORY, {
    variables: {
      getAllStyleByCategoryId: category?.value,
    },
    fetchPolicy: "cache-and-network",
  });
  const {
    control,
    reset,
    setError,
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onChange" });


  useEffect(() => {
    if (data?.getAllJewelrySettings) {
      setAllJewellryData(data?.getAllJewelrySettings);
    }
  }, [data]);
  
  useEffect(() => {
    if (styleData?.getAllStyleByCategory) {
      const data = styleData?.getAllStyleByCategory?.map((d) => {
        return {
          value: d?.id,
          label: d?.styleName,
        };
      });
      setcategoryStyleOption(data);
    }
  }, [styleData, category]);

  useEffect(() => {
    if (jewelleryShape?.getAllJewelryShapesWithoutPagination) {
      const shapeName =
        jewelleryShape?.getAllJewelryShapesWithoutPagination?.map((d) => {
          return {
            value: d?.id,
            label: d?.shapeName,
          };
        });
      setShapeDiamondOptions(shapeName);
    }
  }, [jewelleryShape]);

  useEffect(() => {
    if (categoryies?.jewelryCategoriesWithoutPaginations) {
      const data = categoryies?.jewelryCategoriesWithoutPaginations?.map(
        (d) => {
          return {
            value: d?.id,
            label: d?.name,
          };
        }
      );
      setCategoryOptions(data);
    }
  }, [categoryies]);

  const addJewellerySettings = () => {
    setModal(true);
    setIsEdit(false);
    reset({});
  };
 
  const MetalOption = ({ img, title }) => {
    return (
      <div className="d-flex align-items-center" style={{ padding: "4px 5px" }}>
        <img className="me-1" src={img} height="30px" width="30px" />
        <span>{title}</span>{" "}
      </div>
    );
  };
  const options = [
    { value: "GOLD", label: <MetalOption img={Gold} title="Gold" /> },
    {
      value: "WHITE_GOLD",
      label: <MetalOption img={Silver} title="White Gold" />,
    },
    { value: "ROSE_GOLD", label: <MetalOption img={Rose} title="Rose Gold" /> },
    {
      value: "PLATINUM",
      label: <MetalOption img={Platinum} title="Platinum" />,
    },
  ];
  const [metalOptions, setMetalOptions] = useState(options);


  if (!jewelleryDiamondsettingcolumn?.find((d) => d?.name === "Active")) {
    jewelleryDiamondsettingcolumn.push({
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
              UpdateJewelrySetting({
                variables: {
                  input: {
                    id: row?.id,
                    isActive: e.target.checked,
                  },
                },
              })
                .then((response) => {
                  if (response?.data?.updateJewelrySetting) {
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

  const EditSubmitHandler = (data) => { };
  const AddSubmitHandler = (data) => {
   
    CreateJewelrySetting({
      variables: {
        input: {
          name: data?.name,
          width: data?.width,
          length: data?.length,
          categoryId: data?.categoryId,
          styleId: data?.styleId,
          metals: dynamicFields,
        },
      },
    })
      .then(({ data }) => {
        if (data?.createJewelrySetting) {
          setModal(false);
          toast.success("Jewellery setting  added successfully");
          refetch();
          resetData();
          reset({});
          setLoader(false);
        } else {
          setModal(false);
          setLoader(false);
          toast.warn("Jewellery not added");
          reset({});
          resetData();
        }
      })
      .catch((error) => {
        // toast.warn(FormatError(error));
        setLoader(false);
      });
  };
  const toggleHandler = () => {
    setModal(!modal);
    resetData();
    reset({});
  };
  
  const getBase64 = async (e, onChange, index, name) => {
    e.preventDefault();
    let reader = new FileReader();
    let files = e.target.files; // Access multiple selected files
    let imageArray = [];

    for (let i = 0; i < files.length; i++) {
      reader.readAsDataURL(files[i]);

      // Wrap the reader.onloadend in a Promise to ensure sequential processing
      await new Promise((resolve, reject) => {
        reader.onloadend = async () => {
          let result = await reader.result;
          imageArray.push(result);
          resolve();
        };
      });
    }
    if (name === "metalName") {
      setImageArray(imageArray);
      handleMetal(imageArray, index, "images");
    } else if (name === "diamondImage") {
      setdiamondImageArray(imageArray);
      handleDiamond(imageArray, index, "images");
    }
    await onChange(imageArray);
  };
  const editJewellerySetting = (data) => {
    const metalData = data?.metals;
    setCategory({ value: data?.categoryId?.id });
    setModal(true);
    setIsEdit(true);
    setDynamicFields(metalData);
    const selectoption = metalData?.map((metal) => {
      return metalOptions?.find((d) => d?.value === metal?.name)
    })

    setSelectedOptions(selectoption)

    reset(data);
    // resetData();
  };
  const handleSort = (e) => {
    setLoader(true);
    const type = sort.type == -1 ? 1 : -1;
    setSort({ key: e?.sortField, type });
  };

  const handlePagination = (page) => {
    setLoader(true);
    setCurrentPage(page?.selected);
  };
  const resetData = () => {
    setDynamicFields([]);
    // setSelectedOptions([])
    // setMetalOptions([])
  };
 
  const handleMetal = (e, index, name) => {
    if (name === "images") {
      getBase64(e, index, "images");
    }
    metalArray[index] = { ...metalArray[index], [name]: e };
    setmetalArray([...metalArray]);
  };

  const handleDiamond = (e, index, name) => {
    // diamondDetailsArray[index] = [...diamondDetailsArray];
    if (name === "images") {
      getBase64(e, index, "images");
    }
    diamondDetailsArray[index] = { ...diamondDetailsArray[index], [name]: e };
    setdiamondDetailsArray([...diamondDetailsArray]);
  };
  const deleteJewellerySettings = async (id) => {
    let Status = await ConfirmationModal(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, delete it!"
    );
    if (Status) {
      setLoader(true);
      DeleteJewelrySetting({
        variables: {
          deleteJewelrySettingId: id,
        },
      })
        .then(async ({ data }) => {
          if (data?.deleteJewelrySetting) {
            refetch();
            setLoader(false);
            await ConfirmationModal(
              "success",
              "Deleted!",
              "Jewellery setting has been deleted.",
              ""
            );
          } else {
            toast.error("Jewellery settings not deleted");
            setLoader(false);
          }
        })
        .catch((error) => {
          // toast.error(FormatError(error));
          setLoader(false);
        });
    }
  };
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  const managePageType = (type) => {
    if (type === "back") {
      setPageType(pageType - 1);
    }
    if (type === "next") {
      if (Object.keys(errors).length === 0) {
        trigger();
      } else {
        setPageType(pageType + 1);
      }
    }
  };
  const handleDeleteImage = (index) => {
    const values = [...ImageArray];
    values.splice(index, 1);
    setImageArray(values);
  };
  const handleDiamondDeleteImage = (index) => {
    const values = [...diamondImageArray];
    values.splice(index, 1);
    setdiamondImageArray(values);
  };
  const handleAdd = () => {
    const values = [...metalArray];
    values.push(null);
    setmetalArray(values);
    setIsEdit(false);
  };
  const handleAddDiamond = () => {
    const values = [...diamondDetailsArray];
    values.push({ diamondId: "", images: [] });
    setdiamondDetailsArray(values);
  };
  const handleRemove = (i) => {
    const values = [...metalArray];
    values.splice(i, 1);
    setmetalArray(values);
  };
  const handleRemoveDiamond = (i) => {
    const values = [...diamondDetailsArray];
    values.splice(i, 1);
    setdiamondDetailsArray(values);
  };
  return (
    <Fragment>
      <Card className="w-100 h-100">
        {loader && <ComponentSpinner />}
        <CardBody style={{ flex: "unset", height: "inherit" }}>
          <Header
            limit={limit}
            title={"Jewellery Settings"}
            setLimit={setLimit}
            setSearchText={setSearchText}
            setCurrentPage={setCurrentPage}
            addData={() => addJewellerySettings()}
          />
          <Table
            columns={jewelleryDiamondsettingcolumn}
            data={alljewelleryData?.data || []}
            currentPage={currentPage}
            totalRecords={alljewelleryData?.count || 0}
            limit={limit}
            deleteData={deleteJewellerySettings}
            editData={editJewellerySetting}
            onSort={handleSort}
            handlePagination={handlePagination}
            modal={modal}
            setModal={setModal}
          />
        </CardBody>
        <Modal
          isOpen={modal}
          toggle={() => toggleHandler()}
          backdrop="static"
          className={"modal-dialog-centered modal-lg"}
        >
          <ModalHeader toggle={() => toggleHandler()}>
            {isEdit ? " Update your Product" : "Add Your Product Here"}
          </ModalHeader>
          <ModalBody>
            <Form className="auth-login-form mt-2">
              {/* <SettingFormBasic
                register={register}
                errors={errors}
                control={control}
                category={category}
                setCategory={setCategory}
                className={pageType !== 1 ? "d-none" : ""}
              /> */}
              <HandRingFilter
                register={register}
                errors={errors}
                control={control}
                category={category}
                setCategory={setCategory}
                dynamicFields={dynamicFields}
                setDynamicFields={setDynamicFields}
                isEdit={isEdit}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                metalOptions={metalOptions}
                setMetalOptions={setMetalOptions}
                options={options}
              />

              {/* 
              <SettingFormMetalDetails
                dynamicFields={dynamicFields}
                setDynamicFields={setDynamicFields}
                register={register}
                errors={errors}
                control={control}
                isEdit={isEdit}
                validateMetals={validateMetals}
                setErrors={setErrorss}
                errorss={errorss}
                className={pageType !== 2 ? "d-none" : ""}
              /> */}
              <div className="d-flex justify-content-end">
                {isEdit ? (
                  <Button
                    type="submit"
                    color="primary"
                    onClick={handleSubmit(EditSubmitHandler)}
                  >
                    Update
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    color="primary"
                    onClick={handleSubmit(AddSubmitHandler)}
                  >
                    Save
                  </Button>
                )}

              </div>

            </Form>
          </ModalBody>
        </Modal>
      </Card>
    </Fragment>
  );
}

export default index;
