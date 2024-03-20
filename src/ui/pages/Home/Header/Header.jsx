import React, { useState, useContext, useEffect, useRef } from 'react';
import './header.scss';
import "../../../scss/variable.scss";
import "../../../scss/common.scss";
import wishlistIcon from '../../../../assets/images/pages/header-wishlist.png';
import bellIcon from '../../../../assets/images/pages/bell.png'
import cartIcon from '../../../../assets/images/pages/header-cart.png';
import userIcon from '../../../../assets/images/pages/header-user.png';
import headerLogo from "../../../../../src/assets/images/pages/header-logo.png";
import topbarDelete from "../../../../../src/assets/images/pages/topbarDelete-icon.svg";
import header_profileicon from "../../../../../src/assets/images/pages/headerProfile.svg";
import { NavHashLink as Link } from "react-router-hash-link";
import { ApolloConsumer, useQuery } from 'react-apollo';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import RightModel from '../../../components/RightModel';
import Cart from '../Cart/Cart';
import Notification from '../Notification'
import Wishlist from '../Wishlist/Wishlist';
import WishListContext from '../../../../context/WishListContext';
import CartContext from "../../../../context/CartContext";
import { AlignLeft, Bell } from 'react-feather';
import MobileMenu from './MobileMenu';
import gql from 'graphql-tag';
import NoticationContext from '../../../../context/NotificationContext';

