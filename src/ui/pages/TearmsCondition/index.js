import Header from "../Home/Header/Header";
import '../../pages/Home/home.scss'
import '../../pages/Home/homev2.scss'
import check from '../../../assets/images/icons/tearms-check.png'


const Termscondition = () => {
    return (
        <div className='home-page'>
            < Header />
            <div className="tearms-condition-data">
                <div className="container history-wrap">
                    {/* <h5 className="terms-subtitle">Agreement</h5> */}
                    <h3 className="terms-title">Terms of Services</h3>
                    <div className="tearms-condition-blog">
                        <p className="tearms-blog-data mb-0">Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit.</p>
                        <p className="tearms-blog-data mt-2 mb-0">Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit. Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit. Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit.</p>
                    </div>
                    <ul className="terms-list">
                        <li className="d-flex align-items-start">
                            <img src={check} />
                            Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor
                        </li>
                        <li className="d-flex align-items-start">
                            <img src={check} />
                            Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor  ipsum dolor sit Lorem ipsum dolor sit L
                        </li>
                        <li className="d-flex align-items-start">
                            <img src={check} />
                            Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum.
                        </li>
                        <li className="d-flex align-items-start">
                            <img src={check} />
                            Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum. Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum. Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum.
                        </li>
                        <li className="d-flex align-items-start">
                            <img src={check} />
                            Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor
                        </li>
                    </ul>
                    <div className="tearms-condition-blog">
                        <p className="tearms-blog-data mb-0">Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit Lorem ipsum dolor sit.</p>
                    </div>
                    <div className="d-flex align-items-center terms-footer">
                        <button className="common-button">I Agree with Terms</button>
                        <button className="not-now-btn border-0 bg-transparent">Not Now</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Termscondition;