import Logo from "../../assets/images/logo/logo.png";
import React, {useEffect, useState} from "react";

const AuthorizationPage = () => {
    const [inputCode, setCode] = useState('');
    const [timeLeft, setTimeLeft] = useState(10);
    const [isButtonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timerId);
        } else {
            setButtonDisabled(false);
        }
    }, [timeLeft]);

    async function register() {
        console.log('great!');
    }

    async function sendAgain() {
        console.log('great!');
        setTimeLeft(10);
        setButtonDisabled(true);
    }

    return (
        <>
            <main className="d-flex flex-column align-items-center justify-content-center py-4 form-signin w-100">
                <img className="mb-3" src={`${Logo}`} alt="" width="72"/>

                <form onSubmit={register} className={"text-center form-signin"}>
                    <h2 className="h4 mb-3 fw-medium">Insert the code</h2>
                    <div className={"form-floating"}>
                        <input type="number" className="form-control" id="floatingPassword" placeholder="Code" required
                               value={inputCode} onChange={(e) => setCode(e.target.value)}/>
                        <label htmlFor="floatingPassword">Code</label>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <button className="btn btn-link rounded-pill rememberMe redHover" disabled={isButtonDisabled}
                                type="button" onClick={sendAgain}>Send again
                        </button>
                        <p className={"rememberMe"}>{timeLeft > 0 ? `0:${timeLeft} c.` : '0:0 c.'}</p>
                    </div>
                    <button className="btn  btn-danger w-100 py-2" type="submit">Verify</button>
                </form>

            </main>
        </>
    );
}

export {AuthorizationPage}