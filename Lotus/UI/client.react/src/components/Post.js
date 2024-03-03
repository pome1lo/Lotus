import "../resources/css/Post.css";
import Avatar from "../../src/resources/images/content/test_Avatar.png";
import React from "https://esm.run/react@18";
import confetti from "https://esm.run/canvas-confetti@1";
import content from "../../src/resources/images/content/content.jpg";
import Publisher from "./Publisher";
function Post() {

    function onClick() {
        confetti({
            particleCount: 150,
            spread: 60
        });
    }
    return (
        <div data-aos="fade-up" data-aos-anchor-placement="center-bottom" className="post two" data-aos-duration="750">
        {/*<div className="col-md-6 post">*/}
            <div>
                <Publisher avatar={Avatar} nickname="Travis Scott" info="31 Jan. 15:23" />
                <blockquote>
                    <div className="context-post">
                        <div className="scale">
                            <img src={content}/>
                        </div>
                        <p className="content-text">
                            I've been hiding it for a long time, but it's time to tell everyone about it, I'm a
                            pineapple.
                            I've been hiding it for a long time, but it's time to tell everyone about it, I'm a
                            pineapple.
                            I've been hiding it for a long time, but it's time to tell everyone about it, I'm a
                            pineapple.
                            I've been hiding it for a long time, but it's time to tell everyone about it, I'm a
                            pineapple.
                        </p>
                    </div>
                </blockquote>
               <div className="footer-panel d-flex align-items-center justify-content-between">
                   <div className="like">
                       <input type="checkbox" id="checkbox"/>
                       <label htmlFor="checkbox">
                           <svg id="heart-svg" viewBox="467 392 58 57" xmlns="http://www.w3.org/2000/svg">
                               <g id="Group" fill="none" fill-rule="evenodd" transform="translate(467 392)">
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
                       <span>4563</span>
                   </div>
                   <label className="fav-switch">
                       <input type="checkbox"/>
                       <span className="negative icon"></span>
                   </label>
               </div>
            </div>
        </div>
    );
}

export default Post;