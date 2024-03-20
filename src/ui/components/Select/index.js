//library
import React from "react";
import Select from "react-select";
import { selectThemeColors } from '@utils'

const Index = ({ options, value, onChange, invalid, placeholder, isClearable, isMulti }) => {
    return (
        <Select
            isMulti={isMulti}
            isClearable={isClearable}
            options={options}
            classNamePrefix={invalid ? "is-invalid select" : "select"}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e)}
            className='react-select'
            theme={selectThemeColors}
        />
    );
};

export default Index;
