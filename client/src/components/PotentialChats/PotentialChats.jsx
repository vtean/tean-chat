import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import "./PotentialChats.scss";

const PotentialChats = () => {
    const { user } = useContext(AuthContext);
    const {
        potentialChats,
        isPotentialChatsLoading,
        createChat,
        setSendTextMessageError,
        onlineUsers,
    } = useContext(ChatContext);

    if (isPotentialChatsLoading) return <span>Loading potential chats...</span>;

    return (
        <>
            <div className="all-users">
                {potentialChats &&
                    potentialChats.map((u, index) => {
                        return (
                            <div
                                className="single-user"
                                key={index}
                                onClick={() => {
                                    setSendTextMessageError(null);
                                    createChat(user._id, u._id);
                                }}>
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
};

export default PotentialChats;
