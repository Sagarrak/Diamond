import React, { useState, useEffect, useContext } from "react";
import CartContext from "../../../context/CartContext";
import CurrencySymbolContext from "../../../context/CurrencySymbolContext";
import WishListContext from "../../../context/WishListContext";
import CompareContext from "../../../context/CompareContext";
import { useMutation, useQuery } from "react-apollo";
import { GET_ALL_PRODUCTS, GET_COMPARE_PRODUCTS } from "../Products/query";
import { ADD_TO_CART } from "../../components/Session/mutations";
import { GET_AD_CONTENT } from "../ADSpage/query";
import { SESSION_HOLD_STATUS } from "./mutation";
import { ADD_ITEM_IN_WISHLIST } from "../WishList/mutation";
import { BASE_URL } from "../../../config";
import ReactPaginate from "react-paginate";
import tableView from "../../../assets/images/icons/tableDark.svg";
import dark6 from "../../../../src/assets/images/images/six_grid_dark.svg";
import light6 from "../../../../src/assets/images/icons/six_grid.svg";
import cardView from "../../../assets/images/icons/light6Grid.svg";
import eye from "../../../assets/images/icons/akar-icons_eye.svg";
import whish from "../../../assets/images/icons/whish.svg";
import hold from "../../../assets/images/icons/hold.svg";
import akarHold from "../../../assets/images/icons/akar-icons_hold.svg";
import akarAvailable from "../../../assets/images/icons/akar-icons_available.svg";
import ReqInHoldStatusIon from "../../../assets/images/icons/ReqInHoldStatusIon.svg";
import lightWishlist from "../../../assets/images/icons/lightWishlist.svg";
import lightCart from "../../../assets/images/icons/lightCart.svg";
import Whatsapp from "../../../assets/images/icons/Whatsapp.svg";
import compare from "../../../assets/images/icons/compare.svg";
import compared from "../../../assets/images/icons/compared-icon.svg";
import filterCart from "../../../assets/images/icons/filterCart.svg";
import lightTable from "../../../../src/assets/images/pages/table-view.png";
import darkGrid from "../../../assets/images/icons/dark-grid.svg";
import { toast } from "react-toastify";
// import "../inventory.scss";
import { useHistory } from "react-router-dom";
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Spinner, UncontrolledPopover, UncontrolledTooltip } from "reactstrap";
import axios from "axios";
import ProductGridCard from "./productGridCard";
import "../../pages/Home/home.scss";
import { AddToCart, AddToWishList, AddToCompare, CHECK_IN_CART, CHECK_IN_WISHLIST, RequestForHold } from "../../functions/commonFunctions";
import ImageComp from "../../components/ImageComp";
import HoldReqContext from "../../../context/HoldReqContext";
import DataTable, { createTheme } from "react-data-table-component";
import { Check } from "react-feather";
import { digitalOceanURL } from "../../common/common";
createTheme("solarized", {
	text: {
		primary: "#268bd2",
		secondary: "#2aa198"
	},
	background: {
		default: "#002b36"
	},
	context: {
		background: "#cb4b16",
		text: "#FFFFFF"
	},
	divider: {
		default: "#073642"
	},
	action: {
		button: "rgba(0,0,0,.54)",
		hover: "rgba(0,0,0,.08)",
		disabled: "rgba(0,0,0,.12)"
	}
});

