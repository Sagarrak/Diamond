//library
import moment from "moment";
import { BASE_URL } from "../../../config";

//components
import Image from "../Image";

//image
// import TempImg from "../../../@core/assets/images/placeholder.png";
import TempImg from "../../../assets/images/icons/product-image.png";
import TempImg1 from "../../../assets/images/svg/oval-vector.svg";
import TempProductImg from "../../../@core/assets/images/diamond.png";
import { Badge } from "reactstrap";
import { Eye } from "react-feather";
import { useEffect } from "react";
import { digitalOceanURL } from '../../common/common'
const data = localStorage.getItem("UserRes");
let userData = JSON.parse(data);

const commissionType = {
  onPrice: "On Price",
  onDiscount: "On Discount",
};

export const roleTableColumns = [
  {
    name: "Role Name",
    sortable: true,
    minWidth: "150px",
    sortField: "roleName",
    selector: (row) => row?.roleName,
  },
];

//title row for roleTable
export const contactTableColumns = [
  {
    name: "Email",
    sortable: true,
    maxWidth: "400px",
    sortField: "email",
    wrap: true,
    // style: { lineHeight: "2" },
    selector: (row) => row?.email,
  },
  {
    name: "Full Name",
    sortable: true,
    maxWidth: "150px",
    sortField: "companyName",
    selector: (row) => row?.companyName,
  },
  {
    name: "Mobile No",
    sortable: true,
    maxWidth: "150px",
    sortField: "mobile",
    selector: (row) => row?.mobile,
  },
  {
    name: "Subject",
    sortable: true,
    maxWidth: "150px",
    sortField: "subject",
    selector: (row) => row?.subject,
  },
  {
    name: "Appointment Date",
    sortable: true,
    maxWidth: "250px",
    sortField: "date",
    selector: (row) => (row?.date ? moment(row?.date).format("DD/MM/yyyy") : ""),
  },
  {
    name: "Appointment Time",
    sortable: true,
    maxWidth: "250px",
    sortField: "time",
    selector: (row) => row?.time,
  },
  {
    name: "Message",
    sortable: true,
    maxWidth: "400px",
    wrap: true,
    // minWidth: "150px",
    sortField: "note",
    selector: (row) => row?.note,
  },
];

// notification table

export const notificationTableColumns = [
  {
    name: "Email",
    sortable: true,
    // minWidth: "150px",
    sortField: "email",
    selector: (row) => row?.email,
  },
];

export const makeToOrderTableColumns = [
  {
    name: "Country",
    sortable: false,
    // minWidth: "150px",
    // sortField: "email",
    selector: (row) => row?.country,
  },
  {
    name: "Name",
    sortable: false,
    // minWidth: "150px",
    // sortField: "email",
    selector: (row) => (row?.firstName + row?.lastName),
  },
  {
    name: "Email",
    sortable: true,
    // minWidth: "150px",
    sortField: "email",
    selector: (row) => row?.email,
  },
  {
    name: "ContactNo",
    sortable: false,
    // minWidth: "150px",
    // sortField: "email",
    selector: (row) => row?.phoneNo,
  },
];

//title row for product table
export const productTableColumns = [
  {
    name: "Product Image",
    sortable: true,
    minWidth: "150px",
    sortField: "image",
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image
          photo={!row?.image ? TempImg : row?.image?.includes("https") ? row?.image : `${digitalOceanURL}${row?.image}`}
        />
        {/* <Image photo={res?.image ?`${digitalOceanURL}${row?.image}`:TempImg }/> */}
      </div>
    ),
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
    selector: (row) => row?.vendorPricePerCarat,
  },
  {
    name: "Net Value",
    sortable: false,
    minWidth: "150px",
    sortField: "netValue",
    selector: (row) => row?.vendorNetValue,
  },

];

//title row for shape table
export const shapeTableColumns = [
  {
    name: "Shape Name",
    sortable: true,
    minWidth: "150px",
    sortField: "shapeName",
    // selector: (row) => row?.productName,
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image photo={row?.shapeImage ? `${digitalOceanURL}${row?.shapeImage}` : TempImg} />
        <span className="align-middle ms-50"  >{row?.shapeName}</span>
      </div>
    ),
  },
  {
    name: "Alias",
    sortable: true,
    minWidth: "150px",
    sortField: "alias",
    selector: (row) => row?.alias?.join(", "),
  },
  {
    name: "Category",
    sortable: true,
    minWidth: "150px",
    sortField: "category",
    selector: (row) => row?.categoryId?.map((d, i) => (i == row?.categoryId?.length - 1 ? d?.name : d?.name + ", ")),
  },
  {
    name: "Sort Index",
    sortable: true,
    minWidth: "150px",
    sortField: "sortOrder",
    selector: (row) => row?.sortOrder,
  },
];

