import {useParams} from "react-router-dom";
import {ProfileNavBar} from "../components/ProfileNavBar";
import React from "react";

const SupportPage = () => {
    const {username} = useParams();

    return (
        <>
            <div className="col-md-8 order-lg-2">
                <h1 className="fw-bold">How we can help?</h1>
                <label>Your problem:</label>
                <div className="input-group" >
                    <textarea id="problem" className="form-control" aria-label="With textarea" placeholder="Input ypur problem"></textarea>
                </div>
                <button className="btn btn-danger">Send</button>
            </div>
            <ProfileNavBar username={username}/>
        </>
    )
}

export {SupportPage}