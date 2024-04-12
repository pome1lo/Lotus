import {Link, NavLink, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {ProfileNavBar} from "../components/ProfileNavBar";

const ProfileEditPage = () => {
    const {posts, setPosts} = useState(null);
    const {username} = useParams();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`https://localhost:31003/api/profile/${username}`)
            .then(res => {
                if (!res.ok && res.status === 404) {
                    navigate('/not-found');
                }
                return res.json();
            })
            .then(data => setUser(data))
    }, [username, navigate]);

    return (
      <>
          <div className={`col-md-8 order-md-2`}>
              {user && (
                  <form className="needs-validation" noValidate="">
                      <div className="row g-3">
                          <div className="col-sm-6 d-flex flex-column justify-content-center align-items-center">
                              <img src={user.PROFILE_PICTURE} alt="" className="w-50"/>
                              <button className="btn btn-danger py-2 px-5 mt-3" data-bs-toggle="modal"
                                      data-bs-target="#staticBackdrop" type="button">Change photo
                              </button>

                      </div>
                          <div className="col-sm-6">
                              <div className="row g-3">
                                  <div className="col-sm-6">
                                      <label htmlFor="firstName" className="form-label">First name</label>
                                      <input type="text" className="form-control" id="firstName"
                                             placeholder="Input your first name"
                                             defaultValue={`${user.FIRST_NAME == null ? "" : user.FIRST_NAME}`} required=""/>
                                      <div className="invalid-feedback">
                                          Valid first name is required.
                                      </div>
                                  </div>
                                  <div className="col-sm-6">
                                      <label htmlFor="lastName" className="form-label">Last name</label>
                                      <input type="text" className="form-control" id="lastName"
                                             placeholder="Input your last name" value=""
                                             defaultValue={`${user.LAST_NAME == null ? "" : user.LAST_NAME}`} required=""/>
                                      <div className="invalid-feedback">
                                          Valid last name is required.
                                      </div>
                                  </div>
                              </div>
                              <div className="col-12">
                                  <label htmlFor="Username" className="form-label">Username</label>
                                  <input type="text" className="form-control" id="Username"
                                         placeholder="Input your username"
                                         defaultValue={`${user.USERNAME == null ? "" : user.USERNAME}`}
                                         required=""/>
                                  <div className="invalid-feedback">
                                      Please enter your username.
                                  </div>
                              </div>
                              <div className="col-12">
                                  <label htmlFor="Email" className="form-label">Email</label>
                                  <input type="text" className="form-control" id="Email" placeholder="Input your email"
                                         defaultValue={`${user.EMAIL == null ? "" : user.EMAIL}`}
                                         required=""/>
                                  <div className="invalid-feedback">
                                      Please enter your email.
                                  </div>
                              </div>
                              <div className="col-12">
                                  <label htmlFor="number" className="form-label">Phone number</label>
                                  <input type="text" className="form-control" id="number"
                                         placeholder="Input your phone number"
                                         defaultValue={`${user.PHONE_NUMBER == null ? "" : user.PHONE_NUMBER}`} required=""/>
                                  <div className="invalid-feedback">
                                      Please enter your phone number.
                                  </div>
                              </div>
                          </div>
                      </div>
                      <hr className="my-4"/>
                      <button className="w-100 btn btn-danger btn-lg" type="submit">Save changes</button>
                  </form>
              )}
            </div>
            <ProfileNavBar username={username}/>
      </>
    )
}

export {ProfileEditPage}