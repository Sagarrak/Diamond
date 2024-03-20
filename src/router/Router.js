// ** React Imports
import { Suspense, useContext, lazy, Fragment } from "react";
import CartState from '../context/CartState'
import CurrencySymbolState from "../context/CurrencySymbolState";

// ** Utils
import { isUserLoggedIn } from "@utils";
import { useLayout } from "@hooks/useLayout";
import { AbilityContext } from "@src/utility/context/Can";
import { useRouterTransition } from "@hooks/useRouterTransition";

// ** Custom Components
import LayoutWrapper from "@layouts/components/layout-wrapper";
import history from "../constants/history";

// ** Router Components
import {
    BrowserRouter as AppRouter,
    Route,
    Switch,
    Redirect,
    Router,
} from "react-router-dom";

// ** Routes & Default Routes
import { DefaultRoute, Routes } from "./routes";

// ** Layouts
import BlankLayout from "@layouts/BlankLayout";
import VerticalLayout from "@src/layouts/VerticalLayout";
import HorizontalLayout from "@src/layouts/HorizontalLayout";

// import TwoFactorAuth from "../ui/pages/TwoFAVerification"
import withSession from "../ui/components/Session/withSession";
import SignIn from "../ui/pages/SignIn";
import WishListState from "../context/WishListState";
import NotificationState from "../context/NotificationState";
import CompareState from "../context/CompareState";
import SetTitle from "../ui/components/SetTitle";
import HolReqState from "../context/HoldReqState";

