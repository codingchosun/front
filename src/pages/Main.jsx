import React,{ useState } from 'react';
import { Link, useNavigate} from "react-router-dom";
import { useAuth } from "./AuthContext";
import "./Main.css";
import Header from "./Header";
import logo from "../images/로고.png";
import imgGame from "../images/게임.jpg";
import imgCat from "../images/고양이.jpg";
import imgHealth from "../images/헬스.jpg";
import imgBoardgame from "../images/보드게임.jpg";


const SearchBar = ({handleSearch, searchMeeting, setSearchMeeting }) => {
    return (
        <div className="searchBar">
        <input
            type="text"
            value={searchMeeting}
            onChange={(e)=>setSearchMeeting(e.target.value)}
            placeholder="검색어를 입력하세요"
        />
        <button onClick={ () => handleSearch(searchMeeting)}>검색</button>
        </div>
    );
};

//해쉬태그창
const Hashtags=({hashtag}) => {
    return(
        <div className="hashtags">
        { hashtag.map(tag => (
                <div key={tag}>#{tag}</div>
        ))}
        </div>
    );
};

//게시물
const Posts=({posts=[] }) =>{
    return (
        <div className="posts">
        {posts.map(post =>(
            <div
                key={post.id}
                className="post"
            >
                <img src={post.image} alt={post.content} />
                <p>{post.content}</p>
            </div>
        ))}
        </div>
    );
};
const Main = () => {
    const {isLogin} = useAuth();
    const navigate=useNavigate();
    const [searchMeeting, setSearchMeeting]=useState('');

    const handleSerch = (e) => {
    console.log("검색내용: ",e);
    };
    const hashtag=['해쉬태그1','해쉬태그2','해쉬태그3'];
    const posts=[{
    id:1,
    image: imgGame,
    content: '게시물 내용1'
    },{
    id:2,
    image:imgCat,
    content: '게시물 내용2'
    },{
        id:3,
        image:imgHealth,
        content: '게시물 내용3'
    },{
    id:4,
    image:imgBoardgame,
    content: '게시물 내용4'
}];

    return (
        <div>
            <Header/>
                <div className="mainpages">
                {isLogin ? (
                    <>
                    <SearchBar
                        handleSearch={handleSerch}
                        searchMeeting={searchMeeting}
                        setSearchMeeting={setSearchMeeting}
                    />
                        <Hashtags hashtag={hashtag}/>
                        <Posts posts={posts}/>
                    </>
                ) : (
                    <div className="loginCondition">
                        <h1>로그인이 필요합니다</h1>
                        <Link to="/login">
                            <button>로그인 페이지 이동 </button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Main;
