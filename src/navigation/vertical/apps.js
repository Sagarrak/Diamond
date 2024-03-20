// ** Icons Import
import { User, Bell, Package, Circle, FolderPlus, Feather, Aperture, DollarSign } from "react-feather";
const Disc = Circle;

export default [
  {
    id: 'products',
    title: 'Products',
    icon: <Package size={20} />,
    children: [
      {
        id: "Products",
        title: "Products",
        icon: <Disc size={12} />,
        navLink: "/products",
      },
      {
        id: "UploadStock",
        title: "Upload Stock",
        icon: <Disc size={12} />,
        navLink: "/uploadStocks",
      },
      {
        id: "Parameters",
        title: "Parameters",
        icon: <Disc size={12} />,
        navLink: "/parameters",
      },
      {
        id: "Shapes",
        title: "Shapes",
        icon: <Disc size={12} />,
        navLink: "/shapes",
      },
      {
        id: "Categories",
        title: "Categories",
        icon: <Disc size={12} />,
        navLink: "/categories",
      },
      {
        id: "UploadHistory",
        title: "Import History",
        icon: <Disc size={12} />,
        navLink: "/upload-history",
      }
    ]
  },

  {
    id: 'Notificatoins',
    title: 'Notificatoin',
    icon: <Bell size={20} />,
    children: [
      {
        id: "contact_us",
        title: "Contact Us",
        icon: <Disc size={12} />,
        navLink: "/contacts",
      },
      {
        id: "ComingSoonNotification",
        title: "Coming Soon Notification",
        icon: <Disc size={12} />,
        navLink: "/comingSoonNotification",
      },
      {
        id: "MakeToOrder",
        title: "Make To Order",
        icon: <Disc size={12} />,
        navLink: "/makeToOrder",
      },
      {
        id: "Push Notification",
        title: "Push Notification",
        icon: <Disc size={12} />,
        navLink: "/notification",
      },
    ]
  },

  {
    id: 'Payment',
    title: 'Payment & Tracking',
    icon: <DollarSign size={20} />,
    children: [
      {
        id: "Enquiries",
        title: "Enquiries",
        icon: <Disc size={12} />,
        navLink: "/enquiries",
      },
      {
        id: "invoice",
        title: "Invoice",
        icon: <Disc size={12} />,
        navLink: "/invoice",
      },
      {
        id: "payment",
        title: "Payments",
        icon: <Disc size={12} />,
        navLink: "/payments",
      },
      {
        id: "rejectedPayment",
        title: "Rejected Payments",
        icon: <Disc size={12} />,
        navLink: "/rejected-payments",
      },
      {
        id: "tracking",
        title: "Tracking",
        icon: <Disc size={12} />,
        navLink: "/tracking",
      },
      {
        id: "bankDetails",
        title: "Bank Details",
        icon: <Disc size={12} />,
        navLink: "/bankDetail",
      },
      {
        id: "holdRequest",
        title: "Hold Requests",
        icon: <Disc size={12} />,
        navLink: "/hold-requests",
      },
    ]
  },
  {
    id: 'UserThings',
    title: 'User',
    icon: <User size={20} />,
    children: [
      {
        id: "Users",
        title: "Users",
        icon: <Disc size={12} />,
        navLink: "/usersList",
      },
      {
        id: "report",
        title: "Reports",
        icon: <Disc size={12} />,
        navLink: "/reports",
      },
      {
        id: "associate_vendors",
        title: "Associate Vendors",
        icon: <Disc size={12} />,
        navLink: "/associate-vendors",
      },
      {
        id: "associate_partners",
        title: "Associate Partners",
        icon: <Disc size={12} />,
        navLink: "/associate-partners",
      },
    ]
  },
  // {

  //   id: 'Jewellery',
  //   title: 'Jewellery',
  //   icon: <Aperture size={20} />,
  //   children: [
  //     {
  //       id: "Jewellery",
  //       title: "Style",
  //       icon: <Disc size={12} />,
  //       navLink: "/jewellery",
  //     },
  //     {
  //       id: "Category",
  //       title: "Category",
  //       icon: <Disc size={12} />,
  //       navLink: "/category",
  //     },
  //     {
  //       id: "Metal",
  //       title: "Metal",
  //       icon: <Disc size={12} />,
  //       navLink: "/metal",
  //     },
  //     {
  //       id: "Product",
  //       title: "Product",
  //       icon: <Disc size={12} />,
  //       navLink: "/product",
  //     },
  //     {
  //       id: "Diamond Shape",
  //       title: "Diamond Shape",
  //       icon: <Disc size={12} />,
  //       navLink: "/diamondShape",
  //     },
  //     {
  //       id: "Jewellery Settings",
  //       title: "Jewellery Settings",
  //       icon: <Disc size={12} />,
  //       navLink: "/jewellerySettings",
  //     },
  //   ]

  // },

  {
    id: 'Other',
    title: 'Other',
    icon: <FolderPlus size={20} />,
    children: [
      {
        id: "Blog",
        title: "Blog",
        icon: <Disc size={12} />,
        navLink: "/blog",
      },
      {
        id: "Education",
        title: "Education",
        icon: <Disc size={12} />,
        navLink: "/manage-education",
      },
      {
        id: "Seo",
        title: "SEO",
        icon: <Disc size={12} />,
        navLink: "/seo",
      },
      {
        id: "ADV Page",
        title: "Advertisement",
        icon: <Disc size={12} />,
        navLink: "/advertisement",
      },

      {
        id: "PhotosVideos",
        title: "Photos-Videos Upload",
        icon: <Disc size={12} />,
        navLink: "/uploadphotos",
      },
      {
        id: "TopBar",
        title: "TopBar",
        icon: <Disc size={12} />,
        navLink: "/topbar",
      },
      {
        id: "HomePageContent",
        title: "Home Page Content",
        icon: <Disc size={12} />,
        navLink: "/homecontent",
      },
      {
        id: "PhotosVideos",
        title: "Photos/Videos Set",
        icon: <Disc size={12} />,
        navLink: "/setphotovideo",
      },
    ],
  },

  // {
  //   id: "exclusiveDesign",
  //   title: "On Sale Designs",
  //   icon: <Disc size={12} />,
  //   navLink: "/onsale-designs",
  // },






];
