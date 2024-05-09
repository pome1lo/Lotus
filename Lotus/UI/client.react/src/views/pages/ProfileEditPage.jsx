import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import {ProfileNavBar} from "../components/ProfileNavBar";
import {fetchWithAuth} from "../../services/fetchWithAuth/fetchWithAuth";
import {ErrorMessage} from "../components/ErrorMessage";

const ProfileEditPage = () => {
    const {username} = useParams();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const fileInput = useRef();
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    const [inputUserName, setUserName] = useState('');
    const [inputFirstName, setFirstName] = useState('');
    const [inputLastName, setLastName] = useState('');
    const [currentUserId, setCurrentId] = useState('');

    useEffect(() => {
        fetchWithAuth(`https://localhost:31903/api/profile/${username}`)
            .then(res => {
                return res.json();
            })
            .then(data => setUser(data))
        setCurrentId(sessionStorage.getItem('user_id'));

    }, [username, navigate]);

    async function fetchData() {
        const response = await fetchWithAuth('https://localhost:31903/api/account/personal', {
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
            window.location.reload();
        } else {
            console.error('Ошибка входа:', data.message);
        }
    }

    async function changeProfileImage() {
        const file = fileInput.current.files[0];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('user_id', currentUserId);

        const response = await fetchWithAuth('https://localhost:31903/api/profile/image', {
            method: 'PUT',
            body: formData
        });
        const data = await response.json();
        if (!response.ok) {
            return;
        }
        if (response.ok) {
            navigate(`/profile/${username}`);
        } else {
            console.error('Ошибка входа:', data.message);
        }
    }

    return (
      <>
          <div className={`col-md-7 order-md-3`}>
              <div className="row g-5">
                  {user && (
                      <form className="needs-validation " noValidate="">
                          <div className="row align-items-center">
                              <div className="col-sm-6 d-flex flex-column align-items-center">
                                  {user && <img src={user.PROFILE_PICTURE} className="w-50" alt={"content"}/>}
                                  <button type="button" className="btn btn-outline-secondary" data-bs-toggle="modal"
                                          data-bs-target="#exampleModal">
                                      Change
                                  </button>

                                  <div className="modal fade" id="exampleModal" tabIndex="-1"
                                       aria-labelledby="exampleModalLabel" aria-hidden="true">
                                      <div className="modal-dialog">
                                          <div className="modal-content">
                                              <div className="modal-header">
                                                  <h5 className="modal-title" id="exampleModalLabel">Profile image</h5>
                                                  <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                          aria-label="Close"></button>
                                              </div>
                                              <div className="modal-body">
                                                  <input type="file" ref={fileInput} className="form-control"
                                                         aria-label="Large file input example"/>
                                              </div>
                                              <div className="modal-footer">
                                              <button type="button" className="btn btn-outline-secondary  btn-sm"
                                                          data-bs-dismiss="modal">Close
                                                  </button>
                                                  <button type="button" className="btn btn-danger btn-sm" onClick={changeProfileImage}>Save changes
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
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
          <ErrorMessage message={errorMessage} isVisible={showError} />
      </>
    )
}

export {ProfileEditPage}