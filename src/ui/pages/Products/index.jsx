//library
import React, { Fragment, useEffect, useRef, useState } from "react";
import { Card, CardBody, Row, Col, Label, Input, Button, CardHeader, CardTitle, UncontrolledPopover, FormFeedback } from "reactstrap";
import { useMutation, useQuery } from "react-apollo";
import { toast } from "react-toastify";
import Select from "../../components/Select";
import XLSX from "xlsx";
import "./index.scss";

//components
import Table from "../../components/Table";
import { productTableColumns } from "../../components/Constant";
import ComponentSpinner from "../../../@core/components/spinner/Loading-spinner";
import { ConfirmationModal } from "../../components/Alert";
import { FormatError } from "../../../@core/components/common/FormatError";
import { DELETE_PRODUCT, UPDATE_PRODUCT, ADD_PRODUCT, IMPORT_PRODUCTS, ADDING_MATCHING_PAIR, UPDATE_MATCHING_PAIR } from "./mutation";
import { GET_ALL_PRODUCTS, GET_ALL_SHAPE, GET_ALL_CATEGORIES } from "../Products/query";
import { GET_ALL_PARAMETERS } from "../Parameters/query";
import { GET_ALL_USERS, GET_ASSCOIATE_VENDOR } from '../Users/query'
import Header from "../../components/Header";
import TempImg from "../../../assets/images/icons/product-image.png";


// Validation Imports
import { useFieldArray, useForm } from "react-hook-form";
import ImportProductModal from "./ImportProductModal";
import ProductForm from "./ProductForm";
import ViewProduct from "./ViewProduct";
import CertifiedDiamond from "./ProductsForm/CertifiedDiamond";
import CommonFields from "./ProductsForm/CommonFields";
import LooseandLayout from "./ProductsForm/LooseandLayout";
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import LayoutsDiamond from "./ProductsForm/LayoutsDiamond";
import { BASE_URL } from "../../../config";
import Image from "../../components/Image";
import { digitalOceanURL, isURL } from '../../common/common'
import axios from "axios";


