import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Label,
  Row,
  Spinner,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Input,
} from "reactstrap";
import XLSX from "xlsx";
import { toast } from "react-toastify";
import { FormatError } from "../../../@core/components/common/FormatError"; //

import { BookOpen, Copy, Download } from "react-feather";

import SampleFile from "../../../@core/assets/SampleList.xlsx";
import { useHistory } from "react-router-dom";
import { IMPORT_PRODUCTS } from "../Products/mutation";
import { useMutation, useQuery } from "react-apollo";
import Select from "../../components/Select";
import { GET_ALL_CATEGORIES } from "../Products/query";
import { BASE_URL } from "../../../config";
import { digitalOceanURL } from "../../common/common";

function UploadStock() {
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const [importProducts, { loading: IMPloading }] = useMutation(IMPORT_PRODUCTS);
  const [productCategories, _productCategories] = useState("");
  const [impCategory, setImpCategory] = useState();
  const [impData, setImpData] = useState([]);
  const [loader, setLoader] = useState(false);

  const {
    loading: catLoading,
    data: catData,
    refetch: catRefetch,
  } = useQuery(GET_ALL_CATEGORIES, {
    variables: {
      page: 1,
      limit: 100,
      sort: { key: "createdAt", type: -1 },
      filter: "{}",
      search: "",
    },
    fetchPolicy: "cache-and-network",
  });

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = SampleFile;
    a.download = "Sample List.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  const importToggleHandler = () => {
    setModal(!modal);
  };

  useEffect(() => {
    let arr = [];
    if (catData?.getAllCategories) {
      catData?.getAllCategories?.data?.map((d) => arr.push({ label: d?.name, value: d?.id }));
			const data = arr.filter((d) => d?.label !== "On Sale" && d?.label !== "Make to Order")
      _productCategories(data);
    }
  }, [catData]);
  // const viewDocumentation = () => {
  //     let navigate = useNavigate();
  //     let path = `${BASE_URL}/api-docs`
  //     navigate(path);
  // }

  const handleImport = (e) => {
    e.preventDefault();
    if (!impData?.length || impData?.length === 0) {
      toast.error("No product found");
    } else if (!impCategory) {
      toast.error("Please select product category");
    } else {
      setLoader(true);
      importProducts({ variables: { input: impData, categoryId: impCategory } })
        .then((response) => {
          if (response?.data?.importProducts) {
            // refetch()
            toast.success("Product imported successfully.");
            setLoader(false);
            importToggleHandler();
            setImpData([]);
          }
        })
        .catch((err) => {
          toast.error(FormatError(err));
          setLoader(false);
          importToggleHandler();
          setImpData([]);
        });
    }
  };

  const onChangeImport = (e) => {
    e.preventDefault();
    const [file] = e.target.files;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      Object.keys(ws).forEach((key) => {
        if (ws[key]?.l) {
          ws[key].v = ws[key]?.l?.Target ? ws[key]?.l?.Target.replace("amp;", "") : "";
        }

        if (ws[key]?.v === "-") {
          ws[key].v = "";
        }
      });
      let json = XLSX.utils.sheet_to_json(ws);
      json = json.filter((d) => {
				if (impCategory?.label === "Certified Diamond") {
					return Boolean(d?.["Stock #"]);
				} else {
					return Boolean(d?.["Stock #"]);
				}
			});
      setImpData(json);
    };
    reader.readAsBinaryString(file);
  };
  return (
    <div>
      <Card className="w-100">
        <Row className="d-flex justify-content-center">
          <Col md={{ size: 4, order: 0 }} xs={{ size: 4, order: 1 }}>
            <CardBody>
              <Button
                block
                type="submit"
                color="primary"
                className="d-flex justify-content-center"
                onClick={() => {
                  importToggleHandler(!modal);
                }}
              >
                Upload Stock Excel
                {/* {loading && <Spinner size={"sm"} />} */}
              </Button>
            </CardBody>
          </Col>
          <Col md={{ size: 4, order: 0 }} xs={{ size: 4, order: 1 }}>
            <CardBody>
              <Button
                block
                type="submit"
                color="primary"
                className="d-flex justify-content-center"
                onClick={() => {
                  history.push("/generate-vendor-authkey");
                }}
              >
                API
                {/* {loading && <Spinner size={"sm"} />} */}
              </Button>
            </CardBody>
          </Col>
        </Row>
        <Row className="d-flex justify-content-center">
          <Col md={{ size: 4, order: 0 }} xs={{ size: 4, order: 1 }}>
            <CardBody>
              <Button
                block
                type="submit"
                color="primary"
                className="d-flex justify-content-center"
                onClick={() => {
                  handleDownload();
                }}
              >
                Download Sample Excel
                {/* {loading && <Spinner size={"sm"} />} */}
              </Button>
            </CardBody>
          </Col>
          <Col lg={4}>
            <CardBody>
              <a href={`${BASE_URL}/vendor-api-docs`} target="_blank">
                <Button block type="submit" color="primary" className="d-flex justify-content-center">
                  View Documentation
                  {/* {loading && <Spinner size={"sm"} />} */}
                </Button>
              </a>
            </CardBody>
          </Col>
        </Row>
        <Modal
          isOpen={modal}
          toggle={() => importToggleHandler()}
          className={"modal-dialog-centered modal-lg"}
          backdrop={IMPloading ? "static" : undefined}
        >
          <ModalHeader toggle={() => !IMPloading && importToggleHandler()}>Import Inventory</ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <Form className={`auth-login-form mt-2  ${IMPloading && "pe-none"}`}>
                  <Row>
                    <Col sm="12">
                      <div className="mb-1">
                        <label className="login-label" style={{ marginBottom: 5 }}>
                          Product Category<span className="text-danger">&#42;</span>
                        </label>
                        <Select
                          options={productCategories}
                          placeholder="Select category"
                          onChange={(e) => setImpCategory(e.value)}
                        />
                      </div>
                    </Col>
                    <Col sm="12">
                      <Label className="form-label" htmlFor="inputFile">
                        Select File<span className="text-danger">&#42;</span>
                      </Label>
                      <Input
                        type="file"
                        id="inputFile"
                        name="fileInput"
                        accept=".xlsx"
                        onChange={(e) => onChangeImport(e)}
                      />
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" outline onClick={(e) => handleImport(e)} disabled={IMPloading}>
              {IMPloading ? (
                <>
                  Importing &nbsp; <Spinner size="sm" />
                </>
              ) : (
                "Import"
              )}
            </Button>
          </ModalFooter>
        </Modal>
      </Card>
    </div>
  );
}

export default UploadStock;
