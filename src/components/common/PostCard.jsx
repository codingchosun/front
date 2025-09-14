import React from 'react';
import {useNavigate} from 'react-router-dom';
import './PostCard.css';
import defaultImage from '../../assets/images/bridge.png';

const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const PostCard = ({post}) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/party/${post.id}`);
    };

    const imageUrl = post.path ? `/postImage/${post.path}` : defaultImage;

    return (
        <div className="post-card" onClick={handleCardClick}>
            <img src={imageUrl} alt={post.title} className="post-card__image"/>
            <div className="post-card__content">
                <h3 className="post-card__title">{truncateText(post.title, 15)}</h3>
                <p className="post-card__description">{truncateText(post.contents, 40)}</p>
            </div>
        </div>
    );
};

export default PostCard;