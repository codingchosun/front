// 메인페이지
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import "./Main.css";
import cat from "../images/고양이.jpg";

const SearchBar = ({ handleSearch, searchMeeting, setSearchMeeting }) => {
    return (
        <div className="main__search-bar">
            <input
                type="text"
                value={searchMeeting}
                onChange={(e) => setSearchMeeting(e.target.value)}
                placeholder="검색어를 입력하세요"
            />
            <button onClick={() => handleSearch(searchMeeting)}>검색</button>
        </div>
    );
};

const Hashtags = ({ hashtags }) => {
    return (
        <div className="main__hashtags">
            {hashtags.map((tag) => (
                <div key={tag.hashtag_id}>{tag.hashtag_name}</div>
            ))}
        </div>
    );
};

const Posts = ({ posts }) => {
    console.log('게시물:', posts);

    if (posts.length === 0) {
        return <div className="main__posts-empty">게시물이 없습니다.</div>;
    }

    return (
        <div className="main__posts">
            {posts.map((post) => (
                <div key={post.id} className="main__post">
                    {post.path ? (
                        <img src={`http://localhost:8090${post.path}`} alt="post" className="main__post-default" />
                    ) : (
                        <img src={cat} alt="default" className="main__post-default" />
                    )}
                    <div className="main__post-content">
                        <div className="main__post-id"># {post.id}</div>
                        <div className="main__post-title">제목: {post.title}</div>
                        <div className="main__post-content">내용: {post.contents}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Main = () => {
    const { isLogin } = useAuth();
    const [searchMeeting, setSearchMeeting] = useState('');
    const [posts, setPosts] = useState([]);
    const [hashtags, setHashtags] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();

    const fetchPosts = async () => {
        try {
            const url = isLogin
                ? `http://localhost:8090/posts/login?page=1&size=5`
                : `http://localhost:8090/posts?page=1&size=5`;
            const response = await axios.get(url, {
                withCredentials: true
            });

            console.log('Response data:', response.data);

            const postResponses = isLogin
                ? response.data.login_posts_responses
                : response.data.no_login_posts_responses;
            const hashtagDtoList = response.data.hashtag_dto_list;

            console.log('게시물 내용:', postResponses.content);
            console.log('해시태그:', hashtagDtoList);

            setPosts(postResponses.content);
            setHashtags(hashtagDtoList);
        } catch (error) {
            console.error('게시물 에러:', error);
        }
    };

    useEffect(() => {
        console.log('isLogin:', isLogin);
        console.log('location.state:', location.state);
        fetchPosts();

        if (location.state && location.state.newPostId) {
            fetchPosts();
            window.history.replaceState({}, document.title); // Clear the state
        }
    }, [isLogin, location.state]);

    const handleSearch = (searchTerm) => {
        console.log("검색내용: ", searchTerm);
    };

    const handleNewPost = () => {
        navigate('/newpost');
    };

    return (
        <div className="main">
            <div className="main-page">
                <SearchBar
                    handleSearch={handleSearch}
                    searchMeeting={searchMeeting}
                    setSearchMeeting={setSearchMeeting}
                />
                    <Hashtags hashtags={hashtags} />
                    <button onClick={handleNewPost} className="main__newpost-button">글 작성</button>
                    <Posts posts={posts} />
            </div>
        </div>
    );
};

export default Main;
