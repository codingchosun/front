import "./Button.css"

// 버튼 컴포넌트 ( 버튼의 이름, 버튼의 속성, 클릭이벤트 )
const Button = ({text, type, onClick}) => {

    return (
        <button
            onClick={onClick}
            className={`Button Button_${type}`}
        >
            {text}
        </button>
    );
}

export default Button;