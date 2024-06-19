import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Main.css";
import cat from "../images/고양이.jpg";
import api from "../api";

// 검색창
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

// 해시태그(추천)
const Hashtags = ({ hashtags }) => {
    return (
        <div className="main__hashtags">
            {
                hashtags.map((tag) => (
                <div key = {tag.hashtag_id}>{tag.hashtag_name}</div>
            ))}
        </div>
    );
};

// 게시물 길이가 길면 ... 으로 표현
const cutContent = (content, maxLength) => {
    if (content.length <= maxLength) {
        return content;
    }
    return content.substring(0, maxLength) + '...';
};

// 게시물
const Posts = ({ posts = [], title }) => {
    const navigate = useNavigate();
    // 게시물 클릭 이벤트
    const handlePostClick = (postId) => {
        navigate('/party', { state: { postId } }); // 'party'페이지에 객체 postId 값을 전달
    };
    // 게시물이 한 개도 없을 때 출력 메시지
    if (posts.length === 0) {
        return <div className="main__posts-empty">게시물이 없습니다.</div>;
    }

    return (
        <div className="main__posts">
            <h2 className="main__posts-title">{title}</h2>
            {
                posts.map((post) => (
                <div key={post.id} className="main__post" onClick={() => handlePostClick(post.id)}>
                    {/*조건문을 포스트에 이미지가 없으면 기본 이미지 설정할것 */}
                    <img src={cat} alt="default" className="main__post-default" />
                    <div className="main__post-content">
                        <div className="main__post-id">번호: {post.id}</div>
                        <div className="main__post-title">제목: {cutContent(post.title, 8)}</div>
                        <div className="main__post-content">내용: {cutContent(post.contents, 30)}</div>
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
    const [allPosts, setAllPosts] = useState([]);
    const [hashtags, setHashtags] = useState([]);
    const [page] = useState(1);
    const [size] = useState(100);

    const navigate = useNavigate();


    const fetchPosts = async (loginStatus) => {
        try {
            // 전체 게시물
            const allPostsResponse = await api.get(`/posts?page=${page}&size=${size}`, {withCredentials: true});
            const allPostResponses = allPostsResponse.data.no_login_posts_responses.content;

            let PostResponses = [];
            let hashtagDtoList = [];

            // 로그인 되었을때, 해시태그 추천 게시물
            if (loginStatus) {
                const hashtagPostsResponse = await api.get(`/posts/login?page=${page}&size=${size}`, {withCredentials: true });
                PostResponses = hashtagPostsResponse.data.login_posts_responses.content;
                hashtagDtoList = hashtagPostsResponse.data.hashtag_dto_list || [];
            } else {
                hashtagDtoList = allPostsResponse.data.hashtag_dto_list || [];
            }
            setPosts(PostResponses);
            setAllPosts(allPostResponses);
            setHashtags(hashtagDtoList);
        } catch (error) {
            console.error('게시물 에러:', error);
        }
    };

    useEffect(() => {
        if (isLogin !== null) {
            console.log(`isLogin 상태: ${isLogin}`); //나중에 지울것
            fetchPosts(isLogin);
        }
    }, [isLogin]);

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
                    {isLogin && (
                        <div className="main__hashtags-posts">
                            <Posts posts={posts} title="추천 게시물" />
                        </div>
                    )}
                    <div className="main__allposts">
                        <Posts posts={allPosts} title="전체 게시물" />
                        <button onClick={handleNewPost} className="main__newpost-button">글 작성</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
