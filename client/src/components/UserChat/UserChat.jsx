import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import Moment from "react-moment";
import "./UserChat.scss";

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { currentChat, onlineUsers, lastMessages } = useContext(ChatContext);

    const isOnline = onlineUsers?.some((usr) => usr?.userId === recipientUser?._id);
    const lastMessage = lastMessages?.find((msg) => msg?.chatId === chat?._id);

    return (
        <Stack
            direction="horizontal"
            gap={3}
            className={`${
                currentChat?._id === chat?._id
                    ? "user-card active align-items-center p-2 justify-content-between"
                    : "user-card align-items-center p-2 justify-content-between"
            }`}
            role="button">
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
                    <Moment format="YYYY/MM/DD">{lastMessage?.createdAt}</Moment>
                </div>
                {/* <div className="this-user-notifications">3</div> */}
            </div>
        </Stack>
    );
};

export default UserChat;
