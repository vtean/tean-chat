import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";

const ChatBox = () => {
    const { user } = useContext(AuthContext);
    const { currentChat, messages, isMessagesLoading } = useContext(ChatContext);
    const { recipientUser } = useFetchRecipientUser(currentChat, user);

    if (!recipientUser)
        return (
            <p
                className="text-center"
                style={{ width: "100%" }}>
                Choose a person to start chatting!
            </p>
        );

    if (isMessagesLoading)
        return (
            <p
                className="text-center"
                style={{ width: "100%" }}>
                Loading...
            </p>
        );

    return (
        <Stack
            gap={4}
            className="chat-box">
            <div className="chat-header">
                <strong>{recipientUser?.name}</strong>
            </div>
            <Stack
                gap={3}
                className="messages">
                {messages &&
                    messages.map((message, index) => (
                        <Stack
                            key={index}
                            className={`${
                                message?.senderId === user?._id
                                    ? "message self align-self-end flex-grow-0"
                                    : "message align-self-start flex-grow-0"
                            }`}>
                            <span>{message.text}</span>
                            <span className="message-footer">
                                {moment(message.createdAt).calendar()}
                            </span>
                        </Stack>
                    ))}
            </Stack>
        </Stack>
    );
};

export default ChatBox;
