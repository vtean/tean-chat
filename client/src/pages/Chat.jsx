import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/UserChat/UserChat";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/PotentialChats/PotentialChats";
import ChatBox from "../components/ChatBox/ChatBox";

const Chat = () => {
    const { user } = useContext(AuthContext);
    const { userChats, isUserChatsLoading, updateCurrentChat, setSendTextMessageError } =
        useContext(ChatContext);

    return (
        <Container>
            <PotentialChats />
            {isUserChatsLoading && <p>Loading chats...</p>}
            {!isUserChatsLoading && (!userChats || userChats?.length < 1) && (
                <p>No chats available. Start a conversation by selecting a user above!</p>
            )}
            {!isUserChatsLoading && userChats && userChats?.length > 0 && (
                <Stack
                    direction="horizontal"
                    gap={4}
                    className="align-items-start">
                    <Stack
                        className="messages-box flex-grow-0 pe-3"
                        gap={3}>
                        {userChats?.map((chat, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => {
                                        setSendTextMessageError(null);
                                        updateCurrentChat(chat);
                                    }}>
                                    <UserChat
                                        chat={chat}
                                        user={user}
                                    />
                                </div>
                            );
                        })}
                    </Stack>
                    <ChatBox />
                </Stack>
            )}
        </Container>
    );
};

export default Chat;
