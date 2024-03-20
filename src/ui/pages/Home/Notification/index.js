import React, { useContext, useEffect, useState } from 'react'
import { useMutation, useQuery, useSubscription } from 'react-apollo';
import { Bell } from 'react-feather';
import { useHistory } from 'react-router-dom';
import { Badge, Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from 'reactstrap';
import { GET_NOTIFICATION_WITHOUT_PAGINATION, GET_SUBSCRIPTION, UPDATE_NOTIFICATION } from '../../AssociateVendors/query';
import PerfectScrollbar from 'react-perfect-scrollbar'
import ComponentSpinner from '../../../../@core/components/spinner/Loading-spinner';
import Notificationlist from '../../Notification/Notificationlist';
import { GET_ALL_NOTIFICATIONS } from '../../Notification/query';
import classNames from "classnames";
import { toast } from 'react-toastify';
import NoticationContext from '../../../../context/NotificationContext';


function index() {
    const history = useHistory();
    const [open, setOpen] = useState();
    const { loading: notificationrefetch, data: notifications } = useSubscription(GET_SUBSCRIPTION)
    const [updateNotification] = useMutation(UPDATE_NOTIFICATION)  

    const NotificationData = useContext(NoticationContext)


    useEffect(() => {
        notifications?.createNotification && NotificationData?.refetch()

    }, [notifications])
    const handleRedirect = (category, id) => {
        updateNotification({
            variables: { updateNotificationId: id }
        }).then((res) => {
            if (res?.data?.updateNotification) {
                history.push("/order-history")               
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

    const renderMails = () => {
        if (NotificationData?.allNotification?.data) {
            return NotificationData?.allNotification?.data?.map((notification, index) => {                
                return (
                    <li className={classNames('d-flex user-mail cursor-pointer')} onClick={() => handleRedirect(notification?.category, notification?.id)}>
                        <div className='mail-body'>
                            <Row>
                                <Col md="5" className='pe-0 d-flex'>
                                    <div className='mail-left pe-50'>
                                        <Bell />
                                    </div>
                                    <div className='mail-items ms-1'>
                                        <h4 className='mb-1 fw-bold'>{notification?.category}</h4>
                                        <span className='text-truncate mb-0'>{notification?.message}</span>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </li>

                )
            })
        }
    }
    return (
        <>
            <PerfectScrollbar className='email-user-list mt-1' options={{ wheelPropagation: false }} style={{ height: 'inherit', marginBottom: "10px", height: window?.innerHeight - 330 }}>
                {NotificationData?.allNotification?.data?.length ? (
                    <ul className='email-media-list'>{renderMails()}</ul>
                ) : (
                    <div className='no-results d-block'>
                        <h5>No Items Found</h5>
                    </div>
                )}
            </PerfectScrollbar>


        </>
    )
}

export default index