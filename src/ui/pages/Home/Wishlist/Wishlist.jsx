import React, { useContext, useEffect, useState } from 'react'
import { useMutation } from "react-apollo";
import { toast } from 'react-toastify';
import WishListContext from '../../../../context/WishListContext';
import CartContext from '../../../../context/CartContext';
import CurrencySymbolContext from "../../../../context/CurrencySymbolContext";
import emptyCart from "../../../../../src/assets/images/icons/Frame.svg";
import { DELETE_WHISH_LIST, UPDATE_WISHLIST } from '../mutation';
import { ADD_TO_CART } from '../../../components/Session/mutations';
import { FormatError } from '../../../../@core/components/common/FormatError';
import './wishlist.scss';
import ImageComp from '../../../components/ImageComp';
import { Spinner, UncontrolledPopover, Input, Button } from 'reactstrap';
import { AddToCart } from '../../../functions/commonFunctions';
import { useHistory } from 'react-router-dom';
import { Check } from 'react-feather';



const Wishlist = () => {
    const WishListData = useContext(WishListContext);
    const CartData = useContext(CartContext);
    const [allWishListData, _allWishListData] = useState([]);
    const currencyData = useContext(CurrencySymbolContext);
    const [updateWishlist] = useMutation(UPDATE_WISHLIST)

    useEffect(() => {
        if (WishListData?.wishListData?.getWishlist?.data) {
            _allWishListData(WishListData?.wishListData?.getWishlist?.data[0])
        }
    }, [WishListData])

    const CHECK_IN_CART = id => {
        const cartProduct = CartData?.cartData?.getCartItems?.items?.filter((d) => d?.itemId?.id == id);
        if (cartProduct?.length != 0 && cartProduct != undefined) { return true; } else { return false }
    }
    const setSingleProductDetails = (param, type, i) => {
        let index = allWishListData?.items[i]?.itemId?.productDetails?.findIndex((p) => p.parameter == param);
        if (index >= 0 && index != undefined) {
            if (type === "number") {
                return parseFloat(allWishListData?.items[i]?.itemId.productDetails[index].value || 0)?.toFixed(2);
            } else {
                return allWishListData?.items[i]?.itemId.productDetails[index].value;
            }
        } else {
            return "-";
        }
    };

    const [deleteWish, { loading }] = useMutation(DELETE_WHISH_LIST)
    const [atc, { loading: CartLoading }] = useMutation(ADD_TO_CART)

    const DeleteWishList = id => {
        deleteWish({ variables: { itemId: id } }).then((response) => {
            if (response?.data?.removeItemFromWishlist) {
                WishListData.wishListRefetch();
                toast.success("Product has been removed.")
            }
        }).catch(err => {
            toast.error(FormatError(err))
        })
    }
    const UpdWishlst = (id, carat, maxCarat) => {
        if (carat > 0 && carat <= maxCarat) {
            updateWishlist({
                variables: { input: [{ itemId: id, carat }] }
            })
                .then(async (data) => {

                    if (data?.data?.updateItemInWishlist?.status) {
                        await CartData?.cartRefetch();
                        await WishListData.wishListRefetch();
                        toast.success("Wishlist updated Successfully")
                        document.getElementsByClassName("caratToolTipCart")[0].classList.remove("show");;

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

    const history = useHistory();
    return (
        <>
            {(CartLoading || loading) ? <div className='text-center mt-5'> <Spinner size='lg' /> </div> :
                <div className='cart-data'>
                    {
                        allWishListData?.items?.length > 0 ?
                            allWishListData?.items?.map((res, ind) => {
                                const data = res?.itemId;
                                const isEditable = res?.itemId?.categoryId?.name === "Loose Diamonds" || res?.itemId?.categoryId?.name === "Layouts";
                                return (
                                    <div key={ind + "wl"}>
                                        <div className="wishlist-overflow">
                                            <div className="data d-flex" >
                                                <div className='wishlist-data-img w-100 position-relative cursor-pointer' onClick={() => history?.push(`/products/${data?.handle}`)}>
                                                    {data?.categoryId?.name === "Matching Pair" &&
                                                        <div className='pairBadge position-absolute d-flex justify-content-center align-items-center' style={{ background: "#fff", color: "#656565", margin: "4px", fontSize: "13px", width: "45px", right: 0, paddingTop: "2px" }}> <span>PAIR</span> </div>}
                                                    <ImageComp src={data?.image} alt="Product Image" className="wishlist-object-img" />
                                                </div>
                                                <div className="otherInfo">
                                                    <h1 className="ogg-regular cursor-pointer" onClick={() => history?.push(`/products/${data?.handle}`)}> {data?.shapeId?.shapeName} {setSingleProductDetails("CERTIFICATE", "string", ind)} {data?.productName}</h1>
                                                    <div className='mt-1'>
                                                        <div className='d-flex justify-content-between flex-wrap'>
                                                            <div className='d-flex flex-wrap single_productDetails'>
                                                                <span className='padding-r outfit-regular'>Carat : {res?.carat == 0 ? setSingleProductDetails("WEIGHT", "number", ind) : res?.carat} </span>
                                                                <span className='padding-r outfit-regular'>Color : {setSingleProductDetails("COLOR", "string", ind)}</span>
                                                                <span className='padding-r outfit-regular'>Clarity : {setSingleProductDetails("CLARITY", "string", ind)}</span>
                                                                <span className='padding-r outfit-regular'>Polish : {setSingleProductDetails("POLISH", "string", ind)}</span>
                                                                <span className='padding-r outfit-regular'>Symm : {setSingleProductDetails("SYMMETRY", "string", ind)}</span>
                                                                <span className='outfit-regular'>Ratio : {setSingleProductDetails("RATIO", "number", ind)}</span>
                                                            </div>
                                                        </div>
                                                        <div className='single_product'>({setSingleProductDetails("MEASUREMENTS", "string", ind)})
                                                        </div>
                                                    </div>
                                                    <span className="price fw-bolder d-block">${
                                                        data?.categoryId?.name === "Matching Pair" ?
                                                            parseFloat(data?.netValue?.toFixed(2)) + parseFloat(data?.matchingPairId?.netValue?.toFixed(2)) :
                                                            data?.netValue?.toFixed(2)
                                                    }</span>

                                                    <div className='d-flex align-items-center justify-content-between'>
                                                        {console.log("Data form Watchlist --> ", data)}
                                                        <span className={`${data?.status !== "AVAILABLE" || CHECK_IN_CART(data?.id) ? 'disabled' : 'cursor-pointer d-block underline-green-text fw-bolder '} add-bag`} onClick={() => { (data?.status === "AVAILABLE" && !CHECK_IN_CART(data?.id)) && AddToCart(data?.id, CartData?.cartRefetch, atc, history) }}>Add to Bag</span>

                                                        {
                                                            (isEditable && data?.status === "AVAILABLE") &&
                                                            <div>
                                                                <span className='cursor-pointer d-block underline-green-text fw-bolder' id={"bt" + data?.id} title='Modify Product Carats?' > Modify </span>
                                                                <UncontrolledPopover trigger="legacy" className="caratToolTipCart position-absolute" target={"bt" + data?.id} placement="top" >
                                                                    <form className='d-flex justify-content-center align-items-center carats-input' onSubmit={(e) => { e.preventDefault(); UpdWishlst(data?.id, e?.target?.[0]?.value, parseFloat(setSingleProductDetails("CARATS", "number", ind))) }} >
                                                                        <Input type="text" placeholder='Enter Carats' className='carats-input-box'
                                                                            // onChange={e => e.target.value = isNaN(e.target.value) ? "" : Math.min(Math.max(parseFloat(e.target.value), 0.1), parseFloat(data?.itemId?.productDetails?.filter(d => d?.parameter === "CARATS")?.[0]?.value || "-"))}
                                                                            defaultValue={data?.carat}
                                                                        />
                                                                        <Button type="submit" color='primary' className='submit-btn'><Check /></Button>
                                                                    </form>
                                                                </UncontrolledPopover>
                                                            </div>
                                                        }

                                                        <span className='cursor-pointer d-block text-danger fw-bold ' onClick={() => { (!loading && !CartLoading) && DeleteWishList(data?.id) }}> Remove</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <hr />
                                    </div>
                                )
                            })
                            :
                            <div>
                                <div className="d-flex align-items-center justify-content-center flex-column my-4">
                                    <img src={emptyCart} />
                                    <b className="my-2"> Your WatchList Is Empty! </b>
                                    <p>You can add your watch items here...!</p>
                                </div>
                            </div>
                    }
                </div >}
        </>
    )
}

export default Wishlist