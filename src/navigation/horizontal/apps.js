// ** Icons Import
import {
  Box,
  Mail,
  User,
  Circle
} from 'react-feather'

export default [
  {
    id: 'apps',
    title: 'Apps',
    icon: <Box />,
    children: [
      {
        id: 'email',
        title: 'Email',
        icon: <Mail />,
        navLink: '/apps/email'
      },
      // {
      //   id: 'users',
      //   title: 'User',
      //   icon: <User />,
      //   children: [
      //     {
      //       id: 'list',
      //       title: 'List',
      //       icon: <Circle />,
      //       navLink: '/apps/user/list'
      //     },
      //     {
      //       id: 'view',
      //       title: 'View',
      //       icon: <Circle />,
      //       navLink: '/apps/user/view'
      //     }
      //   ]
      // }
    ]
  }
]
