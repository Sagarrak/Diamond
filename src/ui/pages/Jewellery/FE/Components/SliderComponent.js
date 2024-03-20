import React from 'react'
import ImageComp from '../../../../components/ImageComp'
import { useHistory } from 'react-router-dom'

function SliderComponent({ image, sliderTitle, id }) {
  const history = useHistory();
  return (
    <div className="diamond-cut-slider position-relative">
      <div className="diamond-cut-img-wrap" onClick={() => { history?.push(`/jewelry/products/${id}`) }}>
        <ImageComp src={image} alt="diamond-cut" className="img-fluid" style={{ width: "50%", cursor: "pointer" }} />
        <h4 className="text-md mt-2 mb-0 buttler-light">{sliderTitle}</h4>
      </div>
    </div>
  )
}

export default SliderComponent