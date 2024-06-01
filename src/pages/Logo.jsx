// 로고 컨테이너 >> GNB에 사용
import "./Login.css";
import React from 'react';
import logoImage from "../images/로고.png";
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