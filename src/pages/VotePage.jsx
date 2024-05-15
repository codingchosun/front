//매너점수 투표 페이지
import React from 'react';
import {useState} from "react";

const VotoPage=({currentUser}) =>{
    //참가자 목록, 초기점수 설정
    const [vote, setVote]=useState({
        'user1' : 0,
        'user2' : 0,
        'user3' : 0
    });

    // 선택된 점수 관리
    const [selectedScore, setSelectedScore] = useState({
        'user1' : 0,
        'user2' : 0,
        'user3' : 0
    });

    delete vote[currentUser]; //자기자신은 투표에서 제외

    // 점수 선택
    const handleScoreChange=(user, score) => {
        setSelectedScore(prevScore => ({
            ...prevScore,
            [user]:score
        }));
    };

    //투표 제출
    const submitVote=()=>{
        const updatedVote=Object.keys(selectedScore).reduce((i, user) => {
            i[user] = vote[user] + Number(selectedScore[user]);
            return i;
        }, {...vote});
    };

    return(
        <div>
            {Object.keys(vote).map(user => (
                <div key={user}>
                    <lable>{user}</lable>
                    <select
                        value={selectedScore[user]}
                        onChange={(e) => handleScoreChange(user, e.target.value)}
                    >
                        <option value="2">+2</option>
                        <option value="1">+1</option>
                        <option value="-1">-1</option>
                        <option value="-2">-2</option>
                    </select>
                </div>
            ))};
            <button onClick={submitVote}>평가</button>
        </div>
    );
};

export default VotoPage;
