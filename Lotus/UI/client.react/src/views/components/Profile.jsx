import "../../assets/css/Profile.css";
import {useParams, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Post} from "./Post";

const Profile = () => {
    const [posts, setPosts] = useState([]);
    const {userName} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:31003/api/getProfile?userName=${userName}`)
            .then(res => {
                if (!res.ok && res.status === 404) {
                    navigate('/not-found');
                }
                return res.json();
            })
            .then(data => setPosts(data))
    }, [userName, navigate]);

    return (
        <div className="col-md-10">
            <div className="bg-cover p-5 mb-4 bg-body-tertiary rounded-3">
                <div className="d-flex ava">
                    <div className="img-container profile-ava">
                        <img src="" alt="avatar"/>
                    </div>
                    <h1 className="display-4">{userName}</h1>
                </div>
            </div>

            {/*{*/}
            {/*    posts.map(post => (*/}
            {/*        <Post*/}
            {/*            avatar={post.avatar}*/}
            {/*            nickname={post.nickname}*/}
            {/*            info={post.date}*/}
            {/*            content={post.content}*/}
            {/*            text={post.text}*/}
            {/*            likes={post.likes}*/}
            {/*        />*/}
            {/*    ))*/}
            {/*}*/}

        </div>
    );
}

export {Profile};