const Index = () => {
	// initial states
	const [loader, setLoader] = useState(false);
	const [allProducts, setAllProducts] = useState([]);
	const [modal, setModal] = useState(false);
	const [importModal, setImportModal] = useState(false);
	const [categoryModal, setCategoryModal] = useState(false);
	const [matchingModal, setMatchingModal] = useState(false);
	const [looselayoutModal, setLooseLayout] = useState(false);
	const [layoutsModal, setLayouts] = useState(false);
	const [searchText, setSearchText] = useState("");
	const [sort, setSort] = useState({ key: "createdAt", type: -1 });
	const [limit, setLimit] = useState(10);
	const [currentPage, setCurrentPage] = useState(0);
	const [shapeArr, setShapeArr] = useState([]);
	const [viewModal, setViewModal] = useState();
	const [viewProduct, setViewProduct] = useState();
	const [MultipleId, setMultipleId] = useState([]);


	const [productCategories, _productCategories] = useState([]);
	const [users, setgetAllUsers] = useState([]);
	const [image, setImage] = useState("");
	// const [productDetails, _productDetails] = useState([{ carats: "", color: "" }]);
	const [productDetails, _productDetails] = useState([]);

	const [impCategory, setImpCategory] = useState("");
	const [productCategory, setProductCategory] = useState("");
	const [impData, setImpData] = useState([]);
	const [owner, setOwner] = useState("");
	const [_vendor, _setVendor] = useState("");
	const [_status, _setStatus] = useState("");
	const [categoryFilter, setcategoryFilter] = useState("");
	const [userfilter, setuserFilter] = useState("");
	const [vendorfilter, setVendorFilter] = useState("");
	const [vendorUserfilter, setVendorUserFilter] = useState("");
	const [status, setStatus] = useState("");
	const [type, _setType] = useState("");

	const [selectedData, setselectedData] = useState("")
	const [filterData, setFilterData] = useState({});

	const [certifiedImage, setcertifiedImage] = useState("")
	const [looseDiamondImage, setlooseDiamondImage] = useState("")
	const [layoutDiamondImage, setlayoutDiamondImage] = useState("")


	//matching pair
	const [diamondVideomp4, setDiamondVideomp4] = useState()
	const [singlediamondVideomp4, setsingleDiamondVideomp4] = useState()
	const [diamondVideo, setDiamondVideo] = useState()
	const [diamondImage, setDiamondImage] = useState()
	const [diamondCertified, setDiamondCertified] = useState()
	const [productDescription, setproductDescription] = useState()
	const [stockId, setstockId] = useState()
	const [stockIdForPair, setstockIdForPair] = useState()
	const [availability, setavailability] = useState()
	const [pricePerCarat, setpricePerCarat] = useState()
	const [netValue, setnetValue] = useState()
	const [report, setreport] = useState()
	const [country, setcountry] = useState()
	const [shape, setShape] = useState("");
	const [carat, setcarat] = useState("");
	const [color, setColor] = useState("");
	const [clarity, setClarity] = useState("");
	const [cut, setCut] = useState("");
	const [polish, setPolish] = useState("");
	const [symmetry, setSymmetry] = useState("");
	const [lab, setLab] = useState("");
	const [location, setLocation] = useState("");
	const [shade, setshade] = useState("");
	const [matchingPair, setmatchingPair] = useState([])
	const [matchingPairProductDetails, setmatchingPairProductDetails] = useState([])
	const [looseDiamondDetails, setlooseDiamondDetails] = useState([])
	const [layoutDiamondDetails, setlayoutDiamondDetails] = useState([])


	const [matchingdiamondvideomp4, setmatchingdiamondvideomp4] = useState("")
	const [matchingsingleDiamond, setmatchingsinglediamond] = useState("")
	const [matchingDiamondvideo, setmatchingDiamondvideo] = useState("")
	const [matchingDiamondimage, setmatchingDiamondimage] = useState("")
	const [matchingDiamondcertificate, setmatchingDiamondcertificate] = useState("")
	const [matchingDiamondescription, setmatchingDiamondescription] = useState("")
	const [matchingStockId, setmatchingStockId] = useState("")
	const [matchingStockIdForPair, setmatchingStockIdForPair] = useState("")
	const [matchingavailability, setmatchingavailability] = useState("")
	const [matchingapricepercarat, setmatchingapricepercarat] = useState("")
	const [matchingnetvalue, setmatchingnetvalue] = useState("")
	const [matchingnreport, setmatchingnreport] = useState("")
	const [matchingcountry, setmatchingcountry] = useState("")
	const [matchingshape, setmatchingnshape] = useState("")

	const [nextPage, setNextPage] = useState("")
	const [isClearable, setIsClearable] = useState(true);

	const [Error, setError] = useState({
		productName: false,
		matchingPair: false,
		PricePerCarat: false,
		netValue: false,
		shapeId: false,
		status: false,
	})
	const ProductTable = ["Global", "CertifiedDiamond", "MatchingPair", "OnSale", "Layouts", "LooseDiamonds"];
	const StatusOptions = [
		{ value: "AVAILABLE", label: "AVAILABLE" },
		{ value: "HOLD", label: "HOLD" },
		{ value: "IN LAB", label: "IN LAB" },
	];

	// ** Validation modules
	const {
		control,
		reset,
		// setError,
		handleSubmit,
		register,
		watch,
		trigger,
		formState: { errors },
	} = useForm({ mode: 'onChange' });



	const myValue = watch("DiamondVideoMp4")
	const resetData = () => {
		setImage("");
		_productDetails([]);
		setmatchingPair([]);
		setmatchingPairProductDetails([]);
		setlooseDiamondDetails([])
		setlayoutDiamondDetails([])
		setStatus("");
		setpricePerCarat("")

		setcertifiedImage("")
		setcertifiedImage("")
		setlayoutDiamondImage("")
		setlooseDiamondImage("")
		_setType("");
		setColor("")
		// setavailability("")
		// setcountry("")
		setDiamondVideo("")
		setmatchingDiamondvideo("")
		setnetValue("")
		setmatchingnetvalue("")
		setreport("")
		setmatchingnreport("")
		setmatchingavailability("")
		setmatchingcountry("")
		setmatchingnshape("")
		setsingleDiamondVideomp4("")
		setmatchingsinglediamond("")
		setDiamondCertified("")
		setDiamondVideomp4("")
		setDiamondImage("")
		setDiamondVideo("")
		setstockId("")
		setmatchingStockId("")
		setstockIdForPair("")
		setmatchingStockIdForPair("")
		setmatchingdiamondvideomp4("")
		setmatchingDiamondescription("")
		setmatchingapricepercarat("")
		setshade("")
		setreport("")
		setClarity("")
		setcarat("")
		setpricePerCarat("")
		setproductDescription("")
		setavailability("")
		setnetValue("")
		reset({})
	};
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
	const { loading: userloading, data: userData, refetch: userRefetch } = useQuery(GET_ALL_USERS, {
		variables: {
			page: currentPage + 1,
			limit: limit,
			sort: sort,
			filter: JSON.stringify({ isAdmin: true }),
			search: searchText,
		},
		fetchPolicy: "cache-and-network",
	});
	const { loading: vendorloading, data: vendorData, refetch: vendorRefetch } = useQuery(GET_ASSCOIATE_VENDOR, {
		variables: {
			page: currentPage + 1,
			limit: limit,
			sort: sort,
			filter: JSON.stringify({ isVendor: true }),
			search: searchText,
		},
		fetchPolicy: "cache-and-network",
	});

	const { loading, data, refetch } = useQuery(GET_ALL_PRODUCTS, {
		variables: {
			page: currentPage + 1,
			limit: limit,
			sort: sort,
			filter: JSON.stringify(filterData),
			search: searchText,
		},
		fetchPolicy: "cache-and-network",
	});

	//query
	const { data: shapeData } = useQuery(GET_ALL_SHAPE, {
		variables: {
			page: 1,
			limit: 100,
			sort: { key: "sortOrder", type: 1 },
			filter: "{}",
			search: "",
		},
		fetchPolicy: "cache-and-network",
	});

	// -------- query ------------
	const {
		loading: paramLoading,
		data: paramData,
		refetch: paramRefetch,
	} = useQuery(GET_ALL_PARAMETERS, {
		variables: {
			page: 1,
			limit: 100,
			sort: { key: "createdAt", type: -1 },
			filter: JSON.stringify({ isActive: true }),
			search: "",
		},
	});

	//--------- Mutations -----------

	const [addProduct] = useMutation(ADD_PRODUCT);
	const [updateProduct] = useMutation(UPDATE_PRODUCT);
	const [updateMatchingPair] = useMutation(UPDATE_MATCHING_PAIR);
	const [deleteProduct] = useMutation(DELETE_PRODUCT);
	const [addMatchingPair] = useMutation(ADDING_MATCHING_PAIR)
	const [importProducts, { loading: IMPloading }] = useMutation(IMPORT_PRODUCTS);

	useEffect(() => {
		let arr = [];
		if (catData?.getAllCategories) {
			catData?.getAllCategories?.data?.map((d) => arr.push({ label: d?.name, value: d?.id }));
			const data = arr.filter((d) => d?.label !== "On Sale" && d?.label !== "Make to Order")
			_productCategories(data);
		}
	}, [catData]);
	useEffect(() => {
		if (userData?.getAllUser?.data) {
			let userArr = []
			const users = userData?.getAllUser?.data?.map((d) => {
				let user = {
					label: d?.userName,
					value: d?.id
				}
				userArr.push(user)

			})
			setgetAllUsers(userArr)
		}

	}, [userData])
	useEffect(() => {
		if (vendorData?.getAllAssociateVendors) {
			let userArr = []
			vendorData?.getAllAssociateVendors?.map((d) => {
				let user = {
					label: d?.fullName,
					value: d?.id
				}
				userArr.push(user)
			})
			_setVendor(userArr)
		}
	}, [vendorData])

	useEffect(() => {
		setLoader(loading);
	}, [loading]);

	useEffect(() => {
		let newArr = [];
		shapeData?.getAllShapes?.data?.map((res) => {
			let data = {
				label: res?.shapeName,
				value: res?.id,
			};
			newArr.push(data);
		});

		setShapeArr(newArr);
	}, [shapeData]);

	useEffect(() => {
		if (data?.getAllProducts) {
			setLoader(false);
			setAllProducts(data?.getAllProducts);
			// setVendorUserFilter([])
		}
	}, [data]);

	const productTableColumns = [
		{
			name: "Product Image",
			sortable: true,
			minWidth: "150px",
			sortField: "image",
			selector: (row) => (
				<div className="d-flex align-items-center">
					<Image
						photo={!row?.image ? TempImg : row?.image?.includes("http") ? row?.image : `${digitalOceanURL}${row?.image}`}
					/>
					{/* <Image photo={row?.image ? `${digitalOceanURL}${row?.image}` :TempImg}/> */}
				</div>
			),
		},
		{
			name: "Owner",
			sortable: true,
			minWidth: "150px",
			sortField: "productOwner",
			selector: (row) => row?.productOwner,
		},
		{
			name: "Stock Id",
			sortable: true,
			minWidth: "150px",
			sortField: "productName",
			selector: (row) => row?.productName,
		},
		{
			name: "Category",
			sortable: true,
			minWidth: "150px",
			sortField: "categoryId",
			selector: (row) => row?.categoryId?.name,
		},
		{
			name: "Shape",
			sortable: true,
			minWidth: "150px",
			sortField: "shapeId",
			selector: (row) => row?.shapeId?.shapeName,
		},
		{
			name: "Carats",
			sortable: false,
			minWidth: "150px",
			sortField: "carats",
			selector: (row) => parseFloat(row?.productDetails?.find((d) => d?.parameter == "CARATS")?.value)?.toFixed(2),
		},
		{
			name: "Color",
			sortable: false,
			minWidth: "150px",
			sortField: "color",
			selector: (row) => row?.productDetails?.find((d) => d?.parameter == "COLOR")?.value,
		},
		{
			name: "Clarity",
			sortable: false,
			minWidth: "150px",
			sortField: "clarity",
			selector: (row) => row?.productDetails?.find((d) => d?.parameter == "CLARITY")?.value,
		},
		{
			name: "Cut",
			sortable: false,
			minWidth: "150px",
			sortField: "cut",
			selector: (row) => row?.productDetails?.find((d) => d?.parameter == "CUT")?.value,
		},
		{
			name: "Measurement",
			sortable: false,
			minWidth: "150px",
			sortField: "polish",
			selector: (row) => row?.productDetails?.find((d) => d?.parameter == "MEASUREMENTS")?.value,
		},
		{
			name: "Price per Ct",
			sortable: false,
			minWidth: "150px",
			sortField: "pricePerCarat",
			selector: (row) => row?.PricePerCarat,
		},
		{
			name: "Net Value",
			sortable: false,
			minWidth: "150px",
			sortField: "netValue",
			selector: (row) => row?.netValue,
		},
		{
			name: "Status",
			sortable: true,
			minWidth: "150px",
			sortField: "status",
			selector: (row) => row?.status,
			cell: (row) => {
				return (
					<div className="mb-0">
						<Input
							className="custom-control-success"
							id={row?.id}
							name={row?.id}
							type="select"
							style={{ zIndex: 0 }}
							checked={row?.status}
							onChange={(e) => {
								e.preventDefault();
								updateProduct({
									variables: {
										input: {
											id: row?.id,
											status: e.target.value,
										},
									},
								})
									.then((response) => {
										if (response) {
											refetch();
											toast.success("Product updated successfully");
										} else {
											toast.error("Product not updated");
										}
									})
									.catch((error) => {
										toast.error(FormatError(error));
									});
							}}
						>
							<option value="AVAILABLE" selected={row?.status === "AVAILABLE"}>
								Available
							</option>
							<option value="HOLD" selected={row?.status === "HOLD"}>
								{" "}
								Hold
							</option>
							<option value="IN LAB" selected={row?.status === "IN LAB"}>
								{" "}
								In Lab
							</option>
						</Input>
					</div>
				);
			},
		},
		{
			name: "Make Default for",
			sortable: false,
			minWidth: "150px",
			sortField: "default",
			cell: (row) => {
				return (
					<>
						<Button color="primary" outline id={`popBtm${row?.id}`}>
							<i className="bi bi-three-dots-vertical" style={{ fontSize: "25px" }}></i>
						</Button>
						<UncontrolledPopover placement="bottom" target={`popBtm${row?.id}`} trigger="legacy" style={{ padding: "20px 25px 0 25px" }}>
							{ProductTable?.map((d, index) => {
								return (
									<div className="popup_default" key={"d" + index}>
										<Label className="form-content" htmlFor="globalDefault">
											{d}
										</Label>
										<div className="form-check form-switch ms-1">
											<Input
												className="custom-control-success"
												id={row?.id}
												name={d}
												type="switch"
												style={{ zIndex: 0 }}
												value={d}
												defaultChecked={row?.default?.includes(d)}
												onChange={(e) => UpdateProductDefault(row?.id, e, row?.default)}
											/>
										</div>
									</div>
								);
							})}
						</UncontrolledPopover>
					</>
				);
			},
		}

	];



	const UpdateProductDefault = (id, e, prev) => {
		let temp = [...prev];
		if (e.target.checked) temp.push(e.target.name);
		else temp = prev?.filter((d) => d !== e.target.name);

		updateProduct({
			variables: {
				input: { id, default: temp },
			},
		})
			.then((response) => {
				if (response?.data?.updateProduct?.status) {
					refetch();
					toast.success("Product updated successfully");
				} else {
					toast.error("Product not updated");
				}
			})
			.catch((error) => {
				toast.error(FormatError(error));
			});
	};


	// function for  open and close model
	const toggleHandler = () => {
		setModal(!modal);
		resetData();
	};

	// function for  open and close import model
	const importToggleHandler = () => {
		setImportModal(!importModal);
	};
	const categoryToggleHandler = () => {
		setCategoryModal(!categoryModal)
		resetData();

	};
	const matchingToggleHandler = () => {
		setNextPage("")
		setMatchingModal(!matchingModal)
		resetData();

	};
	const looselayoutToggleHandler = () => {
		setLooseLayout(!looselayoutModal)
		resetData()

	}
	const layoutToggleHandler = () => {
		setLayouts(!layoutsModal)
		resetData()

	}

	// function for add bank
	const addBankData = () => {
		setModal(true);
		reset({});
	};

	//function is being called on change page
	const handlePagination = (page) => {
		setLoader(true);
		setCurrentPage(page?.selected);
	};

	//function for handling sort
	const handleSort = (e) => {
		setLoader(true);
		const type = sort.type == -1 ? 1 : -1;
		setSort({ key: e?.sortField, type });
	};

	// Function for fill Edit Form
	const editProduct = (data) => {

		if (data?.categoryId && data?.categoryId?.name === "Certified Diamond") {
			setCategoryModal(true)
		} else if (data?.categoryId && data?.categoryId?.name === "Loose Diamonds") {
			setLooseLayout(true)
		} else if (data?.categoryId && data?.categoryId?.name === "Matching Pair") {
			setMatchingModal(true)
		}
		else {
			setLayouts(true)
		}
		reset(data);
		const productData = data?.productDetails.filter((d) => {
			return delete d.__typename;
		});
		const LooseDiamondData = data?.productDetails.filter((d) => {
			return delete d.__typename;
		});
		const LayoutDiamondData = data?.productDetails.filter((d) => {
			return delete d.__typename;
		});

		const matchingPairData = data?.matchingPairId?.productDetails?.filter((d) => {
			return delete d?.__typename
		})

		_productDetails(productData);
		setlooseDiamondDetails(LooseDiamondData)
		setlayoutDiamondDetails(LayoutDiamondData)

		setmatchingPairProductDetails(matchingPairData || [])
		setmatchingPair(productData)
		setcertifiedImage(!data?.image ? TempImg : data?.image?.includes("https") ? data?.image : `${digitalOceanURL}${data?.image}`)
		setlayoutDiamondImage(!data?.image ? TempImg : data?.image?.includes("https") ? data?.image : `${digitalOceanURL}${data?.image}`)
		setlooseDiamondImage(!data?.image ? TempImg : data?.image?.includes("https") ? data?.image : `${digitalOceanURL}${data?.image}`)

		setDiamondVideomp4(data?.DiamondVideoMp4)
		setsingleDiamondVideomp4(data?.SingleDiamondVideoMp4)
		setDiamondVideo(data?.video)
		setDiamondImage(!data?.image ? TempImg : data?.image?.includes("https") ? data?.image : `${digitalOceanURL}${data?.image}`)
		setproductDescription(data?.description)
		setstockId(data?.productName)
		setstockIdForPair(data?.matchingPair)
		setavailability(data?.status)
		setpricePerCarat(data?.PricePerCarat)
		setnetValue(data?.netValue)
		setreport(data?.report)
		setcountry(data?.country)
		setShape({ label: data?.shapeId?.shapeName, value: data?.shapeId?.id })


		setmatchingdiamondvideomp4(data?.matchingPairId?.DiamondVideoMp4)
		setmatchingDiamondimage(!data?.matchingPairId?.image ? TempImg : data?.matchingPairId?.image?.includes("https") ? data?.matchingPairId?.image : `${digitalOceanURL}${data?.matchingPairId?.image}`)
		setmatchingsinglediamond(data?.matchingPairId?.SingleDiamondVideoMp4)
		setmatchingDiamondvideo(data?.matchingPairId?.video)
		setmatchingDiamondescription(data?.matchingPairId?.description)
		setmatchingStockId(data?.matchingPairId?.productName)
		setmatchingStockIdForPair(data?.matchingPairId?.matchingPair)
		setmatchingavailability(data?.matchingPairId?.status)
		setmatchingapricepercarat(data?.matchingPairId?.PricePerCarat)
		setmatchingnetvalue(data?.matchingPairId?.netValue)
		setmatchingnreport(data?.matchingPairId?.reportNo)
		setmatchingcountry(data?.matchingPairId?.country)
		setmatchingnshape({ label: data?.matchingPairId?.shapeId?.shapeName, value: data?.matchingPairId?.shapeId?.id })
		setStatus(data?.status);
		_setType(data?.type);
	};
	//function is being called on delete of city
	const deleteProductFunc = async (productId) => {
		let Status = await ConfirmationModal("warning", "Are you sure?", "You won't be able to revert this!", "Yes, delete it!");
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
						await ConfirmationModal("success", "Deleted!", "Product has been removed.", "");
					} else {
						toast.error("Product not deleted");
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
	const EditSubmitHandler = (data) => {
		setLoader(true)
		const newProductDetails = productDetails.filter((d) => d.value != "" && d.value != 0);
		const newlooseDiamondDetailsDetails = looseDiamondDetails.filter((d) => d.value != "" && d.value != 0);
		const newlayoutDiamondDetailsDetails = layoutDiamondDetails.filter((d) => d.value != "" && d.value != 0);
		const newmatchPairDetails = matchingPairProductDetails.filter((d) => d.value != "" && d.value != 0);
		const newmatchPair = matchingPair.filter((d) => d.value != "" && d.value != 0);


		if (data?.categoryId?.name === "Certified Diamond" || data?.categoryId?.name === "Loose Diamonds" || data?.categoryId?.name === "Layouts") {
			updateProduct({
				variables: {
					input: {
						id: data?.id,
						productName: data?.productName,
						description: data?.description,
						image: data?.categoryId?.name === "Certified Diamond" ? certifiedImage : data?.categoryId?.name === "Loose Diamonds" ? looseDiamondImage : layoutDiamondImage,
						// image: data?.image,
						certificateURL: data?.categoryId?.name === "Certified Diamond" ? data?.certificateURL : '',
						categoryId: data?.categoryId?.value,
						video: data?.categoryId?.name === "Certified Diamond" ? data?.video : '',
						DiamondVideoMp4: data?.categoryId?.name === "Certified Diamond" ? data?.DiamondVideoMp4 : '',
						country: data?.country,
						type,
						status: data?.status,
						reportNo: data?.reportNo,
						shapeId: data?.shapeId?.value,
						productDetails: data?.categoryId?.name === "Certified Diamond" ? newProductDetails : data?.categoryId?.name === "Loose Diamonds" ? newlooseDiamondDetailsDetails : newlayoutDiamondDetailsDetails,
						netValue: parseFloat(data?.netValue),
						PricePerCarat: parseFloat(data?.PricePerCarat),
						labComment: data?.labComment,
					},
				},
			})
				.then(({ data }) => {
					if (data?.updateProduct?.status) {
						setModal(false);
						setCategoryModal(false);
						setLooseLayout(false)
						setLayouts(false)
						setLoader(false);
						if (data?.updateProduct?.product?.categoryId?.name === "Certified Diamond") {
							toast.success("Certified diamond updated successfully")
						} else if (data?.updateProduct?.product?.categoryId?.name === "Layouts") {
							toast.success("Layouts update successfully")
						} else {
							toast.success("Loose diamond updated successfully");
						}
						// data?.updateProduct?.product?.categoryId?.name === "Certified Diamond" ? toast.success("Certified diamond updated successfully") :
						// toast.success("Loose diamond updated successfully");
						refetch();
						reset({})
						resetData();
					} else {
						setCategoryModal(false);
						setLooseLayout(false);
						setLayouts(false)
						setModal(false);
						setLoader(false);
						toast.success("Something went wrong!");
					}
				})
				.catch((error) => {
					toast.warn(FormatError(error));
					setLoader(false);
				});

		}
		else {
			updateMatchingPair({
				variables: {
					input: [{
						id: data?.matchingPairId?.id,
						productName: matchingStockId,
						matchingPair: matchingStockIdForPair,
						SingleDiamondVideoMp4: matchingsingleDiamond,
						description: matchingDiamondescription,
						image: matchingDiamondimage,
						// certificateURL: matchingDiamondcertificate,
						categoryId: productCategory?.value,
						video: matchingDiamondvideo,
						DiamondVideoMp4: matchingdiamondvideomp4,
						country: matchingcountry,
						status: matchingavailability,
						reportNo: matchingnreport,
						shapeId: matchingshape?.value,
						netValue: parseFloat(matchingnetvalue),
						PricePerCarat: parseFloat(matchingapricepercarat),
						// labComment: data?.matchingPairId?.labComment,
						productDetails: newmatchPairDetails,
					},
					{
						id: data?.id,
						productName: stockId,
						SingleDiamondVideoMp4: singlediamondVideomp4,
						description: productDescription,
						image: diamondImage,
						matchingPair: stockIdForPair,
						// certificateURL: diamondCertified,
						categoryId: productCategory?.value,
						video: diamondVideo,
						DiamondVideoMp4: diamondVideomp4,
						country: country,
						status: availability,
						reportNo: report,
						shapeId: shape?.value,
						netValue: parseFloat(netValue),
						PricePerCarat: parseFloat(pricePerCarat),
						// labComment: data?.labComment,	
						productDetails: newmatchPair,
					}]
				},
			})
				.then(({ data }) => {
					if (data?.updateMatchingPair) {
						setMatchingModal(false)
						setLoader(false);
						toast.success("Matching Pair updated successfully");
						refetch();
						reset({})
						setNextPage("")
						resetData();
						// window.location.reload()
					} else {
						setMatchingModal(false);
						setModal(false);
						setLoader(false);
						toast.success("Something went wrong!");
					}
				})
				.catch((error) => {
					toast.warn(FormatError(error));
					setLoader(false);
				});


		}
		// }
	};
	//function is being called on submit of branchForm
	const AddSubmitHandler = (data) => {
		setLoader(true)
		const newProductDetails = productDetails.filter((d) => d.value != "");
		if (productCategory?.label === "Certified Diamond" || productCategory?.label === "Loose Diamonds" || productCategory?.label === "Layouts") {
			addProduct({
				variables: {
					input: {
						productName: data?.productName,
						description: data?.description,
						// image: data?.image,
						image: productCategory?.label === "Certified Diamond" ? certifiedImage : productCategory?.label === "Loose Diamonds" ? looseDiamondImage : layoutDiamondImage,
						certificateURL: productCategory?.label === "Certified Diamond" ? data?.certificateURL : '',
						categoryId: productCategory?.value,
						video: productCategory?.label === "Certified Diamond" ? data?.video : '',
						DiamondVideoMp4: productCategory?.label === "Certified Diamond" ? data?.DiamondVideoMp4 : '',
						country: data?.country,
						type,
						status: data?.status,
						reportNo: data?.reportNo,
						shapeId: data?.shapeId?.value,
						productDetails: productCategory?.label === "Certified Diamond" ? newProductDetails : productCategory?.label === "Loose Diamonds" ? looseDiamondDetails : layoutDiamondDetails,
						netValue: parseFloat(data?.netValue),
						PricePerCarat: parseFloat(data?.PricePerCarat),
						labComment: data?.labComment,
					},
				},
			})
				.then(({ data }) => {
					if (data?.addProduct?.status) {
						if (data?.addProduct?.product?.categoryId?.name === "Certified Diamond") {
							toast.success("Certified diamond added successfully")
						} else if (data?.addProduct?.product?.categoryId?.name === "Layouts") {
							toast.success("Layouts added successfully")
						} else {
							toast.success("Loose diamond added successfully")
						}
						// data?.addProduct?.product?.categoryId?.name === "Certified Diamond" ? toast.success("Certified diamond added successfully") || data?.addProduct?.product?.categoryId?.name === "Layouts" ? toast.success("Layouts added successfully") :
						// toast.success("Loose diamond added successfully") : toast.success("Loose diamond added successfully")
						refetch();
						setModal(false);
						setCategoryModal(false);
						// setMatchingModal(false)
						setLooseLayout(false)
						setLayouts(false)
						setLoader(false);
						reset({});
						resetData();
					} else {
						setModal(false);
						setCategoryModal(false);
						// setMatchingModal(false)
						setLooseLayout(false)
						setLayouts(false)
						setLoader(false);
						toast.warn(data?.addProduct?.message);
					}
				})
				.catch((error) => {
					toast.warn(FormatError(error));
					setLoader(false);
				});

		}
		else {
			if (stockId === "" || stockIdForPair === "" || netValue === "" || availability === "" || shape === "" || pricePerCarat === "") {
				setError({ productName: stockId === "", matchingPair: stockIdForPair === "", status: availability === "", shapeId: shape === "", PricePerCarat: pricePerCarat === "", netValue: netValue === "" })
				setLoader(false)
			}
			else {
				addMatchingPair({
					variables: {
						input: [{
							productName: matchingStockId,
							matchingPair: matchingStockIdForPair,
							// matchingPair:stockIdForPair,
							SingleDiamondVideoMp4: matchingsingleDiamond,
							description: matchingDiamondescription,
							image: matchingDiamondimage,
							// certificateURL: matchingDiamondcertificate,
							categoryId: productCategory?.value,
							video: matchingDiamondvideo,
							DiamondVideoMp4: matchingdiamondvideomp4,
							country: matchingcountry,
							status: matchingavailability,
							reportNo: matchingnreport,
							shapeId: matchingshape?.value,
							netValue: parseFloat(matchingnetvalue),
							PricePerCarat: parseFloat(matchingapricepercarat),
							productDetails: matchingPairProductDetails,

						},
						{
							productName: stockId,
							SingleDiamondVideoMp4: singlediamondVideomp4,
							matchingPair: stockIdForPair,
							// matchingPair:matchingStockIdForPair,
							description: productDescription,
							categoryId: productCategory?.value,
							image: diamondImage,
							// certificateURL: diamondCertified,
							video: diamondVideo,
							DiamondVideoMp4: diamondVideomp4,
							country: country,
							status: availability,
							PricePerCarat: parseFloat(pricePerCarat),
							reportNo: report,
							netValue: parseFloat(netValue),
							productDetails: matchingPair,
							shapeId: shape?.value,
						}
						]
					}

				})
					.then(({ data }) => {
						if (data?.addMatchingPair) {
							setLoader(false);
							toast.success("Matching pair added successfully");
							refetch();
							setMatchingModal(false)
							reset({});
							resetData();
							setNextPage("")
							// window.location.reload()
						} else {
							setMatchingModal(false)
							setLoader(false);
							toast.warn(data?.addMatchingPair?.message);
						}
					})
					.catch((error) => {
						toast.warn(FormatError(error));
						setLoader(false);
					});
			}

		}

	};

	const handleParam = (data, i, name, type) => {
		let values = [...productDetails];
		const ind = values?.findIndex((p) => {
			return p.parameter == name
		})
		if (ind != undefined && ind > -1) {
			values[ind].value = data;
			values[ind].parameter = name;
			values[ind].type = type;
		} else {
			const flag = {
				value: data,
				parameter: name,
				type: type,
			};
			values.push(flag);
		}
		// }
		_productDetails(values);
	};
	const getBase64 = (e, name) => {
		e.preventDefault();
		let reader = new FileReader();
		let file = e.target.files[0];
		reader.readAsDataURL(file);
		reader.onloadend = () => {
			setcertifiedImage(reader.result)
			setcertifiedImage(reader.result)
			setlayoutDiamondImage(reader.result)
			setlooseDiamondImage(reader.result)
			name === "matchingDiamondimage" ?
				setmatchingDiamondimage(reader.result) : setDiamondImage(reader.result)
		};
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
		if (!impCategory?.value) {
			toast.error("Please select product category");
		} else if (!impData?.length || impData?.length === 0) {
			toast.error("Either Sheet is empty or format is Invalid");
		} else {
			importProducts({
				variables: {
					input: impData,
					categoryId: impCategory?.value,
					commissionType: e?.owner,
				},
			})
				.then((response) => {
					if (response?.data?.importProducts) {
						refetch();
						toast.success("Product imported successfully.");
						setLoader(false);
						importToggleHandler();
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

	const handleFilter = (e, filter, name) => {
		name === "user" ? setuserFilter(e) : name === "vendor" ? setVendorFilter(e) : filter === "category" ? setcategoryFilter(e) : _setStatus(e);
		if (e?.value) {
			if (filter === "category" || filter === "status") {
				setFilterData({ ...filterData, [filter]: e.value })
			} else {
				const adminFilter = { ...vendorUserfilter, [name]: e.value }
				setVendorUserFilter(adminFilter)
				setFilterData({ ...filterData, [filter]: [adminFilter?.["user"], adminFilter?.["vendor"]] })
			}
		} else {
			setFilterData({});
		}
	};
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
					...((vendorUserfilter.hasOwnProperty("user") && vendorUserfilter.hasOwnProperty("vendor")) ? { createdById: [vendorUserfilter?.["user"], vendorUserfilter?.["vendor"]] } : {}),
					// createdById: vendorUserfilter && [vendorUserfilter?.["user"],vendorUserfilter?.["vendor"]],
					categoryId: [categoryFilter?.value],
					status: _status?.value
				}
			},
		}).then((response) => {
			setLoader(false);
			setMultipleId([])
			cleareFilter()
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "product_details.xlsx");
			document.body.appendChild(link);
			link.click();
		});

	}
	const cleareFilter = () => {
		_setStatus("")
		setcategoryFilter("")
		setuserFilter("")
		setVendorUserFilter("")
		setVendorFilter("")
		setFilterData({})
	}
	return (
		<Fragment>
			{localStorage.getItem("utype") === "Admin" && (
				<Card>
					<CardHeader>
						<CardTitle tag="h4">Filters</CardTitle>
					</CardHeader>
					<CardBody>
						<Row>
							<Col md="2">
								<Label htmlFor="role-select">Status</Label>
								<Select
									// isClearable={true}
									options={StatusOptions}
									placeholder="Select status"
									onChange={(e) => handleFilter(e, "status")}
									value={_status}
									defaultValue=""
								/>
							</Col>
							<Col md="2">
								<Label htmlFor="role-select">Select Category</Label>
								<Select
									// isClearable={true}
									options={productCategories}
									placeholder="Select category"
									onChange={(e) => handleFilter(e, "category")}
									value={categoryFilter}
								/>
							</Col>
							<Col md="2">
								<Label htmlFor="role-select">Select User</Label>
								<Select
									// isClearable={true}
									options={users}
									placeholder="Select user"
									// onChange={(e) => handleFilter(e, "adminCreated")}
									onChange={(e) => handleFilter(e, "createdById", "user")}
									value={userfilter}
								/>
							</Col>
							<Col md="2">
								<Label htmlFor="role-select">Select Vendor</Label>
								<Select
									// isClearable={true}
									options={_vendor}
									placeholder="Select vendor"
									// onChange={(e) => handleFilter(e, "vendorId")}
									onChange={(e) => handleFilter(e, "createdById", "vendor")}
									value={vendorfilter}
								/>



							</Col>
							<Col md="2">
								<Button
									color="primary"
									className="btn btn-primary d-flex align-items-center ms-2 mt-2"
									// tag={Label}
									onClick={() => cleareFilter()}
								>
									Clear Filter
								</Button>

							</Col>
						</Row>
					</CardBody>
				</Card>
			)}
			<Card className="w-100 h-100">
				{loader && <ComponentSpinner />}
				<CardBody style={{ flex: "unset", height: "inherit" }}>
					<Header
						limit={limit}
						title={"Product"}
						// changeLimit={(e) => changeLimit(e)}
						addData={() => addBankData()}
						// SearchHandling={(e) => SearchHandling(e)}
						refetch={refetch}
						importData
						modal={importModal}
						// importToggleHandler={importToggleHandler}
						setLimit={setLimit}
						setSearchText={setSearchText}
						setCurrentPage={setCurrentPage}
						productCategories={productCategories}
						productCategory={productCategory}
						setProductCategory={setProductCategory}
						importCategoryHandler={categoryToggleHandler}
						matchingToggleHandler={matchingToggleHandler}
						looselayoutToggleHandler={looselayoutToggleHandler}
						layoutToggleHandler={layoutToggleHandler}
						categoryModal={categoryModal}
						matchingModal={matchingModal}
						looselayoutModal={looselayoutModal}
						layoutsModal={layoutsModal}
						exportToExcel={ExportToExcel}
					/>
					<Table
						columns={productTableColumns}
						data={allProducts?.data || []}
						viewData={setViewProduct}
						setModal={setViewModal}
						// modal={viewModal}
						currentPage={currentPage}
						totalRecords={allProducts?.count || 0}
						limit={limit}
						editData={editProduct}
						deleteData={deleteProductFunc}
						onSort={handleSort}
						handlePagination={handlePagination}
						multiSelectRow={onSelectedRowsChange}
					/>
				</CardBody>

				{/* Import Modal for the product */}
			</Card>
			<ViewProduct data={viewProduct} modal={viewModal} setModal={setViewModal} />
			{/* <ProductForm
				getBase64={getBase64}
				handleSubmit={handleSubmit}
				productCategories={productCategories}
				productDetails={productDetails}
				paramData={paramData}
				modal={modal}
				setModal={setModal}
				StatusOptions={StatusOptions}
				toggleHandler={toggleHandler}
				loader={loader}
				control={control}
				setStatus={setStatus}
				errors={errors}
				register={register}
				Select={Select}
				shapeArr={shapeArr}
				AddSubmitHandler={AddSubmitHandler}
				EditSubmitHandler={EditSubmitHandler}
				handleParam={handleParam}
			/> */}
			<CertifiedDiamond
				Select={Select}
				IMPloading={IMPloading}
				importModal={categoryModal}
				setCategoryModal={setCategoryModal}
				control={control}
				register={register}
				errors={errors}
				productCategory={productCategory}
				importCategoryHandler={categoryToggleHandler}
				shapeArr={shapeArr}
				_productDetails={_productDetails}
				productDetails={productDetails}
				AddSubmitHandler={AddSubmitHandler}
				EditSubmitHandler={EditSubmitHandler}
				productCategories={productCategories}
				handleSubmit={handleSubmit}
				paramData={paramData}
				loader={loader}
				getBase64={getBase64}
				certifiedImage={certifiedImage}>

			</CertifiedDiamond>
			<CommonFields
				Select={Select}
				handleSubmit={handleSubmit}
				productCategories={productCategories}
				control={control}
				importModal={matchingModal}
				setMatchingModal={setMatchingModal}
				errors={errors}
				setOwner={setOwner}
				register={register}
				IMPloading={IMPloading}
				productCategory={productCategory}
				importCategoryHandler={matchingToggleHandler}
				shapeArr={shapeArr}
				handleParam={handleParam}
				AddSubmitHandler={AddSubmitHandler}
				EditSubmitHandler={EditSubmitHandler}
				loader={loader}
				setStatus={setStatus}
				setShape={setShape}
				shape={shape}
				refetch={refetch}
				paramData={paramData}
				selectedData={selectedData}
				reset={reset}
				resetData={resetData}
				setDiamondVideomp4={setDiamondVideomp4}
				diamondVideomp4={diamondVideomp4}
				diamondVideo={diamondVideo}
				setDiamondVideo={setDiamondVideo}
				setDiamondImage={setDiamondImage}
				diamondImage={diamondImage}
				diamondCertified={diamondCertified}
				setDiamondCertified={setDiamondCertified}
				productDescription={productDescription}
				setproductDescription={setproductDescription}
				stockId={stockId}
				setstockId={setstockId}
				stockIdForPair={stockIdForPair}
				setstockIdForPair={setstockIdForPair}
				availability={availability}
				setavailability={setavailability}
				pricePerCarat={pricePerCarat}
				setpricePerCarat={setpricePerCarat}
				netValue={netValue}
				setnetValue={setnetValue}
				report={report}
				setreport={setreport}
				country={country}
				setcountry={setcountry}
				carat={carat}
				setcarat={setcarat}
				color={color}
				setColor={setColor}
				clarity={clarity}
				setClarity={setClarity}
				cut={cut}
				setCut={setCut}
				polish={polish}
				setPolish={setPolish}
				symmetry={symmetry}
				setSymmetry={symmetry}
				setLab={setLab}
				setLocation={setLocation}
				matchingPair={matchingPair}
				setmatchingPair={setmatchingPair}
				matchingPairProductDetails={matchingPairProductDetails}
				setmatchingPairProductDetails={setmatchingPairProductDetails}
				myValue={myValue}
				singlediamondVideomp4={singlediamondVideomp4}
				setsingleDiamondVideomp4={setsingleDiamondVideomp4}

				matchingdiamondvideomp4={matchingdiamondvideomp4}
				setmatchingdiamondvideomp4={setmatchingdiamondvideomp4}
				matchingsingleDiamond={matchingsingleDiamond}
				setmatchingsinglediamond={setmatchingsinglediamond}
				matchingDiamondvideo={matchingDiamondvideo}
				setmatchingDiamondvideo={setmatchingDiamondvideo}
				matchingDiamondimage={matchingDiamondimage}
				setmatchingDiamondimage={setmatchingDiamondimage}
				matchingDiamondcertificate={matchingDiamondcertificate}
				setmatchingDiamondcertificate={setmatchingDiamondcertificate}
				matchingDiamondescription={matchingDiamondescription}
				setmatchingDiamondescription={setmatchingDiamondescription}
				matchingStockId={matchingStockId}
				setmatchingStockId={setmatchingStockId}
				matchingStockIdForPair={matchingStockIdForPair}
				setmatchingStockIdForPair={setmatchingStockIdForPair}
				matchingavailability={matchingavailability}
				setmatchingavailability={setmatchingavailability}
				matchingapricepercarat={matchingapricepercarat}
				setmatchingapricepercarat={setmatchingapricepercarat}
				matchingnetvalue={matchingnetvalue}
				setmatchingnetvalue={setmatchingnetvalue}
				matchingnreport={matchingnreport}
				setmatchingnreport={setmatchingnreport}
				matchingcountry={matchingcountry}
				setmatchingcountry={setmatchingcountry}
				matchingshape={matchingshape}
				setmatchingnshape={setmatchingnshape}
				getBase64={getBase64}
				Error={Error}
				setError={setError}
				nextPage={nextPage}
				setNextPage={setNextPage}


			/>

			<LooseandLayout
				Select={Select}
				IMPloading={IMPloading}
				importModal={looselayoutModal}
				setLooseLayout={setLooseLayout}
				control={control}
				register={register}
				errors={errors}
				productCategory={productCategory}
				importCategoryHandler={looselayoutToggleHandler}
				shapeArr={shapeArr}
				_productDetails={_productDetails}
				productDetails={productDetails}
				AddSubmitHandler={AddSubmitHandler}
				EditSubmitHandler={EditSubmitHandler}
				productCategories={productCategories}
				handleSubmit={handleSubmit}
				paramData={paramData}
				loader={loader}
				getBase64={getBase64}
				looseDiamondDetails={looseDiamondDetails}
				setlooseDiamondDetails={setlooseDiamondDetails}
				looseDiamondImage={looseDiamondImage}
			/>
			<LayoutsDiamond
				Select={Select}
				IMPloading={IMPloading}
				importModal={layoutsModal}
				setLayoutModel={setLooseLayout}
				control={control}
				register={register}
				errors={errors}
				productCategory={productCategory}
				importCategoryHandler={layoutToggleHandler}
				shapeArr={shapeArr}
				_productDetails={_productDetails}
				productDetails={productDetails}
				AddSubmitHandler={AddSubmitHandler}
				EditSubmitHandler={EditSubmitHandler}
				productCategories={productCategories}
				handleSubmit={handleSubmit}
				paramData={paramData}
				loader={loader}
				getBase64={getBase64}
				layoutDiamondDetails={layoutDiamondDetails}
				setlayoutDiamondDetails={setlayoutDiamondDetails}
				layoutDiamondImage={layoutDiamondImage}
			/>
			<ImportProductModal
				Select={Select}
				setImpCategory={setImpCategory}
				productCategories={productCategories}
				importToggleHandler={importToggleHandler}
				IMPloading={IMPloading}
				importModal={importModal}
				onChangeImport={onChangeImport}
				handleImport={handleImport}
				control={control}
				errors={errors}
				setOwner={setOwner}
				register={register}
			/>
		</Fragment>
	);
};
export default Index;