const Header = () => {
    const userData = JSON?.parse(localStorage?.getItem('UserRes'));
    
    const GET_TOP_BAR = gql`
    query GetTopBar {
        getTopBar {
            id
            topBar
            content
        }
    }
    `
    const [topbar, setTopbar] = useState(false);
    const [Menutoggle, _Menutoggle] = useState(false);
    const [dropdown, setDropdown] = useState(false);
    const [blogDropdown, setBlogDropdown] = useState(false);
    const history = useHistory();
    const WishListData = useContext(WishListContext);
    const [openSideModal, setOpenSideModal] = useState(false)
    const [openBellModal, setOpenBellModal] = useState(false)
    const [wishlistToggle, setWishlistToggle] = useState(false)
    const [mobileMenuOpenSideModal, setMobileMenuOpenSideModal] = useState(false)
    const handleSideModal = () => setOpenSideModal(!openSideModal)
    const handleBellModal = () => setOpenBellModal(!openBellModal)
    const mobileMenuHandleSideModal = () => setMobileMenuOpenSideModal(!mobileMenuOpenSideModal)
    const CartData = useContext(CartContext);
    const NotificationData = useContext(NoticationContext)
    const profile = useRef()
    const blogRef = useRef()
    const wishlistHandleSideModal = () => setWishlistToggle(!wishlistToggle)

    const { data: topBar } = useQuery(GET_TOP_BAR, { fetchPolicy: "no-cache" });

    const deletetopbar = () => {
        setTopbar(!topbar)
        sessionStorage.setItem("items", JSON.stringify(!topbar))
    }
    // ** Logout script
    const signOut = (client) => {
        localStorage.clear();
        client.cache.reset();
        history.push("/");
        client.clearStore();
        toast.success("Logout successfully");
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profile.current && !profile.current.contains(event.target)) {
                setDropdown(false)
                setBlogDropdown(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profile])

    useEffect(() => {
        const handleClickOutside = (event) => { if (blogRef.current && !blogRef.current.contains(event.target)) { setBlogDropdown(false) } }
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, [blogRef])

    useEffect(() => {
        const store = sessionStorage.getItem("items")
        store ? setTopbar(true) : setTopbar(false)
    }, [])
    return (
        <div className='w-100' style={{ paddingInline: "0px" }}>
            <div className={`header-topBar position-absolute top-0 start-0 w-100 ${topbar === true ? 'd-none' : 'd-flex'}`}>
                <p className='topBar' dangerouslySetInnerHTML={{ __html: topBar?.getTopBar?.content }}></p>
                <button type='button' style={{ background: "#212121", borderLeft: "none" }} onClick={deletetopbar}> <img src={topbarDelete} alt='topbarDelete-icone' /></button>
            </div>
            <div className='container'>
                <header className={`d-flex align-items-center justify-content-between ${topbar === true ? 'mt-0' : "mt-4"}`}>
                    <div className='header-logo'> <Link to={"/"}> <img src={headerLogo} alt="headerLogo" /> </Link> </div>
                    <div className='nav d-flex align-items-center justify-content-center d-lg-block d-none'>
                        <ul className='nav-bar d-flex align-items-center justify-content-center'>
                            <li className="mobile-list-menu"> <Link smooth={+true} to='/'>HOME</Link> </li>
                            <li className="mobile-list-menu"> <Link smooth={+true} to='/inventory/diamonds'>DIAMONDS</Link> </li>
                            <li className="mobile-list-menu"> <Link smooth={+true} to='/jewelry'>JEWELLERY</Link> </li>
                            <li className="mobile-list-menu position-relative"> <Link smooth={+true} to='/blogs'>BLOG</Link> </li>
                            {/* <li className="mobile-list-menu position-relative" onClick={() => setBlogDropdown(true)}> <Link smooth={+true} to='/blogs'  >BLOG</Link>
                                <div className={` ms-1 ${!blogDropdown && 'd-none'} position-absolute profile-header-dropdown blog-dropdown cursor-pointer`} ref={blogRef}>
                                    <ul>
                                        <li><Link to={'/blogs'}> <span>Tools</span></Link></li>
                                        <li><Link smooth={true} to={'/blogs'}> <span>Tools</span></Link></li>
                                        <li onClick={() => { history?.push('/blogs') }}> <span>Eduction</span> </li>
                                    </ul>
                                </div>
                            </li> */}
                            <li className="mobile-list-menu" > <Link smooth={+true} to='/education'>EDUCATION</Link></li>
                            <li className="mobile-list-menu"> <Link smooth={+true} to='/aboutUs'>ABOUT US</Link> </li>
                            <li> <Link to='/appointment'>CONTACT US</Link> </li>
                        </ul>
                    </div>
                    <div className={`page-dark ${Menutoggle === true ? "active " : "d-none"}`} onClick={() => _Menutoggle(false)}></div>
                    <div className="accessories d-flex align-items-center position-relative">
                        <div className="wishlist position-relative">
                            <div className='wishlist-icon'><img src={wishlistIcon} alt="wishlist" className='cursor-pointer' onClick={() => { setWishlistToggle(true) }} /></div>
                            {WishListData?.wishListData?.getWishlist?.data?.length > 0 && WishListData?.wishListData?.getWishlist?.data[0].items?.length > 0 &&
                                <span className='d-flex align-items-center justify-content-center text-white bg-green w-25 position-absolute top-0 start-100 translate-middle border border-light rounded-circle'>
                                    <span>{WishListData?.wishListData?.getWishlist?.data[0].items?.length}</span>
                                </span>
                            }
                            <RightModel
                                handleSideModal={wishlistHandleSideModal}
                                openSideModal={wishlistToggle}
                                setOpenSideModal={setWishlistToggle}
                                Heading="MY WATCH LIST"
                                TitleLogo={wishlistIcon}
                                ContentComponent={Wishlist}
                            />
                        </div>
                        {/* {userData?.id &&
                            <div className=" accessories  d-flex align-items-center position-relative ms-2">
                                <div className='wishlist-icon position-relative'>
                                    <Bell width={30} height={30} onClick={() => { setOpenBellModal(true) }} className="cursor-pointer" />
                                  
                                </div>
                                {(NotificationData?.allNotification?.data?.length > 0) &&
                                    <span className='d-flex align-items-center justify-content-center text-white bg-green w-25 position-absolute top-0 start-100 translate-middle border border-light rounded-circle'>
                                        <span>{NotificationData?.allNotification?.data?.length}</span>
                                    </span>
                                }
                                <RightModel
                                    handleSideModal={handleBellModal}
                                    openSideModal={openBellModal}
                                    setOpenSideModal={setOpenBellModal}
                                    Heading="MY NOTIFICATION"
                                    icon="bellIcon"
                                    ContentComponent={Notification}
                                />
                            </div>
                        } */}
                        <div className="cart d-flex align-items-center position-relative">
                            <div className='wishlist-icon'>
                                <img src={cartIcon} alt="wishlist" className='cursor-pointer' onClick={() => { setOpenSideModal(true) }} />
                            </div>
                            {(CartData?.cartData?.getCartItems?.items?.length > 0) &&
                                <span className='d-flex align-items-center justify-content-center text-white bg-green w-25 position-absolute top-0 start-100 translate-middle border border-light rounded-circle'>
                                    <span>{CartData?.cartData?.getCartItems?.items?.length}</span>
                                </span>
                            }
                            <RightModel
                                handleSideModal={handleSideModal}
                                openSideModal={openSideModal}
                                setOpenSideModal={setOpenSideModal}
                                Heading="MY CART"
                                TitleLogo={cartIcon}
                                ContentComponent={Cart}
                            />
                        </div>
                        {
                            userData?.id ?
                                <div className="profile cursor-pointer d-lg-block d-none" onClick={() => { setDropdown(!dropdown) }} ref={profile}>
                                    <div className="user-profile-heading position-relative">
                                        <span>
                                            <img src={userIcon} alt="userIcon" />
                                        </span>
                                    </div>
                                    <div className={` ms-1 ${!dropdown && 'd-none'} position-absolute profile-header-dropdown`} >
                                        <ul>
                                            <li onClick={() => { history?.push('/dashboard'); }}>Dashboard</li>
                                            <ApolloConsumer>
                                                {(client) => (
                                                    <li onClick={() => { signOut(client) }}> <span style={{ color: "#E02B1D" }}>Sign Out</span> </li>
                                                )}
                                            </ApolloConsumer>
                                        </ul>
                                    </div>
                                </div>
                                :
                                <div className="logReg cursor-pointer d-lg-block d-none">
                                    <Link to="/login" smooth={+true}>
                                        <img src={userIcon} alt="userIcon" className='' />
                                    </Link>
                                </div>
                        }
                        <button className="navbar-toggler border-0 bg-transparent d-lg-none d-block p-0 ms-lg-0" onClick={mobileMenuHandleSideModal} type="button" ><AlignLeft /></button>
                        <RightModel
                            handleSideModal={mobileMenuHandleSideModal}
                            openSideModal={mobileMenuOpenSideModal}
                            setOpenSideModal={setMobileMenuOpenSideModal}
                            Heading="Explore Here"
                            TitleLogo={userIcon}
                            ContentComponent={MobileMenu}
                        />
                    </div>
                </header >
            </div >
        </div >
    )
}

export default Header