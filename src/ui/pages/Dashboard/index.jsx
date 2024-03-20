import { useEffect, useState } from "react";
import Header from "../Home/Header/Header";
import './dashboard.scss';
import { useHistory } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { NavHashLink as Link } from "react-router-hash-link";
import { ApolloConsumer } from 'react-apollo';
import { toast } from "react-toastify";
import deshboard from "../../../assets/images/icons/deshbord-icon.svg";
import MakeToOrderForm from "../Inventory/MakeToOrder/MakeToOrderForm";
import { GET_ALL_SHAPES } from "../Shapes/query";
import { useQuery } from "react-apollo";
import { GET_ALL_PARAMETERS } from "../Parameters/query";


const Dashboard = () => {
	const [modal, setModal] = useState(false);
	const [shapeLimit] = useState(500);
	const [allShapes, setAllShapes] = useState([])
	const [colors, setColors] = useState([])
	const [clarity, setClarity] = useState([])
	const history = useHistory();
	const userData = JSON?.parse(localStorage?.getItem('UserRes'));
	const userName = userData?.fullName || userData?.userName;

	const { data: shapeData } = useQuery(GET_ALL_SHAPES, {
		variables: {
			page: 1,
			limit: shapeLimit,
			sort: { key: "sortOrder", type: 1 },
			filter: "{}",
			search: ""
		},
		fetchPolicy: "cache-and-network",
	});
	useEffect(() => {
		if (shapeData?.getAllShapes) setAllShapes(shapeData?.getAllShapes);
	}, [shapeData]);
	const { data } = useQuery(GET_ALL_PARAMETERS, {
		variables: {
			page: 1,
			limit: 1000,
			sort: { key: "sortOrder", type: 1 },
			filter: "{}",
			search: ''
		},
		fetchPolicy: "no-cache",
	});

	useEffect(() => {
		if (data?.getAllParameter?.data) {
			let grouped = _.mapValues(_.groupBy(data?.getAllParameter?.data, 'category'), (clist) => clist.map(car => _.omit(car, 'category')));

			setColors(grouped?.Global?.find(d => d?.paramName === "COLOR")?.value || [])
			setClarity(grouped?.Global?.find(d => d?.paramName === "CLARITY")?.value || [])
		}
	}, [data]);
	// ** Logout script
	const signOut = (client) => {
		localStorage.clear();
		client.cache.reset();
		history.push("/");
		client.clearStore();
		// dispatch(handleLogout());
		// CartData?.cartRefetch();
		// _allCartItems([]);
		toast.success("Logout successfully");
	};



	const Square = (props) => {
		return (
			<div className="square cursor-pointer" onClick={() => { props.url === '' ? setModal(true) : history?.push('/' + props?.url) }}>
				<p className="title">{props?.title}</p>
				<p className="description">{props?.description}</p>
			</div>
		)
	}
	return (
		<div className="home-page">
			<div className="banner-img-wrap">
				<div className="banner-img d-flex align-items-center justify-content-center flex-column">
					<Header />
					<div className="container">
						<div className="dash-board">
							<div className="header-text">
								<div className="dashDiv">
									<div className="dashboardText">
										<img className="dashboard" src={deshboard} alt="dashboard-icon" />
										<p className="dashboard-pare">Dashboard</p>
									</div>
									{/* <h1 className="mainHeading buttler-heading">Welcome Hardik</h1> */}
									<div className="lowerText">
										<p className="p-0 mb-1 text-center outfit-bold"><strong>Welcome {userName},</strong></p>
										<p className="p-0 m-0 text-center">you can manage your shopping experience at CVD MART online store.</p>
									</div>
								</div>
								<div className="dashboard-data">
									<Row>
										<Col lg="2" md="4" sm="12" className="dashList d-flex">
											<div>
												<ul>
													<p className="title w-100 text-lg-start text-center">CVD Mart</p>
													<li> <Link to="/user-profile"> My Profile</Link></li>
													<li> <Link to="/watchlist"> My Watch List</Link></li>
													<li> <Link to="/order-history"> My Orders</Link></li>
													<li> <Link to="/change-password"> My Password</Link></li>
													<li className="search-collection"> <Link to="/inventory/diamonds"> Search Our Collection</Link></li>
													<li> <Link to="/user-holdRequest"> Hold Request</Link></li>
												</ul>
											</div>
											<ApolloConsumer>
												{(client) => (
													<button className="common-button" onClick={() => { signOut(client); }}> Sign Out </button>
												)}
											</ApolloConsumer>
										</Col>
										<Col lg="10" md="8" sm="12">
											<div className="dashSquares">
												<div className="line2 mb-3">
													<MakeToOrderForm
														modal={modal}
														setModal={setModal}
														shapes={shapeData?.getAllShapes}
														colors={colors}
														clarity={clarity}

													/>

													<Square
														title="GET A QUOTE FOR CUSTOM REQUIREMENTS"
														description="Contact us to let us know what you have in mind."
														url=""
													/>
													<Square
														title="MY WATCH LIST"
														description="View your Watch list"
														url="watchlist"
													/>
												</div>
												<div className="line1">
													<Square
														title="MY HOLD REQUEST"
														description="View your Watch list"
														url="user-holdRequest"
													/>
													<Square
														title="MY ORDERS"
														description="Check your past orders, order numbers and track current deliveries."
														url="order-history"
													/>
												</div>

											</div>
										</Col>
									</Row>
								</div>
							</div>

						</div>

					</div>
				</div>
			</div>
		</div >
	);
};
export default Dashboard;
