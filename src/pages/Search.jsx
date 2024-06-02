import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import "./Search.css";
import cat from "../images/고양이.jpg";

const Search = () => {
    const location = useLocation();
    const { searchTerm } = location.state || {};
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // const fetchSearchResults = async () => {
        //     try {
        //         const response = await axios.get(`http://localhost:8090/posts/search?query=${searchTerm}`, { withCredentials: true });
        //         setPosts(response.data);
        //     } catch (error) {
        //         console.error('검색 결과 에러:', error);
        //     }
        // };
        //
        // if (searchTerm) {
        //     fetchSearchResults();
        // }
    }, [searchTerm]);

    if (!searchTerm) {
        return <div className="search__empty">검색어를 입력하세요.</div>;
    }

    if (posts.length === 0) {
        return <div className="search__empty">검색 결과가 없습니다.</div>;
    }

    return (
        <div className="search">
            <h1>검색 결과</h1>
            <div className="search__posts">
                {posts.map((post) => (
                    <div key={post.id} className="search__post">
                        {post.path ? (
                            <img src={`http://localhost:8090${post.path}`} alt="post" className="search__post-default" />
                        ) : (
                            <img src={cat} alt="default" className="search__post-default" />
                        )}
                        <div className="search__post-content">
                            <div className="search__post-id"># {post.id}</div>
                            <div className="search__post-title">제목: {post.title}</div>
                            <div className="search__post-content">내용: {post.contents}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;
