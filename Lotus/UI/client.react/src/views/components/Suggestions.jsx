import {Link, useNavigate} from "react-router-dom";
import {Publisher} from "./Publisher";
import {SubscriptionButton} from "./SubscriptionButton";
import {useEffect, useState} from "react";

const Suggestions = () => {
    const navigate = useNavigate();
    const [currentUserId, setCurrentId] = useState(sessionStorage.getItem('user_id'));
    const [suggestions, setSuggestions] = useState();

    useEffect(() => {
        if (!currentUserId) {
            navigate('/login');
        } else {

        fetch(`https://localhost:31903/api/user/suggestions/${currentUserId}`)
            .then(res => {
                if (!res.ok && res.status === 404) {
                    navigate('/not-found');
                }
                return res.json();
            })
            .then(data => {
                setSuggestions(data.suggestions);
            })
        }
    }, [currentUserId, navigate]);

    return (
      <>
          <h6 className="border-bottom pb-2 mb-0 mt-5">Suggestions</h6>
          {suggestions && (
              suggestions.map((item, index) => (
                  <>
                      <div className="d-flex justify-content-between mt-3">
                          <Link to={`/profile/${item.USERNAME}`} className="d-flex justify-content-between w-100">
                              <Publisher key={index}
                                         avatar={"https://localhost:31903/" + item.PROFILE_PICTURE}
                                         nickname={item.USERNAME}
                              />
                          </Link>
                          <SubscriptionButton
                              styles={"btn red-link"}
                              user_id={currentUserId}
                              to_id={item.ID}/>
                      </div>
                  </>
              ))
          )}
      </>
  )
}

export { Suggestions }