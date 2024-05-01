import {Comment} from "../components/Comment";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Post} from "../components/Post";

const CommentsPage = () => {
    const {username, postid} = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState(null);
    const [user, setUser] = useState(null);
    const [inputComment, setComment] = useState('');
    const [currentUsername, setCurrentUsername] = useState(sessionStorage.getItem('username'));
    const [currentUserId, setCurrentId] = useState(sessionStorage.getItem('user_id'));
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://localhost:31903/api/profile/${username}/${postid}`)
            .then(res => {
                if (!res.ok && res.status === 404) {
                    navigate('/not-found');
                }
                return res.json();
            })
            .then(data => setPost(data));
    }, [username, postid, navigate]);

    useEffect(() => {
        fetch(`https://localhost:31903/api/profile/${username}/${postid}/comments`)
            .then(res => {
                if (!res.ok && res.status === 404) {
                    navigate('/not-found');
                }
                return res.json();
            })
            .then(data => setComments(data));
    }, [username, postid, navigate]);

    useEffect(() => {
        fetch(`https://localhost:31903/api/profile/${currentUsername}`)
            .then(res => {
                if (!res.ok && res.status === 404) {
                    navigate('/not-found');
                }
                return res.json();
            })
            .then(data => { setUser(data.user); })
    }, [username, navigate]);

    async function sendComment() {
        const response = await fetch(`https://localhost:31903/api/profile/${username}/${postid}/comments/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: currentUserId,
                comment_username: currentUsername,
                comment_text: inputComment,
                picture: user.PROFILE_PICTURE
            })
        });
        const data = await response.json();
        if (!response.ok) {
            console.log(data.message);
            return;
        }
        if (response.ok) {
            window.location.reload();
        } else {
            console.error('Error:', data.message);
        }
    }


    return(
        <>
            <div className="col-md-8 order-md-2 my-3 p-3 rounded shadow-sm">
                {post &&
                    <>
                        <div
                            className="d-flex align-items-center text-muted  p-3 my-3 text-white bg-purple rounded shadow-sm">
                            <div className="lh-1">
                                <div className="d-flex">
                                    <img className="me-3 border-radius-small"
                                         src={"https://localhost:31903/" + post.IMAGE} alt="" width="48" height="48"/>
                                    <div>
                                        <h1 className="h6 mb-0 text-white lh-1 mb-2">{post.TITLE}</h1>
                                        <p className="content-text small">{post.PUBLISHED_AT}</p>
                                    </div>
                                </div>
                                <p className="content-text">{post.CONTENT}</p>
                            </div>
                        </div>
                    </>
                }
                <h6 className="border-bottom pb-2 mb-0">Recent comments</h6>
                {(comments === null) ?
                    <span className="spinner-border spinner-border-sm resize" role="status"
                          aria-hidden="true"></span>
                    : (
                        comments.length > 0 ? (
                            (comments.sort((a, b) => b.ID - a.ID).map(item => (
                                <Comment
                                    username={item.USERNAME}
                                    text={item.COMMENT}
                                    date={item.CREATED_AT}
                                    user_picture={item.USER_PICTURE}
                                />
                            )))) : (
                            <div  className="d-flex align-items-center justify-content-center text-center p-4 m-5">
                                <h4 className="p-4 m-5">There are no comments under this post yet. Be the first! 👽</h4>
                            </div>

                        )
                    )
                }

                <hr className="mt-4"/>

                <div className="d-flex align-items-start mt-4">
                    {user && <img src={user.PROFILE_PICTURE} alt="alt"
                         className="mr-2 border-radius-medium" width="100" height="100"/>}
                    <div className="w-100">
                        <label htmlFor="firstName" className="form-label">{currentUsername}</label>
                        <textarea className="form-control" id="firstName"
                                  value={inputComment} onChange={(e) => setComment(e.target.value)}
                                  placeholder="Write some comment..." required=""/>
                        <div className="d-flex justify-content-end mt-2">
                            <button type="button" className="btn btn-danger" onClick={sendComment} >
                                Send
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export {CommentsPage};