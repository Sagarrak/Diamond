import React from 'react'
import "../jewellery.scss";
import "../../../../scss/common.scss";

import Gold from "../../../../components/MetalDropDown/Images/Gold.png";
import Silver from "../../../../components/MetalDropDown/Images/Silver.png";
import Rose from "../../../../components/MetalDropDown/Images/Rose.png";
import Platinum from "../../../../components/MetalDropDown/Images/Platinum.png";
import TabOne from '../images/tab-1.png'

import { Heart } from 'react-feather';
import { useQuery } from 'react-apollo';
import { digitalOceanURL } from '../../../../common/common';
import { useHistory } from 'react-router-dom';

const JewelryCard = ({ data }) => {
	const history = useHistory();
	return (
		<div>
			<div>
				<div className='cursor-pointer box position-relative d-flex align-items-center justify-content-center flex-column w-100' onClick={() => {
					history.push(`jewelleries/${data?.id}`)
				}}>
					<div className="box-title d-flex align-items-center justify-content-between w-100">
						<p></p>
						<Heart className='icon-color' />
					</div>
					<div>
						<img src={`${digitalOceanURL}${data?.productImages[0]}`} alt="err" />
					</div>
				</div>
				<div>
					<ul className='box-bottom-btn d-flex align-items-center justify-content-center'>
						{data?.metalName === "WHITE_GOLD" ?
							<li className='border-around'>
								<img src={Silver} alt="err" />
							</li> : ''}
						{data?.metalName === "GOLD" ?
							<li>
								<img src={Gold} alt="err" />
							</li> : ''}
						{data?.metalName === "ROSE_GOLD" ?
							<li>
								<img src={Rose} alt="err" />
							</li> : ""}
						{data?.metalName === "PLATINUM" ?
							<li>
								<img src={Platinum} alt="err" />
							</li>
							: ""}
					</ul>
					<div className='box-bottom-content'>
						<p>{data?.productName}</p>
						<p>{data?.categoryId?.name}</p>
						<p>{`$${data?.price}`}</p>
					</div>
				</div>
			</div>

		</div>

	)
}

export default JewelryCard