import React, { useState, useEffect, useContext } from "react";
import CartContext from "../../../context/CartContext";
import CurrencySymbolContext from "../../../context/CurrencySymbolContext";
import { useQuery, useMutation } from "react-apollo";
import { Col, Row, UncontrolledTooltip } from "reactstrap";
import tableView from "../../../assets/images/icons/table-view.svg";
import cardView from "../../../assets/images/icons/card-view.svg";
import eye from "../../../assets/images/icons/eye.svg";
import lightTable from "../../../assets/images/icons/light-table.svg";
import darkGrid from "../../../assets/images/icons/dark-grid.svg";
import products from "../../../../src/assets/images/pages/akar-icons_cart.png";

import Header from "../Home/Header/Header";
import { GET_COUPLE_PRODUCTS } from "./query";
import { SESSION_HOLD_STATUS } from "./mutation";
// import '../inventory.scss'
import '../Home/home.scss'
import ReactPaginate from "react-paginate";
import { GET_PRODUCT } from "../Products/query";
import { ADD_TO_CART } from "../../components/Session/mutations";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";
import BackArrow from "../../components/Back";
import { CheckCircle, PauseCircle } from "react-feather";
import WishListContext from "../../../context/WishListContext";
import { ADD_ITEM_IN_WISHLIST } from "../WishList/mutation";
import { FormatError } from "../../../@core/components/common/FormatError";
import ImageComp from "../../components/ImageComp";


