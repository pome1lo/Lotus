import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {NewsItem} from "../components/NewsItem";
import "../../assets/css/NewsPage.css";
import {Post} from "../components/Post";
import {ErrorMessage} from "../components/ErrorMessage";

const NewsPage = () => {
    const { topic = 'last' } = useParams();
    const [articles, setArticles] = useState([]);
    const [postStatus, setPostStatus] = useState(false);
    const [currentPage, setCurrentPage] = useState(2);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 12;
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    const navigate = useNavigate();

    const fetchArticlesByTopic = async (currentTopic) => {
        const offsett = (currentPage - 1) * pageSize;
        setPostStatus(false);
        setArticles([]);
        fetch(`https://localhost:31904/api/news?topic=${currentTopic}&limit=${pageSize}&offset=${offsett}`)
            .then(res => {
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data.articles)) {
                    setArticles(data.articles);
                    setTotalPages(Math.ceil(data.totalCount / pageSize));
                } else {
                    setArticles([]);
                }
            })
            .catch(error => {
                setErrorMessage(error.message);
                setShowError(true);
            })
    };



    useEffect(() => {
        const offsett = (currentPage - 1) * pageSize;
        const url = `https://localhost:31904/api/news?topic=${topic}&limit=${pageSize}&offset=${offsett})`;
        fetch(url)
            .then(res => {
                if (!res.ok && res.status === 404) {
                    navigate('/not-found');
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data.articles)) {
                    console.log(data.articles);
                    setArticles(data.articles);
                    setTotalPages(Math.ceil(data.totalCount / pageSize));
                } else {
                    setArticles([]);
                }
            })
            .catch(error => {
                console.error('Ошибка при получении новостей:', error);
            })
            }, [topic, pageSize, currentPage, navigate]);


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
                                    data-bs-target="#nav-main" role="tab" aria-controls="nav-main"
                                    onClick={() => fetchArticlesByTopic('last')}
                                    type="button">Main
                            </button>
                            <button className="nav-link news-item-tab" data-bs-toggle="tab" data-bs-target="#nav-meal"
                                    role="tab" aria-controls="nav-meal"
                                    onClick={() => fetchArticlesByTopic('meal')}
                                    type="button">Sport
                            </button>
                            <button className="nav-link news-item-tab" data-bs-toggle="tab" data-bs-target="#nav-sport"
                                    role="tab" aria-controls="nav-sport"
                                    onClick={() => fetchArticlesByTopic('sport')}
                                    type="button">Eat
                            </button>
                        </div>
                    </nav>

                    {Array.isArray(articles) && (
                        <>
                            <div className="tab-content" id="nav-tabContent">
                            {articles && (
                                (articles.length > 0 ) ? (
                                    <>

                                        <div className="tab-pane fade show active" id="nav-main" role="tabpanel"
                                             aria-labelledby="nav-main-tab">
                                            <p>This is the latest news</p>
                                            <div className="row">
                                                {(articles.map((article, index) => (
                                                    <NewsItem key={index}
                                                      Topic={topic}
                                                      Title={article.title}
                                                      Description={article.description}
                                                      Url={article.url}
                                                      UrlToImage={article.urlToImage}
                                                      PublishedAt={article.publishedAt}
                                                      Content={article.content}
                                                    />
                                                )))}
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="nav-meal" role="tabpanel"
                                             aria-labelledby="nav-meal-tab">
                                            <p>This is the latest food news</p>
                                            {(articles.map((article, index) => (
                                                <NewsItem key={index}
                                                  Topic={'Meal'}
                                                  Title={article.title}
                                                  Description={article.description}
                                                  Url={article.url}
                                                  UrlToImage={article.urlToImage}
                                                  PublishedAt={article.publishedAt}
                                                  Content={article.content}
                                                />
                                            )))}
                                        </div>
                                        <div className="tab-pane fade" id="nav-sport" role="tabpanel"
                                             aria-labelledby="nav-sport-tab">
                                            <p>This is the latest sport news</p>
                                            {(articles.map((article, index) => (
                                                <NewsItem key={index}
                                                  Topic={topic}
                                                  Title={article.title}
                                                  Description={article.description}
                                                  Url={article.url}
                                                  UrlToImage={article.urlToImage}
                                                  PublishedAt={article.publishedAt}
                                                  Content={article.content}
                                                />
                                            )))}
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
                        </>
                    )}
                </div>
            </div>

            <ErrorMessage message={errorMessage} isVisible={showError} />
        </>
    );
};

export {NewsPage};