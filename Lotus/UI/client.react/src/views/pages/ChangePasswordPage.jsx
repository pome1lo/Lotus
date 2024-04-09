import {ProfileNavBar} from "../components/ProfileNavBar";
import React from "react";
import {useParams} from "react-router-dom";

const ChangePasswordPage = () => {
    const {username} = useParams();

    return (
        <>
            <div className="col-md-8 order-lg-2">
                <h1>Change password {username}</h1>
            </div>
            <ProfileNavBar username={username}/>
        </>
    )
}

export { ChangePasswordPage }