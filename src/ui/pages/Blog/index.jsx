//library
import React, { Fragment, useEffect, useState } from "react";
import { Card, CardBody, Form, Label, Input, FormFeedback } from "reactstrap";
import { useMutation, useQuery } from "react-apollo";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
//components
import Table from "../../components/Table";
import { blogTableColumns } from "../../components/Constant"; //
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import CommanModal from "../../components/Modal"; //
import { ConfirmationModal } from "../../components/Alert"; //
import { BASE_URL } from "../../../config";
import { FormatError } from "../../../@core/components/common/FormatError"; //
import { ADD_BLOG, UPDATE_BLOG, DELETE_BLOG } from "./mutation"; //
import { GET_ALL_BLOG } from "./query"; //
import Header from "../../components/Header"; //
import _ from "lodash";
import { EditorState, ContentState, convertFromRaw, convertToRaw } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import { convertToHTML } from 'draft-convert';
import '@styles/react/libs/editor/editor.scss'
import htmlToDraft from 'html-to-draftjs';
import { digitalOceanURL } from "../../common/common";
const Index = () => {
    // initial states
    const [loader, setLoader] = useState(false);
    const [modal, setModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [sort, setSort] = useState({ key: "sortOrder", type: 1 });
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [allBlogs, setAllBlogs] = useState([]);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState(EditorState.createEmpty());
    const [blogImage, setBlogImage] = useState("");
    const [isEditing, _isEditing] = useState(false);
    const [fields, setFields] = useState([{ value: null }]);
    const [contentCode, setContentCode] = useState('');

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
    const { loading, data, refetch } = useQuery(GET_ALL_BLOG, {
        variables: {
            page: currentPage + 1,
            limit: limit,
        },
        fetchPolicy: "cache-and-network",
    });


    //mutation
    const [addBlog] = useMutation(ADD_BLOG);
    const [updateBlog] = useMutation(UPDATE_BLOG);
    const [deleteBlog] = useMutation(DELETE_BLOG);

    if (!blogTableColumns?.find(d => d?.name === 'Active')) {
        blogTableColumns.push({
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
                            updateBlog({
                                variables: {
                                    input: {
                                        id: row?.id,
                                        isActive: e.target.checked
                                    },
                                }
                            }).then(response => {
                                if (response?.data?.updateBlog) {
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
        if (data?.getBlogs) {
            setLoader(false);
            setAllBlogs(data?.getBlogs);
        }
    }, [data]);

    const resetData = () => {
        setTitle("");
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
    const addBlogData = () => {
        setModal(true);
        _isEditing(false);
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

        _isEditing(true);
        setModal(true);
        reset(data);
        setTitle(data?.title);
        setContent(_editorState);
        setContentCode(data?.content);
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
    const deleteBlogs = async (blogId) => {
        let Status = await ConfirmationModal(
            "warning",
            "Are you sure?",
            "You won't be able to revert this!",
            "Yes, delete it!"
        );
        if (Status) {
            setLoader(true);
            deleteBlog({
                variables: {
                    deleteBlogId: blogId,
                },
            })
                .then(async ({ data }) => {
                    if (data?.deleteBlog) {
                        refetch();
                        setLoader(false);
                        await ConfirmationModal("success", "Deleted!", "Blog has been deleted.", "");
                    } else {
                        toast.error("Blog not deleted");
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
    let currentContentAsHTML = convertToHTML(content.getCurrentContent());
    const div = document.createElement('div');
    div.innerHTML = currentContentAsHTML;
    const contentWithoutPTag = div.textContent;

    const EditSubmitHandler = (data) => {
        let input = {
            id: data?.id,
            title: data?.title,
            content: contentWithoutPTag,
            image: blogImage,
        };

        setLoader(true);
        updateBlog({ variables: { input } })
            .then(({ data }) => {
                if (data?.updateBlog?.status) {
                    refetch();
                    setModal(false);
                    setLoader(false);
                    // resetData()
                    toast.success("Blog updated successfully");
                    // reset({});
                } else {
                    setModal(false);
                    setLoader(false);
                    toast.warn(data?.updateBlog?.message);
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
            addBlog({
                variables: {
                    input: {
                        title: data?.title,
                        content: contentWithoutPTag,
                        image: data?.blogImage,
                    },
                },
            })
                .then(({ data }) => {
                    if (data?.addBlog?.status) {
                        refetch();
                        resetData();
                        setLoader(false);
                        toast.success("Blog added successfully");
                        setModal(false);
                        reset({});
                    } else {
                        setModal(false);
                        setLoader(false);
                        toast.warn(data?.addBlog?.message);
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
                        title={"Blog"}
                        addData={() => addBlogData()}
                        // SearchHandling={(e) => SearchHandling(e)}
                        setLimit={setLimit}
                        setSearchText={setSearchText}
                        setCurrentPage={setCurrentPage}
                    />
                    <Table
                        columns={blogTableColumns}
                        data={allBlogs?.data || []}
                        currentPage={currentPage}
                        totalRecords={allBlogs?.count || 0}
                        limit={limit}
                        editData={editBlogData}
                        deleteData={deleteBlogs}
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
                                            placeholder="Blog Title"
                                        />
                                    );
                                }}
                            />
                            {errors.title && <FormFeedback>Blog Title is required</FormFeedback>}

                            {/* <Input type='text' id='blog-title' placeholder='Blog Title' value={title} autoFocus onChange={(e) => { setTitle(e.target.value) }} readOnly={isEditing} /> */}
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
                                name="blogImage"
                                control={control}
                                render={({ field: { onChange, value, ...rest } }) => {
                                    return (
                                        <>
                                            <Input
                                                type="file"
                                                {...register("blogImage", { required: control._defaultValues?.id ? false : true })}
                                                accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG"
                                                invalid={errors?.blogImage && true}
                                                onChange={(e) => {
                                                    getBase64(e, onChange);
                                                }}
                                                {...rest}
                                            />
                                        </>
                                    );
                                }}
                            />
                            {errors?.blogImage && <FormFeedback>Shape Image is required</FormFeedback>}
                            {blogImage != "" ? (
                                blogImage?.includes("base64") ? (
                                    <img src={blogImage} height={100} width={100} alt="shape" className="my-1" />
                                ) : (
                                    <img src={`${digitalOceanURL}${blogImage}`} className="my-1" width={200}/>
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
