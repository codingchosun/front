import React from 'react';
import {Link} from 'react-router-dom';

const Button = ({children, onClick, type = 'button', to}) => {
    if (to) {
        return (
            <Link to={to} className="button-link">
                {children}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} className="button">
            {children}
        </button>
    );
};

export default Button;