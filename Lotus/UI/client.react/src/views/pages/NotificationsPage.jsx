import {useEffect, useState} from "react";
import {fetchWithAuth} from "../../services/fetchWithAuth/fetchWithAuth";
import {Link} from "react-router-dom";
import {Publisher} from "../components/Publisher";
import {SubscriptionButton} from "../components/SubscriptionButton";

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState();

    useEffect(() => {
        fetchWithAuth(`https://localhost:31902/api/notify/email`)
            .then(response => {
                if (response) {
                    response.json().then(data => {
                        console.log(data.notifications);
                        setNotifications(data.notifications);
                    });
                }
            })
    }, []);
    return(
        <>
            <div className="col-md-8 order-md-2">
                <h6 className="border-bottom pb-2 mb-0 mt-5">Notifications</h6>
                {notifications && (
                    notifications.map((item) => (
                        <>
                            <div className="d-flex flex-wrap justify-content-between mt-3"
                                 data-aos="fade-up" data-aos-anchor-placement="center-bottom"
                                 data-aos-duration="750">
                                <Publisher key={item.ID}
                                   avatar={"https://localhost:31903/" + item.IMAGE}
                                   nickname={item.AUTHOR}
                                   info={`${new Date(item.PUBLISHED_AT).toLocaleString("en", {
                                       day: '2-digit',
                                       month: 'short',
                                       hour: '2-digit',
                                       minute: '2-digit'
                                   })}`}
                                />
                                <p className="mt-2 border-bottom pb-4">
                                    {item.CONTENT}
                                </p>
                            </div>
                        </>
                    ))
                )}
            </div>
        </>
    )
}

export { NotificationsPage }