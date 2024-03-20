// library
import React, { useState, useEffect, Fragment } from 'react';
import { Card, CardBody, Form, Label, FormFeedback, Input } from 'reactstrap';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation } from 'react-apollo';
import _ from 'lodash';
import axios from 'axios';


// components
import Header from "../../components/Header";
import Table from "../../components/Table";
import CommonModal from "../../components/Modal";
import { GET_ALL_CATEGORIES } from "./query";
import { ADD_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from "./mutation";
import { catTableColumns } from '../../components/Constant';
import { FormatError } from '../../../@core/components/common/FormatError';
import { ConfirmationModal } from '../../components/Alert';
import { BASE_URL } from '../../../config';
import ComponentSpinner from '../../../@core/components/spinner/Loading-spinner';
import { digitalOceanURL } from '../../common/common';
import { GENERATE_PRE_SIGN } from '../../common/commonQuery'


const Index = () => {

  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [isEditing, _isEditing] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [hoverImage, setHoverImage] = useState("");
  const [allAdd, setAllAdd] = useState([]);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileImage, setMobileImage] = useState("");
  const [sort, setSort] = useState({ key: "sortOrder", type: 1 });
  const [catOptions, _catOptions] = useState({});

  const { loading, data, error, refetch } = useQuery(GET_ALL_CATEGORIES, {
    variables: {
      page: 1,
      limit: 1000,
      sort: { key: "createdAt", type: -1 },
      filter: "{}",
      search: "",
    },
    fetchPolicy: "cache-and-network",
  });

  const [addCategory] = useMutation(ADD_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);
  const [generatePresignedURL] = useMutation(GENERATE_PRE_SIGN)

  const {
    control,
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  useEffect(() => {
    if (data?.getAllCategories?.data?.length > 0) {
      setLoader(false);
      setAllAdd(data?.getAllCategories?.data);
      let arr = [];
      data?.getAllCategories?.data?.map((d) => {
        arr.push({ id: d?.id, name: d?.name, categoryImage: d?.categoryImage, hoverImage: d?.hoverImage, mobileImage: d?.mobileImage })
      });
      _catOptions(arr);
    }
  }, [data]);

  // function for open and close model
  const toggleHandler = () => {
    setModal(!modal);
    resetData();
    reset({});
  };

  const resetData = () => {
    setName("");
    setImage("");
    setHoverImage("");
    setMobileImage("");
  };

  // function for add Cat. Data
  const addCatData = () => {
    setModal(true);
    reset({});
    resetData();
    _isEditing(false);
  };

  // function is being called on change page
  const handlePagination = (page) => {
    setLoader(false);
    setCurrentPage(page?.selected);
  };

  const handleSort = (e) => {
    setLoader(true);
    const type = sort.type == -1 ? 1 : -1;
    setSort({ key: e?.sortField, type });
  };

  // function for edit Adv. content
  const editCatData = (data) => {
    _isEditing(true);
    setModal(true);
    setName(data?.name);
    reset(data);
    setImage(data?.categoryImage);
    setHoverImage(data?.hoverImage);
    setMobileImage(data?.mobileImage);
  };

  const deleteCat = async (catId) => {

    let Status = await ConfirmationModal(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, delete it!"
    );
    if (Status) {
      deleteCategory({
        variables: {
          deleteCategoryId: catId,
        }
      })
        .then(async ({ data }) => {
          if (data?.deleteCategory) {
            refetch();
            setLoader(false);
            await ConfirmationModal("success", "Deleted!", "Category has been deleted.", "");
          } else {
            toast.error("Category not deleted");
            setLoader(false);
          }
        })
        .catch((error) => {
          toast.error(FormatError(error));
          setLoader(false);
        });
    }
  };
  
  //function is being called on submit of branchForm
  const AddSubmitHandler = (data) => {
    setModal(false);
    addCategory({
      variables: {
        input: {
          name: data?.name,
          categoryImage: data?.image,
          hoverImage: data?.hoverImage,
          mobileImage: data?.mobileImage,
          sortOrder: parseInt(data?.sortOrder),
        },
      }
    })
      .then(response => {
        if (response) {
          refetch();
          setLoader(false);
          setModal(false);
          toast.success("Data add successfully");
        }
      })
      .catch(error => {
        toast.warn("Data not added");
      })
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


  const getBase64Hover = (e, onChange) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      let result = await reader.result;
      await setHoverImage(result);
      await onChange(result);
    };
  };
  const getBase64Mobile = (e, onChange) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      let result = await reader.result;
      await setMobileImage(result);
      await onChange(result);
    };
  };
 
  const EditSubmitHandler = (data) => {    
        let input = {
          id: data?.id,
          name: data?.name,
          categoryImage: data?.image,
          hoverImage: data?.hoverImage,
          mobileImage: data?.mobileImage,
          sortOrder: parseInt(data?.sortOrder),
        };
        setLoader(true);
        updateCategory({
          variables: {
            input
          }
        })
          .then(response => {
            if (response) {
              refetch();
              setLoader(false);
              setModal(false);
              toast.success("Category has been updated successfully")
            }
          })
          .catch(error => {
            toast.warn(FormatError(error));
            setLoader(false);
          })

  };

  return (
    <Fragment>
      <Card className="w-100 h-100">
        {loader && <ComponentSpinner />}
        <CardBody style={{ flex: "unset", height: "inherit" }}>
          <h2 style={{ textAlign: "center" }} > Category Page </h2>

          <Header
            limit={limit}
            addData={() => addCatData()}
            title="Category"
            setLimit={setLimit}
            setCurrentPage={setCurrentPage}
          />

          <Table
            limit={limit}
            columns={catTableColumns}
            data={allAdd}
            currentPage={currentPage}
            handlePagination={handlePagination}
            totalRecords={allAdd?.count || 0}
            onSort={handleSort}
            editData={editCatData}
            deleteData={deleteCat}
          />
        </CardBody>

        <CommonModal
          modal={modal}
          setModal={setModal}
          loading={loader}
          title="Category"
          toggleHandler={toggleHandler}
          updateId={control._defaultValues?.id ? true : false}
          modalTitle={control._defaultValues?.id ? "Update " : "Add "}
          addButtonHandler={handleSubmit(AddSubmitHandler)}
          updateButtonHandler={handleSubmit(EditSubmitHandler)}
        >

          <Form className="auth-login-form mt-2">
            <div className='mb-1'>

              <Label className='form-position' htmlFor='position' >
                Category Name <span className="text-danger">&#42;</span>
              </Label>

              <Controller
                name='name'
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      type="text"
                      {...register("name",
                        {
                          required: true
                        })
                      }
                      invalid={errors?.name && true}
                      required
                      {...field}
                      placeholder="Category Name"
                    />
                  );
                }}
              />
              {errors.name?.message && <FormFeedback>Position is required</FormFeedback>}
            </div>

            <div className='d-flex align-items-center'>
              <div className='col-lg-12 input-box mb-lg-0 mb-2'>
                <Label className='image' htmlFor='image' >
                  Category Image <span className="text-danger">&#42;</span>
                </Label> {" "}

                <Controller
                  name='image'
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => {
                    return (
                      <Input
                        type="file"
                        accept="image/*"
                        {...register("image", { required: control._defaultValues?.id ? false : true })}
                        invalid={errors?.image && true}
                        onChange={(e) => {
                          getBase64(e, onChange);
                        }}
                        {...rest}
                      />
                    )
                  }}
                />
                {errors.image?.message && <FormFeedback>Image is required</FormFeedback>}
                {image != "" ? (
                  image?.includes("base64") ? (
                    <img src={image} height={100} width={100} alt="categoryimage" className="my-1" />
                  ) : (
                    <img src={`${digitalOceanURL}${image}`} className="my-1" width={100} height={100} />
                  )
                ) : null}
              </div>
            </div>
            <br></br>

            <div className='d-flex align-items-center'>
              <div className='col-lg-12 input-box mb-lg-0 mb-2'>
                <Label className='form-hoverimage' htmlFor='hoverImage' >
                  Category Hover Image <span className="text-danger">&#42;</span>
                </Label> {" "}

                <Controller
                  name='hoverImage'
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => {
                    return (
                      <Input
                        type="file"
                        accept="image/*"
                        {...register("hoverImage", { required: control._defaultValues?.id ? false : true })}
                        invalid={errors?.hoverImage && true}
                        onChange={(e) => {
                          getBase64Hover(e, onChange);
                        }}
                        {...rest}
                      />
                    )
                  }}
                />
                {errors.hoverImage?.message && <FormFeedback>Image is required</FormFeedback>}
                {hoverImage != "" ? (
                  hoverImage?.includes("base64") ? (
                    <img src={hoverImage} height={100} width={100} alt="hoverimage" className="my-1" />
                  ) : (
                    <img src={`${digitalOceanURL}${hoverImage}`} className="my-1" width={100} height={100} />
                  )
                ) : null}
              </div>
            </div>
            <div className='d-flex align-items-center'>
              <div className='col-lg-12 input-box mb-lg-0 mb-2'>
                <Label className='form-hoverimage' htmlFor='hoverImage' >
                  Mobile Image <span className="text-danger">&#42;</span>
                </Label> {" "}

                <Controller
                  name='mobileImage'
                  control={control}
                  render={({ field: { onChange, value, ...rest } }) => {
                    return (
                      <Input
                        type="file"
                        accept="image/*"
                        {...register("mobileImage", { required: control._defaultValues?.id ? false : true })}
                        invalid={errors?.mobileImage && true}
                        onChange={(e) => {
                          getBase64Mobile(e, onChange);
                        }}
                        {...rest}
                      />
                    )
                  }}
                />
                {errors.mobileImage?.message && <FormFeedback>Image is required</FormFeedback>}
                {mobileImage != "" ? (
                  mobileImage?.includes("base64") ? (
                    <img src={mobileImage} height={100} width={100} alt="mobileImage" className="my-1" />
                  ) : (
                    <img src={`${digitalOceanURL}${mobileImage}`} className="my-1" width={100} height={100} />
                  )
                ) : null}
              </div>
            </div>
          </Form>
        </CommonModal>
      </Card>
    </Fragment>
  )
}

export default Index;