import '../../assets/css/Recommendations.css';
import img1 from "../../assets/images/content/1.png";
import img2 from "../../assets/images/content/2.png";
import img3 from "../../assets/images/content/3.png";
import img4 from "../../assets/images/content/4.png";
import img5 from "../../assets/images/content/5.png";
import Logo from "../../assets/images/logo/logo.png";
import Avatar from "../../assets/images/content/test_Avatar.png";
import {Publisher} from "./Publisher";

const Recommendations = () => {
    return (
        <div className="col-md-4 order-md-3 three">
            <aside className="bd-aside sticky-xl-top">
                <div className="themes">
                    <img src={Logo} alt={"logo"}/>
                    <h3>Themes in the Lotus</h3>
                </div>
                <div className="row display-none">
                    <div className="col-md-8">
                        <div className="row mb-3 text-center">
                            <div className="col-md-6 card-item shared-card-item">
                                <span>Food</span>
                                <img src={img1} alt={""}/>
                            </div>
                            <div className="col-md-6 card-item shared-card-item">
                                <span>Beauty</span>
                                <img src={img2} alt={""}/>
                            </div>
                            <div className="col-md-6 card-item shared-card-item">
                                <span>Games</span>
                                <img src={img3} alt={""}/>
                            </div>
                            <div className="col-md-6 card-item shared-card-item">
                                <span>Gadgets</span>
                                <img src={img4} alt={""}/>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 shared-card-item big-card-item">
                        <span>Journeys</span>
                        <img src={img5} alt={""}/>
                    </div>
                </div>


                <div className="p-4 mb-3 bg-body-tertiary rounded about">
                    <h5 className="fst-italic">About</h5>
                    <p className="mb-0">Customize this section to tell your visitors a little bit about your
                        publication,
                        writers, content, or something else entirely. Totally up to you.</p>
                </div>

                <div className="display-none">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className="">Recommendations for you</h6>
                        <button className="btn btn-outline-secondary button-all">All</button>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                        <Publisher avatar={Avatar} nickname="Travis Scott" info="31 Jan. 15:23"/>
                        <a href="#">Subscribe</a>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <Publisher avatar={Avatar} nickname="Travis Scott" info="31 Jan. 15:23"/>
                        <a href="#">Subscribe</a>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <Publisher avatar={Avatar} nickname="Travis Scott" info="31 Jan. 15:23"/>
                        <a href="#">Subscribe</a>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <Publisher avatar={Avatar} nickname="Travis Scott" info="31 Jan. 15:23"/>
                        <a href="#">Subscribe</a>
                    </div>
                </div>
            </aside>
        </div>
    );
}

export {Recommendations};