// 메인페이지
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import "./Main.css";
import cat from "../images/고양이.jpg";

const SearchBar = ({ searchMeeting, setSearchMeeting }) => {
    const navigate=useNavigate();

    const handleSearch = () => {
        navigate('/search', { state: { searchTerm: searchMeeting } });
    }
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

const Posts = ({ posts=[] }) => {
    const navigate=useNavigate();
    const handlePostClick = (postId) => {
        navigate('/party', { state: { postId } });
    };

    if (posts.length === 0) {
        return <div className="main__posts-empty">게시물이 없습니다.</div>;
    }

    return (
        <div className="main__posts">
            {posts.map((post) => (
                <div key={post.id} className="main__post" onClick={()=>handlePostClick(post.id)}>
                    {post.imageUrls && post.imageUrls.length > 0  ? (
                        <img src={`http://localhost:8090${post.imageUrls[0]}`} alt="post" className="main__post-default" />
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
    const { isLogin, userId } = useAuth();
    const [searchMeeting, setSearchMeeting] = useState('');
    const [posts, setPosts] = useState([]);
    const [hashtags, setHashtags] = useState([]);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);

    const navigate = useNavigate();
    const location = useLocation();

    const fetchPosts = async () => {
        try {
            const url = isLogin ? `http://localhost:8090/posts/login?page=${page}&size=${size}`
                : `http://localhost:8090/posts`;
            const response = await axios.get(url, {
                withCredentials: true
            });

            console.log('Response data:', response.data);

            let postResponses = [];

            if (isLogin) {
                console.log('Logged in post responses:', response.data.login_posts_responses);
                if (response.data.login_posts_responses && response.data.login_posts_responses.content) {
                    postResponses = response.data.login_posts_responses.content;
                }
            } else {
                console.log('Not logged in post responses:', response.data.no_login_posts_responses);
                if (response.data.no_login_posts_responses && response.data.no_login_posts_responses.content) {
                    postResponses = response.data.no_login_posts_responses.content;
                }
            }

            const hashtagDtoList = response.data.hashtag_dto_list || [];

            const postsWithImages = await Promise.all(postResponses.map(async (post) => {
                try {
                    const imageResponse = await axios.get(`http://localhost:8090/posts/${post.id}/images`, {
                        withCredentials: true
                    });
                    const imageUrls = imageResponse.data.paged_image_response_list.content.map(img => img.url);
                    return { ...post, imageUrls };
                } catch (error) {
                    console.error('이미지 가져오기 에러:', error);
                    return post;
                }
            }));

            console.log('게시물 내용:', postResponses);
            console.log('해시태그:', hashtagDtoList);

            setPosts(postResponses);
            setHashtags(hashtagDtoList);
        } catch (error) {
            console.error('게시물 에러:', error);
        }
    };

    useEffect(() => {
        console.log('isLogin:', isLogin);
        console.log('location.state:', location.state);
        console.log('userId:', userId);

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
                    <button onClick={handleNewPost} className="main__newpost-button">글 작성</button>
                    <Posts posts={posts} />
            </div>
        </div>
    );
};

export default Main;
