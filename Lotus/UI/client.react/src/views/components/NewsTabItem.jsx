import {NewsItem} from "./NewsItem";
import React from "react";

const NewsTabItem = (news) => {
    return(
        <>
            <div className="row">
                {(news.news && news.news.map((item, index) => (
                    <NewsItem
                        key={index}
                        Title={item.TITLE}
                        UrlToImage={item.IMAGE}
                        PublishedAt={"Time: " + item.DATE}
                        alt={item.ALT}
                        Url={item.LINK}
                    ></NewsItem>
                )))}
            </div>
        </>
    )
}

export { NewsTabItem }