import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {NewsItem} from "../components/NewsItem";
import "../../assets/css/NewsPage.css";
import {Post} from "../components/Post";

const NewsPage = () => {
    const { topic = 'last' } = useParams();
    const [articles, setArticles] = useState([]);
    const [postStatus, setPostStatus] = useState(false);
    const [currentPage, setCurrentPage] = useState(2);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 12;
    const [currentUserId, setCurrentId] = useState(sessionStorage.getItem('user_id'));

    const navigate = useNavigate();

    const fetchArticlesByTopic = async (currentTopic) => {
        const offsett = (currentPage - 1) * pageSize;
        setPostStatus(false);
        setArticles([]);
        const url = `https://localhost:31904/api/news?topic=${currentTopic}&limit=${pageSize}&offset=${offsett}`;
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
    };

    const fetchPosts = async () => {
        setPostStatus(false);
        const url = `https://localhost:31903/api/user/${currentUserId}/posts`;
        fetch(url)
            .then(res => {
                if (!res.ok && res.status === 404) {
                    navigate('/not-found');
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data.posts)) {
                    console.log(data.posts.length);
                    if(data.posts.length === 0) {
                        setPostStatus(true);
                    }
                    console.log(data.posts[0]);
                    setArticles(data.posts);

                    //setTotalPages(Math.ceil(data.totalCount / pageSize));
                } else {
                    setArticles([]);
                }
            })
            .catch(error => {
                console.error('Ошибка при получении новостей:', error);
            })
    }

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

                            <button className="nav-link news-item-tab" data-bs-toggle="tab"
                                    data-bs-target="#nav-subscription" role="tab" aria-controls="nav-subscription"
                                    style={{display: (currentUserId ? 'block' : 'none')}}
                                    onClick={() => fetchPosts()}
                                    type="button">Subscriptions
                            </button>

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
                                        <div className="tab-pane fade" id="nav-subscription" role="tabpanel"
                                             aria-labelledby="nav-subscription-tab">
                                            {(articles.map((article, index) => (
                                                <Post key={index}
                                                      post_id={article.ID}
                                                      user_id={article.USER_ID}
                                                      user_image={'https://localhost:31903/' + article.PROFILE_PICTURE}
                                                      username={article.USERNAME}
                                                      content_image={'https://localhost:31903/' + article.IMAGE}
                                                      content_heading={article.TITLE}
                                                      content_text={article.CONTENT}
                                                      dop_info={`${new Date(article.PUBLISHED_AT).toLocaleString("en", {
                                                          day: '2-digit',
                                                          month: 'short',
                                                          hour: '2-digit',
                                                          minute: '2-digit'
                                                      })}`}
                                                />
                                            )))}
                                        </div>
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

        </>
    );
};

export {NewsPage};