const CertifiedDiamond = (props) => {
	const { LocalFilterArr, LocalShapeFilterArr, searchString, categoryId, categoryName, height } = props;
	const [allProducts, _allProducts] = useState([]);
	const [allProductsWithAdv, setAllProductsWithAdv] = useState([]);
	const [applyFilter, _applyFilter] = useState("{}");
	const [Tabs, setTabs] = useState(1);
	const [limit] = useState(24);
	const [visible, setVisible] = useState(false);
	const [page, setPage] = useState(1);
	const [selectedHoldProducts, setSelectedHoldProducts] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [noFilter, _noFilter] = useState(false);
	const [notCertifiedProducts, _notCertifiedProducts] = useState([]);
	const [tableData, setTableData] = useState([]);
	const [sortObj] = useState({ key: "createdAt", type: -1 });
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const history = useHistory();
	const token = localStorage.getItem("token");
	const isLogin = token && token != undefined && token != null ? true : false;

	// ========================= Queries =========================
	const CART = useContext(CartContext);
	const WISHLIST = useContext(WishListContext);
	const COMPARE = useContext(CompareContext);
	const HOLD = useContext(HoldReqContext);
	const currencyData = useContext(CurrencySymbolContext);

	const { data: advData } = useQuery(GET_AD_CONTENT, { fetchPolicy: "cache-and-network", });
	const advertisement = advData?.getAdContent?.length;

	const { loading: productLoading, data: productData,refetch } = useQuery(GET_ALL_PRODUCTS, {
		variables: {
			page,
			limit: limit - advertisement,
			sort: sortObj,
			filter: applyFilter,
			search: searchString,
			noFilter: noFilter,
		},
		fetchPolicy: "no-cache",
	});

	const { loading: holdProductsLoading, data } = useQuery(GET_COMPARE_PRODUCTS, {
		variables: { getCompareProductsId: selectedHoldProducts },
		fetchPolicy: "cache-and-network",
	});

	// ========================= Pagination =========================
	const handlePageClick1 = (event) => setPage(event.selected + 1);

	// ========================= Mutations =========================
	const [atc] = useMutation(ADD_TO_CART);
	const [statusHoldRequest] = useMutation(SESSION_HOLD_STATUS);
	const [addItemWishlist] = useMutation(ADD_ITEM_IN_WISHLIST);


	const handleMultipleATC = async () => {
		let HoldProducts = []
		const data = await notCertifiedProducts?.filter(d => d?.status !== "AVAILABLE")
		data?.map(d => HoldProducts?.push(d?.itemId));
		setSelectedHoldProducts(HoldProducts);
		if (HoldProducts?.length > 0) { setModal(true) } else { AddToCart(notCertifiedProducts, CART?.cartRefetch, atc, history) }
	}

	useEffect(async () => {
		_allProducts(productData?.getAllProducts?.data);
		let productsWithAdvData = [...productData?.getAllProducts?.data || []];
		advData?.getAdContent?.map((d) => {
				if (d?.index < productData?.getAllProducts?.count) {
				productsWithAdvData.splice((d?.index - 1), 0, { ...d, productType: "adv" });
			}
			})
		setAllProductsWithAdv(productsWithAdvData)
		setPageCount(Math.ceil(productData?.getAllProducts?.count / limit));
	}, [productData]);
	  

	// Sending Filter Response with verification
	useEffect(async () => {
		if (LocalFilterArr?.length > 0 || LocalShapeFilterArr?.length > 0 || searchString) {
			_noFilter(false);
			_applyFilter(JSON.stringify({ default: [categoryName?.replace(" ", "")], shapeId: LocalShapeFilterArr, categoryId: [categoryId], productDetails: LocalFilterArr }));
		} else {
			_noFilter(true);
			_applyFilter(JSON.stringify({ default: [categoryName?.replace(" ", "")] }));
		}

		_notCertifiedProducts([]);
		setTimeout(() => { setPage(1); }, 700);
	}, [LocalShapeFilterArr, LocalFilterArr, categoryId, searchString]);

	useEffect(() => {
		if (notCertifiedProducts?.length > 0) setVisible(true)
		else setVisible(false);
	}, [notCertifiedProducts]);

	// To clear all checkboxes
	// const clearAllCheckBoxes = () => {
	//   Array.from(document.querySelectorAll("input")).forEach((input) => { input.checked = false; });
	//   _notCertifiedProducts([]);
	// };
	const GridAtc = (type, id, status, carat, maxCarat) => {
		if (!CHECK_IN_CART(id, CART) && status === 'AVAILABLE') {
			if (type === "Layouts" || type === "Loose Diamonds") {
				if (carat > 0 && carat <= maxCarat) {
					AddToCart(id, CART?.cartRefetch, atc, history, carat)
					document.getElementsByClassName("caratToolTip")[0].remove();
				} else {
					toast.error(`Please enter minimum 0.1 and maximum ${maxCarat} carats`)
				}
			} else {
				AddToCart(id, CART?.cartRefetch, atc, history)
			}
		}
	}

	const setProductDetails = (param, i, type) => {
		let index = allProducts[i]?.productDetails?.findIndex((p) => p.parameter.trim() === param.trim());
		if (index >= 0 && index != undefined) {
			if (type === "number") { return parseFloat(allProducts[i]?.productDetails[index]?.value || 0)?.toFixed(2); }
			else { return allProducts[i]?.productDetails[index].value; }
		} else {
			return "-";
		}
	};

	const setProductForMetching = (param, i, type) => {
		let index = allProducts[i]?.matchingPairId?.productDetails?.findIndex((p) => p.parameter.trim() === param.trim());
		if (index >= 0 && index != undefined) {
			if (type === "number") { return parseFloat(allProducts[i]?.matchingPairId?.productDetails[index]?.value || 0)?.toFixed(2); }
			else { return allProducts[i]?.matchingPairId?.productDetails[index].value; }
		} else {
			return "-";
		}
	};

	const notCertProductArr = (id, status, productStatus) => {
		let data = [...notCertifiedProducts];
		const index = data?.findIndex((d) => d?.itemId === id);
		if (status) {
			if (index > 0 && index != undefined) {
				data[index].itemId = id;
				data[index].quantity = 1;
				data[index].status = productStatus;
			} else {
				let temp = { itemId: id, quantity: 1, status: productStatus };
				data?.push(temp);
			}
		} else {
			data.splice(index, 1);
		}
		_notCertifiedProducts(data);
	};

	const fetchData = () => {
		setLoading(true);
		axios({
			url: BASE_URL + "/api/v1/export-search-products/",
			method: "GET",
			responseType: "blob", // important
			params: { filter: applyFilter, search: searchString },
		}).then((response) => {
			setLoading(false);
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", "product_details.xlsx");
			document.body.appendChild(link);
			link.click();
		});
	};

	const setProductDetailsHold = (param, i, type) => {
		let index = data?.getCompareProducts[i]?.productDetails?.findIndex((p) => p.parameter.trim() === param.trim());
		if (index >= 0 && index != undefined) {
			if (type === "number") { return parseFloat(data?.getCompareProducts[i]?.productDetails[index]?.value || 0)?.toFixed(2); }
			else { return data?.getCompareProducts[i]?.productDetails[index].value; }
		} else {
			return "-";
		}
	};

	const HoldReqModal = ({ modal, setModal, data, loading }) => {
		return (
			<Modal className="modal-filters" isOpen={modal} toggle={() => setModal(!modal)}>
				<ModalHeader toggle={() => setModal(!modal)}>
					<p>These Diamonds are Not Available Yet, please click on Continue to add remaining Products to cart.</p>
				</ModalHeader>
				<hr className="m-0"></hr>
				<ModalBody >
					{
						loading ? <div className="position-relative py-5"> <Spinner className="position-absolute" style={{ top: "50%", left: "50%" }} size="lg" /></div> :
							<div>
								{
									data?.getCompareProducts?.map((product, i) => {
										return <div className="d-flex justify-content-start align-items-center mb-1" key={product?.id}>
											<div className="image me-2"><ImageComp src={product?.image} width={50} /></div>
											<div className="hold-product-content d-flex">
												<p className={`product-box-subnumber product-box-bold`} > {product?.shapeId?.shapeName?.toLowerCase()}<span className="spacer"></span> </p>
												<p className={`product-box-subnumber product-box-bold`}> {setProductDetailsHold("CLARITY", i)} <span className="spacer"></span> </p>
												<p className={`product-box-subnumber product-box-bold`}> {setProductDetailsHold("COLOR", i)} <span className="spacer"></span> </p>
												<p className={`product-box-subnumber product-box-bold`}> {setProductDetailsHold("WEIGHT", i)} <span className="spacer"></span> </p>
											</div>
										</div>
									})
								}
							</div>
					}
					<ModalFooter>
						<Button type="button" onClick={() => { const arr = notCertifiedProducts?.filter(d => d?.status === 'AVAILABLE'); AddToCart(arr, CART?.cartRefetch, atc, history); setModal(false) }}> Continue</Button>
					</ModalFooter>
				</ModalBody>
			</Modal>
		)
	}

	const columns = [
		{
			name: "Select",
			selector: (row) => row.Select,
			sortable: false,
			style: {
				maxWidth: 63,
			},
		},
		{
			name: "Stone ID ",
			selector: (row) => row.StoneID,
			sortable: false,
			style: {
				maxWidth: 100,
			},
		},
		{
			name: 'Shape',
			selector: (row) => row.Shape,
			sortable: false,
			style: {
				maxWidth: 94,
			},
		},
		{
			name: 'Color ',
			selector: (row) => row.Color,
			sortable: true,
			style: {
				maxWidth: 75,
			},
		},
		{
			name: 'Clarity',
			selector: (row) => row.Clarity,
			sortable: true,
			style: {
				maxWidth: 85,
			},
		},
		{
			name: 'Carat',
			selector: (row) => row.Carat,
			sortable: true,
			style: {
				maxWidth: 75,
			},
		},
		{
			name: 'View',
			selector: (row) => row.View,
			sortable: false,
			style: {
				maxWidth: 75,
			},
		},
		{
			name: 'Status',
			selector: (row) => row.Status,
			sortable: false,
			style: {
				maxWidth: 75,
			},
		},
		{
			name: 'Measurement',
			selector: (row) => row.Measurement,
			sortable: false,
			style: {
				maxWidth: 148,
			},
		},
		{
			name: 'Cut',
			selector: (row) => row.Cut,
			sortable: false,
			style: {
				maxWidth: 80,
			},
		},
		{
			name: 'Pol',
			selector: (row) => row.Pol,
			sortable: false,
			style: {
				maxWidth: 80,
			},
		},
		{
			name: 'Sym',
			selector: (row) => row.Sym,
			sortable: false,
			style: {
				maxWidth: 80,
			},
		},
		{
			name: 'Ratio',
			selector: (row) => row.Ratio,
			sortable: false,
			style: {
				maxWidth: 70,
			},
		},
		{
			name: 'Report No',
			selector: (row) => row.ReportNo,
			sortable: false,
			style: {
				maxWidth: 120,
			},
		},
		isLogin === true && {
			name: 'Net Amt',
			selector: (row) => row.NetAmt,
			sortable: false,
			style: {
				maxWidth: 110,
			},
		},
		isLogin === true && {
			name: 'Operations',
			selector: (row) => row.Operations,
			sortable: false,
			style: {
				maxWidth: 270,
			},
		},

	]

	useEffect(() => {
		let diamondData = [];
		allProducts?.map((res, i) => {
			const isChecked = notCertifiedProducts?.filter(d => d?.itemId === res?.id)?.length > 0;
			diamondData.push({
				Handle: res?.handle,
				Select: isChecked ? <label className="check-boxs">
					<input type="checkbox" onChange={(e) => { notCertProductArr(res?.id, e.target.checked, res?.status); }} checked={isChecked} />
					<span className="checkmark" id={`ch_${allProducts[i]?.id}`}></span>
				</label> :
					<label className="check-boxs">
						<input type="checkbox" onChange={(e) => { notCertProductArr(res?.id, e.target.checked, res?.status); }} />
						<span className="checkmark" id={`ch_${allProducts[i]?.id}`}></span>
					</label>,

				StoneID: res?.productName,
				Shape: res?.shapeId?.shapeName?.toLowerCase(),
				Color: setProductDetails("COLOR", i),
				Clarity: setProductDetails("CLARITY", i),
				Carat: setProductDetails("WEIGHT", i, "number"),
				View: <div>
					<img src={eye} className="cursor-pointer" onClick={() => { history.push(`/products/${res?.handle}`) }} id={"e" + res?.id} /><UncontrolledTooltip placement="top" target={"e" + res?.id}> Product Details </UncontrolledTooltip>
				</div>,
				Status: <div> {res?.status === "AVAILABLE" ? (<img className="cursor-pointer" src={akarAvailable} alt="akar-available" id={"r" + res?.id} />) :
					(<img className="cursor-pointer" id={"r" + res?.id} src={akarHold} alt="akar-hold" />)}
					<UncontrolledTooltip UncontrolledTooltip placement="top" target={"r" + res?.id} > {res?.status === "AVAILABLE" ? "Available" : "On Hold"}</UncontrolledTooltip>
				</div>,
				Measurement: setProductDetails("MEASUREMENTS", i),
				Cut: setProductDetails("CUT", i),
				Pol: setProductDetails("POLISH", i),
				Sym: setProductDetails("SYMMETRY", i),
				Ratio: setProductDetails("RATIO", i, "number"),
				ReportNo: (res?.reportNo === null) ? "N/A" : res?.reportNo,
				NetAmt: `$${res?.netValue?.toFixed(2)}`,

				Operations: <div className="table-line-icone d-flex">
					<span>{res?.status === "AVAILABLE" ?
						<img id={"ho" + res?.id} onClick={() => RequestForHold(statusHoldRequest, res?.id, HOLD, history)} src={hold} style={{ padding: "0", margin: "1px 5px" }} role="button" />
						:
						<img id={"ho" + res?.id} src={ReqInHoldStatusIon} style={{ padding: "0", margin: "1px 5px" }} role="button" />}
						<UncontrolledTooltip placement="top" target={"ho" + res?.id}>
							{res?.status === "AVAILABLE" ? "Request for hold" : "On Hold"}
						</UncontrolledTooltip>
					</span>
					<span>
						{CHECK_IN_WISHLIST(res?.id, WISHLIST) ? <img id={"WatchList" + res?.id} src={lightWishlist} style={{ padding: "0", margin: "1px 5px" }} role="button" />
							:
							<img id={"WatchList" + res?.id} onClick={() => AddToWishList(res?.id, addItemWishlist, WISHLIST, history)} src={whish} style={{ padding: "0", margin: "1px 5px" }} role="button" />
						}
						<UncontrolledTooltip placement="top" target={"WatchList" + res?.id}>
							{CHECK_IN_WISHLIST(res?.id, WISHLIST) ? 'Added to watchlist' : 'Add to watchlist'}
						</UncontrolledTooltip>
					</span>
					<span>

						{
							((!CHECK_IN_CART(res?.id, CART) && res?.status === 'AVAILABLE') && (res?.categoryId?.name === "Layouts" || res?.categoryId?.name === "Loose Diamonds")) ?
								<div>
									<UncontrolledPopover trigger="legacy" className="caratToolTip position-absolute" target={"Cart" + res?.id} placement="top" >
										<form className='d-flex justify-content-center align-items-center carats-input' onSubmit={(e) => { e.preventDefault(); GridAtc(res?.categoryId?.name, res?.id, res?.status, e?.target?.[0]?.value, parseFloat(res?.productDetails?.filter(d => d?.parameter === "CARATS")?.[0]?.value)); }} >
											<Input type="text" placeholder='Enter Carats' className='carats-input-box' required />
											<Button type="submit" color='primary' className='submit-btn'><Check /></Button>
										</form>
									</UncontrolledPopover>
								</div>
								: ""
						}

						{CHECK_IN_CART(res?.id, CART) ?
							<img id={"Cart" + res?.id} src={lightCart} style={{ padding: "0", margin: "1px 5px" }} role="button" />
							:
							res?.status === "AVAILABLE" ?
								<img id={"Cart" + res?.id} onClick={() => {
									CHECK_IN_CART(res?.id) ? toast("Product is already in cart") :
										(res?.categoryId?.name !== "Layouts" && res?.categoryId?.name !== "Loose Diamonds") &&
										AddToCart(res?.id, CART?.cartRefetch, atc, history, allProducts?.matchingPairId?.id)
								}}
									src={filterCart}
									style={{ padding: "0", margin: "0 5px" }}
									role="button"
								/>
								: <img id={"Cart" + res?.id} src={lightCart} style={{ padding: "0", margin: "0 5px" }} role="button" />}
						<UncontrolledTooltip placement="top" target={"Cart" + res?.id}>
							{CHECK_IN_CART(res?.id, CART) ? "Added to cart" : res?.status === "AVAILABLE" ? "Add to cart" : "Product is on Hold"}
						</UncontrolledTooltip>
					</span>


					<span className="d-flex justify-content-center align-items-center" style={COMPARE?.compareProducts?.includes(res?.id) ? { background: "#434343", borderRadius: "10px" } : {}}>
						<img id={"Compare" + res?.id} onClick={() => AddToCompare(res?.id, COMPARE, history)} src={COMPARE?.compareProducts?.includes(res?.id) ? compared : compare} style={{ padding: "0", margin: "2px" }} role="button" />
						<UncontrolledTooltip placement="top" target={"Compare" + res?.id}>
							{COMPARE?.compareProducts?.includes(res?.id) ? "Added to compare" : "Add to compare"}
						</UncontrolledTooltip>
					</span>
					<span className="whatsapp-line">
						<a id={"WhatsApp" + res?.id} href="https://api.whatsapp.com/send?phone=p16136301301&text=Hello" target={'_blank'} role="button" ><img src={Whatsapp} style={{ padding: "0", margin: "1px 5px" }} /></a>
						<UncontrolledTooltip placement="top" target={"WhatsApp" + res?.id}>
							WhatsApp
						</UncontrolledTooltip>
					</span>
				</div>,
			})
		})
		setTableData(diamondData)
	}, [allProducts, notCertifiedProducts, COMPARE, CART, WISHLIST, HOLD])

	const handleRowClicked = (row) => {
		history.push(`/products/${row.Handle}`)
	};
	return (
		<div className="container">
			{productLoading ? (<div className="d-flex justify-content-center align-items-center"><Spinner size={"lg"} /></div>) 
			: allProducts?.length > 0 && allProducts?.length != undefined ? (
				<div className="warning-box mt-lg-2 mt-2">
					<div style={{ top: height }} className={`d-xl-flex align-items-center justify-content-between productLoading-sec ${height === 0 ? "product-height" : "productLoading-sec"}`}>
						<h3 className="mb-xl-0 mb-1 text-xl-start text-center outfit-bold text-large ">Total {productData?.getAllProducts?.count} Products Found</h3>
						<div className="d-flex align-items-center justify-xl-start justify-content-center product-feild">
							<div className="d-flex align-items-center justify-content-center mt-lg-0 mt-2 flex-wrap mb-xl-0 mb-1 text-light-grey">
								<button className={`ms-md-1 ms-0 mt-md-0 mt-0 action-button mb-xl-0 mb-1 outfit-bold hold-request ${!visible && "disabled-btn"}`} disabled={!visible && "disabled-btn"} onClick={() => { RequestForHold(statusHoldRequest, notCertifiedProducts, HOLD, history); }}>Request for Hold</button>
								<button className={`ms-xl-2 ms-lg-1 ms-0 action-button mb-xl-0 mb-1 outfit-bold `} onClick={() => { history?.push("/product-comparison"); }}>Compare {COMPARE?.compareProducts?.length > 0 ? `(${COMPARE?.compareProducts?.length})` : ""} </button>
								<button className={`ms-xl-2 ms-lg-1 ms-0 action-button mb-xl-0 mb-1 outfit-bold`} onClick={() => { fetchData(); }}>Export To Excel</button>
								<button className={`ms-lg-1 ms-1 mt-md-0 mt-0 action-button mb-xl-0 mb-1 outfit-bold ${!visible && "disabled-btn"}`} disabled={!visible && "disabled-btn"} onClick={handleMultipleATC}>Add To Cart</button>
								<button className={`ms-1 action-button mb-xl-0 mb-1 outfit-bold ${!visible && "disabled-btn"}`} disabled={!visible && "disabled-btn"} onClick={() => { AddToWishList(notCertifiedProducts, addItemWishlist, WISHLIST, history) }}>Add to WatchList</button>
							</div>
						</div>
						<div className="d-flex align-items-center icon">
							<div className="sixgrid">
								<img src={`${Tabs === 2 ? dark6 : light6}`} className="cursor-pointer" onClick={(e) => { e.preventDefault(); setTabs(2); }} />
							</div>
							<div>
								<img src={`${Tabs === 1 ? darkGrid : cardView}`} className="mx-2 table-view-product cursor-pointer" onClick={(e) => { e.preventDefault(); setTabs(1); }} />
							</div>
							<div>
								<img src={`${Tabs === 0 ? tableView : lightTable}`} className="cursor-pointer " onClick={(e) => { e.preventDefault(); setTabs(0); }} />
							</div>
						</div>
					</div>



					{Tabs === 0 && (
						<DataTable
							columns={columns}
							data={tableData}
							defaultSortFieldId
							className="product-loading-table"
							onRowClicked={handleRowClicked}
							highlightOnHover
						/>
					)}

					{/* 4 grid view */}
					{Tabs === 1 && (
						<div className="product-row">
							<Row className="mt-1 ">
								{allProductsWithAdv?.map((items, i) => {
									const isChecked = notCertifiedProducts?.filter(d => d?.itemId === items?.id)?.length > 0;
									return (
										<ProductGridCard
											key={"product" + i}
											items={items}
											i={i}
											isChecked={isChecked}
											notCertProductArr={notCertProductArr}
											CHECK_IN_CART={CHECK_IN_CART}
											CHECK_IN_WISHLIST={CHECK_IN_WISHLIST}
											isLogin={isLogin}
											currencyData={currencyData}
											setProductDetails={setProductDetails}
											is6Grid={false}
											categoryName={categoryName}
											setProductForMetching={setProductForMetching}
											refetch={refetch}
										/>
									);
								})}
							</Row>
						</div>
					)}

					{Tabs === 2 &&
						<Row className="mt-3">
							{allProductsWithAdv?.map((items, i) => {
								const isChecked = notCertifiedProducts?.filter(d => d?.itemId === items?.id)?.length > 0;
								return (
									<ProductGridCard
										key={"product" + i}
										items={items}
										i={i}
										isChecked={isChecked}
										notCertProductArr={notCertProductArr}
										CHECK_IN_CART={CHECK_IN_CART}
										CHECK_IN_WISHLIST={CHECK_IN_WISHLIST}
										isLogin={isLogin}
										currencyData={currencyData}
										setProductDetails={setProductDetails}
										is6Grid={true}
										categoryName={categoryName}
										setProductForMetching={setProductForMetching}
										refetch={refetch}
									/>

								);
							})}
						</Row>
					}
					<ReactPaginate
						breakLabel="..."
						nextLabel=">"
						onPageChange={handlePageClick1}
						pageRangeDisplayed={5}
						forcePage={page - 1}
						pageCount={pageCount}
						previousLabel="<"
						renderOnZeroPageCount={null}
						className=" page-list py-5 d-flex justify-content-center"
						activeClassName="selected"
					/>
				</div>
			) : 				
			(
				<div className="search-product-list">
					<div className="noProduct">
						<p className="np-text">{LocalShapeFilterArr?.length==0 && LocalFilterArr?.length==0 ?"Please select any shape": "No product found "}</p>
					</div>
				</div>
			)
			}
			<HoldReqModal modal={modal} setModal={setModal} data={data} loading={holdProductsLoading} />
		</div >
	);
};

export default CertifiedDiamond;
