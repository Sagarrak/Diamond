// library
import React, { useState, useEffect, Fragment } from 'react';
import { Card, CardBody, Input, FormFeedback, Button, Form, Label } from 'reactstrap';
import { useMutation, useQuery } from "react-apollo";
import { useForm, Controller } from 'react-hook-form';

// components
import { GET_AD_CONTENT } from './query';
import { ADD_AD_CONTENT, UPDATE_AD_CONTENT, DELETE_AD_CONTENT } from './mutation';
import Header from '../../components/Header';
import { advTableColumns } from '../../components/Constant';
import Table from '../../components/Table';
import { BASE_URL } from '../../../config';
import {digitalOceanURL} from '../../common/common'
import _, { result } from 'lodash';
import { toast } from 'react-toastify';
import { ConfirmationModal } from "../../components/Alert";
import { FormatError } from "../../../@core/components/common/FormatError";
import CommanModal from "../../components/Modal";

const Index = () => {

  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [gridImage4, setGridImage4] = useState("");
  const [gridImage6, setGridImage6] = useState("");
  const [allAdd, setAllAdd] = useState([]);
  const [id, setId] = useState('');
  const [url, setURL] = useState('')
  const [position, setPosition] = useState([]);
  const [isEditing, _isEditing] = useState(false);
  const [limit, setLimit] = useState(10);
  const [advOption, _advOption] = useState({});

  const {
    control,
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const { loading, data, refetch } = useQuery(GET_AD_CONTENT, { fetchPolicy: "cache-and-network", });

  const [addAdContent] = useMutation(ADD_AD_CONTENT);
  const [updateAdContent] = useMutation(UPDATE_AD_CONTENT);
  const [deleteAdContent] = useMutation(DELETE_AD_CONTENT);


  useEffect(() => {
    if (data?.getAdContent) {
      setLoader(false);
      setAllAdd(data?.getAdContent);
      let arr = [];
      data?.getAdContent?.map((d) => {
        arr.push({ id: d?.id, index: d?.index, gridImage4: d?.gridImage4, gridImage6: d?.gridImage6, url: d?.url });
      });
      _advOption(arr);
    }
  }, [data]);

  const resetData = () => {
    setPosition("");
    setGridImage4("");
    setGridImage6("");
    setURL("");
  };

  const addAdvData = () => {
    setModal(true);
    _isEditing(false);
    reset({});
    resetData();
  };

  const editAdvData = (data) => {
    _isEditing(true);
    setModal(true);
    reset(data);
    setPosition(data?.index);
    setURL(data?.url);
    setGridImage4(data?.gridImage4);
    setGridImage6(data?.gridImage6);
  };

  const toggleHandler = () => {
    setModal(!modal);
    resetData();
    reset({});
  };

  const handlePagination = (page) => {
    setLoader(true);
    setCurrentPage(page?.selected);
  };

  const deleteAdv = async (advId) => {
    let Status = await ConfirmationModal(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, delete it!"
    );
    if (Status) {
      setLoader(true);
      deleteAdContent({
        variables: {
          deleteAdContentId: advId,
        }
      })
        .then(async ({ data }) => {
          if (data?.deleteAdContent) {
            refetch();
            setLoader(false);
            await ConfirmationModal("success", "Deleted!", "Adv has been deleted.", "");
          } else {
            toast.error("Adv not deleted");
            setLoader(false);
          }
        })
        .catch((error) => {
          toast.error(FormatError(error));
          setLoader(false);
        });
    }
  };

  const AddSubmitHandler = (data) => {
    // if (!Object.values(data).includes(undefined)) {

    addAdContent({
      variables: {
        input: {
          index: data?.index,
          gridImage4: data?.gridImage4,
          gridImage6: data?.gridImage6,
          url: data?.url,
        }
      }
    })
      .then(response => {
        if (response) {
          refetch();
          setModal(false);
          toast.success("Data add successfully")
        }
        else {
          setModal(false);
          setLoader(false);
        }
      }).catch(error => {
        toast.error("Data not added")
      })

    // }
  }

  const EditSubmitHandler = (data) => {
    let input = {
      id: data?.id,
      index: data?.index,
      gridImage4: data?.gridImage4,
      gridImage6: data?.gridImage6,
      url: data?.url
    }
    setLoader(true);
    updateAdContent({ variables: { input } })
      .then(response => {
        if (response) {
          refetch();
          setModal(false);
          setLoader(false);
          toast.success("Adv updated successfully");
        } else {
          setModal(false);
          setLoader(false);
        }
      })
      .catch(error => {
        toast.warn(FormatError(error));
        setLoader(false);
      })
  }

  const getBase64 = (e, onChange) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      let result = await reader.result;
      await setGridImage4(result);
      await onChange(result);
    };
  };

  const getBase64GridImage6 = (e, onChange) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
      let result = await reader.result;
      await setGridImage6(result);
      await onChange(result);
    };
  };

  return (
    <Fragment>
      <Card className="w-100 h-100">
        <CardBody style={{ flex: "unset", height: "inherit" }}>
          <h2 style={{ textAlign: "center" }} > Advertisement Page </h2>

          <Header
            limit={limit}
            addData={() => addAdvData()}
            title="Advertisement"
            setLimit={setLimit}
            setCurrentPage={setCurrentPage}
          />

          <Table
            limit={limit}
            columns={advTableColumns}
            data={allAdd}
            currentPage={currentPage}
            handlePagination={handlePagination}
            editData={editAdvData}
            deleteData={deleteAdv}
            totalRecords={allAdd.count || 0}
          />

        </CardBody>

        <CommanModal
          modal={modal}
          setModal={setModal}
          addButtonHandler={handleSubmit(AddSubmitHandler)}
          updateButtonHandler={handleSubmit(EditSubmitHandler)}
          toggleHandler={toggleHandler}
          loading={loader}
          updateId={control._defaultValues?.id ? true : false}
          modalTitle={control._defaultValues?.id ? "Update " : "Add "}
          title="Advertisement"
        >

          <Form className="auth-login-form mt-2" onSubmit={handleSubmit(AddSubmitHandler)}>

            <div className="mb-1" >
              <Label className='form-image' htmlFor='image' style={{ fontSize: "15px" }}>
                Image 4 Grid <span className="text-danger">&#42;</span>
              </Label> {" "}

              <Controller
                name='gridImage4'
                control={control}
                render={({ field: { onChange, value, ...rest } }) => {
                  return (
                    <Input
                      type="file"
                      {...register("gridImage4", { required: control._defaultValues?.id ? false : true })}
                      invalid={errors?.gridImage4 && true}
                      accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
                      onChange={(e) => {
                        getBase64(e, onChange);
                      }}
                      {...rest}
                    />
                  )
                }}
              />
              {errors.gridImage4?.message && <FormFeedback>Image is required</FormFeedback>}
              {gridImage4 != "" ? (
                gridImage4?.includes("base64") ? (
                  <img src={gridImage4} height={100} width={100} alt="advimage" className="my-1" />
                ) : (
                  <img src={`${digitalOceanURL}${gridImage4}`} className="my-1" width={100} height={100} />
                )
              ) : null}
            </div>

            <div className='mb-1' >
              <Label className='form-image-grid6' htmlFor='image-grid6' style={{ fontSize: "15px" }}>
                Image 6 Grid <span className="text-danger">&#42;</span>
              </Label> {" "}

              <Controller
                name='gridImage6'
                control={control}
                render={({ field: { onChange, value, ...rest } }) => {
                  return (
                    <Input
                      type="file"
                      accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
                      {...register("gridImage6", { required: control._defaultValues?.id ? false : true })}
                      invalid={errors?.gridImage6 && true}
                      onChange={(e) => {
                        getBase64GridImage6(e, onChange);
                      }}
                      {...rest}
                    />
                  )
                }}
              />
              {errors.gridImage6?.message && <FormFeedback>Image is required</FormFeedback>}
              {gridImage6 != "" ? (
                gridImage6?.includes("base64") ? (
                  <img src={gridImage6} height={100} width={100} alt="advimage" className="my-1" />
                ) : (
                  <img src={`${digitalOceanURL}${gridImage6}`} width={100} height={100} className="my-1" />
                )
              ) : null}
            </div>

            <div className='mb-1'>
              <Label className='form-position' htmlFor='position' style={{ fontSize: "15px" }}>
                Position <span className="text-danger">&#42;</span>
              </Label>

              <Controller
                name='index'
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      type="number"
                      {...register("index",
                        {
                          required: true
                        })
                      }
                      invalid={errors?.position && true}
                      required
                      {...field}
                      placeholder="Position"
                    />
                  );
                }}
              />
              {errors.position?.message && <FormFeedback>Position is required</FormFeedback>}
            </div>

            <div className='mb-1' >
              <Label className='form-url' htmlFor='url' style={{ fontSize: "15px" }}>
                URL <span className="text-danger">&#42;</span>
              </Label>

              <Controller
                name='url'
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      type="url"
                      {...register("url",
                        {
                          required: true
                        })
                      }
                      invalid={errors?.url && true}
                      required
                      {...field}
                      placeholder="URL"
                    />
                  )
                }}
              />
              {errors.url && <FormFeedback>URL is required</FormFeedback>}
            </div>
          </Form>
        </CommanModal>
      </Card>
    </Fragment>
  )
}

export default Index;
