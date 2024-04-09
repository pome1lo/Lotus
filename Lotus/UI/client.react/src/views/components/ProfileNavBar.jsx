import {NavLink} from "react-router-dom";
import React, {useEffect, useState} from "react";

const ProfileNavBar = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [profileName, setProfileName] = useState('');
    useEffect(() => {
        const username = sessionStorage.getItem('username');
        setProfileName(username);
        setIsAuthenticated(!!username);
    }, []);

  return (
      <>
          <div className="col-md-2 order-md-3 profile-nav-bar">
              <nav className="">
                  {isAuthenticated
                      ? <ul className="list-unstyled d-flex flex-column gap-2">
                      <li>
                          <NavLink to={`/profile/${profileName}/edit`}
                                   className="btn rounded-2 d-flex align-items-start gap-2 py-2 px-3 lh-sm text-start">
                              <i className="bi bi-person-circle"></i>
                              <div>
                                  <strong className="d-block">Account and appearance</strong>
                                  <small>You can edit your profile here</small>
                              </div>
                          </NavLink>
                      </li>
                      <li>
                          <NavLink to={`/profile/${profileName}/change-password`}
                                   className="btn rounded-2 d-flex align-items-start gap-2 py-2 px-3 lh-sm text-start">
                              <i className="bi bi-fingerprint"></i>
                              <div>
                                  <strong className="d-block">Security</strong>
                                  <small>You can change your password here</small>
                              </div>
                          </NavLink>
                      </li>
                      <li>
                          <NavLink to={`/support`}
                                   className="btn rounded-2 d-flex align-items-start gap-2 py-2 px-3 lh-sm text-start">
                              <i className="bi bi-question-circle"></i>
                              <div>
                                  <strong className="d-block">Support</strong>
                                  <small>Get help from our support crew</small>
                              </div>
                          </NavLink>
                      </li>
                  </ul>
                      : <></>
                  }
              </nav>
          </div>
      </>
  )
}

export {ProfileNavBar}