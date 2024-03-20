import React, { useState, useEffect, Fragment, useContext } from "react";
import Header from "../Home/Header/Header";
import { Button, CardBody, CardText } from "reactstrap";
import { useMutation } from "react-apollo";
import { DELETE_WHISTLIST } from "./mutation";
import emptyCart from "../../../assets/images/icons/Frame.svg";
import { toast } from "react-toastify";
import { FormatError } from "../../../@core/components/common/FormatError";
import { useHistory } from "react-router-dom";
import BackArrow from "../../components/Back";
import CartContext from "../../../context/CartContext";
import CurrencySymbolContext from "../../../context/CurrencySymbolContext";
import { ConfirmationModal } from "../../components/Alert";
import { ADD_TO_CART } from "../../components/Session/mutations";
import "./wishlist.scss";
import { X } from "react-feather";
import "@styles/base/pages/app-ecommerce.scss";
import WishListContext from "../../../context/WishListContext";
import { AddToCart } from "../../functions/commonFunctions";
import { DELETE_WHISH_LIST } from "../Home/mutation";
import ImageComp from "../../components/ImageComp";

function index() {
  const history = useHistory();
  const [wishListData, _setWishListdata] = useState(null);
  const [atc] = useMutation(ADD_TO_CART);
  const CART = useContext(CartContext);
  const currencyData = useContext(CurrencySymbolContext);
  const WISHLIST = useContext(WishListContext);
  // const [removeWshListItem] = useMutation(DELETE_WHISTLIST);
  const [deleteWish, { loading }] = useMutation(DELETE_WHISH_LIST)
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (WISHLIST?.wishListData?.getWishlist?.data) {
      let data = WISHLIST?.wishListData?.getWishlist?.data;
      _setWishListdata(data[0]);
    }
  }, [WISHLIST]);

  const setProductDetails = (param, i, type) => {
    let index = wishListData?.items[i]?.itemId?.productDetails?.findIndex(
      (p) => p.parameter.trim() === param.trim()
    );
    if (index >= 0 && index != undefined) {
      if (type === "number") {
        return parseFloat(
          wishListData?.items[i]?.itemId?.productDetails[index].value || 0
        )?.toFixed(2);
      } else {
        return wishListData?.items[i]?.itemId?.productDetails[index].value;
      }
    } else {
      return "-";
    }
  };

  const deleteData = async (id) => {
    let Status = await ConfirmationModal(
      "warning",
      "Are you sure want to remove?",
      "You won't be able to revert this!",
      "Yes"
    );
    if (Status) {
      setLoader(true);
      deleteWish({
        variables: {
          itemId: id,
        },
      })
        .then(async ({ data }) => {
          if (data?.removeItemFromWishlist) {
            WISHLIST?.wishListRefetch();
            setLoader(false);
            await ConfirmationModal(
              "success",
              "Deleted!",
              "Item has been removed from your watch list",
              ""
            );
          } else {
            toast.error("watchlist item not deleted");
            setLoader(false);
          }
        })
        .catch((error) => {
          toast.error(FormatError(error));
          setLoader(false);
        });
    }
  };

  const wishListLength = wishListData?.items?.length;

  return (
    <div className="home-page wishlist-page">
      <div className="banner-img-wrap">
        <div className="banner-img ">
          <Header />
          <div className="wish-list-col">
            <div className="container">
              <div className="d-flex align-items-center my-2">
                <BackArrow history={history} />
                <h5 className="product-desc-title m-0 outfit-bold">Back</h5>
              </div>
              <Fragment>
                <div className="text-center wishlist-head">
                  <h1 className="buttler-heading outfit-bold">My Watch List</h1>
                  <p className="mb-2 mt-1 fw-bold outfit-bold">
                    {wishListLength !== 0 &&
                      (wishListLength > 1
                        ? `You have ${wishListLength} items saved`
                        : `You have ${wishListLength} item saved`)}
                  </p>
                </div>

                <div>
                  {!wishListLength && (
                    <div className="d-flex history-row justify-content-center align-items-center my-4 flex-column">
                      <h2 className="outfit-bold"> Oops..! </h2>{" "}
                      <img src={emptyCart} className="my-2" />
                      <h3 className="outfit-bold"> No Product Found </h3>
                      <p className="outfit-bold no-product">
                        Looks like you haven't add any product yet{" "}
                      </p>
                    </div>
                  )}
                </div>
                {wishListData?.items?.length > 0 ? (
                  <div className="wishlist-items row">
                    {wishListData?.items?.map((d, i) => {
                      return (
                        <div
                          key={i}
                          className="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12"
                        >
                          <div className="ecommerce-card card">
                            <div className="d-flex justify-content-end">
                              {" "}
                              <Button
                                className="btn-wishlist remove-wishlist"
                                color="light"
                                onClick={() => {
                                  deleteData(d?.itemId?.id);
                                }}
                              >
                                <X className="me-25" size={24} />
                              </Button>
                            </div>
                            <div className="item-img text-center mx-auto align-items-baseline">
                              <ImageComp
                                className="img-fluid"
                                src={d?.itemId?.image}
                                onClick={() =>
                                  history.push(`/products/${d?.id}`)
                                }
                              />
                            </div>
                            <CardBody className="p-0 text-center pt-2">
                              <div className="item-name">
                                <h1 className="buttler-heading outfit-bold">
                                  {d?.shapeId?.shapeName}{" "}
                                  {
                                    d?.productDetails?.find(
                                      (val) => val?.parameter == "CERTIFICATE"
                                    )?.value
                                  }{" "}
                                  {d?.reportNo}
                                </h1>
                              </div>
                              <CardText className="item-description fs-5">
                                <div className="d-flex flex-wrap justify-content-center outfit-bold">
                                  <span className="product-txt">
                                    {" "}
                                    Carats:{" "}
                                    {setProductDetails(
                                      "WEIGHT",
                                      i,
                                      "number"
                                    )}{" "}
                                  </span>
                                  <span className="product-txt">
                                    Color: {setProductDetails("COLOR", i)}{" "}
                                  </span>
                                  <span className="product-txt">
                                    Clarity: {setProductDetails("CLARITY", i)}
                                  </span>
                                  <span className="product-txt">
                                    Polish: {setProductDetails("POLISH", i)}
                                  </span>
                                  <span className="product-txt">
                                    Symm: {setProductDetails("SYMMETRY", i)}{" "}
                                  </span>
                                  <span className="product-txt">
                                    Ratio:{" "}
                                    {setProductDetails("RATIO", i, "number")}
                                  </span>
                                </div>
                                <div className="product-txt outfit-bold">
                                  (
                                  {setProductDetails(
                                    "MEASUREMENTS",
                                    i,
                                    "string"
                                  )}
                                  )
                                </div>
                                <h6 className="item-price mb-2 mt-1 fw-bolder outfit-bold">
                                  {currencyData?.currency == "USD"
                                    ? `$${d?.itemId?.netValue?.toFixed(2)}`
                                    : currencyData
                                      ?.changeOnCurrentCurrencyPrice(
                                        d?.itemId?.netValue
                                      )
                                      ?.toFixed(2)}{" "}
                                </h6>
                                <Button
                                  color="primary"
                                  disabled={d?.status !== "AVAILABLE" && true}
                                  onClick={() =>
                                    AddToCart(
                                      d?.id,
                                      CART?.cartRefetch,
                                      atc,
                                      history
                                    )(d?.id)
                                  }
                                  className="common-button"
                                >
                                  <span>Add To Cart</span>
                                </Button>
                              </CardText>
                            </CardBody>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  ""
                )}
              </Fragment>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default index;