const Routers = (props) => {
    const { session, refetch } = props;
    // ** Hooks
    const { layout, setLayout, setLastLayout } = useLayout();
    const { transition, setTransition } = useRouterTransition();

    // ** Default Layout
    const DefaultLayout =
        layout === "horizontal" ? "HorizontalLayout" : "VerticalLayout";

    // ** All of the available layouts
    const Layouts = { BlankLayout, VerticalLayout, HorizontalLayout };

    // ** Current Active Item
    const currentActiveItem = null;

    const NotAuthorized = lazy(() =>
        import("@src/ui/components/Error/NotAuthorized")
    );

    // ** Init Error Component
    const Error = lazy(() => import("@src/ui/components/Error/404"));

    const { ...restProps } = props;
    const AdminRoute = ({ component: Component, ...rest }) => {
        const routerProps = {};
        return (
            <Route
                {...rest}
                render={(props) => {
                    let me = rest && rest?.session && rest?.session?.me;
                    if (me) {
                        // Verifying If it is admin or not
                        if (rest.type == localStorage.getItem('utype').toLowerCase()) {
                            return (
                                <VerticalLayout
                                    layout={"VerticalLayout"}
                                    setLayout={setLayout}
                                    transition={transition}
                                    routerProps={routerProps}
                                    setLastLayout={setLastLayout}
                                    setTransition={setTransition}
                                    currentActiveItem={currentActiveItem}
                                >
                                    <LayoutWrapper
                                        layout={DefaultLayout}
                                        transition={transition}
                                        setTransition={setTransition}
                                        {...(rest.appLayout
                                            ? {
                                                appLayout: rest.appLayout,
                                            }
                                            : {})}
                                        {...(rest.meta
                                            ? {
                                                routeMeta: rest.meta,
                                            }
                                            : {})}
                                        {...(rest.className
                                            ? {
                                                wrapperClass: rest.className,
                                            }
                                            : {})}
                                    >
                                        <Suspense fallback={null}>
                                            <Component {...restProps} {...rest} />
                                        </Suspense>
                                    </LayoutWrapper>
                                </VerticalLayout>
                            );
                        } else {
                            return (<Route
                                exact
                                session={props.session}
                                path="*"
                                {...rest}
                                component={() => <Error />}
                            />)
                        }
                    } else {
                        return (<Redirect to={{ pathname: "/", state: { from: props.location } }} />);
                    }
                }}
            />
        );
    };


    const AssociatePartnersRoutes = ({ component: Component, ...rest }) => {
        const isApproved = rest?.session?.me?.approvedStatus === "approved" ? true : false;
        const routerProps = {};
        return (
            <Route
                {...rest}
                render={(props) => {
                    let me = rest && rest?.session && rest?.session?.me;
                    if (me) {
                        if (rest.type == localStorage.getItem('utype')) {
                            if (!isApproved) {
                                if (rest?.path == '/update-partner-kyc') {
                                    return <BlankLayout> <Component {...restProps} {...rest} /> </BlankLayout>
                                } else {
                                    return <Redirect to={{ pathname: "/update-partner-kyc", state: { from: props.location } }} />
                                }
                            }
                            else {
                                return <VerticalLayout
                                    layout={"VerticalLayout"}
                                    setLayout={setLayout}
                                    transition={transition}
                                    routerProps={routerProps}
                                    setLastLayout={setLastLayout}
                                    setTransition={setTransition}
                                    currentActiveItem={currentActiveItem}
                                >
                                    <LayoutWrapper
                                        layout={DefaultLayout}
                                        transition={transition}
                                        setTransition={setTransition}
                                        {...(rest.appLayout
                                            ? {
                                                appLayout: rest.appLayout,
                                            }
                                            : {})}
                                        {...(rest.meta
                                            ? {
                                                routeMeta: rest.meta,
                                            }
                                            : {})}
                                        {...(rest.className
                                            ? {
                                                wrapperClass: rest.className,
                                            }
                                            : {})}
                                    >
                                        <Suspense fallback={null}>
                                            <Component {...restProps} {...rest} />
                                        </Suspense>
                                    </LayoutWrapper>
                                </VerticalLayout>
                            }
                        } else {
                            return (<Route
                                exact
                                session={props.session}
                                path="*"
                                {...rest}
                                component={() => <Error />}
                            />)
                        }
                    } else {
                        return (
                            <Redirect
                                to={{ pathname: "/", state: { from: props.location } }}
                            />
                        );
                    }
                }}
            />
        );
    };

    const AssociateVendorsRoutes = ({ component: Component, ...rest }) => {
        const isApproved = rest?.session?.me?.approvedStatus === "approved" ? true : false;
        const routerProps = {};
        return (
            <Route
                {...rest}
                render={(props) => {
                    let me = rest && rest?.session && rest?.session?.me;
                    if (me) {
                        if (rest.type == localStorage.getItem('utype')) {
                            if (!isApproved) {
                                if (rest?.path == '/update-vendor-kyc') {
                                    return <BlankLayout> <Component {...restProps} {...rest} /> </BlankLayout>
                                } else {
                                    return <Redirect to={{ pathname: "/update-vendor-kyc", state: { from: props.location } }} />
                                }

                            }
                            else {
                                return <VerticalLayout
                                    layout={"VerticalLayout"}
                                    setLayout={setLayout}
                                    transition={transition}
                                    routerProps={routerProps}
                                    setLastLayout={setLastLayout}
                                    setTransition={setTransition}
                                    currentActiveItem={currentActiveItem}
                                >
                                    <LayoutWrapper
                                        layout={DefaultLayout}
                                        transition={transition}
                                        setTransition={setTransition}
                                        {...(rest.appLayout
                                            ? {
                                                appLayout: rest.appLayout,
                                            }
                                            : {})}
                                        {...(rest.meta
                                            ? {
                                                routeMeta: rest.meta,
                                            }
                                            : {})}
                                        {...(rest.className
                                            ? {
                                                wrapperClass: rest.className,
                                            }
                                            : {})}
                                    >
                                        <Suspense fallback={null}>
                                            <Component {...restProps} {...rest} />
                                        </Suspense>
                                    </LayoutWrapper>
                                </VerticalLayout>
                            }
                        } else {
                            return (<Route
                                exact
                                session={props.session}
                                path="*"
                                {...rest}
                                component={() => <Error />}
                            />)
                        }
                    } else {
                        return (
                            <Redirect
                                to={{ pathname: "/", state: { from: props.location } }}
                            />
                        );
                    }
                }}
            />
        );
    };

    const PublicRoute = ({ component: Component, ...rest }) => {

        return (
            <Route
                {...rest}
                render={(props) => {
                    const me = (rest && rest.session && rest?.session?.me) ? true : false;
                    // Applying default title
                    document.title = "CVD MART";
                    const token = localStorage.getItem('token')
                    if (me && token) {
                        const UserType = rest?.session?.me?.userType;
                        const isApproved = rest?.session?.me?.approvedStatus;

                        if (UserType) {
                            if (UserType === "Admin") {
                                return  <Redirect
                                            to={{ pathname: "/products", state: { from: props.location } }}/>
                                
                            }
                            else if (UserType === rest?.type) {
                                return (<BlankLayout>
                                    <CartState>
                                        <HolReqState>
                                            <WishListState>
                                                <NotificationState>
                                                    <CurrencySymbolState>
                                                        <CompareState>
                                                            <Component {...restProps} {...rest} />
                                                        </CompareState>
                                                    </CurrencySymbolState>
                                                </NotificationState>
                                            </WishListState>
                                        </HolReqState>
                                    </CartState>
                                </BlankLayout>)
                            }
                            else if (UserType === 'AssociatePartner') {
                                return (
                                    (isApproved === "approved") ?
                                        <Redirect
                                            to={{ pathname: "/PartnerDashboard", state: { from: props.location } }}
                                        /> :
                                        <Redirect
                                            to={{ pathname: "/update-partner-kyc", state: { from: props.location } }}
                                        />

                                )
                            }

                            else if (UserType === 'AssociateVendor') {
                                return (
                                    (isApproved === "approved") ?
                                        <Redirect
                                            to={{ pathname: "/VendorDashboard", state: { from: props.location } }}
                                        /> :
                                        <Redirect
                                            to={{ pathname: "/update-vendor-kyc", state: { from: props.location } }}
                                        />


                                )
                            }
                            else {
                                return (<Redirect
                                    to={{ pathname: "/", state: { from: props.location } }}
                                />)
                            }
                        }

                    } else {
                        if (rest?.authRoute) {
                            return (<Route
                                exact
                                session={props.session}
                                path="*"
                                {...rest}
                                component={() => <Error />}
                            />)
                        } else {
                            return (
                                <BlankLayout>
                                    <CompareState>
                                        <Component {...restProps} {...rest} />
                                    </CompareState>
                                </BlankLayout>
                            )
                        }
                    }
                }
                }
            />

        );
    };

    return (
        <AppRouter>
            <Switch>
                {Routes.map((d, key) => {
                    if (d.layout === "BlankLayout") {
                        if (d.path === "/login") {
                            return (
                                <PublicRoute
                                    key={key}
                                    exact
                                    session={session}
                                    path={d.path}
                                    {...d}
                                    component={() => <SignIn refetch={refetch} />}
                                />
                            );
                        } else {
                            return (
                                <PublicRoute
                                    key={key}
                                    exact
                                    session={session}
                                    path={d.path}
                                    {...d}
                                    component={d.component}
                                />
                            );
                        }
                    } else {
                        if (d.type === "admin") {
                            return (
                                <AdminRoute
                                    exact
                                    // key={key}
                                    session={session}
                                    path={d.path}
                                    {...d}
                                    component={d.component}
                                />
                            );
                        }
                        if (d?.type === "AssociatePartner") {
                            return (
                                <AssociatePartnersRoutes
                                    exact
                                    key={key}
                                    session={session}
                                    path={d.path}
                                    {...d}
                                    component={d.component}
                                />
                            );
                        }
                        if (d?.type === "AssociateVendor") {
                            return (
                                <AssociateVendorsRoutes
                                    exact
                                    key={key}
                                    session={session}
                                    path={d.path}
                                    {...d}
                                    component={d.component}
                                />
                            );
                        }
                    }
                })}
                <Route path="*" component={Error} />
            </Switch>
        </AppRouter>
    );
};

export default withSession(Routers);
