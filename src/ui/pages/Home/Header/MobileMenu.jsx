import React from 'react'
import { ApolloConsumer } from 'react-apollo'
import { NavHashLink as Link } from "react-router-hash-link";
import { toast } from 'react-toastify';

import home_icon from "../../../../../src/assets/images/pages/home_menuicon.svg";
import diamond_icon from "../../../../../src/assets/images/pages/diamond_menuicon.svg";
import jewellery_icon from "../../../../../src/assets/images/pages/jewellery_menuicon.svg";
import contact_icon from "../../../../../src/assets/images/pages/contact_menuicon.svg";
import about_icon from "../../../../../src/assets/images/pages/about_menuicon.svg";
import dashboard_icon from "../../../../../src/assets/images/pages/dashboard_menuicon.svg";
import blog_icon from "../../../../../src/assets/images/pages/blog_menuicon.svg";
import signOut_icon from "../../../../../src/assets/images/pages/signOut_icons.svg";
import { Bookmark } from 'react-feather';

const MobileMenu = () => {

    const signOut = (client) => {
        localStorage.clear();
        client.cache.reset();
        history.push("/");
        client.clearStore();
        toast.success("Logout successfully");
    };
    return (
        <div className='mobile-view-toggle active'>
            <div className="mobile-menu-list">
                <ul className="mobile-menu outfit-bold">
                    <li className="mobile-list-menu"> <Link smooth={+true} to='/'> <img className='me-2' src={home_icon} width={23} height={23} />HOME</Link> </li>
                    <li className="mobile-list-menu"> <Link smooth={+true} to='/inventory/diamonds'> <img className='me-2' src={diamond_icon} width={23} height={23} />Diamonds</Link> </li>
                    <li className="mobile-list-menu"> <Link smooth={+true} to='/jewelry'> <img className='me-2' src={jewellery_icon} width={23} height={23} />Jewellery</Link> </li>
                    <li className="mobile-list-menu"> <Link smooth={+true} to='/blogs'> <img className='me-2' src={blog_icon} width={23} height={23} />Blogs</Link> </li>
                    <li className="mobile-list-menu"> <Link smooth={+true} to='/education'> <Bookmark className='me-2'/> Education</Link> </li>
                    <li className="mobile-list-menu"> <Link smooth={+true} to='/aboutUs'>  <img className='me-2' src={about_icon} width={23} height={23} />ABOUT US</Link> </li>
                    <li className="mobile-list-menu"> <Link smooth={+true} to='/appointment'> <img className='me-2' src={contact_icon} width={23} height={23} />CONTACT US</Link> </li>
                    {
                        // userData?.id ?
                        <>
                            <li className="mobile-list-menu" ><Link to="/dashboard"> <img className='me-2' src={dashboard_icon} width={23} height={23} />My Dashboard</Link></li>
                            <ApolloConsumer>
                                {(client) => (
                                    <li className="mobile-list-menu signout-menu" onClick={() => { signOut(client) }}>
                                        <Link to="#" > <img className='me-2' src={signOut_icon} width={23} height={23} />Sign Out</Link>
                                    </li>
                                )}
                            </ApolloConsumer>
                        </>
                        //   :
                        // <li className="mobile-list-menu"> <Link to="/login"> Login / Sign up </Link> </li>
                    }

                </ul >
            </div >
        </div >
    )
}

export default MobileMenu