import {Recommendations} from "../components/Recommendations";
import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {NewsItem} from "../components/NewsItem";
import "../../assets/css/NewsPage.css";

const NewsPage = () => {
    const navigate = useNavigate();
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:31001/api/news`)
            .then(res => {
                if (!res.ok && res.status === 404) {
                    navigate('/not-found');
                }
                return res.json();
            })
            .then(data => setNews(data))
    }, [navigate]);

    return(
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
                            {
                                news.sort((a, b) => b.ID - a.ID).map(item => (
                                    <div className="mt-3 mb-3" data-aos="fade-up" data-aos-anchor-placement="center-bottom" data-aos-duration="350">
                                        <NewsItem
                                            ID={item.ID}
                                            Heading={item.Heading}
                                            Paragraph={item.Paragraph}
                                            Date={item.Date}
                                        />
                                    </div>

                                ))
                            }
                        </div>
                        <div className="tab-pane fade" id="nav-profile" role="tabpanel"
                             aria-labelledby="nav-profile-tab">
                            <p>Тут должен быть топик <strong>ЕДА</strong></p>
                            {
                                news.sort((a, b) => b.ID - a.ID).map(item => (
                                    <NewsItem
                                        ID={item.ID}
                                        Heading={item.Heading}
                                        Paragraph={item.Paragraph}
                                        Date={item.Date}
                                    />
                                ))
                            }
                        </div>
                        <div className="tab-pane fade" id="nav-contact" role="tabpanel"
                             aria-labelledby="nav-contact-tab">
                            <p>Тут должен быть топик <strong>СПОРТ</strong></p>
                            {
                                news.sort((a, b) => b.ID - a.ID).map(item => (
                                    <NewsItem
                                        ID={item.ID}
                                        Heading={item.Heading}
                                        Paragraph={item.Paragraph}
                                        Date={item.Date}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Recommendations/>
        </>
    );
}
export {NewsPage};