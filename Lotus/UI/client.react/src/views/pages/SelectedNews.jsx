import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";

const SelectedNews = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetch(`https://localhost:31001/api/news/${id}`)
            .then(res => {
                if (!res.ok && res.status === 404) {
                    navigate('/not-found');
                }
                return res.json();
            })
            .then(data => setNews(data))
    }, [id, navigate]);
    return (
        <>
            <div className="col-md-7 order-md-1 two">
                <div className="bd-example-snippet bd-code-snippet">
                    <h3 className="fw-bold mt-2">{news.Heading}</h3>
                    <p>{news.Paragraph}</p>
                    <div className="bd-example m-0 border-0">
                        <svg className="bd-placeholder-img bd-placeholder-img-lg img-fluid" width="100%" height="250"
                             xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Responsive image"
                             preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title>
                            <rect width="100%" height="100%" fill="#868e96"></rect>
                            <text x="50%" y="50%" fill="#dee2e6" dy=".3em">Responsive image</text>
                        </svg>
                    </div>
                </div>
                <h5>We recommend it:</h5>
            </div>

            <div className="col-md-3 order-md-2">
                <div className="position-sticky">
                    <div className="p-4 mb-3 bg-body-tertiary rounded">
                        <h4 className="fst-italic">About</h4>
                        <p className="mb-0">Customize this section to tell your visitors a little bit about your
                            publication, writers, content, or something else entirely. Totally up to you.</p>
                    </div>

                    <div>
                        <h4 className="fst-italic">Recent posts</h4>
                        <ul className="list-unstyled">
                            <li>
                                <Link className="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top"
                                   to="#">
                                    <svg className="bd-placeholder-img" width="100%" height="96"
                                         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                                         preserveAspectRatio="xMidYMid slice" focusable="false">
                                        <rect width="100%" height="100%" fill="#777"></rect>
                                    </svg>
                                    <div className="col-lg-8">
                                        <h6 className="mb-0">Example blog post title</h6>
                                        <small className="text-body-secondary">January 15, 2024</small>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link className="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top"
                                   to="#">
                                    <svg className="bd-placeholder-img" width="100%" height="96"
                                         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                                         preserveAspectRatio="xMidYMid slice" focusable="false">
                                        <rect width="100%" height="100%" fill="#777"></rect>
                                    </svg>
                                    <div className="col-lg-8">
                                        <h6 className="mb-0">This is another blog post title</h6>
                                        <small className="text-body-secondary">January 14, 2024</small>
                                    </div>
                                </Link>
                            </li>
                            <li>
                                <Link className="d-flex flex-column flex-lg-row gap-3 align-items-start align-items-lg-center py-3 link-body-emphasis text-decoration-none border-top"
                                   to="#">
                                    <svg className="bd-placeholder-img" width="100%" height="96"
                                         xmlns="http://www.w3.org/2000/svg" aria-hidden="true"
                                         preserveAspectRatio="xMidYMid slice" focusable="false">
                                        <rect width="100%" height="100%" fill="#777"></rect>
                                    </svg>
                                    <div className="col-lg-8">
                                        <h6 className="mb-0">Longer blog post title: This one has multiple lines!</h6>
                                        <small className="text-body-secondary">January 13, 2024</small>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="p-4">
                        <h4 className="fst-italic">Archives</h4>
                        <ol className="list-unstyled mb-0">
                            <li><Link to="#">March 2021</Link></li>
                            <li><Link to="#">February 2021</Link></li>
                            <li><Link to="#">January 2021</Link></li>
                            <li><Link to="#">December 2020</Link></li>
                            <li><Link to="#">November 2020</Link></li>
                            <li><Link to="#">October 2020</Link></li>
                            <li><Link to="#">September 2020</Link></li>
                            <li><Link to="#">August 2020</Link></li>
                            <li><Link to="#">July 2020</Link></li>
                            <li><Link to="#">June 2020</Link></li>
                            <li><Link to="#">May 2020</Link></li>
                            <li><Link to="#">April 2020</Link></li>
                        </ol>
                    </div>

                    <div className="p-4">
                        <h4 className="fst-italic">Elsewhere</h4>
                        <ol className="list-unstyled">
                            <li><Link to="#">GitHub</Link></li>
                            <li><Link to="#">Twitter</Link></li>
                            <li><Link to="#">Facebook</Link></li>
                        </ol>
                    </div>
                </div>
            </div>

        </>
    );
}

export {SelectedNews};
