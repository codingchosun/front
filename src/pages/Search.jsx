// 검색 페이지
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./Search.css";
import Header from "./Header";

const Search = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState(location.state?.searchTerm || '');
    const [posts, setPosts] = useState([]);
    const [sortOrder, setSortOrder] = useState('latest');

    useEffect(() => {
        // Fetch posts from backend based on searchTerm
        fetchPosts();
    }, [searchTerm, sortOrder]);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`http://localhost:8090/api/posts?search=${searchTerm}&sort=${sortOrder}`);
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPosts();
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    return (
        <div>
            <Header />
            <div className="search-container">
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        valued={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="검색어를 입력하세요"
                    />
                    <button type="submit">검색</button>
                </form>
                <select value={sortOrder} onChange={handleSortChange}>
                    <option value="latest">최신순</option>
                    <option value="date">날짜순</option>
                </select>
                <div className="posts">
                    {posts.map(post => (
                        <div key={post.id} className="post">
                            <img src={post.image} alt={post.title} />
                            <div className="post-content">
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                                <p>{post.date}</p>
                                <div className="hashtags">
                                    {post.hashtags.map((tag, index) => (
                                        <span key={index}>#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Search;
