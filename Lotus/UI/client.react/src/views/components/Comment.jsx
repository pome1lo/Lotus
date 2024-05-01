import {useState} from "react";

const Comment = ({ username, text, user_picture }) => {
    return(
        <div className="d-flex text-muted pt-3">
            <img className="mr-2 border-radius-small" width="35" height="35" src={user_picture} alt="content"/>
            <p className="pb-3 mb-0 small lh-sm border-bottom">
                <strong className="d-block text-gray-dark">{username}</strong>
                {text}
            </p>
        </div>
    )
}

export {Comment}