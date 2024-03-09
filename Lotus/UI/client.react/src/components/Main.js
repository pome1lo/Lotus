import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Post from "./Post";
import Recommendations from "./Recommendations";
function Main(){
    return(
        <div className="container-xxl">
            <Header/>
                <main className="container-xxl">
                    <div className="row g-4">
                        <Sidebar/>
                        <div className="col-md-6 order-md-1 two">
                            <Post/>
                            <Post/>
                            <Post/>
                            <Post/>
                        </div>
                        <Recommendations />
                    {/*<Profile/>*/}
                    </div>
                </main>
            <Footer/>
        </div>
    );
}
export default Main;