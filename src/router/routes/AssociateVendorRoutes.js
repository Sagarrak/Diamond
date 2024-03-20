import { lazy } from "react";

export default [

    {
        path: "/update-vendor-kyc",
        component: lazy(() => import("../../ui/pages/KYC")),
        type: "AssociateVendor",
        exact: true,
    },
   
    {
        path: "/generate-vendor-authkey",
        component: lazy(() => import("../../ui/pages/AssociateVendors/GenerateAuthKey")),
        type: "AssociateVendor",
        exact: true,
    },
    {
        path: "/vendor-api-reference",
        component: lazy(() => import("../../ui/pages/AssociateVendors/documentation")),
        type: "AssociateVendor",
        exact: true,
    },
   
    {
        path: "/VendorDashboard",
        component: lazy(() => import("../../ui/pages/AssociateVendors/VendorDashboard")),
        type: "AssociateVendor",
        exact: true,
    },
    {
        path: "/UploadHistory",
        component: lazy(() => import("../../ui/pages/AssociateVendors/UploadHistory")),
        type: "AssociateVendor",
        exact: true,
    },
    {
        path: "/OrderHistory",
        component: lazy(() => import("../../ui/pages/AssociateVendors/OrderHistory")),
        type: "AssociateVendor",
        exact: true,
    },
    {
        path: "/UploadStock",
        component: lazy(() => import("../../ui/pages/UploadStock")),
        type: "AssociateVendor",
        exact: true,
    },
    {
        path: "/product-reports",
        component: lazy(() => import("../../ui/pages/Graph")),
        type: "AssociateVendor",
        exact: true,
    },
    {
        path: "/vendor-products",
        component: lazy(() => import("../../ui/pages/AssociateVendors/products")),
        type: "AssociateVendor",
        exact: true,
    },
    {
        path: "/vendorNotification",
        component: lazy(() => import("../../ui/pages/AssociateVendors/Notification")),
        type: "AssociateVendor",
        exact: true,
    },
    {
        path: "/hold-Request",
        component: lazy(() => import("../../ui/pages/AssociateVendors/HoldRequest")),
        type: "AssociateVendor",
        exact: true,
    },       
]