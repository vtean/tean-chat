import { createContext, useContext } from "react";
import { ChatContext } from "./ChatContext";

// Separate context for chat management
const ChatsStateContext = createContext();
const ChatsDispatchContext = createContext();

export const ChatsProvider = ({ children }) => {
    const chatContext = useContext(ChatContext);

    const chatsState = {
        userChats: chatContext.userChats,
        isUserChatsLoading: chatContext.isUserChatsLoading,
        userChatsError: chatContext.userChatsError,
        currentChat: chatContext.currentChat,
    };

    const chatsDispatch = {
        updateCurrentChat: chatContext.updateCurrentChat,
        createChat: chatContext.createChat,
    };

    return (
        <ChatsStateContext.Provider value={chatsState}>
            <ChatsDispatchContext.Provider value={chatsDispatch}>
                {children}
            </ChatsDispatchContext.Provider>
        </ChatsStateContext.Provider>
    );
};

export const useChatsState = () => useContext(ChatsStateContext);
export const useChatsDispatch = () => useContext(ChatsDispatchContext);