//exclusive design table
export const exDesignTableColumns = [
  {
    name: "Product Image",
    sortable: true,
    minWidth: "150px",
    sortField: "image",
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image
          photo={!row?.image ? TempImg : row?.image?.includes("https") ? row?.image : `${digitalOceanURL}${row?.image}`}
        />
      </div>
    ),
  },
  {
    name: "Product Name",
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
    name: "Report No",
    sortable: true,
    minWidth: "150px",
    sortField: "reportNo",
    selector: (row) => row?.reportNo,
  },
  {
    name: "Lab",
    sortable: true,
    minWidth: "150px",
    sortField: "lab",
    selector: (row) => row?.productDetails?.find((d) => d?.parameter == "CERTIFICATE")?.value,
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
    sortable: true,
    minWidth: "150px",
    sortField: "carats",
    selector: (row) => parseFloat(row?.productDetails?.find((d) => d?.parameter == "CARATS")?.value)?.toFixed(2),
  },
  {
    name: "Color",
    sortable: true,
    minWidth: "150px",
    sortField: "color",
    selector: (row) => row?.productDetails?.find((d) => d?.parameter == "COLOR")?.value,
  },
  {
    name: "Clarity",
    sortable: true,
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
    name: "Polish",
    sortable: false,
    minWidth: "150px",
    sortField: "polish",
    selector: (row) => row?.productDetails?.find((d) => d?.parameter == "POLISH")?.value,
  },
  {
    name: "Symmetry",
    sortable: false,
    minWidth: "150px",
    sortField: "symm",
    selector: (row) => row?.productDetails?.find((d) => d?.parameter == "SYMMETRY")?.value,
  },
  {
    name: "Fluorescence",
    sortable: false,
    minWidth: "150px",
    sortField: "fls",
    selector: (row) => row?.productDetails?.find((d) => d?.parameter == "FLUORESCENCE INTENSITY")?.value,
  },
  {
    name: "Ratio",
    sortable: false,
    minWidth: "150px",
    sortField: "ratio",
    selector: (row) => parseFloat(row?.productDetails?.find((d) => d?.parameter == "RATIO")?.value || 0)?.toFixed(2),
  },
  {
    name: "Rap. Price",
    sortable: true,
    minWidth: "150px",
    sortField: "totalPrice",
    selector: (row) => (row?.totalPrice ? "$" + row?.totalPrice : null),
  },
  {
    name: "Disc %",
    sortable: true,
    minWidth: "150px",
    sortField: userData?.userType === "AssociateVendor" ? "vendorDiscount" : "discount",
    selector: (row) => (row?.vendorDiscount ? row?.vendorDiscount : row?.discount),
  },
  {
    name: "Net Rate",
    sortable: true,
    minWidth: "150px",
    sortField: userData?.userType === "AssociateVendor" ? "vendorNetRate" : "netRate",
    selector: (row) =>
      row?.vendorNetRate ? "$" + Math.round(row?.vendorNetRate) : row?.netRate ? "$" + Math.round(row?.netRate) : null,
  },
  {
    name: "Net Value",
    sortable: true,
    minWidth: "150px",
    sortField: userData?.userType === "AssociateVendor" ? "vendorNetValue" : "netValue",
    selector: (row) =>
      row?.vendorNetValue
        ? "$" + Math.round(row?.vendorNetValue)
        : row?.netValue
          ? "$" + Math.round(row?.netValue)
          : null,
  },

  {
    name: "Type",
    sortable: false,
    minWidth: "150px",
    sortField: "type",
    selector: (row) => row?.type,
  },
  {
    name: "Location",
    sortable: true,
    minWidth: "150px",
    sortField: "location",
    selector: (row) => row?.location,
  },
  {
    name: "Status",
    sortable: true,
    minWidth: "150px",
    sortField: "status",
    selector: (row) => row?.status,
    cell: (row) => (
      <Badge
        className="text-capitalize"
        color={
          row?.status === "AVAILABLE" ? "light-success" : row?.status === "SOLD" ? "light-danger" : "light-warning"
        }
        pill
      >
        {row?.status}
      </Badge>
    ),
  },
  {
    name: "Length",
    sortable: false,
    minWidth: "150px",
    sortField: "length",
    selector: (row) => parseFloat(row?.productDetails?.find((d) => d?.parameter == "LENGTH")?.value || 0)?.toFixed(2),
  },
  {
    name: "Width",
    sortable: false,
    minWidth: "150px",
    sortField: "width",
    selector: (row) => parseFloat(row?.productDetails?.find((d) => d?.parameter == "WIDTH")?.value || 0)?.toFixed(2),
  },
  {
    name: "Depth",
    sortable: false,
    minWidth: "150px",
    sortField: "depth",
    selector: (row) => parseFloat(row?.productDetails?.find((d) => d?.parameter == "DEPTH")?.value || 0)?.toFixed(2),
  },
  {
    name: "Depth %",
    sortable: false,
    minWidth: "150px",
    sortField: "depthPer",
    selector: (row) => parseFloat(row?.productDetails?.find((d) => d?.parameter == "DEPTH %")?.value || 0)?.toFixed(2),
  },
  {
    name: "Table %",
    sortable: false,
    minWidth: "150px",
    sortField: "tablePer",
    selector: (row) => parseFloat(row?.productDetails?.find((d) => d?.parameter == "TABLE %")?.value || 0)?.toFixed(2),
  },
];

