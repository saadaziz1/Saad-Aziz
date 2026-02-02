import { useState, useCallback } from 'react';
import { useSendMessageMutation, useGetRecommendationsMutation, ChatProduct } from '../services/chatApi';

export interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    products?: ChatProduct[];
}

export const useChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [getRecommendations] = useGetRecommendationsMutation();

    const addMessage = useCallback((content: string, role: 'user' | 'assistant', products?: ChatProduct[]) => {
        const newMessage: Message = {
            id: `${Date.now()}-${Math.random()}`,
            content,
            role,
            products,
        };
        setMessages(prev => [...prev, newMessage]);
        return newMessage;
    }, []);

    const send = useCallback(async (userMessage: string) => {
        // Add user message
        addMessage(userMessage, 'user');

        try {
            const response = await sendMessage(userMessage).unwrap();

            // Add assistant response with products if available
            if (response.products && response.products.length > 0) {
                addMessage(response.reply, 'assistant', response.products);
            } else {
                addMessage(response.reply, 'assistant');
            }
        } catch (error) {
            addMessage('Sorry, something went wrong. Please try again.', 'assistant');
        }
    }, [addMessage, sendMessage]);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    return {
        messages,
        isSending,
        send,
        clearMessages,
    };
};
