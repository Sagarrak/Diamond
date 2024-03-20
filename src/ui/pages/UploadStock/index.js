import React, { Fragment, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { DownloadCloud, X } from "react-feather";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardText,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  ListGroup,
  Row,
  Spinner,
} from "reactstrap";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import Header from "../../components/Header";
import XLSX from "xlsx";
import { GET_ALL_CATEGORIES } from "../Products/query";
import Select from "../../components/Select";
import { useMutation, useQuery } from "react-apollo";
import { Controller, useForm } from "react-hook-form";
import { BASE_URL } from "../../../config";
import { useHistory } from "react-router-dom";
import { IMPORT_PRODUCTS } from "../Products/mutation";
import SampleFile from "../../../@core/assets/SampleList.xlsx";

const index = () => {
  const [loader, setLoader] = useState(false);
  const [modal, setModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({ key: "createdAt", type: -1 });
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [name, setName] = useState("");
  const [tableData, setTableData] = useState([]);
  const [productCategories, _productCategories] = useState([]);
  const [impCategory, setImpCategory] = useState("");
  const [owner, setOwner] = useState("");
  const [radioOption, setRadioOption] = useState("");
  const [checkboxOption, setCheckboxOption] = useState([]);
  const history = useHistory(null);
  const [importProducts] = useMutation(IMPORT_PRODUCTS);

  const checkboxNivodaRef = useRef(null);
  const checkboxIDEXRef = useRef(null);

  const radioAddRef = useRef(null);
  const radioReplaceRef = useRef(null);

  const utype = localStorage.getItem("utype");
  const {
    loading: catLoading,
    data: catData,
    refetch: catRefetch,
  } = useQuery(GET_ALL_CATEGORIES, {
    variables: {
      page: 1,
      limit: 100,
      sort: { key: "sortOrder", type: -1 },
      filter: "{}",
      search: "",
    },
    fetchPolicy: "cache-and-network",
  });
  useEffect(() => {
    let arr = [];
    if (catData?.getAllCategories) {
      catData?.getAllCategories?.data?.map((d) =>
        arr.push({ label: d?.name, value: d?.id })
      );
      const data = arr.filter(
        (d) => d?.label !== "On Sale" && d?.label !== "Make to Order"
      );
      _productCategories(data);
    }
  }, [catData]);

  const DownloadSampleFile = () => {
    const a = document.createElement("a");
    a.href = SampleFile;
    a.download = "Sample List.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getTableData = (arr, name) => {
    setTableData(arr);
    setName(name);
  };

  const {
    control,
    reset,
    // setError,
    handleSubmit,
    register,
    watch,
    trigger,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (result) => {
      const reader = new FileReader();
      reader.onload = function () {
        const fileData = reader.result;
        const wb = XLSX.read(fileData, { type: "binary" });

        wb.SheetNames.forEach(function (sheetName) {
          const rowObj = XLSX.utils.sheet_to_row_object_array(
            wb.Sheets[sheetName]
          );
          getTableData(rowObj, result[0].name);
        });
      };
      if (result.length && result[0].name.endsWith("xlsx")) {
        reader.readAsBinaryString(result[0]);
      } else {
        toast.error("Invalid  file format");
        // toast.error(<ErrorToast />, { icon: false, hideProgressBar: true })
      }
    },
  });
  const handleReset = () => {
    setTableData([]);
    setImpCategory("");
    setOwner("");
    setRadioOption("");
    setCheckboxOption("");
    setName("");
  };
  const UploadFile = (e) => {
    e.preventDefault();
    if (!impCategory?.value) {
      toast.error("Please select product category");
    } else if (!owner) {
      toast.error("Please add owner name");
    } else if (!tableData?.length || tableData?.length === 0) {
      toast.error("Either Sheet is empty or format is Invalid");
    } else {
      setLoader(true);
    //   const checkname = checkboxOption?.map((d) => d?.name);
      importProducts({
        variables: {
          input: tableData,
          categoryId: impCategory?.value,
          owner: owner,
          isRemoveAll: radioOption === "Replace" ? true : false,
          // isNivoda: checkname.includes("Nivoda") ? true : false,
          // isIDEX: checkname.includes("IDEX") ? true : false,
        },
      })
        .then((response) => {
          if (response?.data?.importProducts) {
            reset();
            catRefetch()
            handleReset();
            // refetch()
            toast.success("Product imported successfully.");
            // if (checkboxNivodaRef || checkboxIDEXRef) {
            //   checkboxNivodaRef.current.checked = false;
            //   checkboxIDEXRef.current.checked = false;
            // }
            // if (radioAddRef || radioReplaceRef) {
            //   radioAddRef.current.checked = false;
            //   radioReplaceRef.current.checked = false;
            // }
            setLoader(false);
          }
        })
        .catch((err) => {
          toast.error("Product data is not imported");
          setLoader(false);
          handleReset("");
        });
    }
  };
  const handleOptionChange = (e) => {
    setRadioOption(e);
  };
  const handleCheckboxChange = (name, e) => {
    const isChecked = e?.target?.checked;
    const updatedOptions = [...checkboxOption];

    if (isChecked) {
      setCheckboxOption([
        ...checkboxOption,
        { name, value: e?.target?.checked },
      ]);
    } else {
      const data = updatedOptions?.filter((d) => d?.name !== name);
      setCheckboxOption(data);
    }
  };

  return (
    <Fragment>
      <Card className="w-100 h-100">
        <CardBody style={{ flex: "unset", height: "inherit" }}>
          <div>
            <div>
              <p className="upload-stock fw-bolder mt-2 ">
                Uploading stock on CVD Mart
              </p>
              <span className="fs-4">
                There are many ways that you can upload your stock to CVD
                Mart.Please note that stock that has not been updated within the
                last 48 hours will no longer appear in search results.{" "}
              </span>
            </div>
            <Row>
              <Col md={utype === "AssociateVendor" ? "6" : "12"}>
                <Card className="custom-card mt-2">
                  <CardBody>
                    <p className="fs-4 mt-2 font-family">
                      Step 1: Add your file.
                    </p>
                    <div className="d-flex w-100">
                      <div
                        className={
                          utype === "AssociateVendor"
                            ? "border-dotted mt-2  w-100"
                            : "border-dotted mt-2 w-50"
                        }
                      >
                        {!name ? (
                          <div {...getRootProps({ className: "dropzone" })}>
                            <input {...getInputProps()} />
                            <div className="d-flex align-items-center justify-content-center flex-column mt-4">
                              <DownloadCloud size={40} />
                              <h5>Drop Files here or click to upload</h5>
                              <p className="text-secondary">
                                Drop files here or click{" "}
                                <a href="/" onClick={(e) => e.preventDefault()}>
                                  browse
                                </a>{" "}
                                thorough your machine
                              </p>
                            </div>
                          </div>
                        ) : (
                          <ListGroup className="my-2 d-flex align-items-center justify-content-center flex-column mt-4">
                            {name}
                          </ListGroup>
                        )}
                      </div>
                      {utype === "Admin" && (
                        <div className="mt-2 direct-upload  mb-2 w-50 ms-2">
                          <Card className="custom-card">
                            <CardBody>
                              <Col sm={4} className=" mt-2 w-100">
                                <div className="fs-4">Direct upload</div>
                                <div>
                                  <Button
                                    color="primary"
                                    className="btn btn-primary mt-2 ms-2 font-family w-50"
                                    onClick={() => {
                                      DownloadSampleFile();
                                    }}
                                  >
                                    Download Sample File
                                  </Button>
                                </div>
                              </Col>
                            </CardBody>
                          </Card>
                        </div>
                      )}
                    </div>
                    <p className="mt-1 font-family">
                      Accepted file type only XLSX
                    </p>
                    <p className="fs-4 mt-2 font-family ">
                      Step 2: Select category.
                      <span className="text-danger">&#42;</span>
                    </p>
                    <div
                      className={
                        utype === "AssociateVendor"
                          ? "mb-1 mt-2 "
                          : "mb-1 mt-2 w-50"
                      }
                    >
                      <Select
                        options={productCategories}
                        placeholder="Select category"
                        value={impCategory}
                        onChange={(e) => setImpCategory(e)}
                      />
                    </div>
                    <p className="fs-4 mt-2 font-family">
                      Step 3: Add Owner name.
                      <span className="text-danger">&#42;</span>
                    </p>
                    <div
                      className={
                        utype === "AssociateVendor" ? "mt-2" : "mt-2 w-50"
                      }
                    >
                      <Controller
                        name="owner"
                        className="mt-2"
                        control={control}
                        render={({ field }) => {
                          return (
                            <Input
                              type="text"
                              {...register("owner", {
                                required: true,
                              })}
                              invalid={errors?.owner && true}
                              required
                              {...field}
                              value={owner}
                              placeholder="Owner Name"
                              onChange={(e) => setOwner(e?.target?.value)}
                            />
                          );
                        }}
                      />
                      {errors.owner && (
                        <FormFeedback> Owner Name is required </FormFeedback>
                      )}
                    </div>
                    {utype !== "AssociateVendor" && (
                      <>
                        {/* <p className="fs-4 mt-2 font-family">
                          Step 4: Select Upload Option.
                        </p> */}
                        {/* <Row>
                          <Col
                            sm={utype === "AssociateVendor" ? 6 : 4}
                            className="d-flex mt-2"
                          >
                            <div className="border-solid">
                              <FormGroup check inline>
                                <Label check>
                                  <div>
                                    <Input
                                      type="checkbox"
                                      onClick={(e) =>
                                        handleCheckboxChange("Nivoda", e)
                                      }
                                      innerRef={checkboxNivodaRef}
                                    />
                                  </div>
                                  <div>
                                    <b className="font-family">Nivoda</b>
                                    <p className="mt-1">
                                      Add new Diamonds and update all currently
                                      listed diamonds.{" "}
                                    </p>
                                  </div>
                                </Label>
                              </FormGroup>
                            </div>
                          </Col>
                          <Col
                            sm={utype === "AssociateVendor" ? 6 : 4}
                            className="d-flex mt-2"
                          >
                            <div className="border-solid">
                              <FormGroup check inline>
                                <Label check>
                                  <div>
                                    <Input
                                      type="checkbox"
                                      onClick={(e) =>
                                        handleCheckboxChange("IDEX", e)
                                      }
                                      innerRef={checkboxIDEXRef}
                                    />
                                  </div>
                                  <div>
                                    <b className="font-family">IDEX</b>
                                    <p className="mt-1">
                                      All diamonds which aren't included in this
                                      update will be deleted
                                    </p>
                                  </div>
                                </Label>
                              </FormGroup>
                            </div>
                          </Col>
                        </Row> */}
                      </>
                    )}
                    {utype !== "AssociateVendor" ? (
                      <p className="fs-4 mt-2 font-family">
                        Step 4: Select Upload Option.
                      </p>
                    ) : (
                      <p className="fs-4 mt-2 font-family">
                        Step 4: Select Upload Option.
                      </p>
                    )}

                    <Row>
                      <Col
                        sm={utype === "AssociateVendor" ? 6 : 4}
                        className="d-flex mt-2"
                      >
                        <div className="border-solid">
                          <FormGroup check>
                            <Label check>
                              <div>
                                <Input
                                  type="radio"
                                  name="radioGroup"
                                  onChange={(e) =>
                                    handleOptionChange("AddUpdate", e)
                                  }
                                  innerRef={radioAddRef}
                                />
                              </div>
                              <div></div>
                              <b className="font-family">Add & Update</b>
                              <p className="mt-1">
                                Add new Diamonds and update all currently listed
                                diamonds.{" "}
                              </p>
                            </Label>
                          </FormGroup>
                        </div>
                      </Col>
                      <Col
                        sm={utype === "AssociateVendor" ? 6 : 4}
                        className="d-flex mt-2"
                      >
                        <div className="border-solid">
                          <FormGroup check>
                            <Label check>
                              <Input
                                type="radio"
                                name="radioGroup"
                                onChange={(e) =>
                                  handleOptionChange("Replace", e)
                                }
                                innerRef={radioReplaceRef}
                              />
                              <b className="font-family">Replace All</b>
                              <p className="mt-1">
                                All diamonds which aren't included in this
                                update will be deleted
                              </p>
                            </Label>
                          </FormGroup>
                        </div>
                      </Col>
                    </Row>
                    <Button
                      color="primary"
                      className="btn btn-primary mt-4 w-100 font-family"
                      onClick={(e) => { !loader && UploadFile(e); }}
                    >
                      Upload File
                      {
                        loader && <Spinner />
                      }
                    </Button>
                  </CardBody>
                </Card>
              </Col>
              {utype === "AssociateVendor" && (
                <Col md="6">
                  <Card className="custom-card mt-2">
                    <CardBody>
                      <Col sm={4} className=" mt-2 w-100 text-center">
                        <div className="fs-4">Direct upload</div>
                        <div>
                          <Button
                            color="primary"
                            className="btn btn-primary mt-2 ms-2 font-family w-50"
                            onClick={() => {
                              DownloadSampleFile();
                            }}
                          >
                            Download Sample File
                          </Button>
                        </div>
                      </Col>
                    </CardBody>
                  </Card>
                  <Card className="custom-card">
                    <CardBody>
                      <Col sm={4} className=" mt-2 w-100">
                        {/* <div>
                          Lorem, ipsum dolor sit amet consectetur adipisicing
                          elit. Voluptas eum expedita necessitatibus. Provident
                          illum, nisi cum a tenetur accusamus repellat nobis rem
                          culpa tempora. Eum accusamus sequi voluptatum deleniti
                          itaque. Et, quisquam obcaecati nobis vel porro minima
                          soluta at adipisci tempore quia architecto perferendis
                          sequi facilis, totam deserunt suscipit repellendus
                          ipsam necessitatibus consequatur illo, possimus rem
                          libero cum officia! Corporis?
                        </div> */}
                        <div>
                          <Button
                            block
                            type="submit"
                            color="primary"
                            className="w-100 mt-2 font-family"
                            onClick={() => {
                              history.push("/generate-vendor-authkey");
                            }}
                          >
                            API
                          </Button>
                        </div>
                      </Col>
                    </CardBody>
                  </Card>
                  <Card className="custom-card">
                    <CardBody>
                      <Col sm={4} className=" mt-2 w-100">
                        {/* <div>
                          Lorem, ipsum dolor sit amet consectetur adipisicing
                          elit. Voluptas eum expedita necessitatibus. Provident
                          illum, nisi cum a tenetur accusamus repellat nobis rem
                          culpa tempora. Eum accusamus sequi voluptatum deleniti
                          itaque. Et, quisquam obcaecati nobis vel porro minima
                          soluta at adipisci tempore quia architecto perferendis
                          sequi facilis, totam deserunt suscipit repellendus
                          ipsam necessitatibus consequatur illo, possimus rem
                          libero cum officia! Corporis?
                        </div> */}
                        <div>
                          <a
                            href={`${BASE_URL}/vendor-api-docs`}
                            target="_blank"
                            className="d-block w-100"
                          >
                            <Button
                              block
                              type="submit"
                              color="primary"
                              className="mt-2 font-family"
                            >
                              View Documentation
                              {/* {loading && <Spinner size={"sm"} />} */}
                            </Button>
                          </a>
                        </div>
                      </Col>
                    </CardBody>
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  );
};

export default index;