//title row for parameter table
export const parameterTableColumns = [
  {
    name: "Parameter Name",
    sortable: true,
    minWidth: "150px",
    sortField: "paramName",
    selector: (row) => row?.paramName,
  },
  // {
  //   name: "Display Name",
  //   sortable: true,
  //   minWidth: "150px",
  //   sortField: "displayName",
  //   selector: (row) => row?.displayName,
  // },
  {
    name: "Type",
    sortable: true,
    minWidth: "150px",
    sortField: "type",
    selector: (row) => row?.type,
  },
  {
    name: "Category",
    sortable: true,
    minWidth: "150px",
    sortField: "category",
    selector: (row) => row?.category,
  },
  // {
  //   name: "Value",
  //   sortable: true,
  //   minWidth: "150px",
  //   sortField: "value",
  //   selector: (row) => row?.value,
  // },
];

//title row for parameter table
export const enquiryTableColumns = [
  {
    name: "Product Name",
    sortable: true,
    minWidth: "150px",
    sortField: "items",
    // selector: (row) => row?.productName,
    selector: (row) =>
      row?.items?.map((res, index) => {
        return (
          <div key={res?.itemId?.image + index} className="d-flex align-items-center my-1">
            <Image
              photo={
                !res?.itemId?.image
                  ? TempImg
                  : res?.itemId?.image?.includes("https")
                    ? res?.itemId?.image
                    : `${digitalOceanURL}${res?.itemId?.image}`
              }
            />
            <span className="align-middle ms-50">{res?.itemId?.productName}</span>
          </div>
        );
      }),
  },
  {
    name: "User Name",
    sortable: true,
    minWidth: "150px",
    sortField: "createdBy",
    selector: (row) => {
      return (
        <div className="d-flex align-items-center">
          {/* <Image photo={row?.itemId?.image ? `${digitalOceanURL}/assets/${res?.itemId?.image}` : TempImg} /> */}
          {/* <Image photo={res?.itemId?.image ? `${digitalOceanURL}${res?.itemId?.image}` : TempImg} /> */}
          <span className="align-middle ms-50">{row?.createdBy?.fullName}</span>
        </div>
      );


    },
  },
  {
    name: "User Email",
    sortable: true,
    minWidth: "150px",
    sortField: "userEmail",
    selector: (row) => row?.userEmail,
  },
  {
    name: "Enquiry Date",
    sortable: true,
    minWidth: "150px",
    sortField: "createdAt",
    selector: (row) => moment(row?.createdAt).format("DD/MM/YYYY"),
  },
  {
    name: "Status",
    sortable: true,
    minWidth: "150px",
    sortField: "status",
    selector: (row) => row?.status,
    cell: (row) => (
      <Badge className="text-capitalize" color={row?.status ? "light-success" : "light-danger"} pill>
        {row?.status ? "success" : "not success"}
      </Badge>
    ),
  },
  {
    name: "Proforma Invoice",
    minWidth: "150px",
    sortField: "proformaInvoiceUrl",
    selector: (row) => <a href={`${digitalOceanURL}${row?.proformaInvoiceUrl}`} download="proformaInvoice.pdf" target="_blank" >Download</a>,
  }

];

