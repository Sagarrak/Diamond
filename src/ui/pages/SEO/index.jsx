// library
import React, { Fragment, useState, useEffect } from 'react';
import { Card, CardBody, Input, Label, FormFeedback, Form, Col, Row } from 'reactstrap';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation } from "react-apollo";
import { Editor } from 'react-draft-wysiwyg';
import _ from 'lodash';
import { toast } from 'react-toastify';
import "./seo.scss"

// components        
import CommanModal from "../../components/Modal";
import { EditorState, ContentState } from "draft-js";
import Header from "../../components/Header";
import ComponentSpinner from '../../../@core/components/spinner/Loading-spinner';
import '@styles/react/libs/editor/editor.scss';
import { convertToHTML } from 'draft-convert';
import Table from "../../components/Table";
import htmlToDraft from 'html-to-draftjs';
import { MinusCircle, PlusCircle } from "react-feather";
import { seoTableColumns } from "../../components/Constant";
import { GET_SEO_CONTENT } from "./query";
import { ADD_SEO_CONTENT, UPDATE_SEO_CONTENT, DELETE_SEO_CONTENT } from "./mutation";
import { FormatError } from "../../../@core/components/common/FormatError";
import { ConfirmationModal } from "../../components/Alert";


const Index = () => {

  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [content, setContent] = useState(EditorState.createEmpty());
  const [allSEO, setAllSEO] = useState([]);
  const [title, setTitle] = useState("");
  const [isEditing, _isEditing] = useState(false);
  const [limit, setLimit] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [fieldsLabel, setFieldsLabel] = useState([{ label: "", url: "" }]);
  const [contentCode, setContentCode] = useState("");
  const [seoOption, _seoOption] = useState({});


  // ** Validation modules
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // query
  const { loading, data, refetch } = useQuery(GET_SEO_CONTENT, { fetchPolicy: "cache-and-network" });
  const firstData = data?.getSEOContent?.tags;

  // mutation
  const [addSEOContent] = useMutation(ADD_SEO_CONTENT);
  const [updateSEOContent] = useMutation(UPDATE_SEO_CONTENT);
  const [deleteSEOContent] = useMutation(DELETE_SEO_CONTENT);

  useEffect(() => {
    if (data?.getSEOContent) {
      setLoader(false);
      let array = new Array(data?.getSEOContent);
      setAllSEO(array);
    }
  }, [data]);

  const resetData = () => {
    setContent(EditorState.createEmpty());
    setTitle("");
    setFieldsLabel([{ label: "", url: "" }]);
  };

  // function for add SEO Data
  const addSEOData = () => {
    setModal(true);
    resetData();
    reset({});
    _isEditing(false);
  };

  // function for open and close model
  const toggleHandler = () => {
    setModal(false);
    resetData();
    reset({});
  };

  // function is being called on change page
  const handlePagination = (page) => {
    setLoader(true);
    setCurrentPage(page?.selected);
  };

  // function for edit seo content
  const editSEOData = (data) => {
    const contentBlock = htmlToDraft(data?.content);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    const _editorState = EditorState.createWithContent(contentState);

    setModal(true);
    _isEditing(true);
    reset(data);
    setTitle(data?.title);
    setContent(_editorState);
    setContentCode(data?.content);
    setFieldsLabel(data?.tags?.length > 0 ? data?.tags : [{ label: "", url: "" }])
  };

  const deleteSEOData = async (seoId) => {

    let Status = await ConfirmationModal(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, delete it!"
    );
    if (Status) {
      deleteSEOContent({
        variables: {
          deleteSeoContentId: seoId,
        }
      })
        .then(async ({ data }) => {
          if (data?.deleteSEOContent) {
            refetch();
            setLoader(false);
            await ConfirmationModal("success", "Deleted!", "SEO has been deleted.", "");
          } else {
            toast.warn("SEO not deleted");
            setLoader(false);
          }
        })
        .catch(error => {
          toast.warn(FormatError(error));
          setLoader(false);
        })
    }
  };

  let currentContentAsHTML = convertToHTML(content.getCurrentContent());
  // const htmlContent = currentContentAsHTML;
  // const div = document.createElement('div');
  // div.innerHTML = htmlContent;
  // const contentWithoutPTag = div.textContent;
 
  //function is being called on submit of branchForm
  const AddSubmitHandler = (data) => {

    if (!Object.values(data).includes(undefined)) {

      const input = {
        title: data?.title,
        content: currentContentAsHTML,
        tags: fieldsLabel,
      };

      addSEOContent({
        variables: { input }
      })
        .then(response => {
          if (response) {
            refetch();
            setModal(false);
            toast.success("SEO add successfully");
          }
        }).catch(error => {
          toast.error("SEO not added");
        })
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

  const EditSubmitHandler = async (data) => {
    const result = await fieldsLabel.map(({ __typename, ...rest }) => ({ ...rest }));
    let input = {
      id: data?.id,
      title: data?.title,
      content: currentContentAsHTML,
      tags: result,
    };
    setLoader(true);
    updateSEOContent({ variables: { input } })
      .then(({ data }) => {
        if (data) {
          refetch();
          setModal(false);
          setLoader(false);
          toast.success("SEO has been updated successfully");
        }
      })
      .catch(error => {
        toast.warn("SEO has not updated successfully");
      });
  };

  const handleChangeLabel = (text, i, flag) => {
    const values = [...fieldsLabel];
    if (flag === "url") values[i].url = text;
    else if (flag === "label") values[i].label = text;
    setFieldsLabel(values);
  };

  // function for add new label and url
  const handleAdd = () => {
    const values = [...fieldsLabel];
    values.push({ label: '', url: "" });
    setFieldsLabel(values);

  };

  // function for remove label and url
  const handleRemove = (i) => {
    const values = [...fieldsLabel];
    values.splice(i, 1);
    setFieldsLabel(values);
  };

  return (
    <Fragment>
      <Card className="w-100 h-100">
        {loader && <ComponentSpinner />}
        <CardBody style={{ flex: "unset", height: "inherit" }} >
          <h2 style={{ textAlign: "center" }} > SEO </h2>

          <Header
            limit={limit}
            title="SEO"
            addData={() => addSEOData()}
            setLimit={setLimit}
            setCurrentPage={setCurrentPage}
          />

          <Table
            limit={limit}
            columns={seoTableColumns}
            handlePagination={handlePagination}
            data={allSEO}
            currentPage={currentPage}
            totalRecords={allSEO}
            editData={editSEOData}
            deleteData={deleteSEOData}
          />
        </CardBody>

        <CommanModal
          modal={modal}
          setModal={setModal}
          loading={loader}
          title="SEO"
          toggleHandler={toggleHandler}
          addButtonHandler={handleSubmit(AddSubmitHandler)}
          updateButtonHandler={handleSubmit(EditSubmitHandler)}
          updateId={control._defaultValues?.id ? true : false}
          modalTitle={control._defaultValues?.id ? "Update " : "Add "}
        >

          <Form className="auth-login-form mt-2">
            <div className="mb-1">
              <Label className='form-title' htmlFor='title'>
                Title <span className="text-danger">&#42;</span>
              </Label>

              <Controller
                name='title'
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
                      placeholder="SEO Title"
                    />
                  );
                }}
              />
              {errors.title && <FormFeedback> SEO label is required </FormFeedback>}
            </div>

            <div className='mb-1'>
              <Label className='form-content' htmlFor='content' >
                Content <span className="text-danger">&#42;</span>
              </Label>

              <Editor editorState={content} onEditorStateChange={(data) => setContent(data)} />

            </div>

            <div className='mb-1'>
              <Label className='form-content' htmlFor='label' >
                Label <span className="text-danger">&#42;</span>
              </Label>
              <>
                {fieldsLabel?.map((item, index) => {
                  return (
                    <Row key={index}>
                      <Col md="6">
                        <Input
                          placeholder="Label name"
                          value={item?.label}
                          onChange={e => handleChangeLabel(e?.target?.value, index, "label")}
                        />
                      </Col>
                      <Col md="6">
                        <div className="d-flex justify-content-center align-items-center mb-1">
                          <Input
                            placeholder="URL"
                            value={item?.url}
                            onChange={(e) => { handleChangeLabel(e.target.value, index, "url"); }}
                            style={{ marginRight: "30px" }}
                          />
                          {fieldsLabel?.length - 1 == index ? (
                            <PlusCircle
                              className="cursor-pointer"
                              onClick={(e) => handleAdd(e)}
                              style={{ marginLeft: 10 }}
                            />
                          ) : null}
                          {fieldsLabel?.length > 1 ? (
                            <MinusCircle
                              className="cursor-pointer"
                              onClick={() => handleRemove(index)}
                              style={{ marginLeft: 10 }}
                            />
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                  );
                })}
              </>
            </div>
          </Form>
        </CommanModal>
      </Card>
    </Fragment>
  )
}

export default Index;