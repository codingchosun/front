// Main.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import "./Main.css";
import cat from "../images/고양이.jpg";
import api from "../api"
const SearchBar = ({ searchMeeting, setSearchMeeting }) => {
    const navigate = useNavigate();

    const handleSearch = () => {
        navigate('/search', { state: { searchTerm: searchMeeting } });
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

const Hashtags = ({ hashtags }) => {
    return (
        <div className="main__hashtags">
            {hashtags.map((tag) => (
                <div key={tag.hashtag_id}>{tag.hashtag_name}</div>
            ))}
        </div>
    );
};

const cutContent=(content, maxLength) => {
    if ( content.length <= maxLength){
        return content;
    }
    return content.substring(0,maxLength)+'...';
};

const Posts = ({ posts = [], title }) => {
    const navigate = useNavigate();
    const handlePostClick = (postId) => {
        navigate('/party', { state: { postId } });
    };

    if (posts.length === 0) {
        return <div className="main__posts-empty">게시물이 없습니다.</div>;
    }

    return (
        <div className="main__posts">
            <h2 className="main__posts-title">{title}</h2>
            { posts.map((post) => (
                <div key={post.id} className="main__post" onClick={() => handlePostClick(post.id)}>
                    <img src={cat} alt="default" className="main__post-default" />

                    <div className="main__post-content">
                        <div className="main__post-id">번호: {post.id}</div>
                        <div className="main__post-title">제목: {cutContent(post.title,8)}</div>
                        <div className="main__post-content">내용: {cutContent(post.contents,30)}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Main = () => {
    const { isLogin, userId } = useAuth();
    const [searchMeeting, setSearchMeeting] = useState('');
    const [posts, setPosts] = useState([]);
    const [allPosts, setAllPosts]=useState([]);
    const [hashtags, setHashtags] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);

    const navigate = useNavigate();
    const location = useLocation();

    const fetchPosts = async () => {
        try {
            let allPostsUrl = `/posts?page=${page}&size=${size}`;
            console.log(`모든 게시물 URL: ${allPostsUrl}`);
            let allPostsResponse = await api.get(allPostsUrl, {
                withCredentials: true
            });

            let allPostResponses = allPostsResponse.data.no_login_posts_responses.content;

            let PostResponses = [];
            let hashtagDtoList = [];

            if (isLogin) {
                let PostsUrl = `/posts/login?page=${page}&size=${size}`;
                console.log(`유저 게시물 URL: ${PostsUrl}`);
                let taggedPostsResponse = await api.get(PostsUrl, {
                    withCredentials: true
                });

                console.log('로그인후 받는 데이터들:', taggedPostsResponse.data.login_posts_responses);
                PostResponses = taggedPostsResponse.data.login_posts_responses.content;
                hashtagDtoList = taggedPostsResponse.data.hashtag_dto_list || [];
            } else {
                hashtagDtoList = allPostsResponse.data.hashtag_dto_list || [];
            }

            console.log('해시태그:', hashtagDtoList);

            setPosts(PostResponses);
            setAllPosts(allPostResponses);
            setHashtags(hashtagDtoList);

        } catch (error) {
            console.error('게시물 에러:', error);
        }
    };

    useEffect(() => {
        console.log('로그인 여부:', isLogin);
        console.log('location.state:', location.state);
        console.log('아이디:', userId);

        fetchPosts();

        if (location.state && location.state.newPostId) {
            fetchPosts();
            window.history.replaceState({}, document.title);
        }
    }, [isLogin, location.state, userId, page, size]);

    const handleNewPost = () => {
        navigate('/newpost');
    };

    return (
        <div className="main">
            <div className="main-page">
                <SearchBar
                    searchMeeting={searchMeeting}
                    setSearchMeeting={setSearchMeeting}
                />
                <Hashtags hashtags={hashtags} />

                <div className="main__posts-container">
                    { isLogin && (
                        <div className="main__hashtags-posts">
                            <Posts posts={posts} title="추천 게시물" />
                        </div>
                    )}
                    <div className="main__allposts">
                        <Posts posts={allPosts} title="전체 게시물"/>
                        <button onClick={handleNewPost} className="main__newpost-button">글 작성</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;