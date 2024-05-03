import {ProfileNavBar} from "../components/ProfileNavBar";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";

const ChangePasswordPage = () => {
    const {username} = useParams();
    const [inputCurrentPassword, setCurrentPassword] = useState('');
    const [inputNewPassword, setNewPassword] = useState('');
    const [inputConfirmPassword, setConfirmPassword] = useState('');

    const navigate = useNavigate();
    const [user, setUser] = useState(null);

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

    async function changePassowrd() {
        const response = await fetch('https://localhost:31903/api/account/security', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: user.ID,
                password: inputNewPassword
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
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('username', data.username);
            navigate(`/profile/${username}`);
        } else {
            console.error('Ошибка входа:', data.message);
        }
    }
    async function deleteAccount() {
        const response = await fetch('https://localhost:31903/api/account/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({
                id: user.ID
            })
        });
        if (!response.ok) {
            //console.error('Ошибка входа:', response.statusText);
            return;
        }
        const data = await response.json();
        console.log(data.message);
        if (response.ok) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('username');
            navigate(`/`);
        } else {
            console.error('Error:', data.message);
        }
    }

    return (
        <>
            <div className="col-md-7 order-lg-2 row mt-4">
                <form className="col-xl-6">
                    <h4>Change password {username}</h4>
                    <hr className="mb-3 mt-3"/>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Current password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1"
                               value={inputCurrentPassword} onChange={(e) => setCurrentPassword(e.target.value)}/>
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword2" className="form-label">New password</label>
                        <input type="password" className="form-control" id="exampleInputPassword2"
                               value={inputNewPassword} onChange={(e) => setNewPassword(e.target.value)}/>/>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="exampleInputPassword3" className="form-label">Confirm password</label>
                        <input type="password" className="form-control" id="exampleInputPassword3"
                               value={inputConfirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>/>
                    </div>
                    <button className="w-100 btn btn-outline-secondary" type="button" onClick={changePassowrd}>
                        Save changes
                    </button>
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
                </form>
            </div>
            <ProfileNavBar username={username}/>
        </>
    )
}

export {ChangePasswordPage}