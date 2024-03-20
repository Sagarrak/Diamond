import React from 'react';
import { useQuery } from "react-apollo";
import { Link, } from "react-router-dom";
import ImageComp from '../../components/ImageComp';
import { GET_HOME_PAGE_CONTENT } from "../ChangeHomeContent/query";

const HomeContent = () => {

  const { data } = useQuery(GET_HOME_PAGE_CONTENT, { fetchPolicy: "cache-and-network" });

  return (
    <div className="container-sm mt-5">
      <div className="row align-items-center justify-content-center mt-5">
        <div className='col-md-2 col-12'>
          <div className="bannerDiamondImg">
            {/* <img src={bannerDiamondImg} alt="bannerDiamondImg" className="img-fluid float-start" /> */}
            <ImageComp src={data?.getHomepageContent?.leftImage} alt="bannerDiamondImg" className="img-fluid float-start" />
          </div>
        </div>

        <div className='col-md-8 col-12'>
          <div className="join-content d-flex flex-column my-lg-0 my-2">
            <p className="head-bold text-center outfit-bold">{data?.getHomepageContent?.header}</p>
            <p className="text-sm-content text-center">{data?.getHomepageContent?.content} </p>
            <Link className="d-block btn-sm" to={data?.getHomepageContent?.buttonLink} >{data?.getHomepageContent?.buttonText}</Link>
          </div>
        </div>

        <div className='col-md-2 col-12'>
          <div className="bannerNecklesImg">
            <ImageComp src={data?.getHomepageContent?.rightImage} alt="bannerNecklesImg" className="img-fluid float-end" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeContent;