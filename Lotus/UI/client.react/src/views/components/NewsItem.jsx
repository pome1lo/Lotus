import "../../assets/css/NewsItem.css";
import {Link} from "react-router-dom";

const NewsItem =  ({ ID, Heading, Paragraph, Date })  => {
    return (
        <>
            <Link to={`/news/${ID}`} className="mb-4 news-item-card">
                <div className="card">
                    <svg className="bd-placeholder-img card-img-top" width="100%" height="200"
                         xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Image cap"
                         preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title>
                        <rect width="100%" height="100%" fill="#868e96"></rect>
                        <text x="50%" y="50%" fill="#dee2e6" dy=".3em">Image cap</text>
                    </svg>
                    <div className="card-body">
                        <h5 className="card-title">{Heading}</h5>
                        <p className="card-text">{Paragraph}</p>
                        <p className="card-text"><small className="text-body-secondary">{Date}</small>
                        </p>
                    </div>
                </div>
            </Link>
        </>
    );
}

export {NewsItem}