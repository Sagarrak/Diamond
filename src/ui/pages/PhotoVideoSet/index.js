import React, { Fragment, useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo';
import { useForm } from 'react-hook-form';
import { Button, Card, CardBody, Col, Form, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import Header from "../../components/Header";
import CommonModal from "../../components/Modal";
import { ADD_PHOTO_VIDEO, GENERATE_PRESIGNED_PHOTO_VIDEO, DELETE_PHOTO_VIDEO } from './mutation'
import { GET_ALL_PHOTO_VIDEO } from './query';
import Table from "../../components/Table";
import axios from 'axios';
import { toast } from 'react-toastify';
import { ConfirmationModal } from '../../components/Alert';
import { digitalOceanURL } from '../../common/common'
import Image from "../../components/Image";
import play from '../../../../src/assets/images/svg/play-circle.svg'

function index() {
  const [loader, setLoader] = useState(false);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [PhotoVideoData, setPhotoVideoData] = useState([]);
  const [modal, setModal] = useState(false);
  const [video, setVideo] = useState();
  const [image, setImage] = useState({ image: "", video: "" });
  const [imageOpen, setImageOpen] = useState(false);
  const [toolTipMsg, _toolTipMsg] = useState("Copy");
  const [displayErrorVideo, setDisplayErrorVideo] = useState(false);

  const [addImageVideo] = useMutation(ADD_PHOTO_VIDEO);
  const [generatePresignedURL] = useMutation(GENERATE_PRESIGNED_PHOTO_VIDEO);
  const [deleteImageVideo] = useMutation(DELETE_PHOTO_VIDEO);

  const {
    control,
    reset,
    setError,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const { loading, data, refetch } = useQuery(GET_ALL_PHOTO_VIDEO, {
    variables: {
      page: 1,
      limit: 1000,
    },
    fetchPolicy: "cache-and-network",
  });


  const imageVideoSetTableColumns = [

    {
      name: "Image/Video",
      sortable: true,
      minWidth: "100px",
      sortField: "url",
      selector: (row) => (
        row?.url.split("/").includes("image") ?
          <div className="d-flex align-items-center" onClick={() => {
            setImage({ image: row?.url })
            setImageOpen(!imageOpen)
          }}>
            <Image photo={row?.url ? `${digitalOceanURL}${row?.url}` : TempImg} width="100px" height="100px" />
          </div>
          :
          <div class="video" onClick={() => {
            setImage({ video: row?.url })
            setImageOpen(!imageOpen)
          }}>
            <img src={play}></img>
          </div>
      )
    }
  ]
  useEffect(() => {
    if (data?.getImgVid) {
      setPhotoVideoData(data?.getImgVid?.data)

    }
  }, [data])

  const importToggleHandler = () => {
    setModal(!modal)

  }
  const handlePagination = (page) => {
    setLoader(true);
    setCurrentPage(page?.selected);
  };
  const deletephotovideo = async (imageId) => {
    setLoader(true);
    let Status = await ConfirmationModal(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, delete it!"
    );
    if (Status) {
      setLoader(true);
      deleteImageVideo({
        variables: {
          deleteImgVidUploadId: imageId,
        }
      })
        .then(async ({ data }) => {
          if (data?.deleteImgVidUpload) {
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

  }
  const AddSubmitHandler = () => {
    setModal(true)
    generatePresignedURL({ variables: { typeOfFile: video?.type.split("/")[1] } }).then((res) => {
      if (res?.data?.generatePreSignedUrl) {
        uploadFile(video, res?.data?.generatePreSignedUrl?.fileName, res?.data?.generatePreSignedUrl?.URL, video?.type.split("/")[1])
        addImageVideo({
          variables: {
            input: {
              url: res?.data?.generatePreSignedUrl.fileName
            }
          }
        }).then(response => {
          if (response) {
            refetch();
            setModal(false);
            toast.success("Image/Video add successfully");
          } else {
            toast.error("Image/Video not added");
          }
        })
          .catch(error => {
            toast.warn(error.message);
          })

      }
    })


  }
  const uploadFile = async (file, fileName, url, type) => {
    let myRenamedFile = new File([file], fileName);
    let uploadData = myRenamedFile;
    let contentType = type == "mp4" ? "video/mp4" : "image/jpeg"
    await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        "x-amz-acl": "public-read",
      },
      body: uploadData,
    });


  };
  const onChangeVideo = (e) => {
    e.preventDefault();
    const file = e?.target?.files[0];

    let size = file?.size / 1024 / 1024;
    // _filesize(size)

    let fileSize = size;
    if (file?.size > 8000) {
      //8589934592 - 8GB
      setDisplayErrorVideo(true);
    }
    const allowedExtensions = [
      "flv",
      "FLV",
      "mov",
      "MOV",
      "mkv",
      "MKV",
      "mp4",
      "MP4",
      "webm",
      "WEBM",
      "3gp",
      "3GP",
      "avi",
      "AVI",
      "m4v",
      "M4V",
      "jpg",
      "jpeg",
      "png",
      "mp3",
      "svg"
    ];
    const fileExtension = file?.name?.split(".")?.pop();
    if (!allowedExtensions?.includes(fileExtension)) {
      setDisplayErrorVideo(true);

      setTimeout(() => {
        setDisplayErrorVideo(false);
      }, 3000);
    } else {
      if (file?.size / 1000000 > 8000) {
        toast.error("Your video exceeds the maximum size limit of 8GB");
      } else {
        setVideo(file)

        setDisplayErrorVideo(false);
      }

    }

  }
  const importToggleHandlerImage = () => {
    setImageOpen(!imageOpen)
  }
  
  const copyURL = async (data) => {
    await navigator?.clipboard?.writeText(data);
    _toolTipMsg("Copied")

  }
  return (
    <Fragment>
      <Card className="w-100 h-100" >
        {loader && <ComponentSpinner />}
        <CardBody style={{ flex: "unset", height: "inherit" }} >
          <h2 style={{ textAlign: "center" }} >Photos/Videos Set </h2>
          <Header
            limit={limit}
            // addData={() => addHomeData()}
            setLimit={setLimit}
            title="Photo/Video"
            uploadHandler={importToggleHandler}
            setCurrentPage={setCurrentPage}
          />
          <Table
            limit={limit}
            columns={imageVideoSetTableColumns}
            data={PhotoVideoData}
            currentPage={currentPage}
            handlePagination={handlePagination}
            copyURL={copyURL}
            toolTipMsg={toolTipMsg}
            totalRecords={PhotoVideoData?.count || 0}
            // editData={editHomePageContent}
            deleteData={deletephotovideo}
          />
        </CardBody>

        <CommonModal
          modal={modal}
          setModal={setModal}
          toggleHandler={importToggleHandler}
          loading={loader}
          updateId={control._defaultValues?.id ? true : false}
          modalTitle={control._defaultValues?.id ? "Update " : "Add "}
          title="Photo/Video"
          addButtonHandler={handleSubmit(AddSubmitHandler)}
        //   updateButtonHandler={handleSubmit(EditSubmitHandler)}
        >
          <Form className='auth-login-form ' onSubmit={handleSubmit(AddSubmitHandler)}>
            <Row>
              <Col sm="12">
                <Form className={`auth-login-form mt-2 `}>
                  <Row>
                    <Col sm="12">
                      <Label className="form-label" for="inputFile">
                        Select File<span className="text-danger">&#42;</span>
                      </Label>
                      <Input
                        type="file"
                        id="inputFile"
                        name="fileInput"
                        accept=".mp3,.MP3,.mp4,.MP4,.jpg,.JPEG,.png,.PNG,.jpeg,.JPEG"
                        onChange={(e) => onChangeVideo(e)}
                      />
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>

          </Form>

        </CommonModal>
        {imageOpen && (
          <Modal
            isOpen={imageOpen}
            toggle={importToggleHandlerImage}
            className={"modal-dialog-centered modal-lg imagemodal"}
            style={{ width: "530px", height: "500px" }}>
            <ModalHeader toggle={() =>  importToggleHandlerImage()}>
             {image?.image ? "Show Image": "Play video"}
            </ModalHeader>
            <ModalBody>
              {image?.image ? <img src={`${digitalOceanURL}${image?.image}`} width="500px" height="500px" /> :
                <video controls loop={false} width="500px" height="300px">
                  <source src={`${digitalOceanURL}${image?.video}`} type="video/mp4" />
                </video>
              }

            </ModalBody>
          </Modal>
        )}

      </Card>
    </Fragment>
  )
}

export default index