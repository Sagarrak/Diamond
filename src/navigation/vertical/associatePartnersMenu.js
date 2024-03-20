// ** Icons Import
import { Mail, Circle, User, Code } from "react-feather";

export default [
  // {
  //   id: "Products",
  //   title: "Products",
  //   icon: <Circle size={12} />,
  //   navLink: "/partner-products",
  // },

  // {
  //   id: "Developer_Console",
  //   title: "Developer Console",
  //   icon: <Code size={20} />,
  //   children: [

  //   ],
  // },
  {
    id: "Dashboard",
    title: "Dashboard",
    icon: <Circle size={12} />,
    navLink: "/PartnerDashboard",
  },
  {
    id: "GenerateAuthKey",
    title: "Authentication Key",
    icon: < Circle size={12} />,
    navLink: "/generate-partner-authkey",
  },
  {
    id: "API_Reference",
    title: "API Reference",
    icon: <Circle size={12} />,
    navLink: "/partner-api-reference",
  },
];
