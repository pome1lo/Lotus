function Publisher({ avatar, nickname, info }) {
    return (
        <div className="d-flex align-items-center user">
            <div className="img-container">
                <img src={avatar} alt="Ваше изображение"/>
            </div>
            <div className="m-3">
                <span className="nickname">{nickname}</span>
                <span className="date"><br/>{info}</span>
            </div>
        </div>
    );
}

export default Publisher;