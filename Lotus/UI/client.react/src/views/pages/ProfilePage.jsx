import {Link, useParams, useNavigate} from "react-router-dom";
import React, {useEffect, useState,} from "react";
import "../../assets/css/Profile.css";
import SubscriptionButton from "../components/SubscriptionButton";
import {CreatePostPage} from "./CreatePostPage";
import DefaultProfileImage from "../../assets/images/content/default_profile.png";

const ProfilePage = () => {
    const {posts, setPosts} = useState(null);
    const {username} = useParams();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:31003/api/profile/${username}`)
            .then(res => {
                if (!res.ok && res.status === 404) {
                    navigate('/not-found');
                }
                return res.json();
            })
            .then(data => setUser(data))
    }, [username, navigate]);


    return (
        <div className={`col-md-8 order-md-2`}>
            {user && (
                <>
                    <div className="d-flex">
                        <img src={user.ProfilePicture} alt="" height="210" className="mr-4"/>
                        <div className="w-100 d-flex align-items-center flex-wrap" >
                            <div className="d-flex align-items-center w-100">
                                <div className="mr-2">
                                    <h1 className="fw-bold display-4">{user.UserName}</h1>
                                </div>
                                <SubscriptionButton
                                    styles={"m-lg-4 btn btn-outline-secondary d-inline-flex align-items-center"}/>
                                <Link to={`/prmr-2ofile/${username}/edit`}
                                      className=" mr-2 btn btn-outline-secondary d-inline-flex align-items-center">Edit
                                </Link>
                                <Link to={`/`} className="mr-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                         className="bi bi-gear rotate hover-size" viewBox="0 0 16 16">
                                        <path
                                            d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                                        <path
                                            d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                                    </svg>
                                </Link>
                            </div>
                            <div className="d-flex align-items-center w-100">
                                <p className="mr-2">{/*{user.PostsCount}*/} 132 publications</p>
                                <p className="mr-2">{user.SubscribersCount} subscribers</p>
                                <p className="mr-2">{user.SubscriptionsCount} subscriptions</p>
                            </div>
                            <div>
                                This is some additional paragraph placeholder content. It has been written to fill the available space  of text affects the surrounding content. We'll repeat it often to keep the demonstration flowing, so be on the lookout for this exact same string of text.
                            </div>
                        </div>
                    </div>

                    <div className="d-flex">
                        <h2>{user.FirstName}</h2>
                        <h2>{user.LastName}</h2>
                    </div>


                    <div className="d-flex align-items-center w-100 justify-content-between text-muted">
                        <div className="d-flex">
                            <img src={`${user.ProfilePicture}`} height="30" alt="" className="mr-2"/>
                            <p className="m-auto">What's new with you?</p>
                        </div>
                        <Link to="post/create" className="btn btn-outline-secondary d-inline-flex align-items-center mr-2" data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop">
                            Create post
                        </Link>
                    </div>

                    <hr/>
                    {/*{posts && (*/}
                    {/*    <>*/}
                    <div
                        className="position-relative p-5 text-center text-muted bg-body">
                        <i className="bi bi-check2-circle display-3"></i>
                        <h1 className="text-body-emphasis">Create your first post!</h1>
                        <p className="col-lg-6 mx-auto mb-4">
                            Other users who subscribe to you will see it in their news feed.
                        </p>
                        <Link to="post/create" className="btn btn-danger py-2 px-5 mb-5" data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop">
                            Create post
                        </Link>

                        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static"
                             data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel"
                             aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="staticBackdropLabel">Create new post</h5>
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
                                                           placeholder="Heading" required/>
                                                    <div className="invalid-feedback">
                                                        Heading is required.
                                                    </div>
                                                </div>

                                                <label htmlFor="content" className="form-label mt-3">Content</label>
                                                <textarea className="form-control mb-3" id="content"
                                                          aria-label="With textarea"></textarea>

                                                <div className="mb-3">
                                                    <input type="file" className="form-control"
                                                           aria-label="Large file input example"/>
                                                </div>

                                                <div className="input-group has-validation">
                                                    <span className="input-group-text">Publication date</span>
                                                    <input type="text" className="form-control" id="heading" required disabled
                                                           placeholder={`${new Date().toLocaleString("en", {
                                                               day: '2-digit',
                                                               month: 'short',
                                                               hour: '2-digit',
                                                               minute: '2-digit'
                                                           })}`} />
                                                    <div className="invalid-feedback"></div>
                                                </div>

                                            </div>
                                        </form>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-secondary"
                                                data-bs-dismiss="modal">Close
                                        </button>
                                        <button type="submit" className="btn btn-danger">Create</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </>
            )}
        </div>
    );
}

export {ProfilePage};


// {/*{*/}
// {/*    posts.map(post => (*/}
// {/*        <Post*/}
// {/*            avatar={post.avatar}*/}
// {/*            nickname={post.nickname}*/}
// {/*            info={post.date}*/}
// {/*            content={post.content}*/}
// {/*            text={post.text}*/}
// {/*            likes={post.likes}*/}
// {/*        />*/}
// {/*    ))*/}
// {/*}*/}