//title row for parameter table
export const holdRequestTableColumns = [
  {
    name: "Product Name",
    sortable: true,
    minWidth: "150px",
    sortField: "items",
    selector: (row) =>
      row?.itemIds?.map((res, index) => {

        return (
          <div key={index} className="d-flex align-items-center my-1">
            <Image
              photo={
                !res?.image ? TempImg : res?.image?.includes("https") ? res?.image : `${digitalOceanURL}${res?.image}`
              }
            />
            {/* <Image photo={res?.image ? `${digitalOceanURL}${res?.image}` : TempImg} /> */}
            <span className="align-middle ms-50">{res?.productName}</span>
          </div>
        );
      }),
  },
  {
    name: "Request By",
    sortable: true,
    minWidth: "150px",
    sortField: "createdBy",
    selector: (row) => {
      return (
        <div className="d-flex align-items-center">
          {/* <Image photo={row?.image ? `${BASE_URL}/assets/${res?.image}` : TempImg} /> */}
          {/* <Image photo={row?.image ? `${digitalOceanURL}${res?.image}` : TempImg} /> */}
          <span className="align-middle ms-50">{row?.createdBy?.fullName}</span>
        </div>
      );
    },
  },
  {
    name: "User Email",
    sortable: true,
    minWidth: "150px",
    sortField: "userEmail",
    selector: (row) => row?.createdBy?.email,
  },
  userData?.userType === "Admin" && {
    name: "User category",
    sortable: true,
    minWidth: "150px",
    sortField: "userEmail",
    selector: (row) => row?.createdBy?.category,
  },
  {
    name: "Request Date",
    sortable: true,
    minWidth: "150px",
    sortField: "createdAt",
    selector: (row) => moment(row?.createdAt).format("DD/MM/YYYY"),
  },
  {
    name: "Status",
    sortable: true,
    minWidth: "150px",
    sortField: "status",
    selector: (row) => row?.status,
    cell: (row) => (
      <Badge
        className="text-capitalize"
        color={
          row?.status === "accepted" ? "light-success" : row?.status === "rejected" ? "light-danger" : "light-warning"
        }
        pill
      >
        {row?.status}
      </Badge>
    ),
  },
];

export const vendorOrderHistory = [
  {
    name: "Product Name",
    sortable: true,
    minWidth: "150px",
    sortField: "items",
    selector: (row) => (
      <div className="d-flex align-items-center my-1">
        <Image
          photo={
            !row?.product?.image
              ? TempImg
              : row?.product?.image?.includes("https")
                ? row?.product?.image
                : `${digitalOceanURL}${row?.product?.image}`
          }
        />
        <span className="align-middle ms-50">{row?.product?.productName}</span>
      </div>
    ),
  },
  {
    name: "Net Value",
    sortable: true,
    minWidth: "150px",
    sortField: "netValue",
    selector: (row) => (row?.product?.netValue ? "$" + row?.product?.netValue : ""),
  },
  {
    name: "Order Date",
    sortable: true,
    minWidth: "150px",
    sortField: "netValue",
    selector: (row) => moment(row?.createdAt).format("DD/MM/YYYY"),
  },
  {
    name: "User Name",
    sortable: true,
    minWidth: "150px",
    sortField: "userName",
    selector: (row) => row?.userName,
  },
  {
    name: "User Email",
    sortable: true,
    minWidth: "150px",
    sortField: "userEmail",
    selector: (row) => row?.userEmail,
  },
  {
    name: "Status",
    sortable: true,
    minWidth: "150px",
    sortField: "status",
    selector: (row) => row?.status,
  },
  // {
  //   name: "ProformaInvoiceUrl",
  //   sortable: true,
  //   minWidth: "150px",
  //   sortField: "proformaInvoiceUrl",
  //   selector: (row) => row?.proformaInvoiceUrl,
  // },
];
export const UploadHistoryColumns = [
  {
    name: "No of Stocks",
    sortable: true,
    minWidth: "150px",
    sortField: "newValue",
    selector: (row) => row?.newValue,
  },
  {
    name: "Upload Date",
    sortable: true,
    minWidth: "150px",
    sortField: "createdAt",
    selector: (row) => moment(row?.createdAt).format("DD/MM/YYYY"),
  },
  {
    name: "Upload Time",
    sortable: true,
    minWidth: "150px",
    sortField: "createdAt",
    selector: (row) => moment(row?.createdAt).format("HH:mm:ss"),
  },
];
//title row for parameter table
export const usersTableColumns = [
  {
    name: "Imges",
    sortable: true,
    minWidth: "150px",
    sortField: "profilePicture",
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image photo={row?.profilePicture ? `${digitalOceanURL}${row?.profilePicture}` : TempImg}

        />
      </div>
    ),
  },
  {
    name: "Full Name",
    sortable: true,
    minWidth: "150px",
    sortField: "fullName",
    selector: (row) => row?.fullName,
  },
  {
    name: "User Name",
    sortable: true,
    minWidth: "150px",
    sortField: "userName",
    selector: (row) => row?.userName,
  },
  {
    name: "Email",
    sortable: true,
    minWidth: "150px",
    sortField: "email",
    selector: (row) => row?.email,
  },
  {
    name: "Mobile No",
    sortable: true,
    minWidth: "150px",
    sortField: "mobile",
    selector: (row) => row?.mobile,
  },
  {
    name: "Verification Status",
    sortable: true,
    minWidth: "150px",
    sortField: "isEmailVerified",
    selector: (row) => row?.isEmailVerified,
    cell: (row) => (
      <Badge className="text-capitalize" color={row?.isEmailVerified ? "light-success" : "light-danger"} pill>
        {row?.isEmailVerified ? "verified" : "not verified"}
      </Badge>
    ),
  },
  {
    name: "Category",
    sortable: true,
    minWidth: "150px",
    sortField: "userType",
    selector: (row) => row?.category,
  },
];

