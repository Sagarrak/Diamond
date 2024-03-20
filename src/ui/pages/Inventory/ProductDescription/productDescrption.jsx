import React, { useState, useEffect, useRef, useContext } from "react";
import CartContext from "../../../../context/CartContext";
import CurrencySymbolContext from "../../../../context/CurrencySymbolContext";
import { useParams, useHistory, Link } from "react-router-dom";
import { FormatError } from "../../../../@core/components/common/FormatError";
import Header from "../../Home/Header/Header";
import pause from "../../../../assets/images/images/pause.svg";
import DragVideo from "../../../../assets/images/images/DragVideo.svg";
import check from "../../../../assets/images/icons/true.png";
import WishListContext from "../../../../context/WishListContext";
import { toast } from "react-toastify";
import './productDescription.scss';
import colorDummy from "../../../../assets/images/icons/colorDummy.svg";
import { useMutation, useQuery } from "react-apollo";
import { AddToCart, AddToCompare, AddToWishList } from "../../../functions/commonFunctions";
import { ADD_ITEM_IN_WISHLIST } from "../../WishList/mutation";
import { ADD_TO_CART } from "../../../components/Session/mutations";
import BackArrow from "../../../components/Back";
import { SESSION_HOLD_STATUS } from "../mutation";
import { GET_RELATED_PRODUCTS } from "../query";
import ImageComp from "../../../components/ImageComp";
import { Badge, Button, Card, Col, Input, Row, Spinner, UncontrolledTooltip } from "reactstrap";
import city from "../City.json";
import ReqInHoldStatusIon from "../../../../assets/images/icons/ReqInHoldStatusIon.svg";
import whish from "../../../../assets/images/icons/whish.svg";
import Whatsapp from "../../../../assets/images/icons/Whatsapp.svg";
import compare from "../../../../assets/images/icons/compare-icon.svg";
import compared from "../../../../assets/images/icons/compared-icon.svg";
import hold from "../../../../assets/images/icons/hold.svg";
import lightWishlist from "../../../../assets/images/icons/lightWishlist.svg";
import clarityDummy from "../../../../assets/images/icons/clarityDummy.svg";
// import D from "../../../../assets/images/icons/D.svg";
import SetTitle from "../../../components/SetTitle";
import Footer from "../../../components/Footer";
import ProductGridCard from "../productGridCard";
import { GetSingleProduct } from "../../../functions/commonQuries";
import ProductDetails from "./ProductDetails";
import CompareContext from "../../../../context/CompareContext";
import SpinnerComponent from "../../../../@core/components/spinner/Fallback-spinner";
import Error from "@src/ui/components/Error/404";
// import TempImg from "../../../assets/images/icons/product-image.png";
import TempImg from '../../../../assets/images/icons/product-image.png'
import D from '../../../../assets/images/color/D.png'
import E from '../../../../assets/images/color/E.png'
import F from '../../../../assets/images/color/F.png'
import G from '../../../../assets/images/color/G.png'
import H from '../../../../assets/images/color/H.png'
import I from '../../../../assets/images/color/I.png'
import J from '../../../../assets/images/color/J.png'
import K from '../../../../assets/images/color/K.png'
import L from '../../../../assets/images/color/L.png'
import M from '../../../../assets/images/color/M.png'
import IF from '../../../../assets/images/clarity/IF.png'
import VVS1 from '../../../../assets/images/clarity/VVS1.png'
import VVS2 from '../../../../assets/images/clarity/VVS1.png'
import VS2 from '../../../../assets/images/clarity/VS2.png'
import S1 from '../../../../assets/images/clarity/S1.png'
import S2 from '../../../../assets/images/clarity/S2.png'
import I1 from '../../../../assets/images/clarity/I1.png'
import I2 from '../../../../assets/images/clarity/I2.png'
import { ChevronDown, ChevronUp } from "react-feather";


