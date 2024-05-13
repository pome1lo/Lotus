import React, { useState, useEffect } from 'react';
import "../../assets/css/NewsPage.css";
import {ErrorMessage} from "../components/ErrorMessage";
import {NewsTabItem} from "../components/NewsTabItem";

const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    const fetchArticlesByTopic = async (currentTopic) => {
        setNews([]);
        fetch(`https://localhost:4000/api/news/${currentTopic}?limit=24&page=1`)
            .then(response => {
                if (response) {
                    response.json().then(data => {
                        setNews([]);
                        setNews(data.news);
                    });
                }
            })
            .catch(error => {
                setErrorMessage(error.message);
                setShowError(true);
            })
    };

    useEffect( () => {
         fetchArticlesByTopic('world');
    }, []);

    return (
        <>
            <div className="col-md-10 order-md-1 two">
                <div className="p-5 mb-4 bg-body-image rounded-3">
                    <div className="container-fluid py-5">
                        <h1 className="display-1 fw-bold">Themes</h1>
                    </div>
                </div>
                <div className="bd-example m-0 border-0">
                    <nav>
                        <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                            <button className="nav-link news-item-tab active" data-bs-toggle="tab"
                                    data-bs-target="#nav-world" role="tab" aria-controls="nav-world"
                                    onClick={() => fetchArticlesByTopic('world')}
                                    type="button">World
                            </button>
                            <button className="nav-link news-item-tab" data-bs-toggle="tab" data-bs-target="#nav-politics"
                                    role="tab" aria-controls="nav-politics"
                                    onClick={() => fetchArticlesByTopic('politics')}
                                    type="button">Politics
                            </button>
                            <button className="nav-link news-item-tab" data-bs-toggle="tab" data-bs-target="#nav-incidents"
                                    role="tab" aria-controls="nav-incidents"
                                    onClick={() => fetchArticlesByTopic('incidents')}
                                    type="button">Incidents
                            </button>
                            <button className="nav-link news-item-tab" data-bs-toggle="tab" data-bs-target="#nav-society"
                                    role="tab" aria-controls="nav-society"
                                    onClick={() => fetchArticlesByTopic('society')}
                                    type="button">Society
                            </button>
                            <button className="nav-link news-item-tab" data-bs-toggle="tab" data-bs-target="#nav-economy"
                                    role="tab" aria-controls="nav-economy"
                                    onClick={() => fetchArticlesByTopic('economy')}
                                    type="button">Economy
                            </button>
                        </div>
                    </nav>
                        <div className="tab-content" id="nav-tabContent">
                            {news && (
                                (news.length > 0 ) ? (
                                    <>
                                        <div className="tab-pane fade show active" id="nav-world" role="tabpanel"
                                             aria-labelledby="nav-world-tab">
                                            <NewsTabItem news={news}/>
                                        </div>
                                        <div className="tab-pane fade" id="nav-politics" role="tabpanel"
                                             aria-labelledby="nav-politics-tab">
                                            <NewsTabItem news={news}/>
                                        </div>
                                        <div className="tab-pane fade" id="nav-incidents" role="tabpanel"
                                             aria-labelledby="nav-incidents-tab">
                                            <NewsTabItem news={news}/>
                                        </div>
                                        <div className="tab-pane fade" id="nav-society" role="tabpanel"
                                             aria-labelledby="nav-society-tab">
                                            <NewsTabItem news={news}/>
                                        </div>
                                        <div className="tab-pane fade" id="nav-economy" role="tabpanel"
                                             aria-labelledby="nav-economy-tab">
                                            <NewsTabItem news={news}/>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="spinner-border spinner-border-sm resize justify-content-center"
                                              role="status"
                                              aria-hidden="true"></span>
                                    </>
                                )
                            )}
                        </div>
                </div>
            </div>
            <ErrorMessage message={errorMessage} isVisible={showError} />
        </>
    );
};

export {NewsPage};