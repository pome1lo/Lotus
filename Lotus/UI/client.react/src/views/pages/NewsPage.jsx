import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import {NewsItem} from "../components/NewsItem";
import "../../assets/css/NewsPage.css";

const NewsPage = () => {
    const { topic } = useParams();
    const [articles, setArticles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        fetchArticles();
    }, [currentPage]);

    const fetchArticles = async () => {
        const offset = (currentPage) ;
        const url = `https://localhost:31904/api/news?topic=${topic}&limit=${pageSize}&offset=${offset}`;

        console.log(url);
        try {
            const response = await axios.get(url);
            setArticles(response.data.articles);
            setTotalPages(Math.ceil(response.data.totalCount / pageSize));
        } catch (error) {
            console.error('Ошибка при получении новостей:', error.message);
        }
    };

    const setPage = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0); // Прокрутка вверх страницы
        fetchArticles(); // Подгрузка новостей для новой страницы
    };

    // Рассчитываем диапазон страниц для отображения
    const pageNumbers = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
            <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); setPage(i); }}>
                    {i}
                </a>
            </li>
        );
    }

    return (
        <>
            <div className="col-md-6 order-md-1 two">
                <div className="bd-example m-0 border-0">
                    <nav>
                        <div className="nav nav-tabs mb-3" id="nav-tab" role="tablist">
                            <button className="nav-link " id="nav-home-tab" data-bs-toggle="tab" disabled
                                    data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home">
                                <span className="badge bg-secondary">News</span>
                            </button>
                            <button className="nav-link active news-item-tab" id="nav-home-tab" data-bs-toggle="tab"
                                    data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home"
                                    aria-selected="true">Main
                            </button>
                            <button className="nav-link news-item-tab" id="nav-profile-tab" data-bs-toggle="tab"
                                    data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile"
                                    aria-selected="false" tabIndex="-1">Sport
                            </button>
                            <button className="nav-link news-item-tab" id="nav-contact-tab" data-bs-toggle="tab"
                                    data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact"
                                    aria-selected="false" tabIndex="-1">Eat
                            </button>
                        </div>
                    </nav>
                    <div className="tab-content" id="nav-tabContent">
                        <div className="tab-pane fade active show" id="nav-home" role="tabpanel"
                             aria-labelledby="nav-home-tab">
                            <p>Тут должен быть топик <strong>Главная</strong></p>
                            {articles.length > 0 ? (


                                (articles.map((article, index) => (
                                        <NewsItem
                                            Topic={"News"}
                                            Title={article.title}
                                            Description={article.description}
                                            Url={article.url}
                                            UrlToImage={article.urlToImage}
                                            PublishedAt={article.publishedAt}
                                            Content={article.content}
                                        />
                                    )))
                                    (
                                        <nav aria-label="Standard pagination example">
                                            <ul className="pagination">
                                                <li className="page-item">
                                                    <a className="page-link" href="#" aria-label="Previous"
                                                       onClick={(e) => {
                                                           e.preventDefault();
                                                           if (currentPage > 1) setPage(currentPage - 1);
                                                       }}>
                                                        <span aria-hidden="true">«</span>
                                                    </a>
                                                </li>
                                                {pageNumbers}
                                                <li className="page-item">
                                                    <a className="page-link" href="#" aria-label="Next"
                                                       onClick={(e) => {
                                                           e.preventDefault();
                                                           if (currentPage < totalPages) setPage(currentPage + 1);
                                                       }}>
                                                        <span aria-hidden="true">»</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </nav>
                                    )
                            ) : (
                                <span className="spinner-border spinner-border-sm resize" role="status"
                                      aria-hidden="true"></span>
                            )}
                        </div>
                        <div className="tab-pane fade" id="nav-profile" role="tabpanel"
                             aria-labelledby="nav-profile-tab">
                            <p>Тут должен быть топик <strong>Главная</strong></p>
                            {articles.length > 0 ? (


                                (articles.map((article, index) => (
                                    <NewsItem
                                        Topic={"Sport"}
                                        Title={article.title}
                                        Description={article.description}
                                        Url={article.url}
                                        UrlToImage={article.urlToImage}
                                        PublishedAt={article.publishedAt}
                                        Content={article.content}
                                    />
                                )))
                                (
                                    <nav aria-label="Standard pagination example">
                                        <ul className="pagination">
                                            <li className="page-item">
                                                <a className="page-link" href="#" aria-label="Previous"
                                                   onClick={(e) => {
                                                       e.preventDefault();
                                                       if (currentPage > 1) setPage(currentPage - 1);
                                                   }}>
                                                    <span aria-hidden="true">«</span>
                                                </a>
                                            </li>
                                            {pageNumbers}
                                            <li className="page-item">
                                                <a className="page-link" href="#" aria-label="Next"
                                                   onClick={(e) => {
                                                       e.preventDefault();
                                                       if (currentPage < totalPages) setPage(currentPage + 1);
                                                   }}>
                                                    <span aria-hidden="true">»</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                )
                            ) : (
                                <span className="spinner-border spinner-border-sm resize" role="status"
                                      aria-hidden="true"></span>
                            )}
                        </div>
                        <div className="tab-pane fade" id="nav-contact" role="tabpanel"
                             aria-labelledby="nav-contact-tab">
                            <p>Тут должен быть топик <strong>Eat</strong></p>
                            {articles.length > 0 ? (


                                (articles.map((article, index) => (
                                    <NewsItem
                                        Topic={"Eat"}
                                        Title={article.title}
                                        Description={article.description}
                                        Url={article.url}
                                        UrlToImage={article.urlToImage}
                                        PublishedAt={article.publishedAt}
                                        Content={article.content}
                                    />
                                )))
                                (
                                    <nav aria-label="Standard pagination example">
                                        <ul className="pagination">
                                            <li className="page-item">
                                                <a className="page-link" href="#" aria-label="Previous"
                                                   onClick={(e) => {
                                                       e.preventDefault();
                                                       if (currentPage > 1) setPage(currentPage - 1);
                                                   }}>
                                                    <span aria-hidden="true">«</span>
                                                </a>
                                            </li>
                                            {pageNumbers}
                                            <li className="page-item">
                                                <a className="page-link" href="#" aria-label="Next"
                                                   onClick={(e) => {
                                                       e.preventDefault();
                                                       if (currentPage < totalPages) setPage(currentPage + 1);
                                                   }}>
                                                    <span aria-hidden="true">»</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </nav>
                                )
                            ) : (
                                <span className="spinner-border spinner-border-sm resize" role="status"
                                      aria-hidden="true"></span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/*<Recommendations/>*/}





            {/*<div className="col-md-5 order-md-1 two">*/}
            {/*    <div>*/}
            {/*        {articles.map((article, index) => (*/}
            {/*            <NewsItem*/}
            {/*                Topic={topic}*/}
            {/*                Title={article.title}*/}
            {/*                Description={article.description}*/}
            {/*                Url={article.url}*/}
            {/*                UrlToImage={article.urlToImage}*/}
            {/*                PublishedAt={article.publishedAt}*/}
            {/*                Content={article.content}*/}
            {/*            />*/}
            {/*        ))}*/}

            {/*        <nav aria-label="Standard pagination example">*/}
            {/*            <ul className="pagination">*/}
            {/*                <li className="page-item">*/}
            {/*                    <a className="page-link" href="#" aria-label="Previous" onClick={(e) => {*/}
            {/*                        e.preventDefault();*/}
            {/*                        if (currentPage > 1) setPage(currentPage - 1);*/}
            {/*                    }}>*/}
            {/*                        <span aria-hidden="true">«</span>*/}
            {/*                    </a>*/}
            {/*                </li>*/}
            {/*                {pageNumbers}*/}
            {/*                <li className="page-item">*/}
            {/*                    <a className="page-link" href="#" aria-label="Next" onClick={(e) => {*/}
            {/*                        e.preventDefault();*/}
            {/*                        if (currentPage < totalPages) setPage(currentPage + 1);*/}
            {/*                    }}>*/}
            {/*                        <span aria-hidden="true">»</span>*/}
            {/*                    </a>*/}
            {/*                </li>*/}
            {/*            </ul>*/}
            {/*        </nav>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
    );
};

export {NewsPage};