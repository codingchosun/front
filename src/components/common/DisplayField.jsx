import React from 'react';
import './DisplayField.css';

const DisplayField = ({ label, value }) => {
    return (
        <div className="display-field">
            <label className="display-label">{label}</label>
            <p className="display-value">{value}</p>
        </div>
    );
};

export default DisplayField;