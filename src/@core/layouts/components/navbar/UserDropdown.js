// ** React Imports
import { Link, useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Utils

// ** Store & Actions
import { useDispatch } from 'react-redux'
import { handleLogout } from '@store/authentication'
import { ApolloConsumer } from "react-apollo";
// ** Third Party Components
import { User, Mail, CheckSquare, MessageSquare, Settings, CreditCard, HelpCircle, Power } from 'react-feather'

// ** Reactstrap Imports
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from 'reactstrap'

// ** Default Avatar Image
import defaultAvatar from '@src/assets/images/avatars/avatar-blank.png'
import { toast } from 'react-toastify'

const UserDropdown = () => {
  const userData = JSON.parse(localStorage.getItem('UserRes'))
  let history = useHistory();
  // ** Store Vars
  const dispatch = useDispatch()

  // ** State

  //** ComponentDidMount

  //** Vars
  const signOut = client => {
    localStorage.clear()
    client.cache.reset()
    history.push('/');
    client.clearStore()
    dispatch(handleLogout())
    toast.success("Logout successfully");
  };

  return (
    <UncontrolledDropdown tag='li' className='dropdown-user nav-item'>
      <DropdownToggle href='/' tag='a' className='nav-link dropdown-user-link' onClick={e => e.preventDefault()}>
        <div className='user-nav d-sm-flex d-none'>
          <span className='user-name fw-bold'>{userData?.userName}</span>
          <span className='user-status'>{userData?.userType}</span>
        </div>
        <Avatar img={defaultAvatar} imgHeight='40' imgWidth='40' status='online' />
      </DropdownToggle>
      <DropdownMenu end>
        {/* <DropdownItem tag={Link} to='#'>
          <User size={14} className='me-75' />
          <span className='align-middle'>Profile</span>
        </DropdownItem>
        <DropdownItem tag={Link} to='#'>
          <Settings size={14} className='me-75' />
          <span className='align-middle'>Settings</span>
        </DropdownItem> */}
        {/* <DropdownItem divider /> */}
        <ApolloConsumer>
          {(client) => (
            <DropdownItem className='w-100' onClick={() => signOut(client)}>
              <Power size={14} className='me-75' />
              <span className='align-middle'>Logout</span>
            </DropdownItem>
          )}
        </ApolloConsumer>
        {/* <DropdownItem tag={Link} to='/login' onClick={() => dispatch(handleLogout())}>
          <Power size={14} className='me-75' />
          <span className='align-middle'>Logout</span>
        </DropdownItem> */}
      </DropdownMenu>
    </UncontrolledDropdown>
  )
}

export default UserDropdown
