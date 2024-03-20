import { lazy } from "react";

export default [
    {
        path: "/generate-partner-authkey",
        component: lazy(() => import("../../ui/pages/AssociatePartners/GenerateAuthKey")),
        type: "AssociatePartner",
        exact: true,
    },
    {
        path: "/partner-api-reference",
        component: lazy(() => import("../../ui/pages/AssociatePartners/documentation")),
        type: "AssociatePartner",
        exact: true,
    },
    {
        path: "/update-partner-kyc",
        component: lazy(() => import("../../ui/pages/KYC")),
        type: "AssociatePartner",
        exact: true,
    },

    {
        path: "/PartnerDashboard",
        component: lazy(() => import("../../ui/pages/AssociatePartners/partnerDashboard")),
        type: "AssociatePartner",
        exact: true,
    },
]