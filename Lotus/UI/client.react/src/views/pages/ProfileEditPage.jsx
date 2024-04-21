import {Link, NavLink, useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {ProfileNavBar} from "../components/ProfileNavBar";

const ProfileEditPage = () => {
    const {posts, setPosts} = useState(null);
    const {username} = useParams();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    const [inputUserName, setUserName] = useState('');
    const [inputFirstName, setFirstName] = useState('');
    const [inputLastName, setLastName] = useState('');
    const [inputPhoneNumber, setPhoneNumber] = useState('');

    const CURRENT_USER_ID = sessionStorage.getItem('username');

    useEffect(() => {
        fetch(`https://localhost:31903/api/profile/${username}`)
            .then(res => {
                if (!res.ok && res.status === 404) {
                    navigate('/not-found');
                }
                return res.json();
            })
            .then(data => setUser(data))
    }, [username, navigate]);

    async function fetchData() {
        const response = await fetch('https://localhost:31903/api/account/personal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: user.ID,
                username: inputUserName,
                firstname: inputFirstName,
                lastname: inputLastName
            })
        });
        if (!response.ok) {
            //console.error('Ошибка входа:', response.statusText);
            const data = await response.json();
            console.log(data.message);
            return;
        }

        const data = await response.json();
        if (response.ok) {
            console.log("TOKEN", data.token);
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('username', data.username);
            navigate(`/profile/${username}`);
        } else {
            console.error('Ошибка входа:', data.message);
        }
    }

    return (
      <>
          <div className={`col-md-8 order-md-3`}>
              <div className="row g-5">
                  {user && (
                      <form className="needs-validation " noValidate="">
                          <div className="row align-items-center">
                              <div className="col-sm-6 d-flex flex-column align-items-center">
                                  <img src={user.PROFILE_PICTURE} alt="" className="w-50"/>
                                  <button className="btn btn-outline-secondary  py-2 px-5 mt-3" data-bs-toggle="modal"
                                          data-bs-target="#staticBackdrop" type="button">Change
                                  </button>

                              </div>
                              <div className="col-sm-6 ">
                                  <div className="row g-3 mb-3">
                                      <div className="col-sm-6">
                                          <label htmlFor="firstName" className="form-label">First name</label>
                                          <input type="text" className="form-control" id="firstName"
                                                 placeholder="Input your first name" value={inputFirstName}
                                                 onChange={(e) => setFirstName(e.target.value)}
                                                 defaultValue={`${user.FIRST_NAME == null ? "" : user.FIRST_NAME}`}
                                                 required=""/>
                                          <div className="invalid-feedback">
                                              Valid first name is required.
                                          </div>
                                      </div>
                                      <div className="col-sm-6 ">
                                          <label htmlFor="lastName" className="form-label">Last name</label>
                                          <input type="text" className="form-control" id="lastName"
                                                 placeholder="Input your last name" value={inputLastName}
                                                 onChange={(e) => setLastName(e.target.value)}
                                                 defaultValue={`${user.LAST_NAME == null ? "" : user.LAST_NAME}`}
                                                 required=""/>
                                          <div className="invalid-feedback">
                                              Valid last name is required.
                                          </div>
                                      </div>
                                  </div>
                                  <div className="col-12 mb-3">
                                      <label htmlFor="Username" className="form-label">Username</label>
                                      <input type="text" className="form-control" id="Username"
                                             placeholder="Input your username" value={inputUserName}
                                             onChange={(e) => setUserName(e.target.value)}
                                             defaultValue={`${user.USERNAME == null ? "" : user.USERNAME}`}
                                             required=""/>
                                      <div className="invalid-feedback">
                                          Please enter your username.
                                      </div>
                                  </div>
                                  <div className="col-12 mb-3">
                                      <label htmlFor="Email" className="form-label">Email</label>
                                      <input type="text" className="form-control" id="Email"
                                             placeholder="Input your email"
                                             defaultValue={`${user.EMAIL == null ? "" : user.EMAIL}`}
                                             required=""/>
                                      <div className="invalid-feedback">
                                          Please enter your email.
                                      </div>
                                  </div>
                                  <div className="col-12 mb-3">
                                      <label htmlFor="number" className="form-label">Phone number</label>
                                      <input type="text" className="form-control" id="number"
                                             placeholder="Input your phone number"
                                             onChange={(e) => setPhoneNumber(e.target.value)}
                                             defaultValue={`${user.PHONE_NUMBER == null ? "" : user.PHONE_NUMBER}`}
                                             required=""/>
                                      <div className="invalid-feedback">
                                          Please enter your phone number.
                                      </div>
                                  </div>
                                  <hr className="my-4"/>
                                  <button className="w-100 btn btn-danger btn-lg" type="button" onClick={fetchData}>
                                      Save changes
                                  </button>
                              </div>
                          </div>
                          <hr className="my-4"/>

                      </form>
                  )}
              </div>
          </div>
          <ProfileNavBar username={username}/>
      </>
    )
}

export {ProfileEditPage}