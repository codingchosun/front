import React from 'react';
import './Textarea.css';

const Textarea = ({ label, name, value, onChange, placeholder, required = false }) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="textarea-input"
            />
        </div>
    );
};

export default Textarea;