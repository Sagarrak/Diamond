// library
import React, { useState, useEffect, Fragment } from 'react';
import { Card, CardBody, Form, FormFeedback, Label, Input } from "reactstrap";
import { useMutation, useQuery } from "react-apollo";
import { useForm, Controller } from 'react-hook-form';
import _ from "lodash";

// componants
import { GET_HOME_PAGE_CONTENT } from "./query";
import { ADD_HOME_PAGE_CONTENT, UPDATE_HOME_PAGE_CONTENT, DELETE_HOME_PAGE_CONTENT } from "./mutation";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import Header from "../../components/Header";
import Table from "../../components/Table";
import { homePageContentColumns } from "../../components/Constant/index";
import CommonModal from "../../components/Modal";
import { ConfirmationModal } from '../../components/Alert';
import { toast } from 'react-toastify';
import { FormatError } from "../../../@core/components/common/FormatError";
import { BASE_URL } from '../../../config';
import { digitalOceanURL } from '../../common/common';



const Index = () => {

  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isEditing, setIsEditing] = useState(false);
  const [allData, setAllData] = useState([]);
  const [leftImage, setLeftImage] = useState("");
  const [rightImage, setRightImage] = useState("");
  const [header, setHeader] = useState("");
  const [content, setContent] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [buttonLink, setButtonLink] = useState("");

  const {
    control,
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const { data, refetch } = useQuery(GET_HOME_PAGE_CONTENT, { fetchPolicy: "cache-and-network" });

  const [addHomepageContent] = useMutation(ADD_HOME_PAGE_CONTENT);
  const [updateHomepageContent] = useMutation(UPDATE_HOME_PAGE_CONTENT);
  const [deleteHomepageContent] = useMutation(DELETE_HOME_PAGE_CONTENT);

  useEffect(() => {
    if (data?.getHomepageContent) {
      setLoader(false);
      let array = new Array(data?.getHomepageContent);
      let arr = [];
      array?.map((d) => {
        arr.push({ id: d?.id, header: d?.header, leftImage: d?.leftImage, rightImage: d?.rightImage, content: d?.content, buttonText: d?.buttonText, buttonLink: d?.buttonLink });
      })
      setAllData(arr);
    }
  }, [data]);


  // function is being called on change page
  const handlePagination = (page) => {
    setLoader(true);
    setCurrentPage(page?.selected);
  };

  // function is being called on close the modal
  const toggleHandler = () => {
    setModal(!modal);
    resetData();
    reset({});
  };

  // function is being called on reset data
  const resetData = () => {
    setButtonLink("");
    setButtonText("");
    setContent("");
    setLeftImage("");
    setRightImage("");
    setHeader("");
  };

  // function is being called on Add Home Content
  const addHomeData = () => {
    setModal(true);
    setIsEditing(false);
    reset({});
    resetData();
  };

  // function is being called on edit Home content Data
  const editHomePageContent = (data) => {
    setModal(true);
    setIsEditing(true);
    reset(data);
    setHeader(data?.header);
    setButtonText(data?.buttonText);
    setButtonLink(data?.buttonLink);
    setLeftImage(data?.leftImage);
    setRightImage(data?.rightImage);
    setContent(data?.content);
  };

  // function is being called on to convert image to base 64
  const getBase64 = (e, onChange) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      let result = await reader.result;
      await setLeftImage(result);
      await onChange(result);
    };
  };

  // function is being called on to convert image to base 64
  const getBase64RightImage = (e, onChange) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      let result = await reader.result;
      await setRightImage(result);
      await onChange(result);
    };
  };

  // function is being called on delete data
  const deleteHomePageContent = async (ConId) => {
    let Status = await ConfirmationModal(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, delete it!"
    );
    if (Status) {
      deleteHomepageContent({
        variables: {
          deleteHomepageContentId: ConId,
        }
      })
        .then(async ({ data }) => {
          if (data?.deleteHomepageContent) {
            refetch();
            setLoader(true);
            await ConfirmationModal("success", "Deleted", "Content has been deleted");
          }
        })
        .catch((error) => {
          toast.error(FormatError(error));
          setLoader(false);
        });
    }
  };

  // function is being called on Add Data
  const AddSubmitHandler = (data) => {

    let input = {
      header: data?.header,
      content: data?.content,
      buttonLink: data?.buttonLink,
      buttonText: data?.buttonText,
      leftImage: data?.leftImage,
      rightImage: data?.rightImage,
    };

    addHomepageContent({ variables: { input } })
      .then(response => {
        if (response) {
          refetch();
          setModal(false);
          toast.success("Content add successfully")
        }
        else {
          setModal(false);
          setLoader(false);
        }
      }).catch((error) => {
        toast.error(FormatError(error));
        setLoader(false);
      })
  };

  // function is being called on to submit update data
  const EditSubmitHandler = (data) => {
    let input = {
      id: data?.id,
      header: data?.header,
      content: data?.content,
      buttonLink: data?.buttonLink,
      buttonText: data?.buttonText,
      leftImage: data?.leftImage,
      rightImage: data?.rightImage,
    }
    setLoader(true);
    updateHomepageContent({ variables: { input } })
      .then(response => {
        if (response) {
          refetch();
          setModal(false);
          setLoader(false);
          toast.success("Content updated successfully");
        } else {
          setModal(false);
          setLoader(false);
        }
      }).catch((error) => {
        toast.warn(FormatError(error));
        setLoader(false);
      })
  };

  return (  
    <Fragment>
      <Card className="w-100 h-100" >
        {loader && <ComponentSpinner />}
        <CardBody style={{ flex: "unset", height: "inherit" }} >
          <h2 style={{ textAlign: "center" }} > Content of Home page. </h2>

          <Header
            limit={limit}
            addData={() => addHomeData()}
            setLimit={setLimit}
            title="Home Page Content"
            setCurrentPage={setCurrentPage}
          />

          <Table
            limit={limit}
            columns={homePageContentColumns}
            data={allData}
            currentPage={currentPage}
            handlePagination={handlePagination}
            totalRecords={allData}
            editData={editHomePageContent}
            deleteData={deleteHomePageContent}
          />

        </CardBody>

        <CommonModal
          modal={modal}
          setModal={setModal}
          toggleHandler={toggleHandler}
          loading={loader}
          updateId={control._defaultValues?.id ? true : false}
          modalTitle={control._defaultValues?.id ? "Update " : "Add "}
          title="Home Content"
          addButtonHandler={handleSubmit(AddSubmitHandler)}
          updateButtonHandler={handleSubmit(EditSubmitHandler)}
        >

          <Form className='auth-login-form mt-2' onSubmit={handleSubmit(AddSubmitHandler)}>

            <div className="mb-1" >
              <Label className='form-header' htmlFor='header' style={{ fontSize: "15px" }}>
                Header <span className='text-danger' >&#42;</span>
              </Label>  

              <Controller
                name='header'
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      type="text"
                      {...register("header",
                        {
                          required: true
                        }
                      )}
                      invalid={errors?.header && true}
                      required
                      {...field}
                      placeholder="Header"
                    />
                  )
                }}
              />
              {errors?.header && <FormFeedback> Header is Required </FormFeedback>}
            </div>

            <div className="mb-1" >
              <Label className='form-content' htmlFor='content' style={{ fontSize: "15px" }} >
                Content <span className='text-danger' >&#42;</span>
              </Label>

              <Controller
                name='content'
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      type='text'
                      {...register("content",
                        {
                          required: true
                        })
                      }
                      invalid={errors?.content && true}
                      required
                      {...field}
                      placeholder="Content"
                    />
                  )
                }}
              />
              {errors?.content && <FormFeedback> Content is Required </FormFeedback>}
            </div>

            <div className='mb-1' >
              <Label className='form-buttontext' htmlFor='buttontext' style={{ fontSize: "15px" }} >
                Button Text <span className="text-danger">&#42;</span>
              </Label>

              <Controller
                name='buttonText'
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      type='text'
                      {...register("buttonText",
                        {
                          required: true
                        })
                      }
                      invalid={errors?.buttonText && true}
                      required
                      {...field}
                      placeholder="Button Text"
                    />
                  )
                }}
              />
              {errors?.buttonText && <FormFeedback> Button Text is Required </FormFeedback>}
            </div>

            <div className='mb-1'>
              <Label className='form-buttonLink' htmlFor='buttonLink' style={{ fontSize: "15px" }} >
                Button Link <span className="text-danger">&#42;</span>
              </Label>

              <Controller
                name='buttonLink'
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      type='text'
                      {...register("buttonLink",
                        {
                          required: true
                        })
                      }
                      invalid={errors?.buttonLink && true}
                      required
                      {...field}
                      placeholder="Button Link"
                    />
                  )
                }}
              />
              {errors?.buttonLink && <FormFeedback> Button Link is Required </FormFeedback>}
            </div>

            <div className='mb-1'>
              <Label className='form-leftImage' htmlFor='leftImage' style={{ fontSize: "15px" }} >
                LeftImage <span className="text-danger">&#42;</span>
              </Label>

              <Controller
                name='leftImage'
                control={control}
                render={({ field: { onChange, value, ...rest } }) => {
                  return (
                    <Input
                      type="file"
                      accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
                      {...register("leftImage", { required: control._defaultValues?.id ? false : true })}
                      invalid={errors?.leftImage && true}
                      onChange={(e) => {
                        getBase64(e, onChange);
                      }}
                      {...rest}
                    />
                  )
                }}
              />
              {errors?.leftImage?.message && <FormFeedback> LeftImage is required </FormFeedback>}
              {leftImage != "" ? (
                leftImage?.includes("base64") ? (
                  <img src={leftImage} height={100} width={100} alt="leftimage" className="my-1" />
                ) : (
                  <img src={`${digitalOceanURL}${leftImage}`} className="my-1" width={100} height={100} />
                )
              ) : null}
            </div>

            <div className='mb-1'>
              <Label className='form-leftImage' htmlFor='leftImage' style={{ fontSize: "15px" }} >
                Rightimage <span className="text-danger">&#42;</span>
              </Label>

              <Controller
                name='rightImage'
                control={control}
                render={({ field: { onChange, value, ...rest } }) => {
                  return (
                    <Input
                      type="file"
                      accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
                      {...register("rightImage", { required: control._defaultValues?.id ? false : true })}
                      invalid={errors?.rightImage && true}
                      onChange={(e) => {
                        getBase64RightImage(e, onChange);
                      }}
                      {...rest}
                    />
                  )
                }}
              />
              {errors?.rightImage?.message && <FormFeedback>Right Image is Required</FormFeedback>}
              {rightImage !== "" ? (
                rightImage?.includes("base64") ? (
                  <img src={rightImage} height={100} width={100} alt="rightimage" className='my-1' />
                ) : (
                  <img src={`${digitalOceanURL}${rightImage}`} className="my-1" width={100} height={100} />
                )
              ) : null}
            </div>
          </Form>
        </CommonModal>
      </Card>
    </Fragment>
  )
}

export default Index;