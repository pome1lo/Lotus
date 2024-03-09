import "../assets/css/Form.css";
import Logo from "../assets/images/logo/logo.png";
import Login from "./Login";
import Auth from "./Auth";

function Form() {
    return (
        <main className="d-flex flex-column align-items-center justify-content-center py-4 form-signin w-100">
            <img className="mb-3" src={Logo} alt="" width="72"/>
            <Login/>
            {/*<Auth/>*/}
        </main>
    );
}

export default Form;
