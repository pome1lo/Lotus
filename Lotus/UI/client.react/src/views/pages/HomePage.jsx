const HomePage = () => {
    return (
        <div id="carouselExampleDark" className="carousel carousel-dark slide" data-bs-ride="carousel">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" className="active"
                        aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1"
                        aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2"
                        aria-label="Slide 3"></button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active" data-bs-interval="10000">
                    <img src="https://vosnews.ru/wp-content/uploads/2022/05/k0f-te8rzde-1.jpg" className="d-block w-100"
                         alt="..." style={{height: '50vh', objectFit: 'cover', width: '100%'}}/>
                    <div className="carousel-caption d-none d-md-block">
                        <h1>First slide label</h1>
                        <p>Some representative placeholder content for the first slide.</p>
                    </div>
                </div>
                <div className="carousel-item" data-bs-interval="2000">
                    <img
                        src="https://g.foolcdn.com/image/?url=https%3A//g.foolcdn.com/editorial/images/495788/hands-typing-on-laptop-with-social-media-icons.jpg"
                        className="d-block w-100" alt="..." style={{height: '50vh', objectFit: 'cover', width: '100%'}}/>
                    <div className="carousel-caption d-none d-md-block">
                        <h5>Second slide label</h5>
                        <p>Some representative placeholder content for the second slide.</p>
                    </div>
                </div>
                <div className="carousel-item">
                    <img src="https://www.movisie.nl/sites/movisie.nl/files/2020-06/jongerenparticipatie_0.jpg"
                         className="d-block w-100" alt="..." style={{height: '50vh', objectFit: 'cover', width: '100%'}}/>
                    <div className="carousel-caption d-none d-md-block">
                        <h5>Third slide label</h5>
                        <p>Some representative placeholder content for the third slide.</p>
                    </div>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark"
                    data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleDark"
                    data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    );
}

export {HomePage};
