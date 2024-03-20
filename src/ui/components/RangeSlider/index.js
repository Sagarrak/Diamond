import React, { useState } from 'react'
import ReactSlider from 'react-slider';
import './range.scss';
const Range = (props) => {
    const { miniumRange, maximumRange, min, max, setMin, setMax, step, paramName, handleFilter, sign } = props;
    const [rangeState, setrangeState] = useState(false)
   
    const onAfterChangeHandler=(e) => {
        setrangeState(false)
        
    }
   
    return (
        <div className='slider-app  ps-1 pe-1'>
            <ReactSlider
                className="horizontal-slider"
                thumbClassName="example-thumb"
                trackClassName="example-track"
                defaultValue={[min, max]}
                min={miniumRange}
                max={maximumRange}
                step={step}
                withTracks={true}
                pearling={true}
                renderThumb={(props, state) => (
                    <div {...props} id={`range_`}>
                        <div style={{ position: "relative" }} >
                            <div style={{ color: "black" }} className="range-value" >{state?.valueNow + sign}</div>                          
                                <div className='range-state'style={{ display: !rangeState ?"none": "block"}}>{state?.valueNow + " " + sign}</div>                           
                        </div>
                    </div>
                )
                }
                onAfterChange={(e)=>onAfterChangeHandler(e)}
                onChange={async ([min, max]) => {
                    // debugger;
                    await setMax(max || 0);
                    await setMin(min || 0);                  
                    setrangeState(true)
                    await handleFilter(true, "Number", paramName, (min || 0), (max || 0.1),"More filter")
                }}
            />
        </div >
    )
}

export default Range