const productDescription = () => {
	const COMPARE = useContext(CompareContext);
	const CART = useContext(CartContext);
	const currencyData = useContext(CurrencySymbolContext);
	const [popup, setPopup] = useState(false);
	const [tab, setTab] = useState(1);
	const [productData, _productData] = useState([]);
	const [mainFrame, _mainFrame] = useState(<ImageComp />);
	const [tabActive1, _tabActive1] = useState("active");
	const [tabActive2, _tabActive2] = useState("");
	const [tabActive3, _tabActive3] = useState("");
	const [productStatus, _productStatus] = useState("");
	const params = useParams();
	const [limit, setLimit] = useState(4);

	const history = useHistory();
	const token = localStorage.getItem("token");
	const isLogin = token && token != undefined && token != null ? true : false;
	const matchingPairData = productData?.matchingPairId;

	const defaultVideo = (
		<iframe
			width="560"
			height="315"
			src="https://www.youtube.com/embed/3LSHnLj-utw"
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	);
	const video = productData?.video ? (
		<iframe src={productData?.video?.replace("http://", "https://")}></iframe>
	) : (defaultVideo);




	// const certificateIframe = productData?.certificateURL ? <iframe src={productData?.certificateURL}></iframe> : <iframe width="560" height="315" src="https://www.youtube.com/embed/3LSHnLj-utw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>;
	const frameImg = (<ImageComp src={productData?.image} />);
	useEffect(() => _mainFrame(<ImageComp className="img-fluid" src={productData?.image} />), [productData]);
	const setProductDetails = (param, type) => {
		let index = productData?.productDetails?.findIndex((p) => p.parameter == param);
		if (index >= 0 && index != undefined) {
			if (type === "number") return parseFloat(productData?.productDetails[index].value || 0)?.toFixed(2);
			else return productData?.productDetails[index].value;
		} else { return "-"; }
	};
	// ========================= Queries =========================

	const { data, loading, refetch } = GetSingleProduct(params?.id);

	const { loading: relLoading, data: relData } = useQuery(GET_RELATED_PRODUCTS, {
		variables: { relatedText: `${productData?.shapeId?.shapeName}-${setProductDetails("COLOR")}-${setProductDetails("CLARITY")}` },
		fetchPolicy: "no-cache",
	});

	const TotalRecommandedProducts = relData?.recommendedProducts;

	// ========================= Mutations =========================
	const [atc] = useMutation(ADD_TO_CART);
	const [addToWishlist] = useMutation(ADD_ITEM_IN_WISHLIST);
	const [statusHoldRequest] = useMutation(SESSION_HOLD_STATUS);
	const WISHLIST = useContext(WishListContext);

	useEffect(() => {
		if (data?.getProduct) {
			_productData(data?.getProduct);
			if (data?.getProduct?.status) {
				if (data?.getProduct?.status === "AVAILABLE") {
					_productStatus(
						<>
							<span style={{ color: "#419002", marginRight: 5 }}>Available</span>
							<img style={{ marginTop: -5 }} src={check} />
						</>
					);
				} else if (data?.getProduct?.status === "HOLD") {
					_productStatus(<span style={{ color: "#FFB818" }}>On Hold</span>);
				} else if (data?.getProduct?.status === "SOLD") {
					_productStatus(<span style={{ color: "#FF0000" }}>Sold Out</span>);
				}
			}
		} else {
			!loading && history?.push("/404")
		}
	}, [data, loading]);


	useEffect(() => {
		SetTitle(`${productData?.shapeId?.shapeName} ${setProductDetails("COLOR")} ${setProductDetails("CLARITY")} ${parseFloat(setProductDetails("CARATS")).toFixed(2)} Lab Diamond | CVD Mart`)
	}, [productData]);

	const CHECK_IN_CART = id => {
		const cartProduct = CART?.cartData?.getCartItems?.items?.filter((d) => d?.itemId?.id == id);
		if (cartProduct?.length != 0 && cartProduct != undefined) { return true; } else { return false }
	}


	const getCountryByCitiesName = (name) => {
		let cityName = name ? name : "surat";
		const data = city?.filter(city => city?.name?.toLowerCase() === cityName?.toLowerCase())
		return { Flag: data[0]?.Flag, country: data[0]?.country };
	}


	const CHECK_IN_WISHLIST = id => {
		const wishlistProduct = WISHLIST?.wishListData?.getWishlist?.data?.[0]?.items?.filter((d) => { return d?.itemId?.id == id })
		if (wishlistProduct?.length != 0 && wishlistProduct != undefined) { return true; } else { return false }
	}


	const checkInCart = () => {
		const cartProduct = CART?.cartData?.getCartItems?.items?.filter((d) => d?.itemId?.id == productData?.id);
		return cartProduct?.length != 0 && cartProduct != undefined ? true : false;
	};

	const handleMainFrame = (type) => {

		if (type === "image") {
			_mainFrame(frameImg);
			_tabActive1("active");
			_tabActive2("");
			_tabActive3("");
		} else if (type === "video") {
			if (video) {
				_mainFrame(video);

			} else {
				_mainFrame(TempImg);
			}
			_tabActive1("");
			_tabActive2("active");
			_tabActive3("");
		} else {
			_mainFrame(<video autoPlay loop style={{ width: "85%" }}><source src={productData?.DiamondVideoMp4} type="video/mp4" /></video>);
			_tabActive1("");
			_tabActive2("");
			_tabActive3("active");
		}
	};

	const checkProductPath = localStorage.getItem("productPath");
	useEffect(() => {
		checkProductPath == `/products/${productData?.id}` && localStorage.removeItem('productPath');
	}, [checkProductPath])

	const RequestForHoldOther = (id) => {
		statusHoldRequest({ variables: { input: { itemIds: id } } })
			.then(async (data) => {
				if (data?.data?.sendHoldRequest?.id) {
					toast.success("status has been added");
				}
			})
			.catch((err) => {
				return toast.warn(FormatError(err));
			});
	}
	const setColorImages = () => {
		let img;
		const color = setProductDetails("COLOR");
		switch (color) {
			case "D":
				img = D
				break;
			case "E":
				img = E
				break;
			case "F":
				img = F
				break;
			case "G":
				img = G
				break;
			case "H":
				img = H
				break;
			case "I":
				img = I
				break;
			case "J":
				img = J
				break;
			case "K":
				img = K
				break;
			case "L":
				img = L
				break;
			case "M":
				img = M
				break;
			default:
				img = TempImg
				break;
		}

		return img

	}
	const setClarityImages = () => {
		let img;
		const clarity = setProductDetails("CLARITY");
		switch (clarity) {
			case "FL":
				img = F
				break;
			case "IF":
				img = IF
				break;
			case "VVS1":
				img = VVS1
				break;
			case "VVS2":
				img = VVS2
				break;
			case "VS1":
				img = VS2
				break;
			case "VS2":
				img = VS2
				break;
			case "SI1":
				img = S1
				break;
			case "SI2":
				img = S2
				break;
			case "I1":
				img = I1
				break;
			case "I2":
				img = I2
				break;
			default:
				img = TempImg
				break;
		}

		return img

	}
	return (
		loading ? <SpinnerComponent /> :
			<div className="home-page product-descrptions">
				<Header productRefetch={refetch} />
				<div className="product-descrption-data px-xl-0 px-2">
					<div className="container">

						<div className="productMain mt-xl-0 mt-2">
							<div className="d-flex align-items-center mb-2">
								<BackArrow history={history} />
								<div aria-label="breadcrumb">
									<ol className="breadcrumb" style={{ alignItems: "baseline" }}>
										<li className="breadcrumb-item breadcrumb">
											<Link to="/">Diamond</Link>
										</li>
										<li className="fontBold">&nbsp; {productData?.shapeId?.shapeName}</li>
										<li className="fontBold">&nbsp; {parseFloat(setProductDetails("CARATS")).toFixed(2)}</li>
										<li className="fontBold">&nbsp; {setProductDetails("COLOR")}</li>
										<li className="fontBold">&nbsp; {setProductDetails("CLARITY")}</li>
										<li className="fontBold">&nbsp; {productData?.productName}</li>
									</ol>
								</div>
							</div>
							<div className="row product-image-wrap">
								<div className="col-xl-4 col-12">
									<div className="product-image-data">
										<div className="product-image position-relative">{
											productData?.categoryId?.name === "Matching Pair" &&
											<div className='pairBadge position-absolute d-flex justify-content-center align-items-center' style={{ background: "#fff", color: "#656565", margin: "13px", fontSize: "17px", width: "60px", right: 0, paddingTop: "2px" }}> <span>PAIR</span> </div>
										}{mainFrame}</div>
										<div className="row mt-2 d-flex align-items-center justify-content-xl-start justify-content-center">
											<div className="col-4">
												<div className="sub-product-view">
													<div className={`sub-img-box cursor-pointer ${tabActive1}`} onClick={() => { handleMainFrame("image"); }}>
														{frameImg}
													</div>
												</div>
											</div>
											{
												productData?.DiamondVideoMp4 && (
													<div className="col-4">
														<div className="sub-product-view">
															<div className={`sub-img-box cursor-pointer ${tabActive3}`} onClick={() => { handleMainFrame("video2") }}>
																<div className="position-relative">
																	<div >{frameImg}</div>
																	<img src={pause} className="position-absolute top-50 start-50 translate-middle pause-img" />
																</div>
															</div>
														</div>
													</div>)
											}
											{productData?.video && (
												<div className="col-4">
													<div className="sub-product-view position-relative">
														<div
															className={`sub-img-box cursor-pointer  ${tabActive2}`}
															onClick={() => {
																handleMainFrame("video");
															}}
														>
															<div className="position-relative">
																<div >{frameImg}</div>
																<img src={DragVideo} className="position-absolute top-50 start-50 translate-middle pause-img" />
															</div>
														</div>
													</div>
												</div>
											)}

										</div>
									</div>
								</div>
								<div className="col-xl-8 col-12 mt-xl-0 mt-3">
									<div className="product-all-desc ps-lg-3">
										<div className="d-md-flex align-items-center">
											<h1 className="pe-2 product-head-bold">
												{productData?.shapeId?.shapeName} {setProductDetails("CLARITY")} {setProductDetails("COLOR")} {parseFloat(setProductDetails("CARATS")).toFixed(2)} Lab Diamond </h1>
										</div>
										<div className="productTitles">
											{isLogin ? <p className="label1">{productData?.PricePerCarat?.toFixed(2)}  	$ per carat <Badge color="light-success" className="ms-2">{productData?.discount ? `-${productData?.discount}%` : `-90%`} back</Badge></p> : ""}
											<p><span className="outfit-bold" style={{ color: "#434343" }}>{setProductDetails("CUT")} | {setProductDetails("COLOR")} | {setProductDetails("CLARITY")} </span>
												{
													productData?.certificateURL ?
														<a target="_blank" href={productData?.certificateURL} className="cursor-pointer ms-2 ms-s-0" style={{ color: "#1877F2" }}>{productData?.reportNo?.toLowerCase().includes("www.igi.org") ? productData.reportNo.split("?r=")[1] : productData?.reportNo}</a> :
														<span className="cursor-pointer ms-xl-4 ms-lg-4 ms-md-4 ms-sm-4 ms-1" style={{ cursor: "auto" }}>{productData?.reportNo}</span>
													// <a target="_blank" href={
													// 	productData?.certificateURL?.includes("hrdantwerp.com") ? `https://my.hrdantwerp.com/Download/GetGradingReportPdf/?reportNumber=${items?.reportNo}&printDocumentType=LabGrownCert` :
													// 		productData?.certificateURL?.includes("www.igi.org") ? `https://www.igi.org/viewpdf.php?r=${productData?.reportNo}` : productData?.certificateURL
													// } className="cursor-pointer ms-2 ms-s-0" >{productData?.reportNo}</a> :
													// <span className="cursor-pointer ms-xl-4 ms-lg-4 ms-md-4 ms-sm-4 ms-1" style={{ color: "#1877F2" }}>{productData?.reportNo}</span>
												}
											</p>
											<p className="text-grey">{productStatus} | <span>{getCountryByCitiesName(productData?.city)?.Flag} </span></p>
										</div>
										<div className="carting-box mb-2">
											<div className="add-to-cart ">
												{
													(productData?.categoryId?.name === "Layouts" || productData?.categoryId?.name === "Loose Diamonds") ?
														checkInCart() ?
															<button className={`btn-disable common-button`} disabled={true}	>Added To cart</button> :
															productData?.status == "AVAILABLE" &&
															<div>
																<form className='d-flex justify-content-center align-items-center carats-input' onSubmit={(e) => {
																	e.preventDefault();
																	if (productData?.status != "AVAILABLE") {
																		toast.error(`Product Is On Hold`)
																	} else if (e?.target?.[0]?.value > 0 && e?.target?.[0]?.value <= parseFloat(setProductDetails("CARATS"))) {
																		AddToCart(productData?.id, CART?.cartRefetch, atc, history, e?.target?.[0]?.value)
																	} else {
																		toast.error(`Please enter minimum 0.1 and maximum ${parseFloat(setProductDetails("CARATS"))} carats`)
																	}
																}
																} >
																	<Input type="text" placeholder='Enter Custom Carats' className='carats-input-box' required style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }} readOnly={productData?.status != "AVAILABLE"} />
																	<Button type="submit" color='primary' className='submit-btn d-flex align-items-center'>
																		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
																			<path d="M5 7.76562H18.79C19.0694 7.76564 19.3457 7.8242 19.6011 7.93753C19.8565 8.05087 20.0854 8.21646 20.2729 8.42364C20.4603 8.63082 20.6023 8.87499 20.6897 9.1404C20.777 9.40582 20.8078 9.68659 20.78 9.96463L20.18 15.9646C20.1307 16.4581 19.8997 16.9157 19.532 17.2485C19.1642 17.5813 18.686 17.7656 18.19 17.7656H8.64C8.17747 17.7658 7.72918 17.6057 7.37144 17.3125C7.01371 17.0193 6.76866 16.6112 6.678 16.1576L5 7.76562Z" stroke="#fff" stroke-width="1.95495" stroke-linejoin="round" />
																			<path d="M5.00391 7.76563L4.19391 4.52263C4.13973 4.30638 4.01486 4.11443 3.83911 3.97728C3.66337 3.84013 3.44683 3.76563 3.22391 3.76562H2.00391M8.00391 21.7656H10.0039M16.0039 21.7656H18.0039" stroke="#fff" stroke-width="1.95495" stroke-linecap="round" stroke-linejoin="round" />
																		</svg>
																	</Button>

																</form>
															</div>
														:
														<button className={`${checkInCart() || productData?.status != "AVAILABLE" ? `btn-disable` : null} common-button `}
															onClick={() => { (!checkInCart() && productData?.status == "AVAILABLE" || matchingPairData == "AVAILABLE") ? AddToCart(productData?.id, CART?.cartRefetch, atc, history, matchingPairData?.id) : null; }}
															disabled={checkInCart()}
														>{checkInCart() ? "Added" : "Add"} To cart</button>
												}

												<div className="otherOptions">
													<span id={"WishList" + productData?.id}>
														{CHECK_IN_WISHLIST(productData?.id) ? <img id={"WishList" + productData?.id} src={lightWishlist} style={{ padding: "0", margin: "0 5px" }} role="button" />
															:
															<img onClick={() => AddToWishList(productData?.id, addToWishlist, WISHLIST, history)} src={whish} style={{ padding: "0", margin: "0 5px" }} role="button" />
														}
														<UncontrolledTooltip placement="top" target={"WishList" + productData?.id}>
															{CHECK_IN_WISHLIST(productData?.id) ? 'Added to watchlist' : 'Add to watchlist'}
														</UncontrolledTooltip>
													</span>
													<span id={"ho" + productData?.id}>{productData?.status === "AVAILABLE" ?
														<img onClick={() => RequestForHoldOther(productData?.id)} src={hold} style={{ padding: "0", margin: "0 5px" }} role="button" />
														:
														<img id={"ho" + productData?.id} src={ReqInHoldStatusIon} style={{ padding: "0", margin: "0 5px" }} role="button" />}
														<UncontrolledTooltip placement="top" target={"ho" + productData?.id}>
															{productData?.status === "AVAILABLE" ? "Request for hold" : "On Hold"}
														</UncontrolledTooltip>
													</span>


													<span id={"Compare" + productData?.id} onClick={() => AddToCompare(productData?.id, COMPARE, history)} style={COMPARE?.compareProducts?.includes(productData?.id) ? { background: "#434343" } : {}} role="button" onMouseLeave={() => setPopup(false)}>
														<img src={COMPARE?.compareProducts?.includes(productData?.id) ? compared : compare} style={{ padding: "0", margin: "0 5px" }} onMouseEnter={() => setPopup(true)} />

														{/* <UncontrolledTooltip placement="top" target={"Compare" + productData?.id}>
																{COMPARE?.compareProducts?.includes(productData?.id) ? "Added to compare" : "Add to compare"}
															</UncontrolledTooltip> */}
														<div className={`compare-popup ${popup === true ? 'd-flex' : "d-none"}`} >
															<ul style={{ marginBottom: "0px" }}>
																<li className="mb-1 cursor-pointer" onClick={() => AddToCompare(productData?.id, COMPARE, history)}>{COMPARE?.compareProducts?.includes(productData?.id) ? "Remove from Comparison" : "Add to compare"}</li>
																<li><Link to="/product-comparison">View Comparison</Link></li>
															</ul>
														</div>
													</span>


													<span id={"WhatsApp" + productData?.id}>
														<a href="https://api.whatsapp.com/send?phone=p16136301301&text=Hello" target={'_blank'} role="button" ><img src={Whatsapp} style={{ padding: "0", margin: "0 5px" }} /></a>
														<UncontrolledTooltip placement="top" target={"WhatsApp" + productData?.id}>
															WhatsApp
														</UncontrolledTooltip>
													</span>
												</div>

											</div>
										</div>
										{
											productData?.matchingPairId ?
												(productData.description !== null && productData?.matchingPairId?.description !== null) ?
													(
														<div className="product-description">
															<h2>Description 01</h2>
															<span className="title">{productData?.description} </span>
															<h2>Description 02</h2>
															<span className="title">{productData?.matchingPairId?.description} </span>
														</div>

													) : null
												:
												(
													<>
														<div className="product-description">
															<h2>Description:</h2>
															<span className="title">{productData?.description} </span>
														</div>
														<div className="expert-analytics">
															<h2>Expert Analysis</h2>
															<span className="title">This information is pulled from the Diamond Certification Report: {
																productData?.certificateURL ?
																	<a target="_blank" href={
																		productData?.certificateURL?.includes("hrdantwerp.com") ? 'https://my.hrdantwerp.com/Download/GetGradingReportPdf/?reportNumber=${items?.reportNo}&printDocumentType=LabGrownCert' :
																			productData?.certificateURL?.includes("www.igi.org") ? `https://www.igi.org/viewpdf.php?r=${productData?.reportNo}` : productData?.certificateURL
																	} className="cursor-pointer ms-2 ms-s-0" ><strong>{productData?.reportNo || "1152950733"}</strong></a> :
																	<span className="cursor-pointer "><strong>{productData?.reportNo || "1152950733"}</strong></span>
															} for the most accurate details of your Diamond. To get a better understanding of this analysis, connect with one of our Diamond Concierges. <b> Free Expert Analysis</b></span>
														</div>

													</>
												)

										}
									</div>
								</div>
							</div>
							<Row className={`gray-boxes ${productData?.matchingPairId ? "d-none" : "d-flex"} my-3`}>
								<Col xxl={3} xl={3} lg={3} md={6} >
									<div className="gray-box" >
										<p><span className="heading">Cut: </span><span className="outfit-bold" style={{ fontWeight: "bolder" }}>{setProductDetails("CUT")}</span></p>
										<p><span className="heading">Symmetry: </span><span className="outfit-bold">{setProductDetails("SYMMETRY")}</span></p>
										<p><span className="heading">Polish: </span><span className="outfit-bold">{setProductDetails("POLISH")}</span></p>
									</div>
								</Col>
								<Col xxl={3} xl={3} lg={3} md={6}>
									<div className="gray-box" >

										<p><span className="heading">Color: </span><span className="outfit-bold" style={{ fontWeight: "bolder" }}>{setProductDetails("COLOR")}</span></p>
										<p><span className="heading">Fluorescence: </span><span className="outfit-bold" >{setProductDetails("FLUORESCENCE INTENSITY")}</span></p>
										{/* <span className="extraText"> How much a diamond will glow under ultraviolet light </span> */}
									</div>
								</Col>
								<Col xxl={3} xl={3} lg={3} md={6}>
									<div className="gray-box">
										<p><span className="heading">Clarity: </span><span className="outfit-bold" style={{ fontWeight: "bolder" }}>{setProductDetails("CLARITY")}</span></p>
										<p><span className="heading">Eye Clean: </span><span className="outfit-bold" >Yes</span></p>
									</div>
								</Col>
								<Col xxl={3} xl={3} lg={3} md={6}>
									<div className="gray-box">
										<p><span className="heading">Carat: </span><span className="outfit-bold" style={{ fontWeight: "bolder" }}>{parseFloat(setProductDetails("CARATS")).toFixed(2)}</span></p>
										<p><span className="heading">Looks like: </span><span className="outfit-bold" >Larger</span></p>
										{/* <span className="extraText"> This will look larger than a 0.31 carat diamond </span> */}
									</div>
								</Col>
							</Row>

						</div>

						{
							productData?.matchingPairId ?
								(
									<>
										<div className="matching_pair d-xl-flex d-block">
											<Row className="matchingpair_data d-block col-xxl-6 me-lg-1">
												<div className="productSubDetails mt-0">
													<div className="detailsWithImage d-block">
														<Row className="gy-1">
															<Col xxl={6} xl={3} lg={6} md={6}  className="mb-1" >
																<div className="infoCard clarity">
																	<img src={setClarityImages()} width={100} height={100} />
																	<p className="text">Decent amount of sparkle. Very good polish. Very good symmetry.</p>
																</div>
															</Col>
															<Col xxl={6} xl={3} lg={6} md={6}  className="mb-1" >
																<div className="infoCard color">
																	<img src={setColorImages()} width={100} height={100} />
																	<div className="data second-data">
																		<div><hr /><span >Colorless</span></div>
																		<div><hr /><span>Near Colorless</span></div>
																		<div><hr /><span >Noticeable Color</span></div>
																	</div>
																</div>
															</Col>
															<Col xxl={6} xl={3} lg={6} md={6}>
																<div className="infoCard simple">
																	Chat with a gemologist for a thorough review of this diamond
																</div>
															</Col>
															<Col xxl={6} xl={3} lg={6} md={6}>
																<div className="infoCard simple">
																	Your diamond's proportions can make it look larger or smaller than its carat weight indicates. Learn more about diamond visual size here.
																</div>
															</Col>
														</Row>
														{/* <Row className="d-flex matching_infocard">
															
														</Row> */}
													</div>
													<ProductDetails productData={productData} pairLimit={limit} />
												</div>
											</Row>

											<div className="matchingpair_secound d-block  col-xxl-6">
												<div className="productSubDetails">
													<div className="detailsWithImage d-block">
														<Row className="gy-1">
															<Col xxl={6} xl={3} lg={6} md={6} className="mb-1" >
																<div className="infoCard clarity">
																	<img src={setClarityImages()} width={100} height={100} />

																	<p className="text">Decent amount of sparkle. Very good polish. Very good symmetry.</p>

																</div>
															</Col>
															<Col xxl={6} xl={3} lg={6} md={6} className="mb-1">
																<div className="infoCard color ">
																	<img src={setColorImages()} width={100} height={100} />
																	{/* <img src={colorDummy} alt="DImage" /> */}
																	<div className="data second-data">
																		<div><hr /><span >Colorless</span></div>
																		<div><hr /><span>Near Colorless</span></div>
																		<div><hr /><span>Noticeable Color</span></div>
																	</div>

																</div>
															</Col>
															<Col xxl={6} xl={3} lg={6} md={6} >
																<div className="infoCard simple">
																	Chat with a gemologist for a thorough review of this diamond
																</div>
															</Col>

															<Col xxl={6} xl={3} lg={6} md={6} >
																<div className="infoCard simple ">
																	Your diamond's proportions can make it look larger or smaller than its carat weight indicates. Learn more about diamond visual size here.
																</div>
															</Col>
														</Row>
														<Row className="d-flex matching_infocard">

														</Row>
													</div>
												</div>
												<ProductDetails matchingPairData={matchingPairData} pairLimit={limit} />
											</div>
										</div>
										<Row>
											<Col className='d-flex justify-content-center mt-2'>
												<Button type='button' className='show-data outfit-bold' onClick={() => { limit === 4 ? setLimit(500) : setLimit(4); }}>
													{
														limit === 4 ?
															<div className='d-flex'><p style={{ padding: "2px 2px 0 0" }}>Show More</p><ChevronDown /></div>
															:
															<div className='d-flex'><p style={{ padding: "2px 2px 0 0" }}>Show Less</p><ChevronUp /></div>}
												</Button>
											</Col>
										</Row>
									</>
								)
								:
								(
									<>
										{/* <div className="expert-analytics">
										</div> */}
										<div className="productSubDetails">
											<Row className="detailsWithImage">
												<Col xxl={3} xl={3} lg={6} md={6} >
													<div className="infoCard clarity" >
														<img src={setClarityImages()} width={100} height={100} />
														<p className="text">Decent amount of sparkle. Very good polish. Very good symmetry.</p>
													</div>
												</Col>

												<Col xxl={3} xl={3} lg={6} md={6}>
													<div className="infoCard color" >
														<img src={setColorImages()} width={100} height={100} />

														<div className="data second-data">
															<div><hr /><span >Colorless</span></div>
															<div><hr /><span>Near Colorless</span></div>
															<div><hr /><span >Noticeable Color</span></div>
														</div>

													</div>
												</Col>

												<Col xxl={3} xl={3} lg={6} md={6}>
													<div className="infoCard simple" >
														Chat with a gemologist for a thorough review of this diamond
													</div>
												</Col>

												<Col xxl={3} xl={3} lg={6} md={6}>
													<div className="infoCard simple" >
														Your diamond's proportions can make it look larger or smaller than its carat weight indicates. Learn more about diamond visual size here.
													</div>
												</Col>
											</Row>
										</div>
										<ProductDetails productData={productData} />
									</>
								)
						}


					</div>
				</div >
				<Row className="container mb-2 px-xl-0 px-2"><Col><h3 className="recTitle">Recommended Products</h3></Col></Row>
				<div className="position-relative px-xl-0 px-2">
					{relLoading && <Spinner className="position-absolute" style={{ top: "50%", left: "50%" }} size={'lg'} />}
					<Card className="container mb-3 product-card" style={relLoading ? { opacity: 0 } : {}}>
						<Row className="px-1" style={{ paddingBottom: "10px" }}>
							{relData?.recommendedProducts?.map((items, i) => {
								return (
									<ProductGridCard
										key={"d" + i}
										product={productData?.__typename}
										items={items}
										i={i}
										isRecommended={true}
										isLogin={isLogin}
										currencyData={currencyData}
										setProductDetails={setProductDetails}
										is6Grid={true}
										RequestForHoldOther={RequestForHoldOther}
										totalRecommandedProducts={TotalRecommandedProducts}
									/>
								);
							})}
						</Row>
					</Card>
				</div>

				<Footer showNewsLetter={false} />
			</div >
	);
};
export default productDescription;
