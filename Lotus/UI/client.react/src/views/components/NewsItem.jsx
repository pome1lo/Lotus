import {Link} from "react-router-dom";

const NewsItem =  ({ Topic, Title, Description, Url, UrlToImage, PublishedAt, Content , alt})  => {
    return (
        <div className="mb-4 col-lg-3" data-aos="fade-up" data-aos-anchor-placement="center-bottom"
             data-aos-duration="750">
            <Link to={Url} className="mb-4 news-item-card col">
                <div className="card" >
                    <div className="scale-news-item">
                        {UrlToImage && <img src={UrlToImage} alt={alt} className="w-100 border-radius-small"
                              style={{maxHeight: 130, borderRadius: 0}}/>}
                    </div>
                    <div className="card-body">
                        <h6 className="card-title small">{Title}</h6>
                    </div>
                    <p className="card-text card-footer small"><small className="text-body-secondary">{PublishedAt}</small> </p>
                </div>
            </Link>
        </div>
    );
}

export {NewsItem}