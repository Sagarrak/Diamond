import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from 'react-apollo';
import { toast } from 'react-toastify';
import CartContext from "../../../../context/CartContext";
import CurrencySymbolContext from "../../../../context/CurrencySymbolContext";
import { DELETE_FROM_CART, UPDATE_CART } from '../mutation';
import emptyCart from "../../../../../src/assets/images/icons/Frame.svg";
import yesIcon from "../../../../../src/assets/images/icons/yes-icon.png";
import { SEND_ENQUIRY } from "../../../components/Session/mutations";
import '../Wishlist/wishlist.scss';
import "../../../scss/common.scss";
import { Button, Input, Modal, ModalBody, ModalHeader, Spinner, UncontrolledPopover } from 'reactstrap';
import _ from 'lodash';
import { FormatError } from '../../../../@core/components/common/FormatError';
import { BASE_URL } from '../../../../config';
import ImageComp from '../../../components/ImageComp';
import { useHistory } from 'react-router-dom';
import { Check } from 'react-feather';
import { digitalOceanURL } from '../../../common/common';

const Cart = ({ setBackdrop }) => {
    const CartData = useContext(CartContext);
    const currencyData = useContext(CurrencySymbolContext);
    const history = useHistory();
    const [allCartItems, _allCartItems] = useState([])
    const [modal, setModal] = useState(false)
    const [subTotal, setSubTotal] = useState(0);
    const [url, setUrl] = useState('');
    const token = localStorage.getItem("token");
    const isLogin = token && token != null ? true : false;
    const toggleHandler = () => { setModal(!modal) }
    const [sendEnquiry, { loading }] = useMutation(SEND_ENQUIRY);
    const [updateCart] = useMutation(UPDATE_CART)


    useEffect(() => { setBackdrop(loading) }, [loading])
    useEffect(() => {
        if (CartData?.cartData?.getCartItems) {
            _allCartItems(CartData?.cartData?.getCartItems);
        }
        const data = CartData?.cartData?.getCartItems?.items;

        let subTotalArr = [];
        data?.map((res) => {
            const isPair = res?.itemId?.categoryId?.name === "Matching Pair";
            const isLayoutOrLoose = res?.itemId?.categoryId?.name === "Loose Diamonds" || res?.itemId?.categoryId?.name === "Layouts";
            if (isLayoutOrLoose) {
                subTotalArr.push(parseFloat(res?.carat) * parseFloat(res?.itemId?.PricePerCarat));
            } else if (isPair) {
                subTotalArr?.push(parseFloat(res?.itemId?.netValue) + parseFloat(res?.itemId?.matchingPairId?.netValue))
            } else {
                subTotalArr?.push(parseFloat(res?.itemId?.netValue))
            }
        })
        setSubTotal(subTotalArr?.reduce((a, b) => a + b, 0))

    }, [CartData])

    const setSingleProductDetails = (param, type, i) => {
        let index = allCartItems?.items[i].itemId?.productDetails?.findIndex((p) => {
            return p.parameter == param
        })
        if (index >= 0 && index != undefined) {
            if (type === "number") {
                return parseFloat(allCartItems?.items[i].itemId?.productDetails[index].value || 0)?.toFixed(2);
            } else {
                return allCartItems?.items[i].itemId?.productDetails[index].value;
            }
        } else {
            return "-";
        }
    };

    const UpdateAtc = (id, carat, maxCarat) => {
        if (carat > 0 && carat <= maxCarat) {
            updateCart({
                variables: { input: [{ itemId: id, carat }] }
            })
                .then(async (data) => {
                    if (data?.data?.updateCart?.status) {
                        await CartData?.cartRefetch();
                        toast.success("Cart updated Successfully")
                        document.getElementsByClassName("caratToolTipCart")[0].remove();

                    } else {
                        toast?.error(data?.data?.addEnquiry?.message)
                    }
                })
                .catch((err) => {
                    return toast.warn(FormatError(err));
                });

        } else {
            toast.error(`Please enter minimum 0.1 and maximum ${maxCarat} carats`)
        }

    }

    const [deleteFromCart, { loading: cartLoading }] = useMutation(DELETE_FROM_CART)
    const removeItem = id => {
        deleteFromCart({ variables: { deleteFromCartId: id } }).then((response) => {
            if (response?.data?.deleteFromCart) {
                CartData?.cartRefetch();
                toast.success("Product has been removed.")
            }
        }).catch(err => {
            toast.error(FormatError(err))
        })
    }


    const submitEnquiry = () => {
        // setModal(true);
        if (isLogin) {
            sendEnquiry({
                variables: {
                    exchangeRate: currencyData?.currencyExRateData,
                    currency: currencyData?.currency,
                    symbol: currencyData?.symbol
                }
            })
                .then(async (data) => {
                    if (data?.data?.addEnquiry?.status) {
                        setUrl(`${digitalOceanURL}${data?.data?.addEnquiry?.data?.proformaInvoiceUrl}`)
                        await CartData?.cartRefetch();
                        setModal(true);
                    } else {
                        toast?.error(data?.data?.addEnquiry?.message)
                    }
                })
                .catch((err) => { return toast.warn(FormatError(err)); });
        } else {
            toast.warn("Please Login First");
            history.push("/login");
        }
    };

    return (
        <>
            {(cartLoading || loading) ? <div className='text-center mt-5'> <Spinner size='lg' /> </div> :
                <div className='cart-data'>
                    <div className='cart-overflow'>
                        {
                            allCartItems?.items?.length > 0 ?
                                allCartItems?.items?.map((data, ind) => {
                                    if (data?.itemId) {
                                        const isEditable = data?.itemId?.categoryId?.name === "Loose Diamonds" || data?.itemId?.categoryId?.name === "Layouts";
                                        return (
                                            <div key={data?.itemId?.id}>
                                                <div>
                                                    <div className="data d-flex mb-3" >
                                                        <div className='wishlist-data-img w-100 position-relative cursor-pointer' onClick={() => { history.push(`/products/${data?.itemId?.handle}`) }}>
                                                            {data?.itemId?.categoryId?.name === "Matching Pair" &&
                                                                <div className='pairBadge position-absolute d-flex justify-content-center align-items-center' style={{ background: "#fff", color: "#656565", margin: "4px", fontSize: "13px", width: "45px", right: 0, paddingTop: "2px" }}> <span>PAIR</span> </div>}
                                                            <ImageComp src={data?.itemId?.image} alt="Product Image" className="wishlist-object-img" />
                                                        </div>
                                                        <div className="otherInfo">
                                                            <p className="ogg-regular cursor-pointer" onClick={() => { history.push(`/products/${data?.itemId?.handle}`) }}>{data?.itemId?.shapeId?.shapeName} {setSingleProductDetails("CERTIFICATE", "string", ind)} {data?.itemId?.productName}</p>
                                                            <div className='mt-1'>
                                                                <div className='d-flex justify-content-between flex-wrap'>
                                                                    <div className='d-flex flex-wrap single_productDetails'>
                                                                        <span className='padding-r outfit-regular'>Carat : {isEditable ? data?.carat : setSingleProductDetails("CARATS", "number", ind)} </span>
                                                                        <span className='padding-r outfit-regular'>Color : {setSingleProductDetails("COLOR", "string", ind)}</span>
                                                                        <span className='padding-r outfit-regular'>Clarity : {setSingleProductDetails("CLARITY", "string", ind)}</span>
                                                                        <span className='padding-r outfit-regular'>Polish : {setSingleProductDetails("POLISH", "string", ind)}</span>
                                                                        <span className='padding-r outfit-regular'>Symm : {setSingleProductDetails("SYMMETRY", "string", ind)}</span>
                                                                        <span className='outfit-regular'>Ratio : {setSingleProductDetails("RATIO", "number", ind)}</span>
                                                                    </div>
                                                                </div>
                                                                <div className='single_product'>({setSingleProductDetails("MEASUREMENTS", "string", ind)}) </div>
                                                            </div>
                                                            <div className='d-flex align-items-center justify-content-between'>
                                                                {
                                                                    // data?.itemId?.categoryId?.name === "Matching Pair" ?
                                                                    // <span className="price fw-bolder d-block">{parseFloat(data?.itemId?.netValue?.toFixed(2)) + parseFloat(data?.itemId?.matchingPairId?.netValue.toFixed(2))}</span>
                                                                    // :

                                                                    <span className="price fw-bolder d-block">${
                                                                        data?.itemId?.categoryId?.name === "Matching Pair" ?
                                                                            parseFloat(data?.itemId?.netValue?.toFixed(2)) + parseFloat(data?.itemId?.matchingPairId?.netValue?.toFixed(2))
                                                                            :
                                                                            isEditable ? (parseFloat(data?.itemId?.PricePerCarat) * parseFloat(data?.carat)).toFixed(2)
                                                                                :
                                                                                parseFloat(data?.itemId?.netValue?.toFixed(2))
                                                                    }</span>
                                                                }
                                                                {
                                                                    isEditable &&
                                                                    <div>
                                                                        <span className='cursor-pointer d-block underline-green-text fw-bolder' id={"bt" + data?.itemId?.id} title='Modify Product Carats?' > Modify </span>
                                                                        <UncontrolledPopover trigger="legacy" className="caratToolTipCart position-absolute" target={"bt" + data?.itemId?.id} placement="top" >
                                                                            <form className='d-flex justify-content-center align-items-center carats-input' onSubmit={(e) => { e.preventDefault(); UpdateAtc(data?.itemId?.id, e?.target?.[0]?.value, parseFloat(data?.itemId?.productDetails?.filter(d => d?.parameter === "CARATS")?.[0]?.value || "-")); }} >
                                                                                <Input type="text" placeholder='Enter Carats' className='carats-input-box'
                                                                                    // onChange={e => e.target.value = isNaN(e.target.value) ? "" : Math.min(Math.max(parseFloat(e.target.value), 0.1), parseFloat(data?.itemId?.productDetails?.filter(d => d?.parameter === "CARATS")?.[0]?.value || "-"))}
                                                                                    defaultValue={data?.carat}
                                                                                />
                                                                                <Button type="submit" color='primary' className='submit-btn'><Check /></Button>
                                                                            </form>
                                                                        </UncontrolledPopover>
                                                                    </div>
                                                                }
                                                                <span className='cursor-pointer d-block text-danger fw-bold ' title='Remove product from cart' onClick={() => removeItem(data?.itemId?.id)}> Remove</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='position-fixed bottom-0 w-100 end-0 cart-bottom'>
                                                    <div className='d-flex align-items-center justify-content-between mb-lg-3 mb-1'>
                                                        <p className='cart-total'>SUBTOTAL</p>
                                                        <p className="display-6 fw-bolder ogg-regular">{currencyData?.currency == "USD" ? `$${subTotal?.toFixed(2)}` : currencyData?.changeOnCurrentCurrencyPrice(subTotal?.toFixed(2))}</p>
                                                    </div>
                                                    <div className='d-flex align-items-center justify-content-center'>
                                                        <button className='common-button d-flex justify-content-center align-items-center' onClick={submitEnquiry} disabled={loading ? true : false}><span className='me-1'>Confirm Order </span></button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                })
                                :
                                <div>
                                    <div className="d-flex align-items-center justify-content-center flex-column my-4">
                                        <img src={emptyCart} />
                                        <b className="my-1 fs-5"> Your Cart Is Empty! </b>
                                        <p>Please add some items in cart to Continue</p>
                                    </div>
                                </div>
                        }

                    </div>
                </div>
            }

            <div>
                <Modal
                    isOpen={modal}
                    toggle={toggleHandler}
                    className={"modal-dialog-centered general-modal-thankyou thank-you-modal"}
                >
                    <ModalHeader toggle={toggleHandler}></ModalHeader>
                    <ModalBody className='text-center'>
                        <h1 className='buttler-heading '> Thank you for
                            shopping with us. </h1>
                        <div className='my-2'>
                            <img src={yesIcon} alt="yesIcon" />
                        </div>
                        <a href={url} download="proformaInvoice.pdf" className='common-button' target="_blank" onClick={() => { setModal(false) }} >Download Invoice  </a>
                    </ModalBody>
                </Modal>
            </div>
        </>
    )
}

export default Cart