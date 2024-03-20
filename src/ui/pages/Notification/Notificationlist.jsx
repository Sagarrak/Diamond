import React from 'react'
import { Card, Col, Input, InputGroup, InputGroupText, Row } from 'reactstrap'
import Avatar from '@components/avatar'
import Notificationcard from './Notificationcard'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Pagination } from '../../components/Pagination'
import { PaginationDropDown } from '../../components/Pagination/PaginationDropDown'
import { Search } from 'react-feather'
function Notificationlist({ data, setSearchText, pageCount, setCurrentPage, limit, setLimit, refetch, currentPage, totalRecords }) {

    const renderMails = () => {
        if (data?.length) {
            return data?.map((notification, index) => {
                return (
                    <Notificationcard
                        notification={notification}
                        key={index}
                        refetch={refetch}
                    />
                )
            })
        }
    }
    return (
        <>         
            <div className='email-app-list w-100 '>
                <div className='app-fixed-search d-flex align-items-center justify-content-between'>
                    <div className='sidebar-toggle d-block ms-1 border-end pe-1' style={{ width: "15%" }} >
                        <div className="d-flex justify-content-end align-items-center" >
                            <PaginationDropDown
                                title="Show"
                                limit={limit}
                                changeLimit={(e) => {
                                    e.preventDefault();
                                    setLimit(parseInt(e?.target?.value))
                                    setCurrentPage(0)
                                }}
                            />
                        </div>
                    </div>
                    <div className='d-flex align-content-center justify-content-between w-100'>
                        <InputGroup className='input-group-merge'>
                            <InputGroupText>
                                <Search className='text-muted' size={14} />
                            </InputGroupText>
                            <Input
                                id='email-search'
                                placeholder='Search notification'
                                onChange={(e) => setSearchText(e?.target?.value)}
                            />
                        </InputGroup>
                    </div>
                </div>
             
                <PerfectScrollbar className='email-user-list mt-1' options={{ wheelPropagation: false }} style={{ height: 'inherit', marginBottom: "10px", height: window?.innerHeight - 330 }}>
                    {data?.length ? (
                        <ul className='email-media-list'>{renderMails()}</ul>
                    ) : (
                        <div className='no-results d-block'>
                            <h5>No Items Found</h5>
                        </div>
                    )}
                </PerfectScrollbar>
            </div>
            <div>
                <Pagination
                    currentPage={currentPage}
                    handlePagination={(event) => setCurrentPage(event?.selected)}
                    totalRecords={totalRecords}
                    limit={limit}
                />

            </div>

        </>

    )
}

export default Notificationlist