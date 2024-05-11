import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Post} from "../components/Post";
import {Suggestions} from "../components/Suggestions";
import {RecentPosts} from "../components/RecentPosts";
import {fetchWithAuth} from "../../services/fetchWithAuth/fetchWithAuth";
import {ErrorMessage} from "../components/ErrorMessage";

const SubscriptionsPage = () => {
    const [posts, setPosts] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const url = `https://localhost:31903/api/user/posts`;
        fetchWithAuth(url)
            .then(res => {
                if (!res.ok && res.status === 500) {
                    setPosts([]);
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data.posts)) {
                    setPosts(data.posts);
                    console.log(data);
                } else {
                    setPosts([]);
                }
            })
            .catch(error => {
                setErrorMessage(error.message);
                setShowError(true);
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
                  <ErrorMessage message={errorMessage} isVisible={showError} />
              </div>
          </div>
      </>
  )
}

export {SubscriptionsPage}