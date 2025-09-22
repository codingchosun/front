import React from 'react';
import {useNavigate} from 'react-router-dom';
import './PostCard.css';
import defaultImage from '../../assets/images/bridge.png';

const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength - 1)}...` : text;
};

const PostCard = ({post}) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        if (post?.id) {
            navigate(`/party/${post.id}`);
        }
    };

    const imageUrl = post?.path ? `/images/${post.path}` : defaultImage;

    return (
        <div className="post-card" onClick={handleCardClick}>
            <div className="post-card-image-wrapper">
                <img
                    src={imageUrl || defaultImage}
                    alt={post?.title}
                    className="post-card-image"
                />
            </div>

            <div className="post-card-content">
                <h3 className="post-card-title">{truncateText(post?.title, 20)}</h3>
                <p className="post-card-description">{truncateText(post?.contents, 40)}</p>
            </div>
        </div>
    );
};

export default PostCard;