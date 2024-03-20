import { lazy } from "react";

export default [
    {
        path: "/products",
        component: lazy(() => import("../../ui/pages/Products")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },

    {
        path: "/ringFilter",
        component: lazy(() => import("../../ui/pages/HandRingFilter/HandRingFilter")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/uploadStocks",
        component: lazy(() => import("../../ui/pages/UploadStock")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/makeToOrder",
        component: lazy(() => import("../../ui/pages/MakeToOrder/MakeToOrder")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/notification",
        component: lazy(() => import("../../ui/pages/Notification")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/parameters",
        component: lazy(() => import("../../ui/pages/Parameters")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/shapes",
        component: lazy(() => import("../../ui/pages/Shapes")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/reports",
        component: lazy(() => import("../../ui/pages/Graph")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/onsale-designs",
        component: lazy(() => import("../../ui/pages/OnSaleDesign")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/contacts",
        component: lazy(() => import("../../ui/pages/ContactUs")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/hold-requests",
        component: lazy(() => import("../../ui/pages/HoldRequest")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/upload-history",
        component: lazy(() => import("../../ui/pages/AssociateVendors/UploadHistory")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/comingSoonNotification",
        component: lazy(() => import("../../ui/pages/Notification")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },

    {
        path: "/enquiries",
        component: lazy(() => import("../../ui/pages/Enquiry")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/usersList",
        component: lazy(() => import("../../ui/pages/Users")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/associate-partners",
        component: lazy(() => import("../../ui/pages/AssociatePartners")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/associate-vendors",
        component: lazy(() => import("../../ui/pages/AssociateVendors")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/invoice",
        component: lazy(() => import("../../ui/pages/Invoice")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/blog",
        component: lazy(() => import("../../ui/pages/Blog")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/seo",
        component: lazy(() => import("../../ui/pages/SEO")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/advertisement",
        component: lazy(() => import("../../ui/pages/ADSpage")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/categories",
        component: lazy(() => import("../../ui/pages/Categories")),
        type: "admin",
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/uploadphotos",
        component: lazy(() => import("../../ui/pages/PhotosVideosUpload")),
        type: "admin",
        meta: {
            authRoute: true,
        }
    },
    {
        path: "/setphotovideo",
        component: lazy(() => import("../../ui/pages/PhotoVideoSet")),
        type: "admin",
        meta: {
            authRoute: true,
        }
    },
    {
        path: "/topbar",
        component: lazy(() => import("../../ui/pages/TopBar")),
        type: "admin",
        meta: {
            authRoute: true,
        }
    },
    {
        path: "/bankDetail",
        component: lazy(() => import("../../ui/pages/BankDetails/")),
        type: "admin",
        meta: {
            authRoute: true,
        }
    },
    {
        path: "/homecontent",
        component: lazy(() => import("../../ui/pages/ChangeHomeContent")),
        type: "admin",
        meta: {
            authRoute: true,
        }
    },
    {
        path: "/jewellery",
        component: lazy(() => import("../../ui/pages/Jewellery/admin/index")),
        type: "admin",
        meta: {
            authRoute: true,
        }
    },

    {
        path: "/category",
        component: lazy(() => import("../../ui/pages/Jewellery/category/index")),
        type: "admin",
        meta: {
            authRoute: true,
        }
    },
    {
        path: "/metal",
        component: lazy(() => import("../../ui/pages/Jewellery/metal/index")),
        type: "admin",
        meta: {
            authRoute: true,
        }
    },
    {
        path: "/product",
        component: lazy(() => import("../../ui/pages/Jewellery/product/index")),
        type: "admin",
        meta: {
            authRoute: true,
        }
    },
    {
        path: "/diamondShape",
        component: lazy(() => import("../../ui/pages/Jewellery/DiamondShape/index")),
        type: "admin",
        meta: {
            authRoute: true,
        }
    },
    {
        path: "/jewellerySettings",
        component: lazy(() => import("../../ui/pages/Jewellery/JewellerySettings/index")),
        type: "admin",
        meta: {
            authRoute: true,
        }
    },
    {
        path: "/manage-education",
        component: lazy(() => import("../../ui/pages/Education/Admin")),
        type: "admin",
        meta: {
            authRoute: true,
        }
    },
    {
        path: "/payments",
        component: lazy(() => import("../../ui/pages/Invoice/Payments")),
        type: "admin",
        meta: {
            authRoute: true,
        }
    },
    {
        path: "/rejected-payments",
        component: lazy(() => import("../../ui/pages/Invoice/Payments")),
        type: "admin",
        meta: {
            authRoute: true,
        }
    },
    {
        path: "/tracking",
        component: lazy(() => import("../../ui/pages/Invoice/Tracking")),
        type: "admin",
        meta: {
            authRoute: true,
        }
    },
]