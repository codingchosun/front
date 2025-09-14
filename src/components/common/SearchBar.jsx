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

        navigate(`/search?query=${searchTerm}`);
    };

    return (
        <form className="search-bar" onSubmit={handleSearch}>
            <input
                type="text"
                className="search-bar__input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="관심 있는 모임을 검색해보세요..."
            />
            <button type="submit" className="search-bar__button">
                검색
            </button>
        </form>
    );
};

export default SearchBar;