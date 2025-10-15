import { useContext, useEffect, useRef, useState, memo, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useMessagesState, useMessagesDispatch } from "../../context/MessagesContext";
import { useChatsState } from "../../context/ChatsContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { Stack, Alert } from "react-bootstrap";
import InputEmoji from "react-input-emoji";
import Message from "./Message";
import "./ChatBox.scss";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ChatBox = memo(() => {
    const { user } = useContext(AuthContext);

    // Use separate contexts to minimize re-renders
    const { messages, isMessagesLoading, sendTextMessageError } = useMessagesState();
    const { sendTextMessage, setSendTextMessageError } = useMessagesDispatch();
    const { currentChat } = useChatsState();

    const { recipientUser } = useFetchRecipientUser(currentChat, user);
    const [textMessage, setTextMessage] = useState("");
    const scroll = useRef();

    // Only trigger scroll on message count change
    const messagesLength = messages?.length || 0;
    useEffect(() => {
        if (scroll.current && messagesLength > 0) {
            scroll.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messagesLength]);

    // Memoize send handler
    const handleSendMessage = useCallback(() => {
        if (currentChat && user && textMessage.trim()) {
            sendTextMessage(textMessage, user, currentChat._id, setTextMessage);
        }
    }, [textMessage, user, currentChat, sendTextMessage]);

    // Handle Enter key
    const handleKeyPress = useCallback(
        (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
            }
        },
        [handleSendMessage]
    );

    if (!recipientUser)
        return (
            <Stack
                className="chat-box justify-content-center align-items-center"
                style={{ width: "100%" }}>
                <span>
                    <strong>Choose a person to start chatting!</strong>
                </span>
            </Stack>
        );

    if (isMessagesLoading)
        return (
            <div
                className="chat-box"
                style={{ width: "100%" }}>
                <SkeletonTheme
                    baseColor="#272d36"
                    highlightColor="#303a48">
                    <Skeleton height={42} />
                    <Skeleton height={652} />
                    <Skeleton height={80} />
                </SkeletonTheme>
            </div>
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
                        <Message
                            key={message._id || `msg-${index}`}
                            message={message}
                            isOwnMessage={message?.senderId === user?._id}
                            isLast={index === messages.length - 1}
                            scrollRef={scroll}
                        />
                    ))}
            </Stack>
            {sendTextMessageError && (
                <Alert variant="danger">
                    <p>{sendTextMessageError}</p>
                </Alert>
            )}
            <Stack
                direction="horizontal"
                gap={3}
                className="chat-input flex-grow-0">
                <InputEmoji
                    value={textMessage}
                    onChange={setTextMessage}
                    fontFamily="Nunito"
                    borderColor="rgba(72, 112, 223, 0.2)"
                    onEnter={handleSendMessage}
                    onKeyDown={handleKeyPress}
                />
                <button
                    className="send-btn"
                    onClick={handleSendMessage}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-send"
                        viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                    </svg>
                </button>
            </Stack>
        </Stack>
    );
});

ChatBox.displayName = "ChatBox";

export default ChatBox;
