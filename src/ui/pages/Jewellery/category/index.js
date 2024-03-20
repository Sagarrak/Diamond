import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Card, CardBody, Form, FormFeedback, Input, Label } from 'reactstrap';
import ComponentSpinner from '../../../../@core/components/spinner/Loading-spinner';
import Header from '../../../components/Header'
import CommanModal from '../../../components/Modal'
import Select from '../../../components/Select'
import { digitalOceanURL } from '../../../common/common'
import { useMutation, useQuery } from 'react-apollo';
import { ADD_JEWELLERY_CATEGORY ,UPDATE_JEWELLERY_CATEGORY,DELETE_JEWELLERY_CATEGORY} from './mutation'
import { GET_ALL_JEWELLERY_CATEGORY } from './query'
import { jewellerycategoryTableColumn} from '../../../components/Constant'
import Table from '../../../components/Table'
import { toast } from 'react-toastify';
import { ConfirmationModal } from '../../../components/Alert';
import { FormatError } from '../../../../@core/components/common/FormatError';

function index() {
    const [loader, setLoader] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [sort, setSort] = useState({ key: "createdAt", type: -1 });
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);
    const [modal, setModal] = useState(false);
    const [StyleImage, setStyleImage] = useState("");
    const [allCategoryata, setallcategorydata] = useState("");
    const [OrderIndex, setOrderIndex] = useState();
    const [oldIndex, setoldIndex] = useState("");
    const [Index, setIndex] = useState(false);
    



    //mutation
    const [addcategoryData] = useMutation(ADD_JEWELLERY_CATEGORY)
    const [updatecategoryData] = useMutation(UPDATE_JEWELLERY_CATEGORY)
    const [deletecategoryData] = useMutation(DELETE_JEWELLERY_CATEGORY)

    //query
    const { data, loading, refetch } = useQuery(GET_ALL_JEWELLERY_CATEGORY, {
        variables: {
            page: currentPage + 1,
            limit: limit,
            sort: sort,
            filter: "{}",
            search: searchText,
        },
        fetchPolicy: "cache-and-network",
    })
   
    useEffect(()=>{
        if(data?.jewelryCategories){
            setallcategorydata(data?.jewelryCategories)

        }
    })
    const {
        control,
        reset,
        setError,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleSort = (e) => {
        setLoader(true);
        const type = sort.type == -1 ? 1 : -1;
        setSort({ key: e?.sortField, type });
    };

    const editCategoryData=(data)=>{
        setoldIndex(data?.sortIndex)
        setStyleImage(data?.image)
        setModal(true)
        reset(data)
    }
    
    const EditSubmitHandler=(data)=>{
        data.sortIndex=OrderIndex
        if (!Object.values(data)?.includes(undefined)) {
            const input = {
                id: data?.id,
                name:data?.name,
                image:data?.image,
                oldIndex:oldIndex,
                sortIndex:parseInt(data?.sortIndex),
                title: data?.title
            }
            setLoader(true)
            updatecategoryData({ variables: { input } }).then((response) => {
                if (response?.data?.updateJewellerCategory?.id) {
                    toast.success("Category updated successfully.")
                    refetch()
                    setLoader(false)
                    setModal(false)
                    // handleReset()
                } else {
                    setLoader(false)
                    setModal(false)
                    // handleReset()
                    toast.success("Category not updated")
                }
            }).catch((err) => {
                toast.error(FormatError(err))
                // handleReset()
                setModal(false)
                setLoader(false)
            });
        }
        

    }

    const addCategory=()=>{
        setIndex(true)
        setModal(true);
        reset({});
    }
    const AddSubmitHandler=(data)=>{
        data.sortIndex=OrderIndex
        // if (!Object.values(data).includes(undefined)) {
            addcategoryData({
              variables: {
                input: {
                name:data?.name,
                image:data?.image,
                sortIndex: parseInt(data?.sortIndex),
                title: data?.title,
                },
              },
            })
              .then(({ data }) => {
                if (data?.createJewelryCategory?.id) {
                  refetch();
                  resetData();
                  setLoader(false);
                  toast.success("Category added successfully");
                  setIndex(false)
                  setModal(false);
                  reset({});
                } else {
                  setModal(false);
                  setLoader(false);
                  toast.warn("Category not added");
                  reset({});
                  resetData();
                }
              })
              .catch((error) => {
                // toast.warn(FormatError(error));
                setLoader(false);
              });
            // }
    }
    const toggleHandler=()=>{
        setModal(!modal);
        resetData();
        reset({});
    }
    const deleteCategory=async(categoryId) => {
             
        let Status = await ConfirmationModal(
            "warning",
            "Are you sure?",
            "You won't be able to revert this!",
            "Yes, delete it!"
        );
        if (Status) {
            setLoader(true);
            deletecategoryData({
                variables: {
                    deleteJewelryCategoryId: categoryId,
                },
            })
                .then(async ({ data }) => {
                    if (data?.deleteJewelryCategory) {
                        refetch();
                        setLoader(false);
                        await ConfirmationModal("success", "Deleted!", "Category has been deleted.", "");
                    } else {
                        toast.error("Category not deleted");
                        setLoader(false);
                    }
                })
                .catch((error) => {
                    // toast.error(FormatError(error));
                    setLoader(false);
                });
        }


    }
    const handlePagination = (page) => {
        setLoader(true);
        setCurrentPage(page?.selected);
    };
    const resetData=()=>{
        setStyleImage("")

    }
    const getBase64 = async (e, onChange) => {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            let result = await reader.result;
            await setStyleImage(result);
            await onChange(result);
        };
    };
    if (!jewellerycategoryTableColumn?.find((d) => d?.name === "Active")) {
        jewellerycategoryTableColumn.push({
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
                  updatecategoryData({
                    variables: {
                      input: {
                        id: row?.id,
                        isActive: e.target.checked,
                      },
                    },
                  })
                    .then((response) => {
                      if (response?.data?.updateJewelryCategory) {
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
  return (
    <Fragment>
    <Card className="w-100 h-100">
        {loader && <ComponentSpinner />}
        <CardBody style={{ flex: "unset", height: "inherit" }}>
            <Header
                limit={limit}
                title={"Category"}
                setLimit={setLimit}
                setSearchText={setSearchText}
                setCurrentPage={setCurrentPage}
                addData={() => addCategory()}

            />
            <Table
                columns={jewellerycategoryTableColumn}
                data={allCategoryata?.data || []}
                currentPage={currentPage}
                totalRecords={allCategoryata?.count || 0}
                limit={limit}
                deleteData={deleteCategory}
                editData={editCategoryData}
                onSort={handleSort}
                handlePagination={handlePagination}
                modal={modal}
                setModal={setModal}
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
            <Form className='auth-login-form mt-2'>
                <div className='mb-1'>
                </div>

                <div className='mb-1'>
                    <Label className='form-label' htmlFor='fullName'>
                        Category Name<span className='text-danger'>&#42;</span>
                    </Label>
                    <Controller
                        id='name'
                        name='name'
                        defaultValue=''
                        {...register("name", {
                            required: true,
                        })}
                        control={control}
                        render={({ field }) => (
                            <Input type='text' placeholder='Enter category name' invalid={errors.name && true} {...field} />
                        )}
                    />
                    {errors && errors?.name && (
                        <FormFeedback>Please enter category name</FormFeedback>
                    )}
                </div>
                <div className="mb-1" >
                    <Label className='form-image' htmlFor='image' style={{ fontSize: "15px" }}>
                        Image
                    </Label> {" "}

                    <Controller
                        name='image'
                        control={control}
                        render={({ field: { onChange, value, ...rest } }) => {
                            return (
                                <Input
                                    type="file"
                                    {...register("image")}
                                    invalid={errors?.image && true}
                                    accept=".jpg,.JPG,.jpeg,.JPEG,.png,.PNG,.webp"
                                    onChange={(e) => {
                                        getBase64(e, onChange);
                                    }}
                                    {...rest}
                                />
                            )
                        }}
                    />
                    {errors.image && <FormFeedback>Image is required</FormFeedback>}
                    {StyleImage != "" ? (
                        StyleImage?.includes("base64") ? (
                            <img src={StyleImage} height={100} width={100} alt="advimage" className="my-1" />
                        ) : (
                            <img src={`${digitalOceanURL}${StyleImage}`} className="my-1" width={100} height={100} />
                        )
                    ) : null}
                </div>
                <div className='mb-1'>
                    <Label className='form-label' htmlFor='email'>
                        Title<span className='text-danger'>&#42;</span>
                    </Label>
                    <Controller
                        id='title'
                        name='title'
                        defaultValue=''
                        {...register("title", {
                            required: true,
                        })}
                        control={control}
                        render={({ field }) => (
                            <Input type='text' placeholder='Enter title' invalid={errors.title && true} {...field} />
                        )}
                    />
                    {errors && errors?.title && (
                        <FormFeedback>Please enter title</FormFeedback>
                    )}
                </div>
                <div className='mb-1'>
                    <Label className='form-label' htmlFor='fullName'>
                       Sort Index
                    </Label>                          
                    <Controller
                        name="sortIndex"
                        control={control}
                        {...register("sortIndex", {})}
                        render={({ field: { onChange, value } }) => {
                            setOrderIndex(Index ? allCategoryata?.count+1 : value);
                            return (
                                <Input
                                    type="number"
                                    min="1"
                                    disabled={Index || !control?._defaultValues?.id}
                                    invalid={errors.index && true}
                                    onChange={(e) => {
                                        onChange(e?.target?.value);
                                    }}
                                    value={Index ? allCategoryata?.count+1 : value}
                                />
                            );
                        }}
                    />

                    {errors && errors?.sortIndex && (
                        <FormFeedback>Please enter a valid index name</FormFeedback>
                    )}
                </div>
               
               
            </Form>
        </CommanModal>

    </Card>
</Fragment>
  )
}

export default index