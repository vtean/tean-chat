import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import Moment from "react-moment";
import "./UserChat.scss";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { currentChat, onlineUsers, lastMessages, notifications, markThisUserNotificationsRead } =
        useContext(ChatContext);

    const isOnline = onlineUsers?.some((usr) => usr?.userId === recipientUser?._id);
    const lastMessage = lastMessages?.find((msg) => msg?.chatId === chat?._id);
    const unreadNotifications = unreadNotificationsFunc(notifications);
    const userNotifications = unreadNotifications?.filter((n) => n.senderId === recipientUser?._id);

    return (
        <Stack
            direction="horizontal"
            gap={3}
            className={`${
                currentChat?._id === chat?._id
                    ? "user-card active align-items-center p-2 justify-content-between"
                    : "user-card align-items-center p-2 justify-content-between"
            }`}
            role="button"
            onClick={() => {
                if (userNotifications.length > 0)
                    markThisUserNotificationsRead(userNotifications, notifications);
            }}>
            <div className="d-flex">
                <div className="me-2">
                    <img
                        src={avatar}
                        height="35px"
                        alt="avatar"
                    />
                </div>
                <div className="text-content">
                    <div className="name">
                        {recipientUser?.name}{" "}
                        <span className={isOnline ? "user-online" : "user-offline"}></span>
                    </div>
                    <div className="text">{lastMessage?.text}</div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">
                    <Moment format="DD/MM/YYYY">{lastMessage?.createdAt}</Moment>
                </div>
                {userNotifications.length > 0 && (
                    <div className="this-user-notifications">{userNotifications.length}</div>
                )}
            </div>
        </Stack>
    );
};

export default UserChat;
