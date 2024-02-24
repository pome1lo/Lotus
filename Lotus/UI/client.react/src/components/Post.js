import "../resources/css/Post.css";
import Avatar from "../../src/resources/images/content/test_Avatar.png";
import React from "https://esm.run/react@18";
import confetti from "https://esm.run/canvas-confetti@1";

function Post() {


    function onClick() {
        confetti({
            particleCount: 150,
            spread: 60
        });
    }



    return (
        <div className="col-md-8 post">
            <div className="card">
                <div className="img-container">
                    <img src={Avatar} alt="Ваше изображение"/>
                </div>


            </div>

        </div>
    );
}

export default Post;