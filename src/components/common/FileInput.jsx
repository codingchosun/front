import React from 'react';
import './FileInput.css';

const FileInput = ({label, name, onChange, multiple = false}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            <input
                type="file"
                id={name}
                name={name}
                multiple={multiple}
                onChange={onChange}
                className="file-input"
            />
        </div>
    );
};

export default FileInput;