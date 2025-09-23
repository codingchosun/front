import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import PostCard from '../../components/common/PostCard'
import SearchBar from '../../components/common/SearchBar';
import api from "../../api/api";
import "./PostSearch.css";

const PostSearch = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (query) {
            const fetchSearchResults = async () => {
                setIsLoading(true);
                try {
                    const searchPostResponse = await api.get(`/api/posts/search?search=${encodeURIComponent(query)}`);

                    if (searchPostResponse.data.success) {
                        setResults(searchPostResponse.data.body.content || []);
                    }
                } catch (error) {
                    console.error('검색 결과 로딩 실패:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchSearchResults();
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <div className="search-page-container">
            <div className="search-header">
                <h1>검색 결과</h1>
                <SearchBar/>
            </div>

            {isLoading ? (
                <p>검색 중...</p>
            ) : (
                query && (
                    <div className="results-container">
                        {results.length > 0 ? (
                            <div className="posts-grid">
                                {results.map(post => (
                                    <PostCard key={post.postId} post={post}/>
                                ))}
                            </div>
                        ) : (
                            <p className="no-results-message">"{query}"에 대한 검색 결과가 없습니다.</p>
                        )}
                    </div>
                )
            )}
        </div>
    );
};

export default PostSearch;
