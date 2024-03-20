import { lazy } from "react";

export default [
  {
    path: "/inventory/diamonds",
    component: lazy(() => import("../../ui/pages/Inventory/index")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/appointment",
    component: lazy(() => import("../../ui/pages/Appointment/index")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/product-description",
    component: lazy(() =>
      import("../../ui/pages/Inventory/ProductDescription/productDescrption")
    ),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/terms-condition",
    component: lazy(() => import("../../ui/pages/TearmsCondition/index")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/blogs",
    component: lazy(() => import("../../ui/pages/Bloging/index")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/blogs/:id",
    component: lazy(() => import("../../ui/pages/Bloging/BlogDescription")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/education",
    component: lazy(() => import("../../ui/pages/Education/FrontEnd/index")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/jewellery-showcase",
    component: lazy(() =>
      import("../../ui/pages/Jewellery/FE/StaticJewelry/StaticJewelry")
    ),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/jewellery-dynamic",
    component: lazy(() =>
      import("../../ui/pages/Jewellery/FE/DynamicJewelry/index")
    ),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/jewelleries/:id",
    component: lazy(() =>
      import("../../ui/pages/Jewellery/FE/StaticJewelry/JewelryDescription")
    ),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/",
    component: lazy(() => import("../../ui/pages/Home")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/aboutUs",
    component: lazy(() => import("../../ui/pages/AboutUs/index")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/send-inquiry",
    component: lazy(() => import("../../ui/pages/SendInquiry/index")),
    type: "User",
    layout: "BlankLayout",
  },

  {
    path: "/inventory/diamonds",
    component: lazy(() => import("../../ui/pages/Inventory/index")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/appointment",
    component: lazy(() => import("../../ui/pages/Appointment/index")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/product-description",
    component: lazy(() =>
      import("../../ui/pages/Inventory/ProductDescription/productDescrption")
    ),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/terms-condition",
    component: lazy(() => import("../../ui/pages/TearmsCondition/index")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/blogs",
    component: lazy(() => import("../../ui/pages/Bloging/index")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/blogs/:id",
    component: lazy(() => import("../../ui/pages/Bloging/BlogDescription")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/education",
    component: lazy(() => import("../../ui/pages/Education/FrontEnd/index")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/education/:id",
    component: lazy(() =>
      import("../../ui/pages/Education/FrontEnd/EducationDescription")
    ),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/jewellery-showcase",
    component: lazy(() =>
      import("../../ui/pages/Jewellery/FE/StaticJewelry/StaticJewelry")
    ),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/jewellery-dynamic",
    component: lazy(() =>
      import("../../ui/pages/Jewellery/FE/DynamicJewelry/index")
    ),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/jewelleries/:id",
    component: lazy(() =>
      import("../../ui/pages/Jewellery/FE/StaticJewelry/JewelryDescription")
    ),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/",
    component: lazy(() => import("../../ui/pages/Home")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/aboutUs",
    component: lazy(() => import("../../ui/pages/AboutUs/index")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/send-inquiry",
    component: lazy(() => import("../../ui/pages/SendInquiry/index")),
    type: "User",
    layout: "BlankLayout",
  },

  {
    path: "/filtered-data",
    component: lazy(() => import("../../ui/pages/Inventory/FilteredData")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/jewelry",
    component: lazy(() => import("../../ui/pages/Jewellery/FE/index")),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/jewelry/products/:id",
    component: lazy(() =>
      import("../../ui/pages/Jewellery/FE/Products/Products")
    ),
    type: "User",
    layout: "BlankLayout",
  },
  {
    path: "/products/:id",
    component: lazy(() =>
      import("../../ui/pages/Inventory/ProductDescription/productDescrption")
    ),
    type: "User",
    layout: "BlankLayout",
    exact: true,
  },

  // ************* User Login Required Routes *************
  {
    path: "/change-password",
    component: lazy(() => import("../../ui/pages/ChangePassword/index")),
    type: "User",
    layout: "BlankLayout",
    exact: true,
    authRoute: true,
  },
  {
    path: "/dashboard",
    component: lazy(() => import("../../ui/pages/Dashboard/index")),
    type: "User",
    layout: "BlankLayout",
    exact: true,
    authRoute: true,
  },
  {
    path: "/order-history",
    component: lazy(() => import("../../ui/pages/History/index")),
    type: "User",
    layout: "BlankLayout",
    exact: true,
    authRoute: true,
  },

  {
    path: "/track-order/:id",
    component: lazy(() => import("../../ui/pages/History/TrackOrder/index.jsx")),
    type: "User",
    layout: "BlankLayout",
    exact: true,
    authRoute: true,
  },
  {
    path: "/view-detail/:id",
    component: lazy(() => import("../../ui/pages/History/ViewDetail/index.js")),
    type: "User",
    layout: "BlankLayout",
    exact: true,
    authRoute: true,
  },
  {
    path: "/user-profile",
    component: lazy(() => import("../../ui/pages/UserProfile/index")),
    type: "User",
    layout: "BlankLayout",
    exact: true,
    authRoute: true,
  },
  {
    path: "/user-dashboard",
    component: lazy(() => import("../../ui/pages/Dashboard")),
    type: "User",
    layout: "BlankLayout",
    exact: true,
    authRoute: true,
  },
  {
    path: "/watchlist",
    component: lazy(() => import("../../ui/pages/WishList")),
    type: "User",
    layout: "BlankLayout",
    className: "ecommerce-application",
  },
  {
    path: "/product-comparison",
    component: lazy(() => import("../../ui/pages/Inventory/CompareProducts")),
    type: "User",
    layout: "BlankLayout",
  },

  {
    path: "/user-holdRequest",
    component: lazy(() => import("../../ui/pages/HoldRequest/HoldRequest")),
    type: "User",
    layout: "BlankLayout",
    className: "ecommerce-application",
  },
];
