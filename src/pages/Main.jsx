import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Main.css";
import bridge from "../images/bridge.png";
import api from "../api";

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
                placeholder="검색어를 입력하세요" />
            <button onClick={handleSearch}>검색</button>
        </div>
    );
};

const Hashtags = ({ hashtags }) => {
    const navigate=useNavigate();

    return (
        <div className="main__hashtags"> {
            hashtags.map((tag) => (
            <div key = {tag.hashtag_id}>
                {tag.hashtag_name}
            </div> ))}
        </div>
    );
};

const cutContent = (content, maxLength) => {
    if (content.length <= maxLength) {
        return content; }
    return content.substring(0, maxLength) + '...';
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
            {
                posts.map((post) => (
                <div key={post.id} className="main__post" onClick={() => handlePostClick(post.id)}>
                    { post.path ? (
                        <img src={`${process.env.PUBLIC_URL}/postImage/${post.path}`} alt={post.title} className="main__post-thumbnail"/>
                        ) : (
                        < img src={bridge} alt="default" className="main__post-default"/>
                        )
                    }
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
    const [page, setPage] = useState(1);
    const size=50;

    const navigate = useNavigate();

    const fetchPosts = async (loginStatus, page=1) => {
        try {
            const allPostsResponse = await api.get(`/posts?page=${page}&size=${size}`, {withCredentials: true});
            const allPostResponses = allPostsResponse.data.no_login_posts_responses.content;

            let postResponses = [];
            let hashtagDtoList = [];

            if (loginStatus) {
                const hashtagPostsResponse = await api.get(`/posts/login?page=${page}&size=${size}`, {withCredentials: true });
                postResponses = hashtagPostsResponse.data.login_posts_responses.content;
                hashtagDtoList = hashtagPostsResponse.data.hashtag_dto_list || [];
            } else {
                hashtagDtoList = allPostsResponse.data.hashtag_dto_list || [];
            }

            setPosts(postResponses);
            setAllPosts(allPostResponses);
            setHashtags(hashtagDtoList);

        } catch (error) {
            console.error('게시물 에러:', error);
            alert(error);
        }
    };

    useEffect(() => {
        if (isLogin !== null) {
            console.log(`isLogin 상태: ${isLogin}`); //나중에 지울것
            fetchPosts(isLogin,page);
        }
    }, [isLogin],page);

    const handleNewPost = () => {
        if (isLogin) {
            navigate('/newpost');
        } else {
            alert('로그인을 해주세요');
        }
    };

    return (
        <div className="main">
            <div className="main-page">
                <SearchBar
                    searchMeeting={searchMeeting}
                    setSearchMeeting={setSearchMeeting} />
                <Hashtags hashtags={hashtags} />
                <div className="main__posts-container">
                    { isLogin && (
                        <div className="main__hashtags-posts">
                            <Posts posts={posts} title="[ 추천 게시물 ]" />
                        </div>
                    )}
                    <div className="main__allposts">
                        <Posts posts={allPosts} title="[ 전체 게시물 ]" />
                        <button onClick={handleNewPost} className="main__newpost-button">글 작성</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
