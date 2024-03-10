import "../../assets/css/Profile.css";
import Avatar from "../../assets/images/content/test_Avatar.png";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Post} from "./Post";

const Profile = () => {
    const {userName} = useParams();

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch(`https://localhost:api/users/getuser/${userName}`)
            .then(res => res.json())
            .then(data => setPosts(data))
    });

    return (
        <div className="col-md-10">
            <div className="bg-cover p-5 mb-4 bg-body-tertiary rounded-3">
                <div className="d-flex ava">
                    <div className="img-container profile-ava">
                        <img src={Avatar} alt="Ваше изображение"/>
                    </div>
                    <h1 className="display-4">{userName}</h1>
                </div>
            </div>

            {
                posts.map(post => (
                    <Post
                        avatar={post.avatar}
                        nickname={post.nickname}
                        info={post.date}
                        content={post.content}
                        text={post.text}
                        likes={post.likes}
                    />
                ))
            }

        </div>
    );
}

export {Profile};