export const associatePartnerTableColumns = [
  {
    name: "Company Name",
    sortable: true,
    minWidth: "150px",
    sortField: "companyName",
    selector: (row) => row?.companyName,
  },
  {
    name: "Full Name",
    sortable: true,
    minWidth: "150px",
    sortField: "fullName",
    selector: (row) => row?.fullName,
  },
  {
    name: "Email",
    sortable: true,
    minWidth: "150px",
    sortField: "email",
    selector: (row) => row?.email,
  },
  {
    name: "Category",
    sortable: true,
    minWidth: "150px",
    sortField: "vendorCategory",
    selector: (row) => row?.vendorCategory,
  },
  {
    name: "Commission",
    sortable: true,
    minWidth: "150px",
    sortField: "commission",
    selector: (row) => (row?.commission ? row?.commission + "%" : null),
  },
  {
    name: "Aadhar Card",
    sortable: true,
    minWidth: "150px",
    sortField: "aadharCard",
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image photo={row?.aadharCard ? `${digitalOceanURL}${row?.aadharCard}` : TempImg} />
      </div>
    ),
  },
  {
    name: "Pan Card",
    sortable: true,
    minWidth: "150px",
    sortField: "panCard",
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image photo={row?.panCard ? `${digitalOceanURL}${row?.panCard}` : TempImg} />
      </div>
    ),
  },
  {
    name: "Incorporate Certificate",
    sortable: true,
    minWidth: "150px",
    sortField: "incorporateCertificate",
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image photo={row?.incorporateCertificate ? `${digitalOceanURL}${row?.incorporateCertificate}` : TempImg} />
      </div>
    ),
  },
  {
    name: "Approve Status",
    minWidth: "138px",
    sortable: true,
    sortField: "approvedStatus",
    selector: (row) => row?.approvedStatus,
    cell: (row) => (
      <Badge
        className="text-capitalize"
        color={
          row?.approvedStatus === "approved"
            ? "light-success"
            : row?.approvedStatus === "rejected"
              ? "light-danger"
              : "light-warning"
        }
        pill
      >
        {row?.approvedStatus}
      </Badge>
    ),
  },
];
export const jewelleryDiamondShapecolumn = [
  {

    name: "Image",
    sortable: true,
    minWidth: "150px",
    sortField: "image",
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image photo={row?.jewelryShapeImage ? `${digitalOceanURL}${row?.jewelryShapeImage}` : TempImg} />
      </div>
    ),
  },
  {
    name: "Shape Name",
    sortable: true,
    minWidth: "150px",
    sortField: "shapeName",
    selector: (row) => row?.shapeName,
  },

]

export const ringStyleTableColumn = [
  {

    name: "Style Name",
    sortable: true,
    minWidth: "150px",
    sortField: "styleName",
    selector: (row) => row?.styleName,

  },
  {

    name: "Index",
    sortable: true,
    minWidth: "150px",
    sortField: "index",
    selector: (row) => row?.index,

  },
  {
    name: "Image",
    sortable: true,
    minWidth: "150px",
    sortField: "image",
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image photo={row?.image ? `${digitalOceanURL}${row?.image}` : TempImg} />
      </div>
    ),
  },
  {
    name: "Category",
    sortable: true,
    minWidth: "150px",
    sortField: "categoryId?.name",
    selector: (row) => row?.categoryId?.name,
  },

]
export const jewelleryDiamondsettingcolumn = [
  {
    name: "Name",
    sortable: true,
    minWidth: "150px",
    sortField: "name",
    selector: (row) => row?.name,
  },
  {
    name: "Width",
    sortable: true,
    minWidth: "150px",
    sortField: "width",
    selector: (row) => row?.width,
  },
  {
    name: "Length",
    sortable: true,
    minWidth: "150px",
    sortField: "length",
    selector: (row) => row?.length,
  },
  {
    name: "Category",
    sortable: true,
    minWidth: "150px",
    sortField: "categoryId?.name",
    selector: (row) => row?.categoryId?.name,
  },
  {
    name: "StyleId",
    sortable: true,
    minWidth: "150px",
    sortField: "styleId?.styleName",
    selector: (row) => row?.styleId?.styleName,
  },
]

