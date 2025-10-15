import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import { memo, useMemo, useContext } from "react";
import { useChatsState, useChatsDispatch } from "../../context/ChatsContext";
import { ChatContext } from "../../context/ChatContext";
import Moment from "react-moment";
import "./UserChat.scss";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";

const UserChat = memo(({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { currentChat } = useChatsState();
    const { updateCurrentChat } = useChatsDispatch();

    // Only get needed values from main context
    const {
        onlineUsers,
        lastMessages,
        notifications,
        markThisUserNotificationsRead,
        markAllMessagesRead,
        setSendTextMessageError,
    } = useContext(ChatContext);

    // Memoize all computed values
    const isOnline = useMemo(
        () => onlineUsers?.some((usr) => usr?.userId === recipientUser?._id),
        [onlineUsers, recipientUser?._id]
    );

    const lastMessage = useMemo(
        () => lastMessages?.find((msg) => msg?.chatId === chat?._id),
        [lastMessages, chat?._id]
    );

    const unreadNotifications = useMemo(
        () => unreadNotificationsFunc(notifications),
        [notifications]
    );

    const userNotifications = useMemo(
        () => unreadNotifications?.filter((n) => n.senderId === recipientUser?._id),
        [unreadNotifications, recipientUser?._id]
    );

    const isActive = useMemo(() => currentChat?._id === chat?._id, [currentChat?._id, chat?._id]);

    const handleClick = useMemo(
        () => () => {
            setSendTextMessageError(null);
            updateCurrentChat(chat);
            if (userNotifications.length > 0) {
                markThisUserNotificationsRead(userNotifications, notifications);
            }
            markAllMessagesRead(recipientUser, chat?.id);
        },
        [
            setSendTextMessageError,
            updateCurrentChat,
            chat,
            userNotifications,
            notifications,
            markThisUserNotificationsRead,
            markAllMessagesRead,
            recipientUser,
        ]
    );

    return (
        <Stack
            direction="horizontal"
            gap={3}
            className={`${
                isActive
                    ? "user-card active align-items-center p-2 justify-content-between"
                    : "user-card align-items-center p-2 justify-content-between"
            }`}
            role="button"
            onClick={handleClick}>
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
});

UserChat.displayName = "UserChat";

export default UserChat;
