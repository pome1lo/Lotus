import "../../assets/css/Post.css";
import React from "https://esm.run/react@18";
import {Publisher} from "./Publisher";
import {Link, useNavigate, useParams} from "react-router-dom";
import {useRef, useState} from "react";
import {SaveButton} from "./SaveButton";
import {fetchWithAuth} from "../../services/fetchWithAuth/fetchWithAuth";

const Post =  ({ post_id, user_image, username, dop_info, content_image, content_heading, content_text, likes_count }) => {
    const fileInput = useRef();
    const [Heading, setHeading] = useState(content_heading);
    const [Content, setContent] = useState(content_text);
    const [inpDate, setDate] = useState(dop_info);

    const navigate = useNavigate();

    async function deletePost() {
        const response = await fetchWithAuth(`https://localhost:31903/api/post/${post_id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            console.error('Error:', response.statusText);
            return;
        }
        const data = await response.json();
        console.log(data.message);
        if (response.ok) {
            navigate(`/profile/${username}`);
            window.location.reload();
        } else {
            console.error('Error:', data.message);
        }
    }
    async function editPost() {
        const file = fileInput.current.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('title', Heading);
        formData.append('content', Content);

        try {
            const response = await fetchWithAuth(`https://localhost:31903/api/post/${post_id}`, {
                method: 'PUT',
                body: formData
            });

            if (!response.ok) {
                console.error('Ошибка:', response.statusText);
                return;
            }

            const data = await response.json();
            console.log('OK:', data);
            window.location.reload();
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    const [isFilled, setIsFilled] = useState(true);

    const savePostHandleClick = () => {
        setIsFilled(!isFilled);
    };

    return (
        <>
            <div className="post two mt-3"
                 data-aos="fade-up" data-aos-anchor-placement="center-bottom"
                 data-aos-duration="750">
                <div>
                    <div className="d-flex align-items-center justify-content-between">
                        <Publisher avatar={user_image} nickname={username} info={dop_info}/>
                        <div className="btn-group mr-4">
                            {/*{isAuthor ? (*/}
                                <button type="button" className="btn border-0 bg-transparent" data-bs-toggle="modal"
                                       data-bs-target="#postEditModal">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
                                         className="bi bi-gear rotate hover-size" viewBox="0 0 16 16">
                                        <path
                                            d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
                                        <path
                                            d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
                                    </svg>
                                </button>
                            {/*) : (<></>)}*/}
                        </div>

                    </div>
                    <blockquote>
                        <div className="context-post mr-4">
                            <div className="scale">
                                {content_image && <img src={content_image} className="w-100" alt={"content"}/>}
                            </div>
                            <h4 className="mt-2">{content_heading}</h4>
                            <p className="content-text">{content_text}</p>
                        </div>
                    </blockquote>
                    <div className="footer-panel d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <div className="like">
                                <input type="checkbox" id="checkbox"/>
                                <label htmlFor="checkbox">
                                    <svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
                                        <g id="Group" fill="none" transform="translate(467 392)">
                                            <path
                                                d="M29.144 20.773c-.063-.13-4.227-8.67-11.44-2.59C7.63 28.795 28.94 43.256 29.143 43.394c.204-.138 21.513-14.6 11.44-25.213-7.214-6.08-11.377 2.46-11.44 2.59z"
                                                id="heart" fill="#C2C2C2"/>
                                            <circle id="main-circ" fill="#E2264D" opacity="0" cx="29.5" cy="29.5" r="1.5"/>

                                            <g id="grp7" opacity="0" transform="translate(7 6)">
                                                <circle id="oval1" fill="#9CD8C3" cx="2" cy="6" r="2"/>
                                                <circle id="oval2" fill="#8CE8C3" cx="5" cy="2" r="2"/>
                                            </g>

                                            <g id="grp6" opacity="0" transform="translate(0 28)">
                                                <circle id="oval1" fill="#CC8EF5" cx="2" cy="7" r="2"/>
                                                <circle id="oval2" fill="#91D2FA" cx="3" cy="2" r="2"/>
                                            </g>

                                            <g id="grp3" opacity="0" transform="translate(52 28)">
                                                <circle id="oval2" fill="#9CD8C3" cx="2" cy="7" r="2"/>
                                                <circle id="oval1" fill="#8CE8C3" cx="4" cy="2" r="2"/>
                                            </g>

                                            <g id="grp2" opacity="0" transform="translate(44 6)">
                                                <circle id="oval2" fill="#CC8EF5" cx="5" cy="6" r="2"/>
                                                <circle id="oval1" fill="#CC8EF5" cx="2" cy="2" r="2"/>
                                            </g>

                                            <g id="grp5" opacity="0" transform="translate(14 50)">
                                                <circle id="oval1" fill="#91D2FA" cx="6" cy="5" r="2"/>
                                                <circle id="oval2" fill="#91D2FA" cx="2" cy="2" r="2"/>
                                            </g>

                                            <g id="grp4" opacity="0" transform="translate(35 50)">
                                                <circle id="oval1" fill="#F48EA7" cx="6" cy="5" r="2"/>
                                                <circle id="oval2" fill="#F48EA7" cx="2" cy="2" r="2"/>
                                            </g>

                                            <g id="grp1" opacity="0" transform="translate(24)">
                                                <circle id="oval1" fill="#9FC7FA" cx="2.5" cy="3" r="2"/>
                                                <circle id="oval2" fill="#9FC7FA" cx="7.5" cy="2" r="2"/>
                                            </g>
                                        </g>
                                    </svg>
                                </label>
                                <span>{likes_count}</span>
                            </div>
                            <div className="comments">
                                <Link to={`/${username}/${post_id}/comments`} className="btn btn-outline-secondary">
                                    Comments
                                </Link>
                            </div>
                        </div>
                        <div>
                            <SaveButton
                                postId={post_id}/>
                        </div>
                    </div>
                </div>

            </div>
            <div className="modal fade" id="postEditModal" tabIndex="-1" aria-labelledby="postEditModalLabel"
                 aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="postEditModalLabel">Post settings</h5>
                            <button type="button" className="btn-close btn-sm" data-bs-dismiss="modal"
                                    aria-label="Закрыть"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="col-12 text-start">
                                    <label htmlFor="heading" className="form-label">Title</label>
                                    <div className="input-group has-validation">
                                        <span className="input-group-text">👽</span>
                                        <input type="text" className="form-control" id="heading"
                                               value={Heading} onChange={(e) => setHeading(e.target.value)}
                                               placeholder="Heading" required/>
                                        <div className="invalid-feedback">
                                            Heading is required.
                                        </div>
                                    </div>

                                    <label htmlFor="content"
                                           className="form-label mt-3">Content</label>
                                    <textarea className="form-control mb-3" id="content"
                                              required value={Content}
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
                                               value={inpDate} onChange={(e) => setDate(e.target.value)}
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
                            <hr/>
                            <p>By clicking on this button, you will permanently delete this post and all data associated with it.</p>
                            <button type="button" className="btn red-color btn-outline-secondary btn-sm"
                                    onClick={deletePost}>Delete post
                            </button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary btn-sm"
                                    data-bs-dismiss="modal">Закрыть
                            </button>
                            <button type="button" className="btn btn-danger btn-sm" onClick={editPost}>Edit post</button>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export {Post};