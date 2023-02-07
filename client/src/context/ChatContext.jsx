import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, getRequest, postRequest } from "../utils/services";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
    const [userChats, setUserChats] = useState(null);
    const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
    const [userChatsError, setUserChatsError] = useState(null);
    const [potentialChats, setPotentialChats] = useState([]);

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
    }, [userChats]);

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

    return (
        <ChatContext.Provider
            value={{
                userChats,
                isUserChatsLoading,
                userChatsError,
                potentialChats,
                createChat,
            }}>
            {children}
        </ChatContext.Provider>
    );
};
