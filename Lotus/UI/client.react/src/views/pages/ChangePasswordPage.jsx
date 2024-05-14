import {ProfileNavBar} from "../components/ProfileNavBar";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {authFetch, customFetch} from "../../services/fetchWithAuth/customFetch";
import {ErrorMessage} from "../components/ErrorMessage";

const ChangePasswordPage = () => {
    const {username} = useParams();
    const [inputNewPassword, setNewPassword] = useState('');
    const [inputConfirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if(username !== sessionStorage.getItem('username')) {
            navigate('/login')
        }
    }, []);

    async function changePassowrd(event) {
        event.preventDefault();

        if(inputNewPassword !== inputConfirmPassword) {
            setErrorMessage("Password and password confirmation are different.");
            setShowError(true);
        }
        else {
            const response = await customFetch('/api/profile/account/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    new_password: inputNewPassword
                })
            });
            const data = await response.json();
            if (!response.ok) {
                setErrorMessage(data.message);
                setShowError(true);
                return;
            }
            if (response.ok) {
                sessionStorage.setItem('token', data.token);
                navigate(`/profile/${username}`);
            } else {
                setErrorMessage(data.message);
                setShowError(true);
            }
        }
    }
    async function deleteAccount() {
        const response = await authFetch('https://localhost:31903/api/profile/account', {
            method: 'DELETE'
        });
        const data = await response.json();
        if (!response.ok) {
            setErrorMessage(data.message);
            setShowError(true);
            return;
        }
        if (response.ok) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('username');
            window.location.reload();
            navigate(`/`);
        } else {
            setErrorMessage(data.message);
            setShowError(true);
        }
    }

    return (
        <>
            <div className="col-md-7 order-lg-2 row mt-4">
                <form className="col-xl-6" onSubmit={changePassowrd}>
                    <h4>Change password {username}</h4>
                    <hr className="mb-3 mt-3"/>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword2" className="form-label">New password</label>
                        <input type="password" className="form-control" id="exampleInputPassword2" required
                               value={inputNewPassword} onChange={(e) => setNewPassword(e.target.value)}/>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="exampleInputPassword3" className="form-label">Confirm password</label>
                        <input type="password" className="form-control" id="exampleInputPassword3" required
                               value={inputConfirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    </div>
                    <button className="w-100 btn btn-outline-secondary" type="submit" >
                        Save changes
                    </button>
                </form>
                    <div>
                        <h4 className="mt-3">Delete account</h4>
                        <hr className="mb-3 mt-3"/>
                        <p>Once you delete your account, there is no going back. Please be certain.</p>
                        <button type="button" className="btn btn btn-outline-secondary red-color" data-bs-toggle="modal"
                                data-bs-target="#staticBackdrop">
                            Delete account
                        </button>
                        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static"
                             data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel"
                             aria-hidden="true">
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="staticBackdropLabel">Delete account</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal"
                                                aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        Are you sure you want to delete your account? All your data will be permanently deleted.
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn btn-outline-secondary"
                                                data-bs-dismiss="modal">Cancel
                                        </button>
                                        <button type="button" className="btn btn-danger" onClick={deleteAccount}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
            <ProfileNavBar username={username}/>
            <ErrorMessage message={errorMessage} isVisible={showError} />
        </>
    )
}

export {ChangePasswordPage}