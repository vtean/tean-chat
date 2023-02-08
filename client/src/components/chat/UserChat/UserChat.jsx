import { useFetchRecipientUser } from "../../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import avatar from "../../../assets/avatar.svg";
import { useContext } from "react";
import { ChatContext } from "../../../context/ChatContext";
import "./UserChat.scss";

const UserChat = ({ chat, user }) => {
    const { recipientUser } = useFetchRecipientUser(chat, user);
    const { currentChat } = useContext(ChatContext);

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
                        {recipientUser?.name} <div className="user-online"></div>
                    </div>
                    <div className="text">Text Message</div>
                </div>
            </div>
            <div className="d-flex flex-column align-items-end">
                <div className="date">01/01/2023</div>
                <div className="this-user-notifications">3</div>
            </div>
        </Stack>
    );
};

export default UserChat;
