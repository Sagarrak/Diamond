// Enter Login Routes
import { lazy } from "react";
export default [
    {
        path: "/login",
        component: lazy(() => import("../../ui/pages/SignIn")),
        layout: "BlankLayout",
        exact: true,
        meta: {
            authRoute: true,
        },
    },
    {
        path: "/register",
        component: lazy(() => import("../../ui/pages/Signup")),
        layout: "BlankLayout",
        meta: {
            publicRoute: true,
        },
    },
    {
        path: "/forgot-password",
        component: lazy(() => import("../../ui/pages/ForgotPWD")),
        type: "admin",
        layout: "BlankLayout",
        meta: {
            publicRoute: true,
        },
    },
    {
        path: "/reset-password/:id",
        component: lazy(() => import("../../ui/pages/ResetPWD")),
        type: "admin",
        layout: "BlankLayout",
        meta: {
            publicRoute: true,
        },
    },
    {
        path: "/verify-email/:id",
        component: lazy(() => import("../../ui/pages/VerifyEmail")),
        type: "admin",
        layout: "BlankLayout",
        meta: {
            publicRoute: true,
        },
    },
    {
        path: "/verify-mobile/",
        component: lazy(() => import("../../ui/pages/VerifyMobile")),
        type: "admin",
        layout: "BlankLayout",
        meta: {
            publicRoute: true,
        },
    },

]