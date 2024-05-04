import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Post} from "../components/Post";
import {Suggestions} from "../components/Suggestions";
import {RecentPosts} from "../components/RecentPosts";

const SubscriptionsPage = () => {
    const [posts, setPosts] = useState([]);
    const [currentUserId, setCurrentId] = useState(sessionStorage.getItem('user_id'));

    const navigate = useNavigate();

    useEffect(() => {
        const url = `https://localhost:31903/api/user/${currentUserId}/posts`;
        fetch(url)
            .then(res => {
                if (!res.ok && res.status === 404) {
                    navigate('/not-found');
                }
                if (!res.ok && res.status === 500) {
                    setPosts([]);
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data.posts)) {
                    setPosts(data.posts);
                } else {
                    setPosts([]);
                }
            })
            .catch(error => {
                console.error('Ошибка при получении постов:', error);
            })
    }, [navigate]);

  return (
      <>
          <div className="col-md-6 order-md-1">
              {(posts.map((item, index) => (
                  <Post key={index}
                        post_id={item.ID}
                        user_id={item.USER_ID}
                        user_image={'https://localhost:31903/' + item.PROFILE_PICTURE}
                        username={item.USERNAME}
                        content_image={'https://localhost:31903/' + item.IMAGE}
                        content_heading={item.TITLE}
                        content_text={item.CONTENT}
                        dop_info={`${new Date(item.PUBLISHED_AT).toLocaleString("en", {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}`}
                  />
              )))}
          </div>
          <div className="position-sticky col-md-4 order-md-2">
              <div className="sticky-xl-top ">
                  <div className="alert alert-secondary alert-dismissible fade show" role="alert">
                      Here you can see the posts of the people you are subscribed to.
                      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                  </div>
                  <Suggestions/>
                  <RecentPosts/>
              </div>
          </div>
      </>
  )
}

export {SubscriptionsPage}