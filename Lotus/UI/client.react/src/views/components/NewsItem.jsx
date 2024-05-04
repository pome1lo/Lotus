import {Link} from "react-router-dom";

const NewsItem =  ({ Topic, Title, Description, Url, UrlToImage, PublishedAt, Content })  => {
    return (
        <div className="mb-4 col-md-3" data-aos="fade-up" data-aos-anchor-placement="center-bottom"
             data-aos-duration="750">
            <Link to={`/news/${Topic}/asd`} className="mb-4 news-item-card col">
                <div className="card" >
                    <div className="scale-news-item">
                        <img src={UrlToImage} alt="content" className="w-100 border-radius-small" style={{maxHeight: 130, borderRadius: 0}}/>
                    </div>
                    <div className="card-body">
                        <h6 className="card-title small">{Title}</h6>
                        {/*<p className="card-text  text-fade small">{Description}</p>*/}
                    </div>
                    <p className="card-text card-footer small"><small className="text-body-secondary">{PublishedAt}</small> </p>
                </div>
            </Link>
        </div>
    );
}

export {NewsItem}