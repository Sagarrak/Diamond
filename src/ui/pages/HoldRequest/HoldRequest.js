import Header from "../Home/Header/Header";
import "../Home/home.scss";
import emptyCart from "../../../assets/images/icons/Frame.svg";
import { useContext } from "react";
import BackArrow from "../../components/Back";
import { useHistory } from "react-router-dom";
import { Badge } from "reactstrap";
import ImageComp from "../../components/ImageComp";
import HoldReqContext from "../../../context/HoldReqContext";
import DataTable from "react-data-table-component";

const HoldRequest = () => {
  const history = useHistory();
  const HOLD_ITEMS = useContext(HoldReqContext);

  const formattedDate = (data) => {
    let date = new Date(data);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const columns = [
    {
      name: "Product",
      selector: (row) => {
        const product = row?.itemIds?.[0];
        return (
          <div className="d-flex align-items-center gap-2 p-2">
            <ImageComp
              src={product?.image}
              width={75}
              style={{ borderRadius: "4px" }}
            />
            <p className="text-capitalize">{`${product?.shapeId?.shapeName?.toLowerCase()} ${
              product?.productDetails?.find((d) => d?.parameter === "CLARITY")
                ?.value || "-"
            } ${
              product?.productDetails?.find((d) => d?.parameter === "COLOR")
                ?.value || "-"
            } ${
              product?.productDetails?.find((d) => d?.parameter === "CARATS")
                ?.value || "-"
            }`}</p>
          </div>
        );
      },
      resizable: true,
    },
    {
      name: "Price",
      selector: (row) =>
        parseFloat(row?.itemIds?.[0]?.netValue || "0").toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        }),
      resizable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <Badge
          className="p-1"
          color={
            row?.status === "accepted"
              ? "light-success"
              : row?.status === "pending"
              ? "light-warning"
              : "light-danger"
          }
        >
          {row?.status}
        </Badge>
      ),
      resizable: true,
    },
    {
      name: "Created At",
      selector: (row) => formattedDate(row?.createdAt),
      resizable: true,
    },
  ];

  return (
    <div className="history-page home-page">
      <div className="banner-img-wrap">
        <div className="banner-img">
          <Header />
          <div>
            <h1 className="head-bold text-center outfit-bold hold-request-wrap">
              Your Hold Requests
            </h1>
            <div className="container history-wrap ">
              <div className="d-flex align-items-center mb-2">
                <BackArrow history={history} />
                <h3 className="product-desc-title m-0 outfit-bold">Back</h3>
              </div>
            </div>
            {/* {setProductDetails("WEIGHT", index, i, "number")} */}
            <div className="history-page-detail">
              <div className="container">
                <div className="history-page-col">
                  {HOLD_ITEMS?.holdReqData?.data?.length > 0 ? (
                    <div className="table-wrapper">
                      <DataTable
                        columns={columns}
                        data={HOLD_ITEMS?.holdReqData?.data}
                      />
                    </div>
                  ) : (
                    <div className="d-flex history-row justify-content-center align-items-center my-4 flex-column">
                      <h2> Oops..! </h2>
                      <img src={emptyCart} className="my-2"></img>
                      <h3> No Product Found </h3>
                      <p>Looks like you haven't hold any product yet </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldRequest;
