import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ChatContext } from "../../../context/ChatContext";
import "./PotentialChats.scss";

const PotentialChats = () => {
    const { user } = useContext(AuthContext);
    const { potentialChats, createChat, setSendTextMessageError } = useContext(ChatContext);
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
                                <span className="user-online"></span>
                            </div>
                        );
                    })}
            </div>
        </>
    );
};

export default PotentialChats;