export const jewellerycategoryTableColumn = [
  {

    name: "Name",
    sortable: true,
    minWidth: "150px",
    sortField: "name",
    selector: (row) => row?.name,

  },
  {

    name: "Index",
    sortable: true,
    minWidth: "150px",
    sortField: "sortIndex",
    selector: (row) => row?.sortIndex,

  },
  {
    name: "Image",
    sortable: true,
    minWidth: "150px",
    sortField: "image",
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image photo={row?.image ? `${digitalOceanURL}${row?.image}` : TempImg} />
      </div>
    ),
  },
  {
    name: "Title",
    sortable: true,
    minWidth: "150px",
    sortField: "title",
    selector: (row) => row?.title,
  },

]

export const metaltableColumn = [
  {

    name: "Metal Name",
    sortable: true,
    minWidth: "150px",
    sortField: "metalName",
    selector: (row) => row?.metalName,

  },
  {

    name: "Index",
    sortable: true,
    minWidth: "150px",
    sortField: "sortIndex",
    selector: (row) => row?.sortIndex,

  },
  {
    name: "Image",
    sortable: true,
    minWidth: "150px",
    sortField: "image",
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image photo={row?.image ? `${digitalOceanURL}${row?.image}` : TempImg} />
      </div>
    ),
  },
]

export const jewelleryProductColumn = [
  {
    name: "Product Name",
    sortable: true,
    minWidth: "150px",
    sortField: "productName",
    selector: (row) => row?.productName,
  },
  {
    name: "Description",
    sortable: true,
    minWidth: "150px",
    sortField: "description",
    selector: (row) => row?.description,
  },
  {
    name: "Category",
    sortable: true,
    minWidth: "150px",
    sortField: "categoryId?.name",
    selector: (row) => row?.categoryId?.name,
  },
  {
    name: "Quantity",
    sortable: true,
    minWidth: "150px",
    sortField: "quantity",
    selector: (row) => row?.quantity,
  },
  {
    name: "Width",
    sortable: true,
    minWidth: "150px",
    sortField: "width",
    selector: (row) => row?.width,
  },
  {
    name: "length",
    sortable: true,
    minWidth: "150px",
    sortField: "length",
    selector: (row) => row?.length,
  },
  {
    name: "Style",
    sortable: true,
    minWidth: "150px",
    sortField: "styleId?.styleName",
    selector: (row) => row?.styleId?.styleName,
  },
]
export const associateVendorTableColumns = [
  {
    name: "Company Name",
    sortable: true,
    minWidth: "150px",
    sortField: "companyName",
    selector: (row) => row?.companyName,
  },
  {
    name: "Full Name",
    sortable: true,
    minWidth: "150px",
    sortField: "fullName",
    selector: (row) => row?.fullName,
  },
  {
    name: "Email",
    sortable: true,
    minWidth: "150px",
    sortField: "email",
    selector: (row) => row?.email,
  },
  {
    name: "Category",
    sortable: true,
    minWidth: "150px",
    sortField: "vendorCategory",
    selector: (row) => row?.vendorCategory,
  },
  {
    name: "Commission",
    sortable: true,
    minWidth: "150px",
    sortField: "commission",
    selector: (row) => (row?.commission ? row?.commission + "%" : null),
  },
  {
    name: "commissionType",
    sortable: true,
    minWidth: "150px",
    sortField: "commissionType",
    selector: (row) => commissionType[row?.commissionType],
  },
  {
    name: "Aadhar Card",
    sortable: true,
    minWidth: "150px",
    sortField: "aadharCard",
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image photo={row?.aadharCard ? `${digitalOceanURL}${row?.aadharCard}` : TempImg} />
      </div>
    ),
  },
  {
    name: "Pan Card",
    sortable: true,
    minWidth: "150px",
    sortField: "panCard",
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image photo={row?.panCard ? `${digitalOceanURL}${row?.panCard}` : TempImg} />
      </div>
    ),
  },
  {
    name: "Incorporate Certificate",
    sortable: true,
    minWidth: "150px",
    sortField: "incorporateCertificate",
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image photo={row?.incorporateCertificate ? `${digitalOceanURL}${row?.incorporateCertificate}` : TempImg} />
      </div>
    ),
  },
  {
    name: "Approve Status",
    minWidth: "138px",
    sortable: true,
    sortField: "approvedStatus",
    selector: (row) => row?.approvedStatus,
    cell: (row) => (
      <Badge
        className="text-capitalize"
        color={
          row?.approvedStatus === "approved"
            ? "light-success"
            : row?.approvedStatus === "rejected"
              ? "light-danger"
              : "light-warning"
        }
        pill
      >
        {row?.approvedStatus}
      </Badge>
    ),
  },
];

