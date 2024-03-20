//library
import React, { Fragment, useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Row,
  Col,
  CardTitle,
  CardText,
  Form,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
} from "reactstrap";
import { useMutation, useQuery } from "react-apollo";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Select from "../../components/Select";
import XLSX from "xlsx";
import axios from "axios";
//components
import Table from "../../components/Table";
import { productTableColumns } from "../../components/Constant"; //
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import CommanModal from "../../components/Modal"; //
import { ConfirmationModal } from "../../components/Alert"; //
import { FormatError } from "../../../@core/components/common/FormatError"; //
import { DELETE_PRODUCT } from "./mutation"; //
import { GET_ALL_PRODUCTS } from "../Products/query"; //

import Header from "../../components/Header"; //
import { IMPORT_PRODUCTS } from "../Products/mutation";
import { GET_ALL_CATEGORIES } from "../Products/query";
import { BASE_URL } from "../../../config";
// import Bankform from "./bankForm";//
const Index = () => {
  // initial states
  const [loader, setLoader] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [modal, setModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [sort, setSort] = useState({ key: "createdAt", type: 1 });
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [productCategories, _productCategories] = useState("");
	const [MultipleId, setMultipleId] = useState([]);

  const [impCategory, setImpCategory] = useState();
  const [impData, setImpData] = useState([]);

  const {
    control,
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm();

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

  //query
  const { loading, data, refetch } = useQuery(GET_ALL_PRODUCTS, {
    variables: {
      page: currentPage + 1,
      limit: limit,
      sort: sort,
      filter: "{}",
      search: searchText,
    },
    fetchPolicy: "cache-and-network",
  });

  //mutation
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  const [importProducts, { loading: IMPloading }] =
    useMutation(IMPORT_PRODUCTS);
  // const [importProducts] = useMutation(IMPORT_PRODUCTS)
  // const IMPloading = true;

  const productCommission = [
    { label: "Discount in %", value: "%" },
    { label: "Discount in Price", value: "price" },
  ];
  useEffect(() => {
    let arr = [];
    if (catData?.getAllCategories) {
      catData?.getAllCategories?.data?.map((d) =>
        arr.push({ label: d?.name, value: d?.id })
      );
      const data = arr.filter((d) => d?.label !== "On Sale" && d?.label !== "Make to Order")
      _productCategories(data);
    }
  }, [catData]);

  useEffect(() => {
    setLoader(loading);
  }, [loading]);

  useEffect(() => {
    if (data?.getAllProducts) {
      setLoader(false);
      setAllProducts(data?.getAllProducts);
    }
  }, [data]);
  const onSelectedRowsChange = (data) => {
		const Ids = data?.selectedRows?.map((d) => d?.id)
		setMultipleId(Ids)
	}

  const ExportToExcel = () => {
		setLoader(true);
		axios({
			url: BASE_URL + "/api/v1/export-search-products/",
			method: "GET",
			responseType: "blob", // important
			params: {
				filter: {
					productId: MultipleId,
					// ...((vendorUserfilter.hasOwnProperty("user") && vendorUserfilter.hasOwnProperty("vendor")) ? { createdById: [vendorUserfilter?.["user"], vendorUserfilter?.["vendor"]] } : {}),
					// // createdById: vendorUserfilter && [vendorUserfilter?.["user"],vendorUserfilter?.["vendor"]],
					// categoryId: [categoryFilter?.value],
					// status: _status?.value
				}
			},
		}).then((response) => {
			setLoader(false);
			setMultipleId([])
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "product_details.xlsx");
			document.body.appendChild(link);
			link.click();
		});

	}

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

  //function is being called on delete of city
  const DeleteProduct = async (productId) => {
    let Status = await ConfirmationModal(
      "warning",
      "Are you sure?",
      "You won't be able to revert this!",
      "Yes, delete it!"
    );
    if (Status) {
      setLoader(true);
      deleteProduct({
        variables: {
          deleteProductId: productId,
        },
      })
        .then(async ({ data }) => {
          if (data?.deleteProduct) {
            refetch();
            setLoader(false);
            await ConfirmationModal(
              "success",
              "Deleted!",
              "Product has been removed.",
              ""
            );
          } else {
            toast.error("Product not deleted");
            setLoader(false);
          }
        })
        .catch((error) => {
          // toast.error(FormatError(error));
          setLoader(false);
        });
    }
  };

  const importToggleHandler = () => {
    setModal(!modal);
  };

  //on upload sheet, convert sheet data into json data
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

  const handleImport = (e) => {
    e.preventDefault();
    if (!impData?.length || impData?.length === 0) {
      toast.error("No product found");
    }
    if (!impCategory) {
      toast.error("Please select product category");
    } else {
      setLoader(true);
      importProducts({ variables: { input: impData, categoryId: impCategory, } })
        .then((response) => {
          if (response?.data?.importProducts) {
            refetch();
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

  return (
    <Fragment>
      <Card className="w-100 h-100">
        {loader && <ComponentSpinner />}
        <CardBody style={{ flex: "unset", height: "inherit" }}>
          <Header
            limit={limit}
            title={"product"}
            refetch={refetch}
            importData
            modal={modal}
            importToggleHandler={importToggleHandler}
            setLimit={setLimit}
            setSearchText={setSearchText}
            setCurrentPage={setCurrentPage}
						exportToExcel={ExportToExcel}
          />
          <Table
            columns={productTableColumns}
            data={allProducts?.data || []}
            currentPage={currentPage}
            totalRecords={allProducts?.count || 0}
            limit={limit}
            deleteData={DeleteProduct}
            onSort={handleSort}
            handlePagination={handlePagination}
            multiSelectRow={onSelectedRowsChange}
          />
        </CardBody>
        <Modal
          isOpen={modal}
          toggle={() => importToggleHandler()}
          className={"modal-dialog-centered modal-lg"}
          backdrop={IMPloading ? "static" : undefined}
        >
          <ModalHeader toggle={() => !IMPloading && importToggleHandler()}>
            Import Inventory
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <Form
                  className={`auth-login-form mt-2  ${IMPloading && "pe-none"}`}
                >
                  <Row>
                    <Col sm="12">
                      <div className="mb-1">
                        <label
                          className="login-label"
                          style={{ marginBottom: 5 }}
                        >
                          Product Category
                          <span className="text-danger">&#42;</span>
                        </label>
                        <Select
                          options={productCategories}
                          placeholder="Select category"
                          onChange={(e) => setImpCategory(e.value)}
                        />
                      </div>
                    </Col>
                    {/* <Col sm="12">
											<div className='mb-1'>
												<label className="login-label" style={{ marginBottom: 5 }}>Product Commission Type<span className='text-danger'>&#42;</span></label>
												<Select
													options={productCommission}
													placeholder="Select Product Commission Type"
													onChange={(e) => setImpCommission(e.value)}
												/>
											</div>
										</Col> */}

                    <Col sm="12">
                      <Label className="form-label" htmlFor="inputFile">
                        Select File<span className="text-danger">&#42;</span>
                      </Label>
                      <Input
                        type="file"
                        id="inputFile"
                        name="fileInput"
                        accept=".xlsx"
                        onChange={(e) =>onChangeImport(e)}
                      />
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              outline
              onClick={(e) => handleImport(e)}
              disabled={IMPloading}
            >
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
    </Fragment>
  );
};
export default Index;
