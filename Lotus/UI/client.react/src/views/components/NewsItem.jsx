import {Link} from "react-router-dom";

const NewsItem =  ({ Topic, Title, Description, Url, UrlToImage, PublishedAt, Content })  => {
    return (
        <div className="mb-4" data-aos="fade-up" data-aos-anchor-placement="center-bottom"
             data-aos-duration="750">
            <Link to={`/news/${Topic}/asd`} className="mb-4 news-item-card col">
                <div className="card" >
                    <img src={UrlToImage} alt="content" className="w-100 border-radius-small"/>
                    <div className="card-body">
                        <h5 className="card-title">{Title}</h5>
                        <p className="card-text">{Description}</p>
                        <p className="card-text"><small className="text-body-secondary">{PublishedAt}</small> </p>
                    </div>
                </div>
            </Link>
        </div>
    );
}

export {NewsItem}