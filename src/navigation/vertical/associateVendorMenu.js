// ** Icons Import
import { Mail, Circle, User, Code } from "react-feather";

export default [
  {
    id: "Dashboard",
    title: "Dashboard",
    icon: <Circle size={12} />,
    navLink: "/VendorDashboard",
  },
  {
    id: "Products",
    title: "Products",
    icon: <Circle size={12} />,
    navLink: "/vendor-products",
  },
  {
    id: "reports",
    title: "Reports",
    icon: <Circle size={12} />,
    navLink: "/product-reports",
  },
  {
    id: "Upload Stock",
    title: "Upload Stock",
    icon: <Circle size={12} />,
    navLink: "/UploadStock",
  },
  {
    id: "OrderHistory",
    title: "Order History",
    icon: <Circle size={12} />,
    navLink: "/OrderHistory",
  },
  {
    id: "Hold Request",
    title: "Hold Request",
    icon: <Circle size={12} />,
    navLink: "/hold-Request",
  },
  {
    id: "UploadHistory",
    title: "Upload History",
    icon: <Circle size={12} />,
    navLink: "/UploadHistory",
  },
  {
    id: "Notification",
    title: "Notification",
    icon: <Circle size={12} />,
    navLink: "/vendorNotification",
  },
];
