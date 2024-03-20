import LoginRoutes from "./LoginRoutes";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import AssociatePartnerRoutes from "./AssociatePartnerRoutes";
import AssociateVendorRoutes from "./AssociateVendorRoutes";

const TemplateTitle = "%s - Vuexy React Admin Template";
const DefaultRoute = "/state";

const Routes = [
  ...LoginRoutes,
  ...AdminRoutes,
  ...UserRoutes,
  ...AssociatePartnerRoutes,
  ...AssociateVendorRoutes,
];

export { DefaultRoute, TemplateTitle, Routes };