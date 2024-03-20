// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Bell, X, Check, AlertTriangle } from 'react-feather'

// ** Reactstrap Imports
import { Button, Badge, Input, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown } from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { GET_NOTIFICATION_WITHOUT_PAGINATION, GET_SUBSCRIPTION, UPDATE_NOTIFICATION } from '../../../../ui/pages/AssociateVendors/query'
import { useMutation, useQuery, useSubscription } from 'react-apollo'
import { toast } from 'react-toastify'

const NotificationDropdown = () => {
  const history = useHistory();
  const [open, setOpen] = useState();
  const { loading, data: notifications } = useSubscription(GET_SUBSCRIPTION)
  const [notification, setNotification] = useState();
  const [count, setcount] = useState();
  const [updateNotification] = useMutation(UPDATE_NOTIFICATION)

  const userRes = localStorage.getItem("UserRes")
  const { data, refetch } = useQuery(GET_NOTIFICATION_WITHOUT_PAGINATION, {
    variables: {
      getAllNotificationsWithoutPaginationId: JSON.parse(userRes)?.id

    },
    fetchPolicy: "cache-and-network",
  })

  useEffect(() => {
    if (data?.getAllNotificationsWithoutPagination) {
      const status = data?.getAllNotificationsWithoutPagination?.filter((d) => d?.status === "unRead")
      setNotification(data?.getAllNotificationsWithoutPagination)
      setcount(status?.length)
    }

  }, [data])

  useEffect(() => {
    notifications?.createNotification && refetch()

  }, [notifications])

  const submitHandler = (e) => {
    // setSeen().then((data) => {
    //   refetch();
    // });
    setOpen(false);
   history.push("/notification");
  };
  
  const UpdateHandler = (category,id) => {
    updateNotification({
      variables: { updateNotificationId: id }
    }).then((res) => {
      if (res?.data?.updateNotification) {
        if(category==="Hold Request"){
          history.push(`/hold-requests`)

        }else if(category==="Enquiry Request"){
          history.push(`/enquiries`)

        }else if(category==="Invoice Request"){
          history.push(`/invoice`)

        }
        // toast.success("Update  status success")
        setOpen(false)
        refetch()
      }
      else {
        toast.error("Not update status")
        setOpen(false)
      }


    }).catch((error) => {
      toast.error(error)


    })
  }
  const onClickHandler = (e) => {
    e.preventDefault()
    setOpen(true)
  }


  // ** Function to render Notifications
  /*eslint-disable */
  const renderNotificationItems = () => {
    return (
      <PerfectScrollbar
        component='li'
        className='media-list scrollable-container'
        options={{
          wheelPropagation: false
        }}
      >
        {notification && notification.map((item, index) => {
          return (
            <a key={index}
              className='d-flex'
              href='/'
              onClick={e => e.preventDefault()}>
              <div
                className={classnames('list-item d-flex', {
                  'align-items-start': !item.switch,
                  'align-items-center': item.switch
                })}
                onClick={() => UpdateHandler(item?.category,item?.id)}
              >
                {!item.switch ? (
                  <Fragment>
                    <div className='me-1'>
                      <Bell/>
                      {/* <Avatar
                        {...(item.img
                          ? { img: item.img, imgHeight: 32, imgWidth: 32 }
                          : item.avatarContent
                            ? {
                              content: item.avatarContent,
                              color: item.color
                            }
                            : item.avatarIcon
                              ? {
                                icon: item.avatarIcon,
                                color: item.color
                              }
                              : null)}
                      /> */}
                    </div>
                    <div className="list-item-body flex-grow-1">
                      <p className="media-heading">
                        <span className="fw-bolder">{item?.category}</span>
                        &nbsp;
                      </p>

                      <small className="notification-text">
                        {item?.message}
                      </small>
                    </div>
                  </Fragment>
                ) : (
                  <Fragment>
                    {item.title}
                    {item.switch}
                  </Fragment>
                )}
              </div>
            </a>
          )
        })}
      </PerfectScrollbar>
    )
  }
  /*eslint-enable */

  return (
    <UncontrolledDropdown
      tag="li"
      className="dropdown-notification nav-item me-25"
    >
      <DropdownToggle
        tag="a"
        className="nav-link"
        href="/"
        onClick={(e) => onClickHandler(e)}
      >
        <Bell size={21} />
        {count > 0 && (
          <Badge pill color="danger" className="badge-up">
            {count}
          </Badge>
        )}
      </DropdownToggle>
      {open && (
        <DropdownMenu end tag="ul" className="dropdown-menu-media mt-0">
          <li className="dropdown-menu-header">
            <DropdownItem className="d-flex" tag="div" header>
              <h4 className="notification-title mb-0 me-auto">Notifications</h4>
              <Badge tag="div" color="light-primary" pill>
                {notification?.length} New
              </Badge>
            </DropdownItem>
          </li>
          {renderNotificationItems()}
          <li className="dropdown-menu-footer">
            {notification?.length > 0 && <Button color="primary" block onClick={(e) => submitHandler(e)}>
              Read all notifications
            </Button>}
          </li>
        </DropdownMenu>
      )}
    </UncontrolledDropdown>
  )
}

export default NotificationDropdown
