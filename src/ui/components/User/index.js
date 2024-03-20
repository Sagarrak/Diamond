import React from 'react'
// ** React Imports
import { useState, Fragment } from 'react'

// ** Reactstrap Imports
import { Row, Col, Card, Form, CardBody, Button, Badge, Modal, Input, Label, ModalBody, ModalHeader } from 'reactstrap'

import { BASE_URL } from '../../../config'

import { Check, Briefcase, X } from 'react-feather'


// ** Custom Components
import Avatar from '@components/avatar'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import ImageComp from '../ImageComp'

const index = ({ data }) => {

    // ** render user img
    const renderUserImg = () => {
        return (data?.profilePicture) ?
            (<ImageComp
                height='110'
                width='110'
                alt='user-avatar'
                src={data?.profilePicture}
                className='img-fluid rounded mt-3 mb-2'
            />)
            :
            (
                <Avatar
                    initials
                    color={"light-info"}
                    className='rounded mt-3 mb-2'
                    content={data?.fullName || "No FullName"}
                    contentStyles={{
                        borderRadius: 0,
                        fontSize: 'calc(48px)',
                        width: '100%',
                        height: '100%'
                    }}
                    style={{
                        height: '110px',
                        width: '110px'
                    }}
                />
            )
    }


    return (
        <div>
            <Fragment>
                <Card>
                    <CardBody>
                        <div className='user-avatar-section'>
                            <div className='d-flex align-items-center flex-column'>
                                {renderUserImg()}
                                <div className='d-flex flex-column align-items-center text-center'>
                                    <div className='user-info'>
                                        <h4>{data?.fullName || "No FullName"}</h4>
                                        <Badge color={'light-blue'} className='text-capitalize'>
                                            user
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h4 className='fw-bolder border-bottom pb-50 mb-1'>Details</h4>
                        <div className='info-container'>
                            <ul className='list-unstyled'>
                                <li className='mb-75'>
                                    <span className='fw-bolder me-25'>Username:</span>
                                    <span>{data?.userName}</span>
                                </li>
                                <li className='mb-75'>
                                    <span className='fw-bolder me-25'>Email:</span>
                                    <span>{data?.email}</span>
                                </li>
                                <li className='mb-75'>
                                    <span className='fw-bolder me-25'>Verified Status:</span>
                                    <Badge className='text-capitalize' color={data?.isEmailVerified ? "light-success" : "light-danger"}>
                                        {data?.isEmailVerified ? "Verified" : "Not Verified"}
                                    </Badge>
                                </li>
                                <li className='mb-75'>
                                    <span className='fw-bolder me-25'>Active Status:</span>
                                    <Badge className='text-capitalize' color={data?.isActive ? "light-success" : "light-warning"}>
                                        {data?.isActive ? "Active" : "Not Active"}
                                    </Badge>
                                </li>
                                <li className='mb-75'>
                                    <span className='fw-bolder me-25'>Role:</span>
                                    <span className='text-capitalize'> User </span>
                                </li>
                                <li className='mb-75'>
                                    <span className='fw-bolder me-25'>Gender:</span>
                                    <span>{data?.gender}</span>
                                </li>
                                <li className='mb-75'>
                                    <span className='fw-bolder me-25'>Contact:</span>
                                    <span>{data?.mobile}</span>
                                </li>
                            </ul>
                        </div>
                    </CardBody>
                </Card>
            </Fragment>
        </div>
    )
}

export default index