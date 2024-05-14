import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Publisher} from "../components/Publisher";
import {Suggestions} from "../components/Suggestions";
import {RecentPosts} from "../components/RecentPosts";
import {customFetch} from "../../services/fetchWithAuth/customFetch";
import {ErrorMessage} from "../components/ErrorMessage";

const PeoplePage = () => {
    const [subscriptions, setSubscriptions] = useState();
    const [subscribers, setSubscribers] = useState();
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        customFetch('/api/profile/user/subscriptions')
            .then(response => {
                if (response) {
                    response.json().then(data => {
                        setSubscriptions(data.subscriptions);
                    });
                }
            })
        customFetch('/api/profile/user/subscribers')
            .then(response => {
                if (response) {
                    response.json().then(data => {
                        setSubscribers(data.subscribers);
                    });
                }
            })
    }, []);

    return(
        <>
            <div className="col-md-6 order-md-2">
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    On this page you can view the users you are subscribed to and those who are subscribed to you
                    <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
                <div className="bd-example m-0 border-0">
                    <nav>
                        <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                            <button className="nav-link news-item-tab w-50" id="nav-home-tab" data-bs-toggle="tab"
                                    data-bs-target="#nav-subscriptions"
                                    type="button" role="tab" aria-controls="nav-subscriptions" aria-selected="false"
                                    tabIndex="-1">Subscriptions
                            </button>
                            <button className="nav-link active news-item-tab w-50" id="nav-subscribers-tab"
                                    data-bs-toggle="tab"
                                    data-bs-target="#nav-subscribers" type="button" role="tab"
                                    aria-controls="nav-subscribers"
                                    aria-selected="true">Subscribers
                            </button>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade" id="nav-subscriptions" role="tabpanel"
                             aria-labelledby="nav-subscriptions-tab">
                            {subscriptions && (
                                subscriptions.length > 0 ? (
                                    subscriptions.map((item) => (
                                        <div className="d-flex justify-content-between mt-3" key={item.ID}>
                                            <Link to={`/profile/${item.USERNAME}`}
                                                  className="d-flex justify-content-between w-100">
                                                <Publisher key={item.ID}
                                                           avatar={"https://localhost:31903/" + item.PROFILE_PICTURE}
                                                           nickname={item.USERNAME}
                                                />
                                                <button className="btn red-link">
                                                    View profile
                                                </button>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-body-tertiary p-5 rounded mt-3">
                                        <h2>There's no one here yet ☹️</h2>
                                        <p className="lead">Publish posts and find your audience!</p>
                                    </div>
                                )

                            )}
                        </div>
                        <div className="tab-pane fade active show" id="nav-subscribers" role="tabpanel"
                             aria-labelledby="nav-subscribers-tab">
                            {subscribers && (
                                subscribers.length > 0 ? (
                                    subscribers.map((item) => (
                                        <div className="d-flex justify-content-between mt-3" key={item.ID}>
                                            <Link to={`/profile/${item.USERNAME}`}
                                                  className="d-flex justify-content-between w-100">
                                                <Publisher key={item.ID}
                                                           avatar={"https://localhost:31903/" + item.PROFILE_PICTURE}
                                                           nickname={item.USERNAME}
                                                />
                                                <button className="btn red-link">
                                                    View profile
                                                </button>
                                            </Link>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-body-tertiary p-5 rounded mt-3">
                                        <h2>There's no one here yet ☹️</h2>
                                        <p className="lead">You can subscribe to someone at any time</p>
                                    </div>
                                )

                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="position-sticky col-md-4 order-md-2">
                <div className="sticky-xl-top ">
                    <div className="alert alert-secondary alert-dismissible fade show" role="alert">
                        Here you can see the posts of the people you are subscribed to.
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                    <Suggestions/>
                    <RecentPosts/>
                    <ErrorMessage message={errorMessage} isVisible={showError} />
                </div>
            </div>
        </>
    )
}

export {PeoplePage}