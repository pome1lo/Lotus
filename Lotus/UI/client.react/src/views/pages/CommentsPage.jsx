import {Comment} from "../components/Comment";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {customFetch} from "../../services/fetchWithAuth/customFetch";
import {ErrorMessage} from "../components/ErrorMessage";
import io from "socket.io-client";

const socket = io('https://localhost:31902', { withCredentials: true });

const CommentsPage = () => {
    const {username, post_id} = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState(null);
    const [user, setUser] = useState(null);
    const [currentUser, setCurrentUser]= useState(null);
    const [inputComment, setComment] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    useEffect(() => {
        customFetch(`/api/profile/${username}`)
            .then(response => {
                if (response) {
                    response.json().then(data => {
                        setUser(data.user);
                    });
                }
            });
        customFetch(`/api/profile/${sessionStorage.getItem('username')}`)
            .then(response => {
                if (response) {
                    response.json().then(data => {
                        setCurrentUser(data.user);
                    });
                }
            });
        customFetch(`/api/profile/${username}/${post_id}`)
            .then(response => {
                if (response) {
                    response.json().then(data => {
                        setPost(data);
                    });
                }
            });
        customFetch(`/api/profile/${username}/${post_id}/comments`)
            .then(response => {
                if (response) {
                    response.json().then(data => {
                        setComments(data.comments);
                    });
                }
            });
    }, [username, post_id, navigate]);

    async function sendComment() {
        const response = await customFetch(`/api/profile/${username}/${post_id}/comment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                comment_text: inputComment,
                picture: currentUser.PROFILE_PICTURE,
                com_username: sessionStorage.getItem('username')
            })
        });
        const data = await response.json();
        if (!response.ok) {
            setErrorMessage(data.message);
            setShowError(true);
            return;
        }
        if (response.ok) {
            window.location.reload();

            const data = {
                post_username: user.USERNAME,
                comment_username: currentUser.USERNAME,
                user_id: user.ID,
                profile_picture: currentUser.PROFILE_PICTURE
            }

            socket.emit('comment', data);
        } else {
            setErrorMessage(data.message);
            setShowError(true);
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
                                        <p className="content-text small" >{post.PUBLISHED_AT}</p>
                                    </div>
                                </div>
                                <p className="content-text" style={{fontFamily: "Calibri"}}>{post.CONTENT}</p>
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
                                <Comment key={item.ID}
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
                    {currentUser && <img src={currentUser.PROFILE_PICTURE} alt="alt"
                                  className="mr-2 border-radius" width="100" height="100"/>}
                    <div className="w-100">
                        {currentUser && <label htmlFor="firstName" className="form-label fw-bolder">{currentUser.USERNAME}</label>}
                        <textarea className="form-control" id="firstName"
                                  value={inputComment} onChange={(e) => setComment(e.target.value)}
                                  placeholder="Write some comment..." required=""/>
                        <div className="d-flex justify-content-end mt-2">
                            <button type="button" className="btn btn-danger" onClick={sendComment}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ErrorMessage message={errorMessage} isVisible={showError} />
        </>
    )
}

export {CommentsPage};