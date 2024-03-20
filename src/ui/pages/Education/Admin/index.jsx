//library
import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Form, Label, Input, FormFeedback } from "reactstrap";
import { useMutation, useQuery } from "react-apollo";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
//components
import Table from "../../../components/Table";
import { educationTableColumns } from "../../../components/Constant";
import ComponentSpinner from "../../../../@core/components/spinner/Loading-spinner";
import CommanModal from "../../../components/Modal";
import { ConfirmationModal } from "../../../components/Alert";
import { FormatError } from "../../../../@core/components/common/FormatError";
import { ADD_EDUCATION, UPDATE_EDUCATION, DELETE_EDUCATION } from "../mutation";
import { GET_ALL_EDUCATIONS } from "../query";
import Header from "../../../components/Header";
import _ from "lodash";
import { EditorState, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import { convertToHTML } from 'draft-convert';
import '@styles/react/libs/editor/editor.scss'
import htmlToDraft from 'html-to-draftjs';
import { digitalOceanURL } from "../../../common/common";
const Index = () => {
  // initial states
  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({ key: "sortOrder", type: 1 });
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [allEducations, setAllEducations] = useState([]);

  const [content, setContent] = useState(EditorState.createEmpty());
  const [educationImage, setBlogImage] = useState("");

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
  const { loading, data, refetch } = useQuery(GET_ALL_EDUCATIONS, {
    variables: {
      page: currentPage + 1,
      limit: limit,
    },
    fetchPolicy: "cache-and-network",
  });


  //mutation
  const [addEducation] = useMutation(ADD_EDUCATION);
  const [updateEducation] = useMutation(UPDATE_EDUCATION);
  const [deleteEducation] = useMutation(DELETE_EDUCATION);

  if (!educationTableColumns?.find(d => d?.name === 'Active')) {
    educationTableColumns.push({
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
              updateEducation({
                variables: {
                  input: {
                    id: row?.id,
                    isActive: e.target.checked
                  },
                }
              }).then(response => {
                if (response?.data?.updateEducation) {
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
  }

  useEffect(() => {
    if (data?.getEducations) {
      setLoader(false);
      setAllEducations(data?.getEducations);
    }
  }, [data]);

  const resetData = () => {
    setContent(EditorState.createEmpty());
    setBlogImage("");
  };

  // function for  open and close model
  const toggleHandler = () => {
    setModal(!modal);
    resetData();
    reset({});
  };
  // function for add bank
  const addEducationData = () => {
    setModal(true);
    reset({});
    resetData();
  };
  // function for edit bank
  const editBlogData = (data) => {
    const contentBlock = htmlToDraft(data?.content);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    const _editorState = EditorState.createWithContent(contentState);

    setModal(true);
    reset(data);
    setContent(_editorState);
    setBlogImage(data?.image)
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
  const deleteEducations = async (educationId) => {
    let Status = await ConfirmationModal(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, delete it!"
    );
    if (Status) {
      setLoader(true);
      deleteEducation({ variables: { deleteEducationId: educationId } })
        .then(async ({ data }) => {
          if (data?.deleteEducation) {
            refetch();
            setLoader(false);
            await ConfirmationModal("success", "Deleted!", "Education has been deleted.", "");
          } else {
            toast.error("Education not deleted");
            setLoader(false);
          }
        })
        .catch((error) => {
          toast.error(FormatError(error));
          setLoader(false);
        });
    }
  };

  let currentContentAsHTML = convertToHTML(content.getCurrentContent());
  const div = document.createElement('div');
  div.innerHTML = currentContentAsHTML;
  const contentWithoutPTag = div.textContent;

  const EditSubmitHandler = (data) => {
    let input = {
      id: data?.id,
      title: data?.title,
      content: contentWithoutPTag,
      image: educationImage,
    };

    setLoader(true);
    updateEducation({ variables: { input } })
      .then(({ data }) => {
        if (data?.updateEducation?.status) {
          refetch();
          setModal(false);
          setLoader(false);
          // resetData()
          toast.success("Blog updated successfully");
          // reset({});
        } else {
          setModal(false);
          setLoader(false);
          toast.warn(data?.updateEducation?.message);
        }
      })
      .catch((error) => {
        toast.warn(FormatError(error));
        setLoader(false);
      });
  };

  const AddSubmitHandler = (data) => {
    if (!Object.values(data).includes(undefined)) {
      addEducation({
        variables: {
          input: {
            title: data?.title,
            content: contentWithoutPTag,
            image: data?.educationImage,
          },
        },
      })
        .then(({ data }) => {
          if (data?.addEducation?.status) {
            refetch();
            resetData();
            setLoader(false);
            toast.success("Blog added successfully");
            setModal(false);
            reset({});
          } else {
            setModal(false);
            setLoader(false);
            toast.warn(data?.addEducation?.message);
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
      await setBlogImage(result);
      await onChange(result);
    };
  };


  return (
    <Fragment>
      <Card className="w-100 h-100">
        {loader && <ComponentSpinner />}
        <CardBody style={{ flex: "unset", height: "inherit" }}>
          <Header
            limit={limit}
            // changeLimit={(e) => changeLimit(e)}
            title={"Education"}
            addData={() => addEducationData()}
            // SearchHandling={(e) => SearchHandling(e)}
            setLimit={setLimit}
            setSearchText={setSearchText}
            setCurrentPage={setCurrentPage}
          />
          <Table
            columns={educationTableColumns}
            data={allEducations?.data || []}
            currentPage={currentPage}
            totalRecords={allEducations?.count || 0}
            limit={limit}
            editData={editBlogData}
            deleteData={deleteEducations}
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
              <Label className="form-label" htmlFor="blog-title">
                Title<span className="text-danger">&#42;</span>
              </Label>

              <Controller
                name="title"
                control={control}
                render={({ field }) => {
                  return (
                    <Input
                      type="text"
                      {...register("title", {
                        required: true,
                      })}
                      invalid={errors?.title && true}
                      {...field}
                      placeholder="Education Title"
                    />
                  );
                }}
              />
              {errors.title && <FormFeedback>Education Title is required</FormFeedback>}
            </div>
            <div className="mb-1">
              <Label className="form-label" htmlFor="content">
                Content
              </Label>

              <Editor editorState={content} onEditorStateChange={data => setContent(data)} />

            </div>
            <div className="mb-1">
              <Label className="form-label">
                Image<span className="text-danger">&#42;</span>
              </Label>
              <br />
              <Controller
                name="educationImage"
                control={control}
                render={({ field: { onChange, value, ...rest } }) => {
                  return (
                    <>
                      <Input
                        type="file"
                        {...register("educationImage", { required: control._defaultValues?.id ? false : true })}
                        accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
                        invalid={errors?.educationImage && true}
                        onChange={(e) => {
                          getBase64(e, onChange);
                        }}
                        {...rest}
                      />
                    </>
                  );
                }}
              />
              {errors?.educationImage && <FormFeedback>Shape Image is required</FormFeedback>}
              {educationImage != "" ? (
                educationImage?.includes("base64") ? (
                  <img src={educationImage} height={100} width={100} alt="shape" className="my-1" />
                ) : (
                  <img src={`${digitalOceanURL}${educationImage}`} className="my-1" width={200} />
                )
              ) : null}
            </div>
            {/* <div className='mb-1'>
                            <label className="login-label" htmlFor="">Is Certified?<span className="text-primary font-weight-bold" > * </span></label>
                            <Select defaultValue={certyType} onChange={(select) => { setCertified(select?.value) }} options={[{ label: 'Yes', value: true }, { label: 'No', value: false }]} />
                        </div> */}

          </Form>
        </CommanModal>
      </Card>
    </Fragment>
  );
};
export default Index;
