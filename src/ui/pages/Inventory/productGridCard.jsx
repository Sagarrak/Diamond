import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Card, CardBody, Col, Input, UncontrolledPopover, UncontrolledTooltip } from 'reactstrap'
import ImageComp from '../../components/ImageComp'
import holdReqIcon from "../../../../src/assets/images/pages/holdReqIcon.svg";
import successIcon from "../../../../src/assets/images/pages/product-check.svg";
import discountIcon from "../../../../src/assets/images/pages/discount-icon.svg";
import compare from "../../../assets/images/icons/compare-icon.svg";
import compared from "../../../assets/images/icons/compared-icon.svg";
import whish from "../../../assets/images/icons/whish.svg";
import lightCart from "../../../assets/images/icons/lightCart.svg";
import hold from "../../../assets/images/icons/hold.svg";
import ReqInHoldStatusIon from '../../../../src/assets/images/pages/ReqInHoldStatus-icon.svg';
import lightWishlist from "../../../assets/images/icons/lightWishlist.svg";
import filterCart from "../../../assets/images/icons/filterCart.svg";
import { useState } from 'react';
import { ADD_TO_CART } from '../../components/Session/mutations';
import { AddToCart, AddToCompare, AddToWishList, RequestForHold, CHECK_IN_CART, CHECK_IN_WISHLIST, CHECK_IN_HOLD } from '../../functions/commonFunctions';
import { useMutation } from 'react-apollo';
import CartContext from '../../../context/CartContext';
import { Check } from "react-feather"
import { ADD_ITEM_IN_WISHLIST } from '../WishList/mutation';
import WishListContext from '../../../context/WishListContext';
import { CompareContext } from '../../../context/CompareContext';
import { SESSION_HOLD_STATUS } from './mutation';
import HoldReqContext from '../../../context/HoldReqContext';
import { toast } from 'react-toastify';
const ProductGridCard = (props) => {
	const CART = useContext(CartContext);
	const WISHLIST = useContext(WishListContext);
	const COMPARE = useContext(CompareContext);
	const HOLD = useContext(HoldReqContext);
	const [statusHoldRequest] = useMutation(SESSION_HOLD_STATUS);
	const [atc] = useMutation(ADD_TO_CART)
	const [addToWishlist] = useMutation(ADD_ITEM_IN_WISHLIST)
	const { product, isRecommended, is6Grid, isChecked, items, i, notCertProductArr, isLogin, currencyData, categoryName, totalRecommandedProducts, refetch } = props
	const history = useHistory();

	const [isplay, setPlay] = useState(false);
	const token = localStorage.getItem("token")

	const GridAtc = (type, id, status, carat, maxCarat) => {
		if (!CHECK_IN_CART(id, CART) && status === 'AVAILABLE') {
			if (type === "Layouts" || type === "Loose Diamonds") {
				if (carat > 0 && carat <= maxCarat) {
					AddToCart(items?.id, CART?.cartRefetch, atc, history, carat)
				} else {
					toast.error(`Please enter minimum 0.1 and maximum ${maxCarat} carats`)
				}
			} else {
				AddToCart(items?.id, CART?.cartRefetch, atc, history)
			}
		}

	}


	return (
		<Col xl={`${is6Grid ? '2' : '3'}`} md={`${is6Grid ? '2' : '6'}`} className={`${product === "Product" ? 'product-content-grid col-lg-4 col-md-6' : 'product-grid-card'} `} style={totalRecommandedProducts ? { paddingTop: "10px" } : { paddingTop: "0px" }}>
			<Card className={"product-sub-box" + is6Grid ? 'product-six-grid-wrap' : ''} key={items?.id} style={isRecommended && { marginBottom: "0" }}>
				{
					items?.productType === "adv" ?
						<div className="product-data-sub-bx cursor-pointer" style={{ marginTop: "17px" }}>
							<a href={items?.url} target="_blank">
								<ImageComp
									className="product-grid-image img-fluid w-100 advertise-img"
									src={is6Grid ? items?.gridImage6 : items?.gridImage4}
									style={{ borderRadius: "15px", minHeight: token ? "415px" : "385px" }}
								/>
							</a>
						</div>
						:
						<>
							<div className="position-relative product-data-sub-box">
								<div className="product-data-box cursor-pointer" >
									{!isRecommended &&
										isChecked ?
										<label className="white-check-boxs">
											<input type="checkbox" onChange={(e) => { notCertProductArr(items?.id, e.target.checked, items?.status) }} checked={true} />
											<span className="checkmark" id={`check_${items?.id}`}></span>
										</label>
										:
										<label className={`white-check-boxs  ${totalRecommandedProducts ? "d-none" : "d-flex"}`}>
											<input type="checkbox" onChange={(e) => { notCertProductArr(items?.id, e.target.checked, items?.status) }} />
											<span className="checkmark" id={`check_${items?.id}`}></span>
										</label>
									}
									<div className="w-100 position-relative white-col" onMouseEnter={() => items?.DiamondVideoMp4 && setPlay(true)} onMouseLeave={() => items?.DiamondVideoMp4 && setPlay(false)} >
										{
											isplay === true ?
												<div className={`product-box-subnumber${!is6Grid ? 'product-six-grid-wrap' : ''}`}
													onClick={() => history.push(`/products/${items?.handle ? items?.handle : items?.id}`)}
												>
													<video autoPlay loop className='w-100'>
														<source src={items?.DiamondVideoMp4} type="video/mp4" />
													</video>
												</div>
												:
												<div className='product-grid-wrap position-relative' style={items?.image ? items?.categoryId?.name === "Matching Pair" ? { backgroundColor: "#c3c3cb" } : { backgroundColor: "#a1a6a9" } : { backgroundColor: "#f4f4f4", border: "1px solid #dadada" }}>
													{
														items?.categoryId?.name === "Matching Pair" &&
														<div className='pairBadge position-absolute d-flex justify-content-center align-items-center' style={{ background: "#fff", color: "#656565", margin: "13px", fontSize: "17px", width: "60px", borderRadius: "8px", right: 0, paddingTop: "2px" }}> <span>PAIR</span> </div>
													}
													<ImageComp
														className="product-grid-image img-fluid w-100 h-100 bordered-image video-img"
														src={items?.image}
														onClick={() => history.push(`/products/${items?.handle ? items?.handle : items?.id}`)}
													/>
												</div>
										}
									</div>
								</div>
							</div>
							<CardBody className={`pt-1 product-content-view  ${!is6Grid ? 'product-six-grid-wrap ' : ''} ${product === "Product" ? 'product-content-grid' : ""}`}>
								<div className="d-flex align-items-center justify-content-between">
									<div className={`d-flex justify-content-center product-bottom-detail cursor-pointer ${!is6Grid ? 'four-grid-img' : 'six-grid-img'} `}>
										<div className="d-flex align-items-center">
											<b className={`product-box-subnumber product-box-bold ${!is6Grid ? 'product-six-grid-wrap' : ''} ${product === "Product" ? 'product-grid' : ""}`} > {items?.shapeId?.shapeName?.toLowerCase()}<span className="spacer"></span> </b>
										</div>
										<div className="d-flex align-items-center">
											<b className={`product-box-subnumber product-box-bold ${!is6Grid ? 'product-six-grid-wrap' : ''} ${product === "Product" ? 'product-grid' : ""}`}> {items?.productDetails?.filter(d => d?.parameter === "CLARITY")?.[0]?.value || "-"} <span className="spacer"></span> </b>
										</div>
										<div className="d-flex align-items-center">
											<b className={`product-box-subnumber product-box-bold ${!is6Grid ? 'product-six-grid-wrap' : ''} ${product === "Product" ? 'product-grid' : ""} `}> {items?.productDetails?.filter(d => d?.parameter === "COLOR")?.[0]?.value || "-"} <span className="spacer"></span> </b>
										</div>
										<div className="d-flex align-items-center">
											<b className={`product-box-subnumber product-box-bold ${!is6Grid ? 'product-six-grid-wrap' : ''} ${product === "Product" ? 'product-grid' : ""}`}> {parseFloat(items?.productDetails?.filter(d => d?.parameter === "CARATS")?.[0]?.value).toFixed(2) || "-"} <span className="spacer"></span> </b>
										</div>
									</div>
									<div className={`d-felx align-items-center ${items?.matchingPairId ? "d-flex" : "d-none"} `}>
										{/* <div className={`d-flex align-items-center ${categoryName === "Matching Pair" ? "d-flex" : "d-none"} `}> */}
										<span id={`tool_${i}`} className={`product-box-subnumber measure-text fw-light ${!is6Grid ? 'product-six-grid-wrap' : ''}${product === "Product" ? 'product-grid' : ""} `}> ({items?.productDetails?.filter(d => d?.parameter === "MEASUREMENTS")?.[0]?.value || "-"})</span>
										<UncontrolledTooltip placement="top" target={`tool_${i}`}>{items?.productDetails?.filter(d => d?.parameter === "MEASUREMENTS")?.[0]?.value || "-"} </UncontrolledTooltip>
									</div>

								</div>
								{
									items?.matchingPairId ?
										(
											<>
												<div className="d-flex justify-content-between product-bottom-detail product-middle-title">
													<div className="d-flex align-items-center">
														<div className="d-flex align-items-center">
															<div className={`d-flex justify-content-center product-bottom-detail cursor-pointer ${!is6Grid ? 'four-grid-img' : 'six-grid-img'} `}>
																<div className="d-flex align-items-center">
																	<b className={`product-box-subnumber product-box-bold ${!is6Grid ? 'product-six-grid-wrap' : ''} ${product === "Product" ? 'product-grid' : ""}`} > {items?.matchingPairId?.shapeId?.shapeName?.toLowerCase()}<span className="spacer"></span> </b>
																</div>
																<div className="d-flex align-items-center">
																	<b className={`product-box-subnumber product-box-bold ${!is6Grid ? 'product-six-grid-wrap' : ''} ${product === "Product" ? 'product-grid' : ""}`}> {items?.matchingPairId?.productDetails?.filter(d => d?.parameter === "CLARITY")?.[0]?.value || "-"} <span className="spacer"></span> </b>
																</div>
																<div className="d-flex align-items-center">
																	<b className={`product-box-subnumber product-box-bold ${!is6Grid ? 'product-six-grid-wrap' : ''} ${product === "Product" ? 'product-grid' : ""} `}> {items?.matchingPairId?.productDetails?.filter(d => d?.parameter === "COLOR")?.[0]?.value || "-"} <span className="spacer"></span> </b>
																</div>
																<div className="d-flex align-items-center">
																	<b className={`product-box-subnumber product-box-bold ${!is6Grid ? 'product-six-grid-wrap' : ''} ${product === "Product" ? 'product-grid' : ""}`}> {items?.matchingPairId?.productDetails?.filter(d => d?.parameter === "CARATS")?.[0]?.value || "-"} <span className="spacer"></span> </b>
																</div>
															</div>

														</div>
													</div>
													<div className="d-flex align-items-center">
														<span id={`tool_${i}`} className={`product-box-subnumber measure-text fw-light ${!is6Grid ? 'product-six-grid-wrap' : ''}${product === "Product" ? 'product-grid' : ""} `}> ({items?.matchingPairId?.productDetails?.filter(d => d?.parameter === "MEASUREMENTS")?.[0]?.value || "-"})</span>
														<UncontrolledTooltip placement="top" target={`tool_${i}`}>{items?.matchingPairId?.productDetails?.filter(d => d?.parameter === "MEASUREMENTS")?.[0]?.value || "-"} </UncontrolledTooltip>
													</div>
												</div>
											</>

										) : (
											<div className="d-flex justify-content-between product-bottom-detail product-middle-title">
												<div className="d-flex align-items-center">
													{
														items?.certificateURL ?
															<a className={`product-box-subnumber fw-bold cursor-pointer product-box-bold ${!is6Grid ? 'product-six-grid-wrap' : ''} ${product === "Product" ? 'product-grid' : ""}`}
																target="_blank"
																style={{ color: "#1877F2" }}
																href={
																	items?.certificateURL.toLowerCase()?.includes("hrdantwerp.com") ? `https://my.hrdantwerp.com/Download/GetGradingReportPdf/?reportNumber=${items?.reportNo}&printDocumentType=LabGrownCert` :
																		items?.certificateURL
																}
															// href={
															// 	items?.certificateURL.toLowerCase()?.includes("hrdantwerp.com") ? 'https://my.hrdantwerp.com/Download/GetGradingReportPdf/?reportNumber=${items?.reportNo}&printDocumentType=LabGrownCert' :
															// 		items?.certificateURL?.toLowerCase().includes("www.igi.org") ? `https://www.igi.org/viewpdf.php?r=${items?.reportNo}` : items?.certificateURL
															// }
															>
																{items?.reportNo?.toLowerCase().includes("www.igi.org") ? items.reportNo.split("?r=")[1] : items?.reportNo}</a>

															:
															<span className={`product-box-subnumber fw-bold cursor-pointer product-box-bold ${!is6Grid ? 'product-six-grid-wrap' : ''} ${product === "Product" ? 'product-grid' : ""}`} style={!items?.certificateURL ? { color: "#5C5D5F", cursor: "auto" } : { color: "#1877F2" }} >{items?.reportNo == null ? "Non Certified" : items?.reportNo}</span>
													}
													<span className="spacer"></span>
												</div>
												<div className={`d-felx align-items-center ${categoryName === "Matching Pair" ? "d-none" : "d-flex"}`}>
													<span id={`tool_${i}`} className={`product-box-subnumber measure-text fw-light ${!is6Grid ? 'product-six-grid-wrap' : ''}${product === "Product" ? 'product-grid' : ""} `}> ({items?.productDetails?.filter(d => d?.parameter === "MEASUREMENTS")?.[0]?.value || "-"})</span>
													<UncontrolledTooltip placement="top" target={`tool_${i}`}>{items?.productDetails?.filter(d => d?.parameter === "MEASUREMENTS")?.[0]?.value || "-"} </UncontrolledTooltip>
												</div>
											</div>
										)

								}

								{isLogin === true &&
									<div className="d-flex justify-content-between product-bottom-detail product-middle-title">
										<div className="d-flex align-items-center">
											<span className={`product-box-subnumber product-box-bold ${!is6Grid ? 'product-six-grid-wrap' : ''} ${product === "Product" ? 'product-grid' : ""}`}>{items?.PricePerCarat && `${currencyData?.currency == "USD" ? `$${items?.PricePerCarat?.toFixed(2)}` : currencyData?.changeOnCurrentCurrencyPrice(parseFloat(items?.PricePerCarat)?.toFixed(2))?.toFixed(2)}`} Per cts.
												{items?.categoryId?.name === "Matching Pair" ? '' : (items?.discount ? '-' + items?.discount + "%" : '-90%')}
												<span className="spacer"></span>
											</span>
										</div>
										<div className="d-flex align-items-center">
											<span className={`product-box-subnumber product-box-bold ${!is6Grid ? 'product-six-grid-wrap' : ''} ${product === "Product" ? 'product-grid' : ""}`}>{items?.netValue && `$${items?.categoryId?.name === "Matching Pair" ? parseFloat(items?.netValue?.toFixed(2) || 0) + parseFloat(items?.matchingPairId?.netValue?.toFixed(2) || 0) : parseFloat(items?.netValue?.toFixed(2) || 0)}`}</span>

											{/* <span className={`product-box-subnumber product-box-bold ${!is6Grid ? 'product-six-grid-wrap' : ''} ${product === "Product" ? 'product-grid' : ""}`}>{items?.netValue && `${currencyData?.currency == "USD" ? `$${parseFloat(items?.netValue?.toFixed(2)) + parseFloat(items?.matchingPairId?.netValue?.toFixed(2))}` : currencyData?.changeOnCurrentCurrencyPrice(parseFloat(items?.netValue)?.toFixed(2))?.toFixed(2)}`} */}
										</div>
									</div>
								}

								{
									!isRecommended &&
									<div className="productOperations d-flex align-items-center justify-content-between mt-1">
										<div className='d-flex align-items-center position-relative' >
											<div className={`card-icons ${is6Grid ? 'product-six-grid-wrap' : ''} `} id={`ct${items?.id}`} onClick={() => {
												(items?.categoryId?.name !== "Layouts" && items?.categoryId?.name !== "Loose Diamonds") ?
													GridAtc(items?.categoryId?.name, items?.id, items?.status) : ""
											}
											} >
												{
													((!CHECK_IN_CART(items?.id, CART) && items?.status === 'AVAILABLE') && (items?.categoryId?.name === "Layouts" || items?.categoryId?.name === "Loose Diamonds")) ?
														<div>

															<UncontrolledPopover trigger="legacy" className="caratToolTip position-absolute " target={"ct" + items?.id} placement="top" >
																<form className='d-flex justify-content-center align-items-center carats-input' onSubmit={(e) => { e.preventDefault(); GridAtc(items?.categoryId?.name, items?.id, items?.status, e?.target?.[0]?.value, parseFloat(items?.productDetails?.filter(d => d?.parameter === "CARATS")?.[0]?.value)); }} >
																	<Input type="text" placeholder='Enter Carats' className='carats-input-box'
																		required
																	/>
																	<Button type="submit" color='primary' className='submit-btn'><Check /></Button>
																</form>
															</UncontrolledPopover>
														</div>
														: ""
												}

												<img src={items?.status === "AVAILABLE" ? CHECK_IN_CART(items?.id, CART) ? lightCart : filterCart : lightCart} alt="add to cart" id={`addToCart_${items?.id}`} />
												{
													(items?.categoryId?.name === "Layouts" || items?.categoryId?.name === "Loose Diamonds") ?
														items?.status === "AVAILABLE" ?
															CHECK_IN_CART(items?.id, CART) ? <UncontrolledTooltip placement="top" target={`addToCart_${items?.id}`}> Item is already in cart</UncontrolledTooltip> : "" : <UncontrolledTooltip placement="top" target={`addToCart_${items?.id}`}>Product is on Hold</UncontrolledTooltip>
														:
														<UncontrolledTooltip placement="top" target={`addToCart_${items?.id}`}> {items?.status === "AVAILABLE" ? CHECK_IN_CART(items?.id, CART) ? "Item is already in cart" : "Add to Cart" : "Product is on Hold"} </UncontrolledTooltip>
												}
											</div>


											<div className={`card-icons ${is6Grid ? 'product-six-grid-wrap' : ''}`} onClick={() => { CHECK_IN_WISHLIST(items?.id, WISHLIST) ? null : AddToWishList(items?.id, addToWishlist, WISHLIST, history) }}>
												<img src={CHECK_IN_WISHLIST(items?.id, WISHLIST) ? lightWishlist : whish} alt="add to watchlist" id={`watchlist_${items?.id}`} />
												<UncontrolledTooltip placement="top" target={`watchlist_${items?.id}`}> {CHECK_IN_WISHLIST(items?.id, WISHLIST) ? "Product is already in Watch list" : "Add To Watch List"} </UncontrolledTooltip>
											</div>
											<div className={`card-icons ${is6Grid ? 'product-six-grid-wrap' : ''}`} onClick={() => AddToCompare(items?.id, COMPARE, history)} style={COMPARE?.compareProducts?.includes(items?.id) ? { background: "#434343" } : {}}>
												<img src={COMPARE?.compareProducts?.includes(items?.id) ? compared : compare} alt="add to compare" id={`addToCompare_${items?.id}`} />
												<UncontrolledTooltip placement="top" target={`addToCompare_${items?.id}`}>  {COMPARE?.compareProducts?.includes(items?.id) ? "Added To Compare" : "Add To Compare"}</UncontrolledTooltip>
											</div>
											<div className={`card-icons ${is6Grid ? 'product-six-grid-wrap' : ''}`}>
												<img src={(items?.status !== 'AVAILABLE' || CHECK_IN_HOLD(items?.id, HOLD)) ? ReqInHoldStatusIon : hold} alt="request for hold" id={`requestForHold_${items?.id}`} onClick={() => RequestForHold(statusHoldRequest, items?.id, HOLD, history, refetch)} />
												<UncontrolledTooltip placement="top" target={`requestForHold_${items?.id}`}> {items?.status === "AVAILABLE" ? "Request For Hold" : CHECK_IN_HOLD(items?.id, HOLD) ? "Already in your Hold List" : "Product is on Hold"} </UncontrolledTooltip>
											</div>
										</div>
										<div className='d-flex align-items-center'>
											<div className=" d-flex align-items-center productStatus-icon" style={{ marginRight: "5px" }} px={items?.status}>
												<img src={items?.status === "AVAILABLE" ? successIcon : holdReqIcon} alt="Icon" width={28} id={`productStatus_${items?.id}`} />
												<UncontrolledTooltip placement="top" target={`productStatus_${items?.id}`}> {items?.status === "AVAILABLE" ? "Product is Available" : "Product is on Hold"} </UncontrolledTooltip>
											</div>
											<div className={`productStatus-icon ${categoryName === "On Sale" ? "d-flex" : "d-none"}`}>
												<img src={discountIcon} alt="discount-icon" width={28} style={{ maxWidth: "100%" }} />
											</div>
										</div>
									</div>

								}
							</CardBody>
						</>


				}
			</Card>
		</Col >

	)


}

export default ProductGridCard