export const invoiceTableColumns = [
  {
    name: "Invoice No",
    sortable: true,
    minWidth: "150px",
    sortField: "invoiceNo",
    selector: (row) => row?.invoiceNo,
  },
  {
    name: "Customer Name",
    sortable: true,
    minWidth: "150px",
    sortField: "userName",
    selector: (row) => row?.userName,
  },
  {
    name: "Customer Email",
    sortable: true,
    minWidth: "150px",
    sortField: "userEmail",
    selector: (row) => row?.userEmail,
  },
  {
    name: "Issue Date",
    sortable: true,
    minWidth: "150px",
    sortField: "createdAt",
    selector: (row) => moment(row?.createdAt).format("DD/MM/YYYY"),
  },
  {
    name: "Total Amount",
    sortable: true,
    minWidth: "150px",
    sortField: "totalAmount",
    selector: (row) => "$" + row?.totalAmount.toFixed(2),
  },
  {
    name: "Invoice Accepted",
    sortable: true,
    minWidth: "150px",
    sortField: "productStatus",
    selector: (row) => row?.acceptStatus,
    cell: (row) => (
      <Badge
        className="text-capitalize"
        color={
          row?.acceptStatus.includes("pending")
            ? "light-warning"
            : row?.acceptStatus == "accepted"
              ? "light-success"
              : "light-danger"
        }
        pill
      >
        {row?.acceptStatus}
      </Badge>
    ),
  },

];

export const paymentTableColumns = [
  {
    name: "Invoice No",
    sortable: true,
    minWidth: "150px",
    sortField: "invoiceNo",
    selector: (row) => row?.invoiceNo,
  },
  {
    name: "Customer Name",
    sortable: true,
    minWidth: "150px",
    sortField: "userName",
    selector: (row) => row?.userName,
  },
  {
    name: "Customer Email",
    sortable: true,
    minWidth: "150px",
    sortField: "userEmail",
    selector: (row) => row?.userEmail,
  },
  {
    name: "Issue Date",
    sortable: true,
    minWidth: "150px",
    sortField: "createdAt",
    selector: (row) => moment(row?.createdAt).format("DD/MM/YYYY"),
  },
  {
    name: "Total Amount",
    sortable: true,
    minWidth: "150px",
    sortField: "totalAmount",
    selector: (row) => "$" + row?.totalAmount.toFixed(2),
  },
];

export const genderOptions = [
  { label: "male", value: "MALE" },
  { label: "female", value: "FEMALE" },
];

export const bloodGroupsOptions = [
  { value: "A_POSITIVE", label: "A+" },
  { value: "B_POSITIVE", label: "B+" },
  { value: "AB_POSITIVE", label: "AB+" },
  { value: "O_POSITIVE", label: "O+" },
  { value: "A_NEGATIVE", label: "A-" },
  { value: "B_NEGATIVE", label: "B-" },
  { value: "AB_NEGATIVE", label: "AB-" },
  { value: "O_NEGATIVE", label: "O-" },
];

export const maritalStatusOptions = [
  { value: "MARRIED", label: "married" },
  { value: "UNMARRIED", label: "unmarried" },
];

export const blogTableColumns = [
  {
    name: "Images",
    sortable: true,
    minWidth: "150px",
    sortField: "profilePicture",
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image photo={row?.image ? `${digitalOceanURL}${row?.image}` : TempImg} />
      </div>
    ),
  },
  {
    name: "Title",
    sortable: true,
    minWidth: "150px",
    sortField: "fullName",
    selector: (row) => row?.title,
  }
];

