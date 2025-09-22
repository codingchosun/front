import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import "./Search.css";

import api from "../../api/api";

// 검색창
const SearchBar = ({searchMeeting, setSearchMeeting}) => {
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate('/search', {state: {searchTerm: searchMeeting}});
    };
    return (
        <div className="main__search-bar">
            <input
                type="text"
                value={searchMeeting}
                onChange={(e) => setSearchMeeting(e.target.value)}
                placeholder="검색어를 입력하세요"
            />
            <button onClick={handleSearch}>검색</button>
        </div>
    );
};

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
    const navigate = useNavigate();
    const {searchTerm} = location.state || {};
    const [posts, setPosts] = useState([]);
    const [page] = useState(1);
    const [size] = useState(2);
    const [searchMeeting, setSearchMeeting] = useState('');

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const encodedSearchTerm = encodeHash(searchTerm);
                const response = await api.get(`/posts/search?searchQuery=${encodedSearchTerm}&page=${page}&size=${size}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                const searchResults = response.data.content;
                console.log(searchResults);
                setPosts(searchResults);
            } catch (error) {
                console.error('검색 결과 에러:', error);
            }
        };

        if (searchTerm) {
            fetchSearchResults();
        }
    }, [searchTerm]);

    const handlePostClick = (postId) => {
        navigate('/party', {state: {postId}});
    };

    return (
        <div className="search">
            <div>
                <SearchBar
                    searchMeeting={searchMeeting}
                    setSearchMeeting={setSearchMeeting}
                />
            </div>
            <h1>검색 결과</h1>
            {searchTerm ? (
                posts.length > 0 ? (
                    <div className="search__posts">
                        {
                            posts.map((post) => (
                                <div key={post.id} className="search__post" onClick={() => handlePostClick(post.id)}>
                                    post.path ? (
                                        <img src={`${process.env.PUBLIC_URL}/postImage/${post.path}`} alt={post.title}
                                             className="main__post-thumbnail"/>
                                    )
                                    <div className="search__post-content">
                                        <div className="search__post-id">번호: {post.id}</div>
                                        <div className="search__post-title">제목: {cutContent(post.title, 8)}</div>
                                        <div className="search__post-content">내용: {cutContent(post.contents, 30)}</div>
                                    </div>
                                </div>
                            ))}
                    </div>
                ) : (
                    <div className="search__empty">검색 결과가 없습니다.</div>
                )
            ) : (
                <div className="search__empty">검색어를 입력하세요.</div>
            )}
        </div>
    );
};

export default Search;
