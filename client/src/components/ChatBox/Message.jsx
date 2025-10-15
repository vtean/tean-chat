import { memo } from "react";
import { Stack } from "react-bootstrap";
import moment from "moment";
import "./ChatBox.scss";

const Message = memo(({ message, isOwnMessage, isLast, scrollRef }) => {
    return (
        <Stack
            className={`${
                isOwnMessage
                    ? "message self align-self-end flex-grow-0"
                    : "message align-self-start flex-grow-0"
            }`}
            ref={isLast ? scrollRef : null}>
            <span>{message.text}</span>
            <span className="message-footer">{moment(message.createdAt).calendar()}</span>
        </Stack>
    );
});

Message.displayName = "Message";

export default Message;
