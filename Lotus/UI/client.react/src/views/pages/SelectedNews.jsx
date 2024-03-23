import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

const SelectedNews = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [news, setNews] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:31001/api/news/${id}`)
            .then(res => {
                if (!res.ok && res.status === 404) {
                    navigate('/not-found');
                }
                return res.json();
            })
            .then(data => setNews(data))
    }, [id, navigate]);

    return (
        <div className="col-md-8 order-md-1 two">
            <div className="bd-example-snippet bd-code-snippet">
                <div className="bd-example m-0 border-0">
                    <svg className="bd-placeholder-img bd-placeholder-img-lg img-fluid" width="100%" height="250"
                         xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Responsive image"
                         preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title>
                        <rect width="100%" height="100%" fill="#868e96"></rect>
                        <text x="50%" y="50%" fill="#dee2e6" dy=".3em">Responsive image</text>
                    </svg>
                </div>
                <h2>{news.Heading}</h2>
                <p>{news.Paragraph}</p>
            </div>
            <h4>We recommend it:</h4>
        </div>
    );
}

export {SelectedNews};
