// 사용자 입력용 컴포넌트
import React from 'react';

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