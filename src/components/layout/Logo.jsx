// 로고 컨테이너 >> GNB에 사용
import "../../pages/auth/login/Login.css";
import React from 'react';
import { Link } from "react-router-dom";

const Logo=({className='', alt =''})=>{

    return(
        <Link to="./main">
        <img src={logoImage}
            className={className}
            alt={alt}
        />
        </Link>
    );
};

export default Logo;