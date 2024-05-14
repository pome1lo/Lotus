import {Link, useNavigate} from "react-router-dom";
import {Publisher} from "./Publisher";
import {SubscriptionButton} from "./SubscriptionButton";
import {useEffect, useState} from "react";
import {customFetch} from "../../services/fetchWithAuth/customFetch";

const Suggestions = () => {
    const [suggestions, setSuggestions] = useState();

    useEffect(() => {
        customFetch(`/api/profile/user/suggestions`)
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
              suggestions.map((item) => (
                  <div className="d-flex justify-content-between mt-3" key={item.ID}>
                      <Link to={`/profile/${item.USERNAME}`} className="d-flex justify-content-between w-100">
                          <Publisher key={item.ID}
                                     avatar={"https://localhost:31903/" + item.PROFILE_PICTURE}
                                     nickname={item.USERNAME}
                          />
                      </Link>
                      <SubscriptionButton
                          styles={"btn red-link"}
                          to_id={item.ID}/>
                  </div>
              ))
          )}
      </>
  )
}

export { Suggestions }