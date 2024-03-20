// library
import React, { Fragment, useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { useForm, Controller } from "react-hook-form";
import { Card, CardBody, Input, FormFeedback, Form, Label } from 'reactstrap';
import { toast } from 'react-toastify';

// componants
import { FormatError } from "../../../@core/components/common/FormatError";
import Header from "../../components/Header";
import Table from "../../components/Table";
import CommonModal from "../../components/Modal";
import { imageVideoTableColumns } from '../../components/Constant';
import { GET_IMGVIDOPTION } from "./query";
import { ADD_IMGVIDOPTION, UPDATE_IMGVIDOPTION, DELETE_IMGVIDOPTION } from "./mutation";
import { ConfirmationModal } from "../../components/Alert";

const Index = () => {

  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [limit, setLimit] = useState(10);
  const [isEditing, _isEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productId, setProductId] = useState("");
  const [video, setVideo] = useState("");
  const [image, setImage] = useState("");
  const [allAdd, setAllAdd] = useState([]);

  const {
    control,
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const { loading, data, refetch } = useQuery(GET_IMGVIDOPTION, {
    variables: {
      page: 1,
      limit: 1000,
    },
    fetchPolicy: "cache-and-network",
  });

  const [addImgVidOption] = useMutation(ADD_IMGVIDOPTION);
  const [updateImgVidOption] = useMutation(UPDATE_IMGVIDOPTION);
  const [deleteImgVidOption] = useMutation(DELETE_IMGVIDOPTION);

  useEffect(() => {
    if (data?.getImgVidOption) {
      setLoader(false);
      setAllAdd(data?.getImgVidOption);
      let arr = [];
      data?.getImgVidOption?.map((d) => {
        arr.push({ id: d?.id, productId: d?.productID, image: d?.image, video: d?.video });
      })
      setAllAdd(arr);
    }
  }, [data]);

  const resetData = () => {
    setVideo("");
    setImage("");
    setProductId("");
  };

  const addPhotosVideos = () => {
    setModal(true);
    _isEditing(false);
    reset({});
    resetData();
  };

  const handlePagination = (page) => {
    setLoader(false);
    setCurrentPage(page?.selected);
  };

  const toggleHandler = () => {
    setModal(false);
    resetData();
    reset({});
  };

  const editImgVidOption = (data) => {

    _isEditing(true);
    setModal(true);
    setVideo(data?.video);
    setImage(data?.image);
    reset(data);
    setProductId(data?.productId);
  };

  const AddSubmitHandler = (data) => {
    addImgVidOption({
      variables: {
        input: {
          productID: data?.productId,
          image: data?.image,
          video: data?.video,
        }
      }
    })
      .then(response => {
        if (response) {
          refetch();
          setModal(false);
          toast.success("Data add successfully");
        } else {
          toast.error("Data not added");
        }
      })
      .catch(error => {
        toast.warn(error.message);
      })
  };

  const EditSubmitHandler = (data) => {
    setLoader(true);
    updateImgVidOption({
      variables: {
        input: {
          id: data?.id,
          productID: data?.productId,
          image: data?.image,
          video: data?.video,
        }
      }
    })
      .then(response => {
        if (response) {
          refetch();
          setModal(false);
          setLoader(false);
          toast.success("Data has been updated successfully.");
        } else {
          setModal(false);
          setLoader(false);
          toast.warn("Data has not been updated successfully.");
        }
      })
      .catch(error => {
        toast.warn(error.message);
        setLoader(false);
      })
  };

  const deleteImgVid = async (ImgId) => {
    setLoader(true);
    let Status = await ConfirmationModal(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, delete it!"
    );
    if (Status) {
      setLoader(true);
      deleteImgVidOption({
        variables: {
          deleteImgVidOptionId: ImgId,
        }
      })
        .then(async ({ data }) => {
          if (data?.deleteImgVidOption) {
            refetch();
            setLoader(false);
            await ConfirmationModal("success", "Deleted!", "Data has been deleted.", "");
          } else {
            toast.error("data not deleted");
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
        <CardBody style={{ flex: "unset", height: "inherit" }}>
          <h2 style={{ textAlign: "center" }} > Image and Video Page </h2>

          <Header
            title="Photos-Videos"
            limit={limit}
            setLimit={setLimit}
            setCurrentPage={setCurrentPage}
            addData={() => addPhotosVideos()}
          />

          <Table
            limit={limit}
            columns={imageVideoTableColumns}
            currentPage={currentPage}
            handlePagination={handlePagination}
            totalRecords={allAdd?.count || 0}
            editData={editImgVidOption}
            deleteData={deleteImgVid}
            data={allAdd}
          />
        </CardBody>

        <CommonModal
          modal={modal}
          setModal={setModal}
          addButtonHandler={handleSubmit(AddSubmitHandler)}
          updateButtonHandler={handleSubmit(EditSubmitHandler)}
          toggleHandler={toggleHandler}
          loading={loader}
          updateId={control._defaultValues?.id ? true : false}
          modalTitle={control._defaultValues?.id ? "Update " : "Add "}
          title="Photos-Videos"
        >
          <Form className="auth-login-form mt-2" onSubmit={handleSubmit(AddSubmitHandler)} >

            <div className='mb-1'>
              <Label className='form-productId' htmlFor='ProductID' style={{ fontSize: "15px" }} >
                Product Id <span className="text-danger">&#42;</span>
              </Label>
              <Controller
                name='productId'
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      type='number'
                      {...register("productId",
                        {
                          required: true
                        })
                      }
                      invalid={errors?.id && true}
                      required
                      {...field}
                      placeholder="Product Id"
                    />
                  )
                }}
              />
              {errors?.id?.message && <FormFeedback>Product Id is required</FormFeedback>}
            </div>

            <div className='mb-1' >
              <Label className='form-video' htmlFor='video' style={{ fontSize: "15px" }} >
                Video Link <span className="text-danger">&#42;</span>
              </Label> {" "}
              <Controller
                name="video"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      type='url'
                      {...register("video",
                        {
                          required: true
                        })
                      }
                      invalid={errors?.video && true}
                      required
                      {...field}
                      placeholder="Video Link "
                    />
                  );
                }}
              />
              {errors?.video?.message && <FormFeedback>Video link is required</FormFeedback>}
            </div>

            <div className='mb-1'>
              <Label className='form-image' htmlFor='image' style={{ fontSize: "15px" }} >
                Image Link <span className="text-danger">&#42;</span>
              </Label>
              <Controller
                name='image'
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      type='url'
                      {...register("image",
                        {
                          required: true
                        })
                      }
                      invalid={errors?.image && true}
                      required
                      {...field}
                      placeholder="Image Link "
                    />
                  );
                }}
              />
              {errors?.image?.message && <FormFeedback>Image link is required</FormFeedback>}
            </div>
          </Form>
        </CommonModal>
      </Card>
    </Fragment>
  )
}

export default Index;