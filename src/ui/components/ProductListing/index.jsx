import React from 'react'
import { Spinner } from 'reactstrap';
import emptyCart from "../../../../src/assets/images/icons/Frame.svg";
import ImageComp from '../ImageComp';


const Index = ({ productData }) => {
    return (
        <div>

            {
                productLoading ?
                    <div className='d-flex justify-content-center align-items-center'>
                        <Spinner size={'lg'} />
                    </div>
                    :
                    (productData?.getAllProducts?.length > 0 && productData?.getAllProducts?.length != undefined) ?
                        // !productLoading ?
                        <div className='search-product-list warning-box mt-lg-4 mt-2'>
                            <div className='d-flex align-items-center justify-content-between'>
                                <h3 className='mb-0'>Total {productData?.getAllProducts?.count} Products Found</h3>
                                <div className='d-flex align-items-center'>
                                    {
                                        category !== "625930c878af7e48342bb3ae" ?
                                            <>
                                                <img src={`${Tabs === 0 ? tableView : lightTable}`} className="cursor-pointer" onClick={(e) => { e.preventDefault(); setTabs(0) }} />
                                                <img src={`${Tabs === 1 ? darkGrid : cardView}`} className="table-view-product cursor-pointer" onClick={(e) => { e.preventDefault(); setTabs(1) }} />
                                            </> :
                                            <button
                                                className={`not-cert-atc ${(notCertifiedProducts?.length <= 0 || notCertifiedProducts?.length == undefined) ? 'disabled-btn' : ''}`}
                                                disabled={(notCertifiedProducts?.length > 0 && notCertifiedProducts?.length != undefined) ? false : true}
                                                onClick={() => { handleNotCertifiedATC() }}
                                            > Add To Cart </button>
                                    }
                                </div>
                            </div>
                            {
                                (Tabs === 0) ?
                                    category === "625930c878af7e48342bb3ae" ?
                                        <div className='table-responsive mt-2 mb-2'>
                                            <table className='table product-table'>
                                                <thead>
                                                    <tr>
                                                        <th className='scroll-static'> <p>Select</p></th>
                                                        <th> <p>Ref No</p></th>
                                                        <th> <p>Shape</p></th>
                                                        <th> <p>Range</p></th>
                                                        <th> <p>MM</p></th>
                                                        <th> <p>No Of Piece</p></th>
                                                        <th> <p>Carat</p></th>
                                                        <th> <p>Color</p></th>
                                                        <th> <p>Clarity</p></th>
                                                        <th> <p>Price/CT $</p></th>
                                                        <th> <p>AMT</p></th>
                                                        <th> <p>AVG. Size</p></th>
                                                        <th> <p>Type</p></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        productData?.getAllProducts?.map((res, i) =>
                                                            <>
                                                                <div className='mt-1' key={res?.id}></div>
                                                                <tr key={"tr" + res?.id}>
                                                                    <td className='scroll-static listed-box'>
                                                                        <label className="check-boxs">
                                                                            {(!checkInCart(res?.id) && res?.status == 'AVAILABLE') && <><input type="checkbox" onChange={e => notCertProductArr(res?.id, e.target.checked)} disabled={checkInCart(res?.id) && res?.status != 'AVAILABLE' ? true : false} />
                                                                                <span className="checkmark"></span></>}
                                                                        </label>
                                                                    </td>
                                                                    <td> <p>{res?.productName} </p></td>
                                                                    <td> <p>{res?.shapeId?.shapeName}</p></td>
                                                                    <td> <p>{setProductDetails("RANGE", i)} </p></td>
                                                                    <td> <p>{setProductDetails('LENGTH', i) + ' x ' + setProductDetails('WIDTH', i) + " x " + setProductDetails('DEPTH', i)} </p></td>
                                                                    <td> <p>{res?.quantity ? res?.quantity : "-"}</p></td>
                                                                    <td> <p>{setProductDetails("WEIGHT", i)} </p></td>
                                                                    <td> <p>{setProductDetails("COLOR", i)} </p></td>
                                                                    <td> <p>{setProductDetails("CLARITY", i)} </p></td>
                                                                    <td> <p>{res?.netValue ? res?.netValue : "-"}</p></td>
                                                                    <td> <p>{res?.amt ? res?.amt : "-"} </p></td>
                                                                    <td> <p>{res?.avgSize ? res?.avgSize : "-"} </p></td>
                                                                    <td> <p>{res?.type ? res?.type : "-"} </p></td>
                                                                </tr>
                                                            </>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        :
                                        <div className='table-responsive mt-2 mb-2'>
                                            <table className='table product-table'>
                                                <thead>
                                                    <tr>
                                                        <th className='scroll-static'> <p>View</p></th>
                                                        <th> <p>Status</p></th>
                                                        <th> <p>Stone ID</p></th>
                                                        <th> <p>Shape</p></th>
                                                        <th> <p>Carat</p></th>
                                                        <th> <p>Color</p></th>
                                                        <th> <p>Clarity</p></th>
                                                        <th> <p>Net Amount</p></th>
                                                        <th> <p>Cut</p></th>
                                                        <th> <p>Pol</p></th>
                                                        <th> <p>Sym</p></th>
                                                        <th> <p>Measurement</p></th>
                                                        {/* <th> <p>Flour</p></th> */}
                                                        <th> <p>Ratio</p></th>
                                                        <th> <p>Lab Name</p></th>


                                                        {/* <th> <p>Depth</p></th>
                                                        <th> <p>Table</p></th> */}
                                                        <th> <p>Certificate no</p></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        productData?.getAllProducts?.map((res, i) =>
                                                            <>
                                                                <div className='mt-1' key={res?.id}></div>
                                                                <tr>
                                                                    <td className='scroll-static'>
                                                                        <img src={eye} className={`cursor-pointer`} onClick={() => { history.push(`/products/${res?.id}`) }} />
                                                                    </td>
                                                                    <td>
                                                                        {res?.status === "AVAILABLE" ? <p id={"r" + res?.id} className='cursor-pointer text-center'><CheckCircle style={{ color: '#8da82b' }} /></p> : <p id={"r" + res?.id} className='cursor-pointer text-center' ><PauseCircle style={{ color: '#6e6b7b' }} /></p>}
                                                                        <UncontrolledTooltip placement='top' target={"r" + res?.id}>
                                                                            {res?.status === "AVAILABLE" ? "Available" : "On Hold"}
                                                                        </UncontrolledTooltip>
                                                                    </td>
                                                                    <td> <p className="cursor-pointer" onClick={() => { history.push(`/products/${res?.id}`) }}>{res?.productName} </p></td>
                                                                    <td> <p>{res?.shapeId?.shapeName}</p></td>
                                                                    <td> <p>{setProductDetails("WEIGHT", i, "number")} </p></td>
                                                                    <td> <p>{setProductDetails("COLOR", i)} </p></td>
                                                                    <td> <p>{setProductDetails("CLARITY", i)} </p></td>
                                                                    <td> <p>${res?.netValue} </p></td>
                                                                    <td> <p>{setProductDetails("CUT", i)} </p></td>
                                                                    <td> <p>{setProductDetails("POLISH", i)} </p></td>
                                                                    <td> <p>{setProductDetails("SYMMETRY", i)} </p></td>
                                                                    <td> <p>{setProductDetails('LENGTH', i) + ' x ' + setProductDetails('WIDTH', i) + " x " + setProductDetails('DEPTH', i)} </p></td>
                                                                    {/* <td> <p>{setProductDetails("FLUORESCENCE INTENSITY", i)} </p></td> */}
                                                                    <td> <p>{setProductDetails("RATIO", i, "number")} </p></td>
                                                                    <td> <p>{setProductDetails("CERTIFICATE", i)} </p></td>

                                                                    {/* <td> <p>{setProductDetails("DEPTH %", i, "number")} </p></td> */}
                                                                    {/* <td> <p>{setProductDetails("TABLE %", i, "number")} </p></td> */}
                                                                    <td> <p>{res?.reportNo || '-'} </p></td>
                                                                </tr>
                                                            </>
                                                        )
                                                    }
                                                </tbody>
                                            </table>
                                        </div> : ''
                            }
                            {
                                (Tabs === 1) ?
                                    category === "625930c878af7e48342bb3ae" ? '' :
                                        <div className='product-row'>
                                            {productData?.getAllProducts?.map((items, i) => {
                                                return (
                                                    <div className='product-sub-box' key={items?.id}>
                                                        <div className='position-relative cursor-pointer product-data-sub-box' >
                                                            <div className='product-data-box'>
                                                                <ImageComp className='product-grid-image' src={items?.image} />
                                                                <p className='product-box-title mb-0' onClick={() => { history.push(`/products/${items?.id}`) }}>{items?.productName}</p>
                                                            </div>
                                                            <div className='hover-product'>
                                                                <div className='hover-data d-flex justify-content-center align-items-center flex-column'>
                                                                    <h4 className='hover-data-title' onClick={() => { history.push(`/products/${items?.id}`) }}>{items?.productName}</h4>
                                                                    <p className='hover-data-subtitle'>{items?.description}</p>
                                                                </div>
                                                                <button className='view-btn' onClick={() => { history.push(`/products/${items?.id}`) }}> <img src={views} /></button>
                                                                {
                                                                    (checkInCart(items?.id) || items?.status != 'AVAILABLE') ? null :
                                                                        <span className="add-cart-btn cursor-pointer" onClick={() => { handleATC(items?.id, 1) }}><img src={pluscart} /> add to cart</span>
                                                                }
                                                            </div>
                                                        </div>

                                                        {
                                                            (items?.shapeId?.shapeName === "ROUND") ?
                                                                <>
                                                                    <div className='d-flex justify-content-between product-bottom-detail'>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'>Carat:</p>
                                                                            <b className='product-box-subnumber'>{setProductDetails('CARATS', i)}</b>
                                                                        </div>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'>Color:</p>
                                                                            <b className='product-box-subnumber'>{setProductDetails('COLOR', i)}</b>
                                                                        </div>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'>Clarity:</p>
                                                                            <b className='product-box-subnumber'>{setProductDetails('CLARITY', i)}</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className='d-flex justify-content-between product-bottom-detail'>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'>Cut:</p>
                                                                            <b className='product-box-subnumber'>{setProductDetails('CUT', i)}</b>
                                                                        </div>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'>Polish:</p>
                                                                            <b className='product-box-subnumber'>{setProductDetails('POLISH', i)}</b>
                                                                        </div>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'>Symm:</p>
                                                                            <b className='product-box-subnumber'>{setProductDetails('SYMMETRY', i)}</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className='d-flex justify-content-between product-bottom-detail'>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'></p>
                                                                            <b className='product-box-subnumber'>({setProductDetails('LENGTH', i) + ' x ' + setProductDetails('WIDTH', i) + " x " + setProductDetails('DEPTH', i)}) </b>
                                                                        </div>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'>Price:</p>
                                                                            <b className='product-box-subnumber'>{items?.netValue && '$' + items?.netValue} </b>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                                :
                                                                <>
                                                                    <div className='d-flex justify-content-between product-bottom-detail'>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'>Carat:</p>
                                                                            <b className='product-box-subnumber'>{setProductDetails('CARATS', i)}</b>
                                                                        </div>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'>Color:</p>
                                                                            <b className='product-box-subnumber'>{setProductDetails('COLOR', i)}</b>
                                                                        </div>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'>Clarity:</p>
                                                                            <b className='product-box-subnumber'>{setProductDetails('CLARITY', i)}</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className='d-flex justify-content-between product-bottom-detail'>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'>Polish:</p>
                                                                            <b className='product-box-subnumber'>{setProductDetails('POLISH', i)}</b>
                                                                        </div>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'>Symm:</p>
                                                                            <b className='product-box-subnumber'>{setProductDetails('SYMMETRY', i)}</b>
                                                                        </div>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'>Ratio:</p>
                                                                            <b className='product-box-subnumber'>{setProductDetails('RATIO', i)}</b>
                                                                        </div>
                                                                    </div>
                                                                    <div className='d-flex justify-content-between product-bottom-detail'>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'></p>
                                                                            <b className='product-box-subnumber'>({setProductDetails('LENGTH', i) + ' x ' + setProductDetails('WIDTH', i) + " x " + setProductDetails('DEPTH', i)}) </b>
                                                                        </div>
                                                                        <div className='d-flex align-items-center'>
                                                                            <p className='product-box-subtitle mb-0'>Price:</p>
                                                                            <b className='product-box-subnumber'>{items?.netValue && '$' + items?.netValue} </b>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                        }

                                                    </div>
                                                )
                                            })}
                                        </div> : ''
                            }
                            <ReactPaginate
                                breakLabel="..."
                                nextLabel=">"
                                onPageChange={handlePageClick1}
                                pageRangeDisplayed={5}
                                forcePage={page - 1}
                                pageCount={pageCount}
                                previousLabel="<"
                                renderOnZeroPageCount={null}
                                className="pagination-list mb-3"
                                activeClassName="selected"
                            />
                        </div>
                        // : <div className='d-flex justify-content-center align-items-center'><Spinner size='lg' /></div>
                        :
                        <div className='search-product-list'>
                            <div className="noProduct">
                                <img src={emptyCart} />
                                <p className="np-text"> No Products Found </p>
                            </div>
                        </div>
            }
        </div>
    )
}

export default Index