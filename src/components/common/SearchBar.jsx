import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();

        if (!searchTerm.trim()) {
            alert('검색어를 입력해주세요.');
            return;
        }

        navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
    };

    return (
        <form className="search-bar" onSubmit={handleSearch}>
            <input
                type="text"
                className="search-bar__input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="해시태그 또는 게시글 제목으로 검색하세요!(예: #러닝, 운동)"
            />
            <button type="submit" className="search-bar__button">
                검색
            </button>
        </form>
    );
};

export default SearchBar;