import { toast } from "react-toastify";
import { FormatError } from "../../@core/components/common/FormatError";

export const AddToCart = (id, refetch, atc, history, carat) => {
    const token = localStorage.getItem("token");
    const isLogin = token && token != undefined && token != null ? true : false;
    if (isLogin) {
        let ids = [];
        if (typeof id !== "string") id?.map(d => ids.push({ itemId: d?.itemId, quantity: 1 }))
        // let bothIds = [id, matchingId];
        // if (typeof bothIds !== "string") bothIds?.map(d => ids.push({ itemId: d, quantity: 1 }))

        const input = (typeof id !== "string") ? ids : carat ? { itemId: id, quantity: 1, carat: carat } : { itemId: id, quantity: 1 };
        // const input = (!matchingId) ? { itemId: id, quantity: 1 } : ids;
        atc({ variables: { input } })
            .then(async (data) => {
                if (data?.data?.addToCart?.status) {
                    await refetch();
                    toast?.success("Product has been added to your cart");
                }
            })
            .catch((err) => {
                return toast?.error(FormatError(err));
            });
    } else {
        toast.warn("Please Login to Continue");
        history.push("/login");
    }
};

export const AddToWishList = async (id, addToWishlist, WISHLIST, history) => {
    let ids = [];
    if (typeof id !== "string") id?.map(d => ids.push({ itemId: d?.itemId }))
    const token = localStorage.getItem("token");
    const isLogin = token && token != undefined && token != null ? true : false;
    const input = (typeof id !== "string") ? ids : [{ itemId: id }];
    

    if (isLogin) {
        addToWishlist({ variables: { input } })
            .then(async (data) => {
                if (data?.data?.addItemInWishlist?.status) {
                    await WISHLIST?.wishListRefetch();
                    toast.success("Product has been added to Watch list");
                }
            })
            .catch((err) => {
                return toast.warn(FormatError(err));
            });
    } else {
        toast.warn("Please Login to Continue");
        history.push("/login");
    }
};
export const RequestForHold = (statusHoldRequest, id, HOLD,history,refetch) => {
    let ids = [];
    if (typeof id !== "string") id?.map(d => ids.push(d?.itemId))
    const token = localStorage.getItem("token");
    const isLogin = token && token != undefined && token != null ? true : false;
    if (isLogin) {
        statusHoldRequest({ variables: { input: { itemIds: typeof id !== "string" ? ids : [id] } } })
            .then(async (data) => {
                if (data?.data?.sendHoldRequest?.id) {
                    toast.success("Request has been sent");
                    refetch()
                    HOLD?.holdReqRefetch();
                }
            })
            .catch((err) => {
                return toast.warn(FormatError(err));
            });
    } else {
        toast.warn("Please Login to Continue");
        history.push("/login");
    }
}

export const AddToCompare = (id, COMPARE) => {
    let ids = COMPARE?.compareProducts ? [...COMPARE?.compareProducts] : [];
    if (ids?.includes(id) || ids?.length < 4) {
        const index = ids.indexOf(id);
        if (ids?.includes(id)) { ids?.splice(index, 1) } else { ids = [...ids, id] }
        COMPARE?.setCompareProducts(ids);
    } else {
        toast?.warn("You can compare Maximum Four Products")
    }
}



export const CHECK_IN_WISHLIST = (id, WISHLIST) => {
    const wishlistProduct = WISHLIST?.wishListData?.getWishlist?.data?.[0]?.items?.filter((d) => { return d?.itemId?.id == id })
    if (wishlistProduct?.length > 0 && wishlistProduct != undefined) { return true; } else { return false }
}

export const CHECK_IN_CART = (id, CART) => {
    const cartProduct = CART?.cartData?.getCartItems?.items?.filter((d) => d?.itemId?.id == id);
    if (cartProduct?.length != 0 && cartProduct != undefined) { return true; } else { return false }
}

export const CHECK_IN_HOLD = (id, HOLD) => {
    const holdProduct = HOLD?.holdReqData?.data?.filter((d) => d?.itemId?.id == id);
    if (holdProduct?.length != 0 && holdProduct != undefined) { return true; } else { return false }
}


export const getAverageRGB = (imgEl) => {

    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = { r: 0, g: 0, b: 0 }, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = { r: 0, g: 0, b: 0 },
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch (e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ((i += blockSize * 4) < length) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i + 1];
        rgb.b += data.data[i + 2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r / count);
    rgb.g = ~~(rgb.g / count);
    rgb.b = ~~(rgb.b / count);

    return rgb;

}
