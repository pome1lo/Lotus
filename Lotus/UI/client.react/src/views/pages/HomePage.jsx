import React from "react";

const HomePage = () => {
    return (
        <>
            <div className="col-md-10 order-md-2">
                <h1 className="text-body-emphasis">Lotus Project</h1>
                <p className="fs-5 col-md-8">A comprehensive microservices-based architecture, Lotus seamlessly integrates multiple technologies to provide a scalable and robust backend with a reactive frontend experience.</p>
                <p className="fs-5 col-md-8">Lotus is designed to be a high-performance, scalable solution for modern web applications, leveraging the power of microservices and a reactive user interface. It's built with flexibility in mind, allowing for seamless integration with various databases and messaging systems.</p>
                <hr className="col-3 col-md-2 mb-5"/>
                <div className="row g-4">
                    <div className="col-md-6">
                        <h2 className="text-body-emphasis">Starter projects</h2>
                        <p>Ready to beyond the starter template? Check out these open source projects that you can
                            quickly duplicate to a new GitHub repository.</p>
                        <ul className="list-unstyled ps-0">
                            <li>
                                <a className="icon-link mb-1"
                                   href="https://github.com/pome1lo/Lotus#introduction" rel="noopener">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-box-fill" viewBox="0 0 16 16">
                                        <path d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001 6.971 2.789Zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z"/>
                                    </svg>
                                    Introduction
                                </a>
                            </li>
                            <li>
                                <a className="icon-link mb-1"
                                   href="https://github.com/pome1lo/Lotus#architecture" rel="noopener" >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-box-fill" viewBox="0 0 16 16">
                                        <path d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001 6.971 2.789Zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z"/>
                                    </svg>
                                    Architecture
                                </a>
                            </li>
                            <li>
                                <a className="icon-link mb-1"
                                   href="https://github.com/pome1lo/Lotus?tab=readme-ov-file#technologies"
                                   rel="noopener">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-box-fill" viewBox="0 0 16 16">
                                        <path d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001 6.971 2.789Zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z"/>
                                    </svg>
                                    Technologies
                                </a>
                            </li>
                            <li>
                                <a className="icon-link mb-1"
                                   href="https://github.com/pome1lo/Lotus?tab=readme-ov-file#getting-started"
                                   rel="noopener">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-box-fill" viewBox="0 0 16 16">
                                        <path d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001 6.971 2.789Zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z"/>
                                    </svg>
                                    Getting Started
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="col-md-6">
                        <h2 className="text-body-emphasis">Guides</h2>
                        <p>Read more detailed instructions and documentation on using or contributing to
                            Lotus.</p>
                        <ul className="list-unstyled ps-0">
                            <li>
                                <a className="icon-link mb-1"
                                   href="https://github.com/pome1lo/Lotus?tab=readme-ov-file#installation">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-box-fill" viewBox="0 0 16 16">
                                        <path d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001 6.971 2.789Zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z"/>
                                    </svg>
                                    Installation
                                </a>
                            </li>
                            <li>
                                <a className="icon-link mb-1"
                                   href="https://github.com/pome1lo/Lotus?tab=readme-ov-file#usage">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-box-fill" viewBox="0 0 16 16">
                                        <path d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001 6.971 2.789Zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z"/>
                                    </svg>
                                    Usage
                                </a>
                            </li>
                            <li>
                                <a className="icon-link mb-1"
                                   href="https://github.com/pome1lo/Lotus?tab=readme-ov-file#contributing">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-box-fill" viewBox="0 0 16 16">
                                        <path d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001 6.971 2.789Zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z"/>
                                    </svg>
                                    Contributing
                                </a>
                            </li>
                            <li>
                                <a className="icon-link mb-1"
                                   href="https://github.com/pome1lo/Lotus?tab=readme-ov-file#license">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-box-fill" viewBox="0 0 16 16">
                                        <path d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001 6.971 2.789Zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z"/>
                                    </svg>
                                    License
                                </a>
                            </li>
                            <li>
                                <a className="icon-link mb-1"
                                   href="https://github.com/pome1lo/Lotus?tab=readme-ov-file#contact">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                         fill="currentColor" className="bi bi-box-fill" viewBox="0 0 16 16">
                                        <path d="M15.528 2.973a.75.75 0 0 1 .472.696v8.662a.75.75 0 0 1-.472.696l-7.25 2.9a.75.75 0 0 1-.557 0l-7.25-2.9A.75.75 0 0 1 0 12.331V3.669a.75.75 0 0 1 .471-.696L7.443.184l.004-.001.274-.11a.75.75 0 0 1 .558 0l.274.11.004.001 6.971 2.789Zm-1.374.527L8 5.962 1.846 3.5 1 3.839v.4l6.5 2.6v7.922l.5.2.5-.2V6.84l6.5-2.6v-.4l-.846-.339Z"/>
                                    </svg>
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export {HomePage};
