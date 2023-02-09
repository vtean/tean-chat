import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";
import "./Notification.scss";

const Notification = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useContext(AuthContext);
    const { notifications, userChats, allUsers, markNotificationsRead, markNotificationRead } =
        useContext(ChatContext);
    const unreadNotifications = unreadNotificationsFunc(notifications);
    const notificationsArr = notifications.map((n) => {
        const sender = allUsers.find((usr) => usr._id === n.senderId);

        return {
            ...n,
            senderName: sender?.name,
        };
    });

    return (
        <div className="notifications">
            <div
                className="notifications__icon"
                onClick={() => setIsOpen(!isOpen)}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    className="bi bi-chat-left-fill"
                    viewBox="0 0 16 16">
                    <path d="M2 0a2 2 0 0 0-2 2v12.793a.5.5 0 0 0 .854.353l2.853-2.853A1 1 0 0 1 4.414 12H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
                </svg>
                {unreadNotifications?.length > 0 && (
                    <span className="notifications__count">
                        <span>{unreadNotifications.length}</span>
                    </span>
                )}
            </div>
            {isOpen && (
                <div className="notifications__box">
                    <div className="notifications__header">
                        <h3>Notifications</h3>
                        <div
                            className="mark-as-read"
                            onClick={() => markNotificationsRead(notifications)}>
                            Mark all as read
                        </div>
                    </div>
                    <div className="notifications__list">
                        {notificationsArr?.length === 0 ? (
                            <span className="notification">
                                There are currently no new notifications.
                            </span>
                        ) : (
                            notificationsArr.map((n, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={
                                            n.isRead ? "notification" : "notification not-read"
                                        }
                                        onClick={() => {
                                            markNotificationRead(n, userChats, user, notifications);
                                            setIsOpen(false);
                                        }}>
                                        <span>
                                            <strong>{n.senderName} </strong>
                                            sent you a message
                                        </span>
                                        <span className="notification__time">
                                            {moment(n.date).calendar()}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notification;
