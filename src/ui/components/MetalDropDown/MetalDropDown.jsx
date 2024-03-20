import React from 'react';
import Select from 'react-select';
import Gold from "./Images/Gold.png";
import Silver from "./Images/Silver.png";
import Rose from "./Images/Rose.png";
import Platinum from "./Images/Platinum.png";
const MetalDropDown = ({ setMetal, defaultMetal, metal }) => {

    const MetalOption = ({ img, title }) => {
        return <div className='d-flex align-items-center' style={{ padding: "4px 5px" }}><img className='me-1' src={img} height="30px" width="30px" /><span>{title}</span> </div>
    }

    const options = [
        { value: 'GOLD', label: <MetalOption img={Gold} title="Gold" /> },
        { value: 'WHITE_GOLD', label: <MetalOption img={Silver} title="White Gold" /> },
        { value: 'ROSE_GOLD', label: <MetalOption img={Rose} title="Rose Gold" /> },
        { value: 'PLATINUM', label: <MetalOption img={Platinum} title="Platinum" /> },
    ];

    return (

        <Select
            isClearable={true}
            options={options}
            required
            value={options?.find((d) => d?.value === metal)}
            defaultValue={(options?.find(d => d?.value === defaultMetal)) || ""}
            placeholder="Select Metal"
            onChange={e => setMetal(e?.value)}
            className='react-select'
            isSearchable={false}
        />
    )

}

export default MetalDropDown