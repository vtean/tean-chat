import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, socketUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [lastMessages, setLastMessages] = useState([]);
    const [isLastMessagesLoading, setIsLastMessagesLoading] = useState(false);

    console.log(lastMessages);

    // initialize socket
    useEffect(() => {
        const newSocket = io(socketUrl);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [user]);

    // add online users
    useEffect(() => {
        if (socket === null) return;
        socket.emit("addNewUser", user?._id);
        socket.on("getOnlineUsers", (res) => {
            setOnlineUsers(res);
        });

        return () => {
            socket.off("getOnlineUsers");
        };
    }, [socket]);

    // send message
    useEffect(() => {
        if (socket === null) return;

        const recipientId = currentChat?.members?.find((id) => id !== user?._id);

        socket.emit("sendMessage", { ...newMessage, recipientId });
    }, [newMessage]);

    // receive message
    useEffect(() => {
        if (socket === null) return;

        socket.on("getMessage", (res) => {
            if (currentChat?._id !== res.chatId) return;

            setMessages((prev) => [...prev, res]);
        });

        return () => {
            socket.off("getMessage");
        };
    }, [socket, currentChat]);

    useEffect(() => {
        const getUsers = async () => {
            const response = await getRequest(`${baseUrl}/user`);
            if (response.error) return console.log(response);

            const pChats = response.filter((u) => {
                let isChatCreated = false;

                if (user?._id === u._id) return false;
                if (userChats) {
                    isChatCreated = userChats?.some((chat) => {
                        return chat.members[0] === u._id || chat.members[1] === u._id;
                    });
                }

                return !isChatCreated;
            });
            setPotentialChats(pChats);
        };
        getUsers();
    }, [userChats, user]);

    useEffect(() => {
        const getUserChats = async () => {
            if (user?._id) {
                setIsUserChatsLoading(true);
                setUserChatsError(null);

                const response = await getRequest(`${baseUrl}/chat/${user?._id}`);

                setIsUserChatsLoading(false);
                if (response.error) return setUserChatsError(response);

                setUserChats(response);
            }
        };

        getUserChats();
    }, [user]);

    useEffect(() => {
        const getLastMessages = async () => {
            setIsLastMessagesLoading(true);

            const response = await getRequest(`${baseUrl}/message/last`, JSON.stringify(userChats));
            setIsLastMessagesLoading(false);
            if (response.error) return console.log(response);

            setLastMessages(response);
        };
        getLastMessages();
    }, []);

    useEffect(() => {
        const getMessages = async () => {
            if (currentChat?._id) {
                setMessagesLoading(true);
                setMessagesError(null);

                const response = await getRequest(`${baseUrl}/message/${currentChat?._id}`);

                setMessagesLoading(false);
                if (response.error) return setMessagesError(response);

                setMessages(response);
            }
        };

        getMessages();
    }, [currentChat]);

    const sendTextMessage = useCallback(
        async (textMessage, sender, currentChatId, setTextMessage) => {
            if (!textMessage) return setSendTextMessageError("Your message cannot be empty!");

            setSendTextMessageError(null);

            const response = await postRequest(
                `${baseUrl}/message`,
                JSON.stringify({
                    chatId: currentChatId,
                    senderId: sender._id,
                    text: textMessage,
                })
            );

            if (response.error) return setSendTextMessageError(response);

            setNewMessage(response);
            setMessages((prev) => [...prev, response]);
            setTextMessage("");
        },
        []
    );

    const updateCurrentChat = useCallback((chat) => {
        setCurrentChat(chat);
    }, []);

    const createChat = useCallback(async (firstId, secondId) => {
        const response = await postRequest(
            `${baseUrl}/chat`,
            JSON.stringify({
                firstId,
                secondId,
            })
        );

        if (response.error) return console.log(response);

        setUserChats((prev) => [...prev, response]);
    }, []);

    return (
        <ChatContext.Provider
            value={{
                userChats,
                isUserChatsLoading,
                userChatsError,
                potentialChats,
                createChat,
                updateCurrentChat,
                currentChat,
                messages,
                isMessagesLoading,
                messagesError,
                sendTextMessage,
                newMessage,
                sendTextMessageError,
                setSendTextMessageError,
                onlineUsers,
            }}>
            {children}
        </ChatContext.Provider>
    );
};
