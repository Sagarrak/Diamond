import React from 'react'
import { useHistory } from 'react-router-dom'
import home from '../../../../../assets/images/jewellery/home.png'
import home2 from '../../../../../assets/images/jewellery/home2.png'

function Heading() {
	const history=useHistory()
	const getStarted=()=>{
		history.push("/jewellery-showcase")
	}
	const dynamicJewellery=()=>{
		history.push("/jewellery-dynamic")

	}
	return (
		<>
			<div className='content-text fs-4 content-text'>Explore Jewellery</div>
			<div className='container'>
				<div className='d-flex w-100 mt-2'>
					<div className='me-1 position-relative w-50'>
						<div>
							<img src={home} className="w-100"></img>	
						</div>
						<div className='content-img-text text-end position-absolute'>
							<h5 className='text-white'>Design in your own Rings</h5>
							<p>Select your settings & diamonds to get exactly
								what you’re lookingfor. </p>
							<button className='outline-btn' onClick={getStarted}>Get Started</button>
						</div>
					</div>

					<div className='position-relative w-50'>
						<div className='w-100 h-100'>
							<img src={home2} className="w-100 h-100"></img>
						</div>

						<div className='content-img-text2 text-end position-absolute'>
							<h5 className='text-white'>View in Jewellery Showcase</h5>
							<p>Select your settings & diamonds to get exactly
								what you’re lookingfor. </p>
							<button className='outline-btn' onClick={dynamicJewellery}>Get Started</button>
						</div>
					</div>
				</div>
			</div>

		</>



	)
}

export default Heading