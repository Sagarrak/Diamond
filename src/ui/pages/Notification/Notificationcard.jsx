import React from 'react'
import { Badge, Card, CardBody, Col, Row } from 'reactstrap'
import Avatar from '@components/avatar'
import { createImageFromInitials } from '../../../@core/components/common/CreateImage'
import classNames from 'classnames'
import { UPDATE_NOTIFICATION } from '../AssociateVendors/query'
import { useHistory } from 'react-router-dom'
import { useMutation } from 'react-apollo'
import { toast } from 'react-toastify'
import { Bell } from 'react-feather'

function Notificationcard({ notification, refetch }) {
    const [updateNotification] = useMutation(UPDATE_NOTIFICATION)
    const history = useHistory()

    const handleRedirect  = (category, id) => {

        updateNotification({
            variables: { updateNotificationId: id }
          }).then((res) => {
            if (res?.data?.updateNotification) {
              if(category==="Hold Request"){
                history.push(`/hold-requests`)
      
              }else if(category==="Enquiry Request"){
                history.push(`/enquiries`)
      
              }else if(category==="Invoice Accept"){
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

    return (
        <>
            <li className={classNames('d-flex user-mail cursor-pointer')} onClick={() => handleRedirect(notification?.category, notification?.id)}>
                <div className='mail-body'>
                    <Row>
                        <Col md="5" className='pe-0 d-flex'>
                            <div className='mail-left pe-50'>
                            <Bell/>
                                {/* <Avatar img={createImageFromInitials(400, notification?.userId?.fullName || "", notification?.userId?.fullName?.split(" ")[1] || "")} /> */}
                            </div>
                            <div className='mail-items ms-1'>
                               <h5 className='mb-1 category'>{notification?.category}</h5>
                                <p className='text-truncate mb-0'>{notification?.message}</p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </li>

        </>
    )
}

export default Notificationcard