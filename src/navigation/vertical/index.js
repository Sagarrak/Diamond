// ** Navigation imports
import adminRoutes from './apps'
import partnerMenu from './associatePartnersMenu';
import vendorMenu from './associateVendorMenu';

// ** Merge & Export
export default {
    "Admin" : adminRoutes,
    "AssociatePartner" : partnerMenu,
    "AssociateVendor" : vendorMenu
}
