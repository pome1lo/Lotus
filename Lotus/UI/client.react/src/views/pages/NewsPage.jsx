import React, { useState, useEffect } from 'react';
import "../../assets/css/NewsPage.css";
import {ErrorMessage} from "../components/ErrorMessage";
import {NewsTabItem} from "../components/NewsTabItem";
import {NewsItem} from "../components/NewsItem";

const NewsPage = () => {
    const [news, setNews] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1)
    const [maxPages, setMaxPages] = useState(1)

    const fetchArticlesByTopic = async (currentTopic) => {
        setNews([]);
        fetch(`https://localhost:4000/api/news/${currentTopic}?limit=24&page=${currentPage}`)
            .then(response => {
                if (response) {
                    response.json().then(data => {
                        setNews([]);
                        setNews(data.news);
                        setMaxPages(data.maxPages);
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
    }, [currentPage]);

    return (
        <>
            <div className="col-md-10 order-md-1 two">
                <div className="p-5 mb-4 bg-body-image rounded-3">
                    <div className="container-fluid py-5">
                        <h1 className="display-1 fw-bold">News</h1>
                    </div>

                </div>
                <div className="row p-5 ">
                    <div className="col-4">
                        <h2>Learn new things 😉</h2>
                        <p>Or, keep it light and add a border for some added definition to the boundaries of your
                            content. Be sure to look under the hood at the source HTML here as we've adjusted the
                            alignment and sizing of both column's content for equal-height be sure to look under the hood at the source HTML here as we've adjusted the.</p>
                    </div>
                    <ul className="col-8 list-group list-group-flush">
                        {(news && news.slice(0, 5).map((item, index) => (
                            <li key={index} className="list-group-item">
                                <a href={item.LINK} className="d-flex align-items-center">
                                    <img src={item.IMAGE} alt={item.ALT} className="border-radius mr-2" width={35}
                                         height={35}/>
                                    <p className="small text-muted">{item.TITLE}</p>
                                </a>
                            </li>
                        )))}
                    </ul>
                </div>
                <div className="bd-example m-0 border-0">
                    <nav>
                        <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                            <button className="nav-link news-item-tab active" data-bs-toggle="tab"
                                    data-bs-target="#nav-world" role="tab" aria-controls="nav-world"
                                    onClick={() => fetchArticlesByTopic('world')}
                                    type="button">World
                            </button>
                            <button className="nav-link news-item-tab" data-bs-toggle="tab"
                                    data-bs-target="#nav-politics"
                                    role="tab" aria-controls="nav-politics"
                                    onClick={() => fetchArticlesByTopic('politics')}
                                    type="button">Politics
                            </button>
                            <button className="nav-link news-item-tab" data-bs-toggle="tab"
                                    data-bs-target="#nav-incidents"
                                    role="tab" aria-controls="nav-incidents"
                                    onClick={() => fetchArticlesByTopic('incidents')}
                                    type="button">Incidents
                            </button>
                            <button className="nav-link news-item-tab" data-bs-toggle="tab"
                                    data-bs-target="#nav-society"
                                    role="tab" aria-controls="nav-society"
                                    onClick={() => fetchArticlesByTopic('society')}
                                    type="button">Society
                            </button>
                            <button className="nav-link news-item-tab" data-bs-toggle="tab"
                                    data-bs-target="#nav-economy"
                                    role="tab" aria-controls="nav-economy"
                                    onClick={() => fetchArticlesByTopic('economy')}
                                    type="button">Economy
                            </button>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        {news && (
                            (news.length > 0) ? (
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
                                    <nav aria-label="Пример навигации по страницам">
                                        <ul className="pagination justify-content-center">
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <a className="page-link text-body-secondary"
                                                   onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}>Предыдущая</a>
                                            </li>
                                            <li className={`page-item ${currentPage === 1 ? 'd-none' : ''}`}>
                                                <a className="page-link"
                                                >{currentPage - 1}</a>
                                            </li>
                                            <li className="page-item active">
                                                <a className="page-link"
                                                >{currentPage}</a>
                                            </li>
                                            <li className={`page-item ${currentPage === maxPages ? 'd-none' : ''}`}>
                                                <a className="page-link"
                                                >{currentPage + 1}</a>
                                            </li>
                                            <li className={`page-item ${currentPage === maxPages ? 'disabled' : ''}`}>
                                                <a className={`page-link `}
                                                   onClick={() => currentPage < maxPages && setCurrentPage(currentPage + 1)}>Следующая</a>
                                            </li>
                                        </ul>
                                    </nav>
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
            <ErrorMessage message={errorMessage} isVisible={showError}/>
        </>
    );
};

export {NewsPage};