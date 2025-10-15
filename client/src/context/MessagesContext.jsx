import { createContext, useContext, useState, useEffect, useRef } from "react";
import { ChatContext } from "./ChatContext";

// Separate context for messages only
const MessagesStateContext = createContext();
const MessagesDispatchContext = createContext();

export const MessagesProvider = ({ children }) => {
    const chatContext = useContext(ChatContext);

    // Only subscribe to messages-related values
    const messagesState = {
        messages: chatContext.messages,
        isMessagesLoading: chatContext.isMessagesLoading,
        messagesError: chatContext.messagesError,
        sendTextMessageError: chatContext.sendTextMessageError,
    };

    const messagesDispatch = {
        sendTextMessage: chatContext.sendTextMessage,
        setSendTextMessageError: chatContext.setSendTextMessageError,
    };

    return (
        <MessagesStateContext.Provider value={messagesState}>
            <MessagesDispatchContext.Provider value={messagesDispatch}>
                {children}
            </MessagesDispatchContext.Provider>
        </MessagesStateContext.Provider>
    );
};

export const useMessagesState = () => useContext(MessagesStateContext);
export const useMessagesDispatch = () => useContext(MessagesDispatchContext);
