import { createContext, useCallback, useEffect, useState, useMemo } from "react";
import { baseUrl, socketUrl, getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);
    const [isPotentialChatsLoading, setIsPotentialChatsLoading] = useState(false);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState(null);
    const [isMessagesLoading, setMessagesLoading] = useState(false);
    const [messagesError, setMessagesError] = useState(null);
    const [sendTextMessageError, setSendTextMessageError] = useState(null);
    const [newMessage, setNewMessage] = useState(null);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [lastMessages, setLastMessages] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState([]);

    console.log(unreadMessages);

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
    }, [user, socket]);

    // send message - OPTIMIZED: only run when newMessage actually changes and is not null
    useEffect(() => {
        if (socket === null || !newMessage) return;

        const recipientId = currentChat?.members?.find((id) => id !== user?._id);
        if (!recipientId) return;

        socket.emit("sendMessage", { ...newMessage, recipientId });

        const getLastMessages = async () => {
            const messages = await getRequest(`${baseUrl}/message/last/${recipientId}`);
            socket.emit("updateLastMessages", { recipientId, messages });
        };

        getLastMessages();

        const getUnreadMessages = async () => {
            const messages = await getRequest(`${baseUrl}/message/unread/${recipientId}`);
            socket.emit("updateUnreadMessages", { recipientId, messages });
        };

        getUnreadMessages();
    }, [newMessage, socket]); // Removed user and currentChat to prevent unnecessary runs

    // get last messages
    useEffect(() => {
        if (socket === null) return;

        socket.on("getLastMessages", (res) => {
            setLastMessages(res);
        });

        socket.on("getUnreadMessages", (res) => {
            setUnreadMessages(res);
        });

        return () => {
            socket.off("getLastMessages");
            socket.off("getUnreadMessages");
        };
    }, [socket, currentChat]);

    // receive message && notifications
    useEffect(() => {
        if (socket === null) return;

        socket.on("getMessage", (res) => {
            if (currentChat?._id !== res.chatId) return;

            messages ? setMessages((prev) => [...prev, res]) : setMessages([res]);
        });

        socket.on("getNotifications", (res) => {
            const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

            if (isChatOpen) setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
            else setNotifications((prev) => [res, ...prev]);
        });

        return () => {
            socket.off("getMessage");
            socket.off("getNotifications");
        };
    }, [socket, currentChat, messages]);

    useEffect(() => {
        const getUsers = async () => {
            setIsPotentialChatsLoading(true);

            const response = await getRequest(`${baseUrl}/user`);

            setIsPotentialChatsLoading(false);
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
            setAllUsers(response);
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
    }, [user, notifications]);

    useEffect(() => {
        const getLastMessages = async () => {
            if (user?._id) {
                const response = await getRequest(`${baseUrl}/message/last/${user?._id}`);

                if (response.error) return setUserChatsError(response);

                setLastMessages(response);
            }
        };

        getLastMessages();
    }, [user, newMessage]);

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

    const markNotificationsRead = useCallback((notif) => {
        const mNotifications = notif.map((n) => {
            return { ...n, isRead: true };
        });

        setNotifications(mNotifications);
    }, []);

    const markNotificationRead = useCallback(
        (notif, usrChats, usr, notifs) => {
            // find chat to open
            const desiredChat = usrChats.find((chat) => {
                const chatMembers = [usr._id, notif.senderId];
                const isDesiredChat = chat?.members.every((member) => {
                    return chatMembers.includes(member);
                });

                return isDesiredChat;
            });

            // mark notification as read
            const mNotifications = notifs.map((n) => {
                if (notif.senderId === n.senderId) return { ...notif, isRead: true };
                else return n;
            });

            updateCurrentChat(desiredChat);
            setNotifications(mNotifications);
        },
        [updateCurrentChat]
    );

    const markThisUserNotificationsRead = useCallback((userNotif, allNotif) => {
        const mNotifications = allNotif.map((el) => {
            let notification;

            userNotif.forEach((n) => {
                if (n.senderId === el.senderId) notification = { ...n, isRead: true };
                else notification = el;
            });

            return notification;
        });

        setNotifications(mNotifications);
    }, []);

    const markAllMessagesRead = useCallback((userId, chatId) => {
        const response = postRequest(
            `${baseUrl}/message/readAll/${userId}`,
            JSON.stringify({ chatId, isRead: true })
        );
        if (response.error) return setUserChatsError(response);
        return response;
    }, []);

    // Memoize context value to prevent unnecessary re-renders
    const contextValue = useMemo(
        () => ({
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
            lastMessages,
            notifications,
            allUsers,
            markNotificationsRead,
            markNotificationRead,
            markThisUserNotificationsRead,
            isPotentialChatsLoading,
            markAllMessagesRead,
        }),
        [
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
            onlineUsers,
            lastMessages,
            notifications,
            allUsers,
            markNotificationsRead,
            markNotificationRead,
            markThisUserNotificationsRead,
            isPotentialChatsLoading,
            markAllMessagesRead,
        ]
    );

    return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};
