import {Link} from "react-router-dom";
import {Publisher} from "./Publisher";
import {SubscriptionButton} from "./SubscriptionButton";
import {useEffect, useState} from "react";
import {customFetch} from "../../services/fetchWithAuth/customFetch";

const Suggestions = () => {
    const [suggestions, setSuggestions] = useState();

    useEffect(() => {
        customFetch(`/api/profile/user/get/suggestions`)
            .then(response => {
                if (response) {
                    response.json().then(data => {
                        setSuggestions(data.suggestions);
                    });
                }
            })
    }, []);

    return (
      <>
          <h6 className="border-bottom pb-2 mb-0 mt-5">Suggestions</h6>
          {suggestions && (
              suggestions.length > 0 ? (
                  suggestions.map((item) => (
                      <div className="d-flex justify-content-between mt-3" key={item.ID}>
                          <Link to={`/profile/${item.USERNAME}`} className="d-flex justify-content-between w-100">
                              <Publisher key={item.ID}
                                         avatar={"https://localhost:31903/" + item.PROFILE_PICTURE}
                                         nickname={item.USERNAME}
                              ></Publisher>
                          </Link>
                          <SubscriptionButton
                              styles={"btn red-link"}
                              to_id={item.ID}/>
                      </div>
                  ))
              ) : (
                  <div className="bg-body-tertiary p-5 rounded mt-3">
                      <p className="lead small">Wow! It looks like you will spend your whole life watching news and posts from all the users you subscribe to on Lotus 🥲. Good luck!</p>
                  </div>
              )

          )}
      </>
    )
}

export {Suggestions}