function productCouple() {
	const [tab, setTab] = useState(1);
	const [allProducts, _allProducts] = useState([]);
	const [product, _product] = useState([]);
	const [Tabs, setTabs] = useState(1);
	const [limit, setLimit] = useState(10);
	const [page, setPage] = useState(1);
	const [pageCount, setPageCount] = useState(0);
	const [visible, setVisible] = useState(false);
	const [notCertifiedProducts, _notCertifiedProducts] = useState([]);
	const [statusHold, _statusHold] = useState([]);
	const [addWishlist, _AddwishList] = useState([]);
	let [selectedItem, _selectedItem] = useState([]);

	let [cartItems, _cartItems] = useState([]);

	const CART = useContext(CartContext);

	const currencyData = useContext(CurrencySymbolContext);
	const WISHLIST = useContext(WishListContext);
	const history = useHistory();
	const token = localStorage.getItem("token");
	const params = useParams();
	const productId = params?.id;
	const isLogin = token && token != undefined && token != null ? true : false;
	const {
		loading: productLoading,
		data: productData,
		refetch: productRefetch,
	} = useQuery(GET_COUPLE_PRODUCTS, {
		variables: {
			page,
			limit,
			sort: { key: "createdAt", type: -1 },
			filter: JSON.stringify({ productId: productId }),
			search: "",
		},
		fetchPolicy: "cache-and-network",
	});
	const {
		loading: singleProductLoading,
		data: singleProductData,
		refetch: singleProductRefetch,
	} = useQuery(GET_PRODUCT, {
		variables: { getProductId: productId },
	});

	// ========================= Mutations =========================
	const [atc] = useMutation(ADD_TO_CART);
	const [statusHoldRequest] = useMutation(SESSION_HOLD_STATUS);
	const [addItemWishlist] = useMutation(ADD_ITEM_IN_WISHLIST);

	useEffect(() => {
		if (productData?.getCouplesByProductId?.data) {
			_allProducts(productData?.getCouplesByProductId?.data);
			setPageCount(Math.ceil(productData?.getCouplesByProductId?.count / limit));
		}
	}, [productData]);

	useEffect(() => {
		if (singleProductData?.getProduct) {
			_product(singleProductData?.getProduct);
		}
	}, [singleProductData]);


	useEffect(() => {
		if (notCertifiedProducts?.length > 0) {
			setVisible(true);
		} else {
			setVisible(false);
		}
	}, [notCertifiedProducts])


	// To clear all checkboxes
	const clearAllCheckBoxes = () => {
		Array.from(document.querySelectorAll("input")).forEach(
			input => { input.checked = false }
		);
		_notCertifiedProducts([]);
	}

	// const checkInCart = (id) => {
	// 	const cartProduct = CART?.cartData?.getCartItems?.items?.filter((d) => d?.itemId?.id == id);
	// 	return cartProduct?.length != 0 && cartProduct != undefined ? true : selectedItem?.includes(id) ? true : false;
	// };

	const handlePageClick1 = (event) => {
		setPage(event.selected + 1);
	};
	const setProductDetails = (param, i, type) => {
		let index = allProducts[i]?.productDetails?.findIndex((p) => p.parameter.trim() === param.trim());
		if (index >= 0 && index != undefined) {
			if (type === "number") {
				return parseFloat(allProducts[i]?.productDetails[index]?.value || 0)?.toFixed(2);
			} else {
				return allProducts[i]?.productDetails[index].value;
			}
		} else {
			return "-";
		}
	};
	const notCertProductArr = (id, status) => {
		let data = [...notCertifiedProducts];
		const index = data?.findIndex((d) => d?.itemId === id);
		if (status) {
			if (index > 0 && index != undefined) {
				data[index].itemId = id;
				data[index].quantity = 1;
			} else {
				let temp = { itemId: id, quantity: 1 };
				data?.push(temp);
			}
		} else {
			data.splice(index, 1);
		}
		_notCertifiedProducts(data);
		if (statusHold.includes(id)) {
			_statusHold(statusHold.filter((status) => status !== id));
		} else {
			_statusHold([...statusHold, id]);
		}
		if (addWishlist.includes(id)) {
			_AddwishList(addWishlist.filter((status) => status !== id));
		} else {
			_AddwishList([...addWishlist, id]);
		}
	};
	const RequestForHold = () => {
		_selectedItem(statusHold);
		if (isLogin) {
			statusHoldRequest({ variables: { input: { itemIds: statusHold } } })
				.then(async (data) => {
					if (data?.data?.sendHoldRequest?.id) {
						await CART?.cartRefetch();
						_statusHold([]);
						toast.success("status has been added");
					}
				})
				.catch((err) => {
					return toast.warn(FormatError(err));
				});
		} else {
			// _statusHold([])
			toast.warn("Please Login First");
			history.push("/login");
		}
	};
	const handleATC = (id, qty) => {
		if (isLogin) {
			let quantity = qty;
			cartItems = statusHold;
			_cartItems(cartItems);
			const cartProduct = CART?.cartData?.getCartItems?.items?.filter((d) => d?.itemId?.id == id);
			if (cartProduct?.length != 0 && cartProduct != undefined) {
				cartProduct[0]?.itemId?.isCertified ? (quantity = qty) : (quantity = parseInt(cartProduct[0]?.quantity) + qty);
			}
			const input = {
				itemId: id,
				quantity: quantity,
			};

			atc({ variables: { input: cartItems.map((status) => ({ itemId: status, quantity: 1 })) } })
				.then(async (data) => {
					if (data?.data?.addToCart?.status) {
						await CART?.cartRefetch();
						_cartItems([]);
						await toast.success("Product has been added to your cart");
					}
				})
				.catch((err) => {
					return toast.warn(FormatError(err));
				});
		} else {
			toast.warn("Please Login First");
			history.push("/login");
		}
	};
	const input={itemId: addWishlist }
	const addWishlistData = () => {
		_selectedItem(statusHold);
		if (isLogin) {
			addItemWishlist({ variables: { input } })
				.then(async (data) => {
					if (data?.data?.addItemInWishlist?.id) {
						await WISHLIST?.wishListRefetch();
						_AddwishList([]);
						toast.success("Item has been added to watchlist");
					}
				})
				.catch((err) => {
					return toast.warn(FormatError(err));
				});
		} else {
			// _statusHold([])
			toast.warn("Please Login First");
			history.push("/login");
		}
	};
	const setSingleProductDetails = (param, type) => {
		let index = product?.productDetails?.findIndex((p) => p.parameter == param);
		if (index >= 0 && index != undefined) {
			if (type === "number") {
				return parseFloat(product?.productDetails[index].value || 0)?.toFixed(2);
			} else {
				return product?.productDetails[index].value;
			}
		} else {
			return "-";
		}
	};

	const productValues = (param, per) => {
		const ind = product?.productDetails?.findIndex((d) => d?.parameter === param);
		if (ind > 0 && ind != undefined) {
			const value = parseFloat(product?.productDetails[ind]?.value);
			let rate = per;
			return (value - rate).toFixed(2) + " - " + (value + rate).toFixed(2);
		} else {
			return "-";
		}
	};

	return (
		<div className="home-page product-descrptions">
			<Header productRefetch={productRefetch} />
			<div className="container">
				<div className="d-flex align-items-center mb-2">
					<BackArrow history={history} />
					<h3 className="product-desc-title m-0">Back</h3>
				</div>
				<Row>
					<Col className="col-lg-4 col-12">
						<div className="productImage">
							<ImageComp src={product?.image} />
						</div>
					</Col>
					<Col className="col-lg-8 mt-lg-0 mt-3 col-12">
						<div className="product-descrption-data ps-lg-3 pb-0">
							<div className="product-wrapper-tab p-0">
								<ul className="d-flex align-items-center tab-list-box p-0 product-all-desc">
									<li
										className="tab-list buttler-heading diamond-details"
										onClick={(e) => {
											e.preventDefault();
											setTab(1);
										}}
									>
										<a href="#" className={`${tab === 1 ? "active" : ""} `}>
											Diamond Details
										</a>
									</li>

								</ul>
								{tab === 1 && (
									<div className="diamond-detail d-flex">
										{/* <ul className="diamod-detail-box p-0 d- ex align-items-center flex-wrap d-flex">
											<li className="detail-comment-list">
												<p className="detail-comment-title text-grey fw-bolder">Stone No.</p>
												<p className="detail-comment-value text-left">{product?.productName}</p>
											</li>
											<li className="detail-comment-list">
												<p className="detail-comment-title text-grey fw-bolder">Shape</p>
												<p className="detail-comment-value text-left">{product?.shapeId?.shapeName || "-"}</p>
											</li>
											<li className="detail-comment-list">
												<p className="detail-comment-title text-grey fw-bolder">Carat</p>
												<p className="detail-comment-value text-left">{setSingleProductDetails("WEIGHT")}</p>
											</li>
											<li className="detail-comment-list">
												<p className="detail-comment-title text-grey fw-bolder">Clarity</p>
												<p className="detail-comment-value text-left">{setSingleProductDetails("CLARITY")}</p>
											</li>
											<li className="detail-comment-list">
												<p className="detail-comment-title text-grey fw-bolder">Color</p>
												<p className="detail-comment-value text-left">{setSingleProductDetails("COLOR")}</p>
											</li>

											{product?.shapeId?.shapeName === "ROUND" ? (
												<li className="detail-comment-list">
													<p className="detail-comment-title text-grey fw-bolder">Cut</p>
													<p className="detail-comment-value text-left">{setSingleProductDetails("CUT")}</p>
												</li>
											) : (
												<li className="detail-comment-list">
													<p className="detail-comment-title text-grey fw-bolder">Ratio</p>
													<p className="detail-comment-value text-left">{setSingleProductDetails("RATIO")}</p>
												</li>
											)}
											<li className="detail-comment-list">
												<p className="detail-comment-title  text-grey fw-bolder">Polish</p>
												<p className="detail-comment-value text-left">{setSingleProductDetails("POLISH")}</p>
											</li>
											<li className="detail-comment-list">
												<p className="detail-comment-title  text-grey fw-bolder">Symmetry</p>
												<p className="detail-comment-value text-left">{setSingleProductDetails("SYMMETRY")}</p>
											</li>

										</ul>

										<ul className="diamod-detail-box Inclusion-box p-0 d-flex align-items-center flex-wrap">
											<li className="detail-comment-list">
												<p className="detail-comment-title  text-grey fw-bolder">Measurement</p>
												<p className="detail-comment-value text-center">
													{setSingleProductDetails("LENGTH") +
														" x " +
														setSingleProductDetails("WIDTH") +
														" x " +
														setSingleProductDetails("DEPTH")}
												</p>
											</li>
											<li className="detail-comment-list">
												<p className="detail-comment-title  text-grey fw-bolder">Depth(%)</p>
												<p className="detail-comment-value text-center">
													{setSingleProductDetails("DEPTH %", "number")}
												</p>
											</li>
											<li className="detail-comment-list">
												<p className="detail-comment-title  text-grey fw-bolder">Table(%)</p>
												<p className="detail-comment-value text-center">
													{setSingleProductDetails("TABLE %", "number")}
												</p>
											</li>

											<li className="detail-comment-list">
												<p className="detail-comment-title  text-grey fw-bolder">Certificate No</p>
												<p className="detail-comment-value text-center">{product?.reportNo}</p>
											</li>
											<li className="detail-comment-list">
												<p className="detail-comment-title  text-grey fw-bolder">Lab</p>
												<p className="detail-comment-value text-center">{setSingleProductDetails("CERTIFICATE")}</p>
											</li>
										</ul> */}

										<ul className="diamod-detail-box p-0 d-block align-items-center flex-wrap">
											<li className="detail-comment-list d-md-flex align-items-center">
												<div className="w-50 d-flex align-items-center justify-content-md-start justify-content-between">
													<p className="detail-comment-title text-grey fw-bolder">Stone No.</p>
													<p className="detail-comment-value text-left">{product?.productName}</p>
												</div>
												<div className="w-50 d-flex align-items-center justify-content-md-start justify-content-between">
													<p className="detail-comment-title text-grey fw-bolder">Measurement</p>
													<p className="detail-comment-value text-center">
														{setSingleProductDetails("LENGTH") +
															" x " +
															setSingleProductDetails("WIDTH") +
															" x " +
															setSingleProductDetails("DEPTH")}
													</p>
												</div>
											</li>
											<li className="detail-comment-list d-md-flex align-items-center">
												<div className="w-50 d-flex align-items-center justify-content-md-start justify-content-between">
													<p className="detail-comment-title text-grey fw-bolder">Shape</p>
													<p className="detail-comment-value text-left">{product?.shapeId?.shapeName || "-"}</p>
												</div>
												<div className="w-50 d-flex align-items-center justify-content-md-start justify-content-between">
													<p className="detail-comment-title text-grey fw-bolder">Depth(%)</p>
													<p className="detail-comment-value text-center">
														{setSingleProductDetails("DEPTH %", "number")}
													</p>
												</div>
											</li>
											<li className="detail-comment-list d-md-flex align-items-center">
												<div className="w-50 d-flex align-items-center justify-content-md-start justify-content-between">
													<p className="detail-comment-title text-grey fw-bolder">Carat</p>
													<p className="detail-comment-value text-left">{setSingleProductDetails("WEIGHT")}</p>
												</div>
												<div className="w-50 d-flex align-items-center justify-content-md-start justify-content-between">
													<p className="detail-comment-title text-grey fw-bolder">Table(%)</p>
													<p className="detail-comment-value text-center">
														{setSingleProductDetails("TABLE %", "number")}
													</p>
												</div>
											</li>
											<li className="detail-comment-list d-md-flex align-items-center">
												<div className="w-50 d-flex align-items-center justify-content-md-start justify-content-between">
													<p className="detail-comment-title  text-grey fw-bolder">Color</p>
													<p className="detail-comment-value text-left">{setSingleProductDetails("COLOR")}</p>
												</div>
												<div className="w-50 d-flex align-items-center justify-content-md-start justify-content-between">
													<p className="detail-comment-title  text-grey fw-bolder">Certificate No</p>
													<p className="detail-comment-value text-center">{product?.reportNo}</p>
												</div>
											</li>
											<li className="detail-comment-list d-md-flex align-items-center">
												<div className="w-50 d-flex align-items-center justify-content-md-start justify-content-between">
													<p className="detail-comment-title  text-grey fw-bolder">Clarity</p>
													<p className="detail-comment-value text-left">{setSingleProductDetails("CLARITY")}</p>
												</div>

												<div className="w-50 d-flex align-items-center justify-content-md-start justify-content-between">
													<p className="detail-comment-title  text-grey fw-bolder">Lab</p>
													<p className="detail-comment-value text-center">{setSingleProductDetails("CERTIFICATE")}</p>
												</div>
											</li>
											{product?.shapeId?.shapeName === "ROUND" ? (
												<li className="detail-comment-list d-flex align-items-center">
													<p className="detail-comment-title  text-grey fw-bolder">Cut</p>
													<p className="detail-comment-value text-left">{setSingleProductDetails("CUT")}</p>
												</li>
											) : (
												<li className="detail-comment-list d-flex align-items-center">
													<p className="detail-comment-title  text-grey fw-bolder">Ratio</p>
													<p className="detail-comment-value text-left">{setSingleProductDetails("RATIO")}</p>
												</li>
											)}

											<li className="detail-comment-list d-md-flex align-items-center">
												<div className="w-50 d-flex align-items-center justify-content-md-start justify-content-between">
													<p className="detail-comment-title  text-grey fw-bolder">Polish</p>
													<p className="detail-comment-value text-left">{setSingleProductDetails("POLISH")}</p>
												</div>
											</li>
											<li className="detail-comment-list d-md-flex align-items-center">
												<div className="w-50 d-flex align-items-center justify-content-md-start justify-content-between">
													<p className="detail-comment-title  text-grey fw-bolder">Symmetry</p>
													<p className="detail-comment-value text-left">{setSingleProductDetails("SYMMETRY")}</p>
												</div>
											</li>
											{/* <li className="detail-comment-list d-flex align-items-center">
                                                    <p className="detail-comment-title  text-grey fw-bolder">Fluorescence</p>
                                                    <p className="detail-comment-value text-left">{setProductDetails('FLUORESCENCE')}</p>
                                                </li> */}
										</ul>
									</div>

								)}
								{/* {
                                    tab === 2 && <div>
                                        <div className="diamond-detail">
                                            <ul className="diamod-detail-box p-0 d-flex align-items-center flex-wrap">
                                                <li className="detail-comment-list">
                                                    <p className="detail-comment-title">Lab Comment</p>
                                                    <p className="detail-comment-value">{product?.labComment}</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                } */}
								{tab === 4 && (
									<div>
										<div className="diamond-detail">
											<ul className="diamod-detail-box Inclusion-box p-0 d-flex align-items-center flex-wrap">
												<li className="detail-comment-list">
													<p className="detail-comment-title Inclusion-title"></p>
													<p className="detail-comment-value Inclusion-value">Table</p>
													<p className="detail-comment-value">Side</p>
												</li>
												<li className="detail-comment-list">
													<p className="detail-comment-title Inclusion-title">Black</p>
													<p className="detail-comment-value Inclusion-value">
														{setSingleProductDetails("TABLE_BLACK")}
													</p>
													<p className="detail-comment-value">{setSingleProductDetails("SIDE_BLACK")}</p>
												</li>
												<li className="detail-comment-list">
													<p className="detail-comment-title Inclusion-title">Spot</p>
													<p className="detail-comment-value Inclusion-value">
														{setSingleProductDetails("TABLE_SPOT")}
													</p>
													<p className="detail-comment-value">{setSingleProductDetails("SIDE_SPOT")}</p>
												</li>
												<li className="detail-comment-list">
													<p className="detail-comment-title Inclusion-title">White</p>
													<p className="detail-comment-value Inclusion-value">
														{setSingleProductDetails("TABLE_WHITE")}
													</p>
													<p className="detail-comment-value">{setSingleProductDetails("SIDE_WHITE")}</p>
												</li>
											</ul>

											<ul className="diamod-detail-box Inclusion-box p-0 d-flex align-items-center flex-wrap">
												<li className="detail-comment-list d-md-flex align-items-center">
													<p className="detail-comment-title Inclusion-title"></p>
													<p className="detail-comment-value Inclusion-value">Table</p>
													<p className="detail-comment-value">Side</p>
												</li>
												<li className="detail-comment-list d-md-flex align-items-center">
													<p className="detail-comment-title Inclusion-title">Black</p>
													<p className="detail-comment-value Inclusion-value">{setProductDetails('TABLE_BLACK')}</p>
													<p className="detail-comment-value">{setProductDetails('SIDE_BLACK')}</p>
												</li>
												<li className="detail-comment-list d-md-flex align-items-center">
													<p className="detail-comment-title Inclusion-title">Spot</p>
													<p className="detail-comment-value Inclusion-value">{setProductDetails('TABLE_SPOT')}</p>
													<p className="detail-comment-value">{setProductDetails('SIDE_SPOT')}</p>
												</li>
												<li className="detail-comment-list d-md-flex align-items-center">
													<p className="detail-comment-title Inclusion-title">White</p>
													<p className="detail-comment-value Inclusion-value">{setProductDetails('TABLE_WHITE')}</p>
													<p className="detail-comment-value">{setProductDetails('SIDE_WHITE')}</p>
												</li>
											</ul>
										</div>
									</div>
								)}
							</div>
						</div>
					</Col>
				</Row>
				<div className="my-md-4 my-2 row">
					<div className="col-xl-2 col-lg-2 col-md-4 mb-lg-0">
						<p className="product-range-title text-center"> Depth(%) </p>
						<p className="product-range">{productValues("DEPTH %", 2)} </p>
					</div>
					<div className="col-xl-2 col-lg-2 col-md-4 mb-lg-0">
						<p className="product-range-title text-center"> Table(%) </p>
						<p className="product-range"> {productValues("TABLE %", 2)}</p>
					</div>

					<div className="col-xl-3 col-lg-3 col-md-4 mb-lg-0">
						<p className="product-range-title text-center"> Measurement</p>
						<p className="product-range">

							{productValues("LENGTH", 0.07) +
								" x " +
								productValues("WIDTH", 0.07) +
								" x " +
								productValues("DEPTH", 0.07)}
						</p>
						{/* <p className='product-range'> {setSingleProductDetails('LENGTH') + ' x ' + setSingleProductDetails('WIDTH') + " x " + setSingleProductDetails('DEPTH')}</p> */}
					</div>
					{product?.shapeId?.shapeName !== "ROUND" && (
						<div className="col-xl-2 col-lg-2 col-md-4 mb-lg-0">
							<p className="product-range-title text-center"> Ratio </p>
							<p className="product-range">{productValues("RATIO", 0.01)}</p>
						</div>
					)}

					<div className="col-xl-3 col-lg-3 col-md-4 mb-lg-0">
						<p className="product-range-title text-center"> Carat </p>
						<p className="product-range">{productValues("WEIGHT", 0.04)}</p>
					</div>
				</div>
				<Row>
					<div className="certified-diamond-data">
						{allProducts?.length > 0 && allProducts?.length != undefined && (
							<div className="search-product-list ">
								<div className="d-xl-flex align-items-center justify-content-between">
									<h3 className="mb-0 pb-xl-0 pb-2">Searched Results</h3>
									<div className="d-md-flex align-items-center justify-content-between">
										{Tabs == 0 ? (
											// <button
											//     className={`not-cert-atc ${(notCertifiedProducts?.length <= 0 || notCertifiedProducts?.length == undefined) ? 'disabled-btn' : ''}`}
											//     disabled={(notCertifiedProducts?.length > 0 && notCertifiedProducts?.length != undefined) ? false : true}
											//     onClick={() => { handleNotCertifiedATC() }}
											// > Add To Cart </button> : null
											<div>
												<button
													// className={`mb-1 common-button ${addWishlist?.length <= 0 || addWishlist?.length == undefined ? "disabled-btn" : ""}`}
													className={`mb-1 common-button me-1 ${!visible ? "disabled-btn" : ""}`}
													disabled={!visible && true}
													// disabled={notCertifiedProducts?.length > 0 && notCertifiedProducts?.length != undefined ? false : true}
													onClick={() => { addWishlistData(); clearAllCheckBoxes(); }}
												>Add To Watchlist</button>
												<button
													// className={`ms-2 common-button ${statusHold?.length <= 0 || statusHold?.length == undefined ? "disabled-btn" : ""}`}
													disabled={!visible && true}
													className={`mb-1 common-button me-1 ${!visible ? "disabled-btn" : ""}`}
													// disabled={notCertifiedProducts?.length > 0 && notCertifiedProducts?.length != undefined ? false : true}
													onClick={() => { RequestForHold(); clearAllCheckBoxes(); }}
												> Request for Hold </button>
												<button
													// className={`mb-1 ms-2 common-button ${notCertifiedProducts?.length <= 0 || notCertifiedProducts?.length == undefined ? "disabled-btn" : ""}`}
													className={`mb-1 common-button me-1 ${!visible ? "disabled-btn" : ""}`}
													// disabled={notCertifiedProducts?.length > 0 && notCertifiedProducts?.length != undefined ? false : true}
													disabled={!visible && true}
													onClick={() => { handleATC(); clearAllCheckBoxes(); }}
												>Add To Cart </button>
											</div>
										) : null}
										<div className="d-flex align-items-center justify-content-end">
											<img src={`${Tabs === 1 ? darkGrid : cardView}`} className="cursor-pointer table-view-product " onClick={(e) => { e.preventDefault(); setTabs(1); }} />
											<img src={`${Tabs === 0 ? tableView : lightTable}`} className=" ms-2 cursor-pointer" onClick={(e) => { e.preventDefault(); setTabs(0); }} />
										</div>
									</div>
								</div>
								{Tabs === 0 && (
									<div className="table-responsive mb-2">
										<table className="table product-table">
											<thead>
												<tr>
													<th className="scroll-static"> <p>Select</p> </th>
													<th><p>View</p></th>
													{/* <th> <p>Stone ID</p> </th> */}
													<th><p>Status</p></th>
													<th><p>Shape</p></th>
													<th><p>Carat</p></th>
													<th> <p>Color</p> </th>
													<th> <p>Clarity</p> </th>
													<th> <p>Cut</p> </th>
													<th> <p>Pol</p> </th>
													<th> <p>Sym</p> </th>
													<th> <p>Measurement</p> </th>
													{/* <th> <p>Flour</p></th> */}
													<th> <p>Ratio</p> </th>
													<th> <p>Net Amt</p> </th>
													<th> <p>Lab </p> </th>
													{/* <th> <p>Depth</p></th>
                              <th> <p>Table</p></th> */}
													<th> <p>Certificate no</p> </th>
												</tr>
											</thead>
											<tbody>
												{allProducts?.map((res, i) => (
													<div key={"d" + i}>
														<div className="mt-1" key={res?.id}></div>
														<tr>
															<td className="scroll-static listed-box">
																<label className="check-boxs">
																	{res?.status == "AVAILABLE" && (
																		<>
																			<input type="checkbox" onChange={(e) => notCertProductArr(res?.id, e.target.checked)} disabled={res?.status != "AVAILABLE" ? true : false} />
																			<span className="checkmark"></span>
																		</>
																	)}
																</label>
															</td>
															<td>
																<p className="cursor-pointer" onClick={() => { history.push(`/products/${res?.id}`); }}>
																	{/* <ins>{res?.productName}</ins> */}
																	<img src={eye} style={{ padding: "0" }} />
																</p>
															</td>
															{/* <img
                                  src={eye}
                                  className={`cursor-pointer`}
                                  onClick={() => {
                                    history.push(`/products/${res?.id}`);
                                  }}
                                /> */}

															<td>
																{res?.status === "AVAILABLE" ? (
																	<p id={"r" + res?.id} className="cursor-pointer text-center">
																		<CheckCircle style={{ color: "#8da82b" }} />
																	</p>
																) : (
																	<p id={"r" + res?.id} className="cursor-pointer text-center">
																		<PauseCircle style={{ color: "#6e6b7b" }} />
																	</p>
																)}
																<UncontrolledTooltip placement="top" target={"r" + res?.id}>
																	{res?.status === "AVAILABLE" ? "Available" : "On Hold"}
																</UncontrolledTooltip>
															</td>

															<td> <p>{res?.shapeId?.shapeName}</p> </td>
															<td> <p>{setProductDetails("WEIGHT", i, "number")} </p> </td>
															<td> <p>{setProductDetails("COLOR", i)} </p> </td>
															<td> <p>{setProductDetails("CLARITY", i)} </p> </td>
															<td> <p>{setProductDetails("CUT", i)} </p></td>
															<td> <p>{setProductDetails("POLISH", i)} </p> </td>
															<td> <p>{setProductDetails("SYMMETRY", i)} </p> </td>
															<td> <p> {setProductDetails("LENGTH", i) + " x " + setProductDetails("WIDTH", i) + " x " + setProductDetails("DEPTH", i)}</p></td>
															{/* <td> <p>{setProductDetails("FLUORESCENCE INTENSITY", i)} </p></td> */}
															<td> <p>{setProductDetails("RATIO", i, "number")} </p> </td>
															<td> <p>{currencyData?.currency == "USD" ? `$${res?.netValue}` : currencyData?.changeOnCurrentCurrencyPrice(res?.netValue)} </p></td>
															<td> <p>{setProductDetails("CERTIFICATE", i)} </p> </td>
															{/* <td> <p>{setProductDetails("DEPTH %", i, "number")} </p></td>
                                  <td> <p>{setProductDetails("TABLE %", i, "number")} </p></td> */}
															<td><p>{res?.reportNo || "-"} </p> </td>
														</tr>
													</div>
												))}
											</tbody>
										</table>
									</div>
								)}
								{Tabs === 1 && (
									<div className="product-row">
										{allProducts?.map((items, i) => {
											return (
												<div className="product-sub-box" key={items?.id}>
													<div className="position-relative cursor-pointer product-data-sub-box">
														<div className="product-data-box">
															<ImageComp
																className="product-grid-image"
																src={items?.image}
															/>

														</div>
														<div className="hover-product">
															<div className="hover-data d-flex justify-content-center align-items-center flex-column">
																{/* <h4
                                  className="hover-data-title"
                                  onClick={() => {
                                    history.push(`/products/${items?.id}`);
                                  }}
                                >
                                  {items?.productName}
                                </h4> */}
																<p className="hover-data-subtitle">{items?.description}</p>
															</div>
															<button
																className="view-btn view-product-btn"
																onClick={() => {
																	history.push(`/products/${items?.id}`);
																}}
															>
																view Product
																{/* <img src={views} /> */}
															</button>


															{items?.status != "AVAILABLE" ? null : (
																<button
																	className="add-cart-btn"
																	onClick={() => {
																		handleATC(items?.id, 1);
																	}}
																>
																	<span className="add-cart-btn cursor-pointer position-absolute " onClick={() => { handleATC(items?.id, 1) }}>
																		<img src={products} alt="produtCart" />
																	</span>
																</button>
															)}
														</div>
													</div>
													<h4
														className="hover-data-title mb-0 buttler-heading text-center pt-1"
														onClick={() => {
															history.push(`/products/${items?.id}`);
														}}
													>
														{/* {items?.productName} */}
														{items?.shapeId?.shapeName} {items?.productDetails?.find(val => val?.parameter == "CERTIFICATE")?.value} {items?.reportNo}
													</h4>
													{/* <p className="product-box-title mb-0 buttler-heading text-center">{items?.productName}</p> */}
													{items?.shapeId?.shapeName === "ROUND" ? (
														<>

															<div className="d-flex justify-content-between product-bottom-detail">
																<div className="d-flex align-items-center">
																	<p className="product-box-subtitle mb-0">Carat:</p>
																	<b className="product-box-subnumber">{setProductDetails("WEIGHT", i)}</b>
																</div>
																<div className="d-flex align-items-center">
																	<p className="product-box-subtitle mb-0">Color:</p>
																	<b className="product-box-subnumber">{setProductDetails("COLOR", i)}</b>
																</div>
																<div className="d-flex align-items-center">
																	<p className="product-box-subtitle mb-0">Clarity:</p>
																	<b className="product-box-subnumber">{setProductDetails("CLARITY", i)}</b>
																</div>
															</div>
															<div className="d-flex justify-content-between product-bottom-detail">
																<div className="d-flex align-items-center">
																	<p className="product-box-subtitle mb-0">Cut:</p>
																	<b className="product-box-subnumber">{setProductDetails("CUT", i)}</b>
																</div>
																<div className="d-flex align-items-center">
																	<p className="product-box-subtitle mb-0">Polish:</p>
																	<b className="product-box-subnumber">{setProductDetails("POLISH", i)}</b>
																</div>
																<div className="d-flex align-items-center">
																	<p className="product-box-subtitle mb-0">Symm:</p>
																	<b className="product-box-subnumber">{setProductDetails("SYMMETRY", i)}</b>
																</div>
															</div>
															<div className="d-flex justify-content-between product-bottom-detail">
																<div className="d-flex align-items-center">
																	<p className="product-box-subtitle mb-0"></p>
																	<b className="product-box-subnumber">
																		(
																		{setProductDetails("LENGTH", i) +
																			" x " +
																			setProductDetails("WIDTH", i) +
																			" x " +
																			setProductDetails("DEPTH", i)}
																		)
																	</b>
																</div>
																<div className="d-flex align-items-center">
																	{/* <p className="product-box-subtitle mb-0">Price:</p> */}
																	{/* <b className="bolder">{items?.netValue && "$" + items?.netValue} </b> */}
																	<b className="bolder">{items?.netValue && `${currencyData?.currency == "USD" ? `$${items?.netValue}` : currencyData?.changeOnCurrentCurrencyPrice(items?.netValue)}`}</b>
																</div>
															</div>
														</>
													) : (
														<>

															<div className="d-flex justify-content-between product-bottom-detail">
																<div className="d-flex align-items-center">
																	<p className="product-box-subtitle mb-0">Carat:</p>
																	<b className="product-box-subnumber">{setProductDetails("WEIGHT", i)}</b>
																</div>
																<div className="d-flex align-items-center">
																	<p className="product-box-subtitle mb-0">Color:</p>
																	<b className="product-box-subnumber">{setProductDetails("COLOR", i)}</b>
																</div>
																<div className="d-flex align-items-center">
																	<p className="product-box-subtitle mb-0">Clarity:</p>
																	<b className="product-box-subnumber">{setProductDetails("CLARITY", i)}</b>
																</div>
															</div>
															<div className="d-flex justify-content-between product-bottom-detail">
																<div className="d-flex align-items-center">
																	<p className="product-box-subtitle mb-0">Polish:</p>
																	<b className="product-box-subnumber">{setProductDetails("POLISH", i)}</b>
																</div>
																<div className="d-flex align-items-center">
																	<p className="product-box-subtitle mb-0">Symm:</p>
																	<b className="product-box-subnumber">{setProductDetails("SYMMETRY", i)}</b>
																</div>
																<div className="d-flex align-items-center">
																	<p className="product-box-subtitle mb-0">Ratio:</p>
																	<b className="product-box-subnumber">{setProductDetails("RATIO", i)}</b>
																</div>
															</div>
															<div className="d-flex justify-content-between product-bottom-detail">
																<div className="d-flex align-items-center">
																	<p className="product-box-subtitle mb-0"></p>
																	<b className="product-box-subnumber">
																		(
																		{setProductDetails("LENGTH", i) +
																			" x " +
																			setProductDetails("WIDTH", i) +
																			" x " +
																			setProductDetails("DEPTH", i)}
																		)
																	</b>
																</div>
																<div className="d-flex align-items-center">
																	{/* <p className="product-box-subtitle mb-0">Price:</p> */}
																	{/* <b className="bolder">{items?.netValue && "$" + items?.netValue} </b> */}
																	<b className="bolder">{items?.netValue && `${currencyData?.currency == "USD" ? `$${items?.netValue}` : currencyData?.changeOnCurrentCurrencyPrice(items?.netValue)}`}</b>
																</div>
															</div>
														</>
													)}
												</div>
											);
										})}
									</div>
								)}
								<ReactPaginate
									breakLabel="..."
									nextLabel=">"
									onPageChange={handlePageClick1}
									pageRangeDisplayed={5}
									// forcePage={page}
									pageCount={pageCount}
									previousLabel="<"
									renderOnZeroPageCount={null}
									className="pagination-list mb-3"
									activeClassName="selected"
								/>
							</div>
						)}
					</div>
				</Row>
			</div>
		</div>
	);
}

export default productCouple;
