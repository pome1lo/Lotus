import {Link, useParams, useNavigate} from "react-router-dom";
import React, {useEffect, useRef, useState,} from "react";
import "../../assets/css/Profile.css";
import {SubscriptionButton} from "../components/SubscriptionButton";
import {Post} from "../components/Post";
import {fetchWithAuth} from "../../services/fetchWithAuth/fetchWithAuth";
import {ErrorMessage} from "../components/ErrorMessage";

const ProfilePage = () => {
    const {username} = useParams();
    const [user, setUser] = useState(null);
    const [isCurrentUserSubscribedToProfileUser, setIsCurrentUserSubscribedToProfileUser] = useState(null);
    const [posts, setPosts] = useState(null);
    const navigate = useNavigate();
    const fileInput = useRef();
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    const currentUsername = sessionStorage.getItem('username');

    const [inputHeading, setHeading] = useState('');
    const [inputContent, setContent] = useState('');
    const [inputDate, setDate] = useState('');

    useEffect(() => {
        fetchWithAuth(`https://localhost:31903/api/profile/${username}`)
            .then(response => {
                if (response) {
                    response.json().then(data => {
                        setUser(data.user);
                        setPosts(data.posts);
                        setIsCurrentUserSubscribedToProfileUser(data.isCurrentUserSubscribedToProfileUser);
                    });
                }
            })
    }, [username, navigate]);

    async function fetchData() {
        const file = fileInput.current.files[0];
        const formData = new FormData();
        formData.append('user_id', user.ID);
        formData.append('image', file);
        formData.append('title', inputHeading);
        formData.append('content', inputContent);

        try {
            const response = await fetchWithAuth('https://localhost:31903/api/post', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                console.error('Ошибка:', response.statusText);
                return;
            }

            const data = await response.json();
            console.log('OK:', data);
            navigate(`/profile/${username}`);
            window.location.reload();
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    return (
        <div className={`col-md-7 order-md-2`}>
            {user && (
                <>
                <div className="row">
                    <div className="col-md-4 text-center mb-4 d-flex align-items-center justify-content-center">
                        <img src={user.PROFILE_PICTURE} alt="" className="w-50 border-radius"/>
                    </div>
                    <div className="col-md-8 mb-4 d-flex align-items-center flex-wrap">
                        <div className="d-flex align-items-center w-100 justify-content-start">
                            <div className="mr-2">
                                <h1 className="fw-bold display-4">{user.USERNAME}</h1>
                            </div>
                            {(currentUsername === null || user.USERNAME !== currentUsername) ? (
                                <SubscriptionButton
                                    to_id={user.ID}
                                    initiallySubscribed={isCurrentUserSubscribedToProfileUser}
                                    styles={"m-lg-4 btn btn-outline-secondary d-inline-flex align-items-center"}/>
                            ) : (<></>)
                            }

                            <Link to={`/profile/${username}/edit`} className="mr-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                     className="bi bi-gear rotate hover-size" viewBox="0 0 16 16">
                                    <path
                                        d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                                    <path
                                        d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                                </svg>
                            </Link>
                        </div>
                        <div className="d-flex">
                            <h5 className="mr-2">{user.FIRSTNAME}</h5>
                            <h5>{user.LASTNAME}</h5>
                        </div>
                        <div className="d-flex align-items-center w-100">
                            <p className="mr-2">{posts === null ? "0" : posts.length} publications</p>
                            <p className="mr-2">{user.SUBSCRIBERS_COUNT} subscribers</p>
                            <p className="mr-2">{user.SUBSCRIPTIONS_COUNT} subscriptions</p>
                        </div>
                        <div>
                            {user.DESCRIPTION}
                        </div>
                    </div>
                </div>

                    <div className="d-flex align-items-center w-100 justify-content-between text-muted">
                    <div className="d-flex" >
                        {user && <img src={user.PROFILE_PICTURE} width="30px" className="mr-2 border-radius" alt={"content"}/>}
                        <p className="m-auto">What's new with you?</p>
                    </div>
                    <button type="button"
                            className="btn btn-outline-secondary d-inline-flex align-items-center mr-2"
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop">
                        Create post
                    </button>
                </div>
                <hr/>
                {(posts === null) ?
                    <span className="spinner-border spinner-border-sm resize" role="status"
                          aria-hidden="true"></span>
                    : (
                        posts.length > 0 ? (
                        posts.sort((a, b) => b.ID - a.ID).map(item => (
                            <Post key={item.ID}
                                post_id={item.ID}
                                user_image={user.PROFILE_PICTURE}
                                username={user.USERNAME}
                                content_image={item.IMAGE}
                                content_heading={item.TITLE}
                                content_text={item.CONTENT}
                                dop_info={`${new Date(item.PUBLISHED_AT).toLocaleString("en", {
                                    day: '2-digit',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}`}
                            />
                        )) ) : (

                            (currentUsername === null || user.USERNAME !== currentUsername) ? (
                                <p>EMPTY</p>
                            ) : (
                                <div className="position-relative p-5 text-center text-muted">
                                    <i className="bi bi-check2-circle display-3"></i>
                                    <h1 className="text-body-emphasis">Create your first post!</h1>
                                    <p className="col-lg-6 mx-auto mb-4">
                                        Other users who subscribe to you will see it in their news feed.
                                    </p>
                                    <button type="button" className="btn btn-danger py-2 px-5 mb-5"
                                            data-bs-toggle="modal"
                                            onClick={fetchData} data-bs-target="#staticBackdrop">
                                        Create post
                                    </button>
                                </div>
                            )
                        )
                    )
                }

                    <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static"
                         data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel"
                         aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="staticBackdropLabel">Create new
                                        post</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"
                                            aria-label="Закрыть"></button>
                                </div>
                            <div className="modal-body">
                                <form>
                                    <div className="col-12 text-start">
                                        <label htmlFor="heading" className="form-label">Title</label>
                                        <div className="input-group has-validation">
                                            <span className="input-group-text">👽</span>
                                            <input type="text" className="form-control" id="heading"
                                                   value={inputHeading} onChange={(e) => setHeading(e.target.value)}
                                                   placeholder="Heading" required/>
                                            <div className="invalid-feedback">
                                                Heading is required.
                                            </div>
                                        </div>

                                        <label htmlFor="content"
                                               className="form-label mt-3">Content</label>
                                        <textarea className="form-control mb-3" id="content"
                                                  required value={inputContent}
                                                  onChange={(e) => setContent(e.target.value)}
                                                  aria-label="With textarea"></textarea>

                                        <div className="mb-3">
                                            <input type="file" ref={fileInput} className="form-control"
                                                   aria-label="Large file input example"/>
                                        </div>

                                        <div className="input-group has-validation">
                                        <span className="input-group-text">Publication date</span>
                                            <input type="text" className="form-control" id="heading"
                                                   required disabled
                                                   value={inputDate} onChange={(e) => setDate(e.target.value)}
                                                   placeholder={`${new Date().toLocaleString("en", {
                                                       day: '2-digit',
                                                       month: 'short',
                                                       hour: '2-digit',
                                                       minute: '2-digit'
                                                   })}`}/>
                                            <div className="invalid-feedback"></div>
                                        </div>

                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary"
                                        data-bs-dismiss="modal">Close
                                </button>
                                <button type="button" className="btn btn-danger" onClick={fetchData}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
             </>
            )}
            <ErrorMessage message={errorMessage} isVisible={showError} />
        </div>

    );
}

export {ProfilePage};