export const educationTableColumns = [
  {
    name: "Images",
    sortable: true,
    minWidth: "150px",
    sortField: "profilePicture",
    selector: (row) => (
      <div className="d-flex align-items-center">
        <Image photo={row?.image ? `${digitalOceanURL}${row?.image}` : TempImg} />
      </div>
    ),
  },
  {
    name: "Title",
    sortable: true,
    minWidth: "150px",
    sortField: "fullName",
    selector: (row) => row?.title,
  }
];

export const advTableColumns = [
  {
    name: "Image 4 Grid",
    sortable: true,
    minWidth: "150px",
    sortField: "image4grid",
    selector: (row) =>
      <div className="d-flex align-items-center">
        <Image photo={row?.gridImage4 ? `${digitalOceanURL}${row?.gridImage4}` : TempImg} />
      </div>
  },
  {
    name: "Image 6 Grid",
    sortable: true,
    minWidth: "150px",
    sortField: "image6grid",
    selector: (row) => {
      return <div className="d-flex align-items-center" >
        <Image photo={row?.gridImage6 ? `${digitalOceanURL}${row?.gridImage6}` : TempImg} />
      </div>
    }
  },
  {
    name: "Index",
    sortable: true,
    minWidth: "150px",
    sortField: "index",
    selector: (row) => row?.index,
  },
  {
    name: "URL",
    sortable: true,
    minWidth: "150px",
    sortField: "url",
    selector: (row) => row?.url,
  },
];

export const catTableColumns = [

  {
    name: "Category Image",
    sortable: true,
    minWidth: "150px",
    sortField: "image",
    selector: (row) =>
      <div className="d-flex align-items-center">
        <Image photo={row?.categoryImage ? `${digitalOceanURL}${row?.categoryImage}` : TempImg} />
      </div>
  },
  {
    name: "Image Hover",
    sortable: true,
    minWidth: "150px",
    sortField: "hoverImage",
    selector: (row) =>
      <div>
        <Image photo={row?.hoverImage ? `${digitalOceanURL}${row?.hoverImage}` : TempImg} />
      </div>
  },
  {
    name: "Mobile Image",
    sortable: true,
    minWidth: "150px",
    // sortField: "hoverImage",
    selector: (row) =>
      <div>
        <Image photo={row?.hoverImage ? `${digitalOceanURL}${row?.mobileImage}` : TempImg} />
      </div>
  },
  {
    name: "Category Name",
    sortable: true,
    minWidth: "150px",
    sortField: "name",
    selector: (row) => row?.name
  },
];

export const seoTableColumns = [

  {
    name: "Title",
    sortable: true,
    minWidth: "150px",
    sortField: "title",
    selector: (row) => row?.title,
  },
  {
    name: "Label",
    sortable: true,
    minWidth: "150px",
    sortField: "label",
    selector: (row) => row?.tags[0]?.label,
  },
  {
    name: "URL",
    sortable: true,
    minWidth: "150px",
    sortField: "url",
    selector: (row) => row?.tags[0]?.url,
  },
];


export const imageVideoTableColumns = [

  {
    name: "ProductID",
    sortable: true,
    minWidth: "150px",
    sortField: "productId",
    selector: (row) => row?.productId,
  },
  {
    name: "VideoLink",
    sortable: true,
    minWidth: "150px",
    sortField: "video",
    selector: (row) => row?.video,
  },
  {
    name: "ImageLink",
    sortable: true,
    minWidth: "150px",
    sortField: "image",
    selector: (row) => row?.image,
  },

];

export const homePageContentColumns = [

  {
    name: "RightImage",
    sortable: true,
    minWidth: "150px",
    sortField: "rightImage",
    selector: (row) =>
      <div className="d-flex align-items-center">
        <Image photo={row?.rightImage ? `${digitalOceanURL}${row?.rightImage}` : TempImg} />
      </div>
  },
  {
    name: "LeftImage",
    sortField: true,
    minWidth: "150px",
    sortField: "leftImage",
    selector: (row) =>
      <div className="d-flex align-items-center">
        <Image photo={row?.leftImage ? `${digitalOceanURL}${row?.leftImage}` : TempImg} />
      </div>
  },
  {
    name: "Header",
    sortField: true,
    minWidth: "150px",
    sortField: "header",
    selector: (row) => row?.header,
  },
  {
    name: "Content",
    sortField: true,
    minWidth: "150px",
    sortField: "content",
    selector: (row) => row?.content,
  },
  {
    name: "ButtonText",
    sortField: true,
    minWidth: "150px",
    sortField: "buttonText",
    selector: (row) => row?.buttonText,
  },
  {
    name: "ButtonLink",
    sortField: true,
    minWidth: "150px",
    sortField: "buttonLink",
    selector: (row) => row?.buttonLink,
  },

];