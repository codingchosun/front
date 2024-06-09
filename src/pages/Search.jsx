import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import "./Search.css";
import cat from "../images/고양이.jpg";
import api from "../api";
const cutContent = (content, maxLength) => {
    if (content.length <= maxLength) {
        return content;
    }
    return content.substring(0, maxLength) + '...';
};

const encodeHash = (searchTerm) => {
    return searchTerm.replace(/#/g, '%23');
};

const Search = () => {
    const location = useLocation();
    const { searchTerm } = location.state || {};
    const [posts, setPosts] = useState([]);
    const [page]=useState(1);
    const [size]=useState(2);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const encodedSearchTerm = encodeHash(searchTerm);
                const response = await api.get(`/posts/research?researchQuery=${encodedSearchTerm}&page=${page}&size=${size}`,{
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                const searchResults = response.data.content;

                setPosts(searchResults);
            } catch (error) {
                console.error('검색 결과 에러:', error);
            }
        };

        if (searchTerm) {
            fetchSearchResults();
        }
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
                            <img src={`${post.path}`} alt="post" className="search__post-default" />
                        ) : (
                            <img src={cat} alt="default" className="search__post-default" />
                        )}
                        <div className="search__post-content">
                            <div className="search__post-id">번호: {post.id}</div>
                            <div className="search__post-title">제목: {cutContent(post.title, 20)}</div>
                            <div className="search__post-content">내용: {cutContent(post.contents, 100)}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Search;
