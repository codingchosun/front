import React from 'react';
import "./Input.css"

const Input = ({label, id, name, value, onChange, type = 'text', placeholder = '', required = false}) => {
    return (
        <div className="form-group">
            <label htmlFor={id}>{label}</label>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
            />
        </div>
    );
};

export default Input;