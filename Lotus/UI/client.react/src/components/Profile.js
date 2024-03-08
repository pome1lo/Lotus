import "../resources/css/Profile.css";
import Avatar from "../../src/resources/images/content/test_Avatar.png";
import Cover from "../../src/resources/images/content/cover.jpg";


function Profile() {
    return (
        <div className="col-md-10">
            <div className="bg-cover p-5 mb-4 bg-body-tertiary rounded-3">
                <div className="d-flex ava">
                    <div className="img-container profile-ava">
                        <img src={Avatar} alt="Ваше изображение"/>
                    </div>
                    <h1 className="display-4">Trabis Cott</h1>
                </div>
            </div>
        </div>
    );
}

export default Profile;