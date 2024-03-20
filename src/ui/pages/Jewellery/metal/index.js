import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { Card, CardBody, Form, FormFeedback, Input, Label } from 'reactstrap';
import ComponentSpinner from '../../../../@core/components/spinner/Loading-spinner';
import Header from '../../../components/Header'
import CommanModal from '../../../components/Modal'
import Select from '../../../components/Select'
import { digitalOceanURL } from '../../../common/common'
import { useMutation, useQuery } from 'react-apollo';
import { ADD_METAL_DATA ,UPDATE_METAL_DATA,DELETE_METAL_DATA} from './mutation'
import { GET_ALL_METAL } from './query'
import { metaltableColumn} from '../../../components/Constant'
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
    const [MetalImage, setMetalImage] = useState("");
    const [allMetalData, setallMetalData] = useState("");
    const [OrderIndex, setOrderIndex] = useState();
    const [oldIndex, setoldIndex] = useState("");
    const [Index, setIndex] = useState(false);
  
   //mutation
   const [addMetalData] = useMutation(ADD_METAL_DATA)
   const [updateMetalData] = useMutation(UPDATE_METAL_DATA)
   const [deleteMetalData] = useMutation(DELETE_METAL_DATA)

   //query
   const { data, loading, refetch } = useQuery(GET_ALL_METAL, {
       variables: {
           page: currentPage + 1,
           limit: limit,
           sort: sort,
           filter: "{}",
           search: searchText,
       },
       fetchPolicy: "cache-and-network",
   })
   
   const {
    control,
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
} = useForm();

useEffect(()=>{
    if(data?.getMetal){
        setallMetalData(data?.getMetal)

    }

},[data])

const handleSort = (e) => {
    setLoader(true);
    const type = sort.type == -1 ? 1 : -1;
    setSort({ key: e?.sortField, type });
};

const editMetalData=(data)=>{
    setoldIndex(data?.sortIndex)
    setMetalImage(data?.image)
    setModal(true)
    reset(data)
}
const EditSubmitHandler=(data)=>{
    data.sortIndex=OrderIndex
    if (!Object.values(data)?.includes(undefined)) {
        const input = {
            id: data?.id,
            metalName:data?.metalName,
            image:data?.image,
            oldIndex:oldIndex,
            sortIndex:parseInt(data?.sortIndex),
          
        }
        setLoader(true)
        updateMetalData({ variables: { input } }).then((response) => {
            if (response?.data?.updateMetal?.id) {
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

const addMetal=()=>{
    setIndex(true)
    setModal(true);
    reset({});
}
const AddSubmitHandler=(data)=>{
    data.sortIndex=OrderIndex
    // if (!Object.values(data).includes(undefined)) {
        addMetalData({
          variables: {
            input: {
            metalName:data?.metalName,
            image:data?.image,
            sortIndex: parseInt(data?.sortIndex),
            },
          },
        })
          .then(({ data }) => {
            if (data?.createMetal?.id) {
              refetch();
              resetData();
              setLoader(false);
              toast.success("Metal added successfully");
              setIndex(false)
              setModal(false);
              reset({});
            } else {
              setModal(false);
              setLoader(false);
              toast.warn("Metal not added");
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
const deleteMetal=async(metalId) => {         
    let Status = await ConfirmationModal(
        "warning",
        "Are you sure?",
        "You won't be able to revert this!",
        "Yes, delete it!"
    );
    if (Status) {
        setLoader(true);
        deleteMetalData({
            variables: {
                deleteMetalId: metalId,
            },
        })
            .then(async ({ data }) => {
                if (data?.deleteMetal) {
                    refetch();
                    setLoader(false);
                    await ConfirmationModal("success", "Deleted!", "Metal has been deleted.", "");
                } else {
                    toast.error("Metal not deleted");
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
    setMetalImage("")

}
const getBase64 = async (e, onChange) => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.readAsDataURL(file);
    reader.onloadend = async () => {
        let result = await reader.result;
        await setMetalImage(result);
        await onChange(result);
    };
};
if (!metaltableColumn?.find((d) => d?.name === "Active")) {
    metaltableColumn.push({
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
              updateMetalData({
                variables: {
                  input: {
                    id: row?.id,
                    isActive: e.target.checked,
                  },
                },
              })
                .then((response) => {
                  if (response?.data?.updateMetal) {
                    refetch();
                    toast.success("Metal updated successfully");
                  } else {
                    toast.error("Metal not updated");
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
                    title={"Metal"}
                    setLimit={setLimit}
                    setSearchText={setSearchText}
                    setCurrentPage={setCurrentPage}
                    addData={() => addMetal()}
    
                />
                <Table
                    columns={metaltableColumn}
                    data={allMetalData?.data || []}
                    currentPage={currentPage}
                    totalRecords={allMetalData?.count || 0}
                    limit={limit}
                    deleteData={deleteMetal}
                    editData={editMetalData}
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
                            Metal Name<span className='text-danger'>&#42;</span>
                        </Label>
                        <Controller
                            id='metalName'
                            name='metalName'
                            defaultValue=''
                            {...register("metalName", {
                                required: true,
                            })}
                            control={control}
                            render={({ field }) => (
                                <Input type='text' placeholder='Enter  metalName' invalid={errors.metalName && true} {...field} />
                            )}
                        />
                        {errors && errors?.metalName && (
                            <FormFeedback>Please enter a valid metal name</FormFeedback>
                        )}
                    </div>
                    <div className="mb-1" >
                        <Label className='form-image' htmlFor='image' style={{ fontSize: "15px" }}>
                            Image
                        </Label>    
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
                        {MetalImage != "" ? (
                            MetalImage?.includes("base64") ? (
                                <img src={MetalImage} height={100} width={100} alt="advimage" className="my-1" />
                            ) : (
                                <img src={`${digitalOceanURL}${MetalImage}`} className="my-1" width={100} height={100} />
                            )
                        ) : null}
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
                                setOrderIndex(Index ? allMetalData?.count+1 : value);
                                return (
                                    <Input
                                        type="number"
                                        min="1"
                                        disabled={Index || !control?._defaultValues?.id}
                                        invalid={errors.index && true}
                                        onChange={(e) => {
                                            onChange(e?.target?.value);
                                        }}
                                        value={Index ? allMetalData?.count+1 : value}
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