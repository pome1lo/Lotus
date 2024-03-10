import {Post} from "../components/Post";
import {Recommendations} from "../components/Recommendations";
import React from "react";

const MainPage = () => {
    return(
        <>
        <div className="col-md-6 order-md-1 two">
            <Post/>
            <Post/>
            <Post/>
            <Post/>
        </div>
        <Recommendations />
        </>
    );
}
export { MainPage };