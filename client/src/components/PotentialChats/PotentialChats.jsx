import { useContext, memo, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useMessagesDispatch } from "../../context/MessagesContext";
import "./PotentialChats.scss";

const PotentialChats = memo(() => {
    const { user } = useContext(AuthContext);
    const { potentialChats, isPotentialChatsLoading, createChat, onlineUsers } =
        useContext(ChatContext);
    const { setSendTextMessageError } = useMessagesDispatch();

    const handleCreateChat = useCallback(
        (userId) => {
            setSendTextMessageError(null);
            createChat(user._id, userId);
        },
        [user._id, createChat, setSendTextMessageError]
    );

    if (isPotentialChatsLoading) return <span>Loading potential chats...</span>;

    return (
        <>
            <div className="all-users">
                {potentialChats &&
                    potentialChats.map((u) => {
                        return (
                            <div
                                className="single-user"
                                key={u._id}
                                onClick={() => handleCreateChat(u._id)}>
                                {u.name}
                                <span
                                    className={
                                        onlineUsers?.some((usr) => usr?.userId === u?._id)
                                            ? "user-online"
                                            : "user-offline"
                                    }></span>
                            </div>
                        );
                    })}
            </div>
        </>
    );
});

PotentialChats.displayName = "PotentialChats";

export default PotentialChats;
