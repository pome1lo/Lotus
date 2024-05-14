import React, {useEffect, useState} from "react";
import {customFetch} from "../../services/fetchWithAuth/customFetch";
import {Publisher} from "../components/Publisher";
import {Suggestions} from "../components/Suggestions";
import {RecentPosts} from "../components/RecentPosts";

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState();

    useEffect(() => {
        customFetch(`/api/notify/email`)
            .then(response => {
                if (response) {
                    response.json().then(data => {
                        setNotifications(data.notifications);
                    });
                }
            })
    }, []);
    return(
        <>
            <div className="col-md-6 order-md-2">
                <h6 className="border-bottom pb-2 mb-0 mt-5">Notifications</h6>
                {notifications && (
                    notifications.map((item) => (
                        <>
                            <div className="d-flex flex-wrap justify-content-between mt-3"
                                 data-aos="fade-up" data-aos-anchor-placement="center-bottom"
                                 data-aos-duration="750">
                                <Publisher key={item.ID}
                                           avatar={"https://localhost:31903/" + item.IMAGE}
                                           nickname={item.AUTHOR}
                                           info={`${new Date(item.PUBLISHED_AT).toLocaleString("en", {
                                               day: '2-digit',
                                               month: 'short',
                                               hour: '2-digit',
                                               minute: '2-digit'
                                           })}`}
                                />
                                <p className="mt-2 border-bottom pb-4">
                                    {item.CONTENT}
                                </p>
                            </div>
                        </>
                    ))
                )}
            </div>
            <div className="position-sticky col-md-4 order-md-2">
                <div className="sticky-xl-top ">
                    <div className="alert alert-secondary alert-dismissible fade show" role="alert">
                        Here you can see the posts of the people you are subscribed to.
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                    <Suggestions/>
                    <RecentPosts/> 
                </div>
            </div>
        </>
    )
}

export {NotificationsPage}