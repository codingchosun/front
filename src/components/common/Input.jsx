import React from 'react';
import "./Input.css"

const Input = ({label, id, value, onChange, type = 'text', required = false}) => {
    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    );
};

export default Input;