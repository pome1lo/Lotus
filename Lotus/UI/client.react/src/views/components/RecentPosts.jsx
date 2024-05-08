import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const RecentPosts = () => {
    const [recents, setRecents] = useState([]);
    const [currentUserId, setCurrentId] = useState(sessionStorage.getItem('user_id'));

    const navigate = useNavigate();
    useEffect(() => {
        fetch('https://localhost:31903/api/posts/recent')
            .then(res => {
                if (!res.ok && res.status === 404) {
                    navigate('/not-found');
                }
                if (!res.ok && res.status === 500) {
                    setRecents([]);
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data.posts)) {
                    setRecents(data.posts);
                } else {
                    setRecents([]);
                }
            })
            .catch(error => {
                console.error('Ошибка при получении постов:', error);
            })
    }, [navigate]);
  return(
      <>
          <h6 className="mt-3">Recent posts</h6>
          <ul className="list-unstyled">
              {(recents.map((item, index) => (
                  <li className="d-flex align-items-center mb-3 pt-3 border-top">
                      <div className="mr-2">
                          <img src={'https://localhost:31903/' + item.IMAGE} alt="" height={100} width={100}
                               style={{borderRadius: 20}}/>
                      </div>
                      <div>
                          <p>{item.USERNAME}</p>
                          <h5>{item.TITLE}</h5>
                          <p className="content-text">{`${new Date(item.PUBLISHED_AT).toLocaleString("en", {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                          })}`}
                          </p>
                      </div>
                  </li>
              )))}
          </ul>
      </>
  )
}

export {RecentPosts}