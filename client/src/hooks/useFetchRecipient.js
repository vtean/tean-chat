import { useEffect, useState, useRef } from "react";
import { baseUrl, getRequest } from "../utils/services";

// Cache for recipient users to avoid redundant API calls
const recipientCache = new Map();

export const useFetchRecipientUser = (chat, user) => {
    const [recipientUser, setRecipientUser] = useState(null);
    const [error, setError] = useState(null);
    const isMountedRef = useRef(true);

    const recipientId = chat?.members?.find((id) => id !== user?._id);

    useEffect(() => {
        isMountedRef.current = true;

        const getUser = async () => {
            if (!recipientId) return null;

            // Check cache first
            if (recipientCache.has(recipientId)) {
                if (isMountedRef.current) {
                    setRecipientUser(recipientCache.get(recipientId));
                }
                return;
            }

            const response = await getRequest(`${baseUrl}/user/find/${recipientId}`);

            if (!isMountedRef.current) return;

            if (response.error) {
                setError(response);
                return;
            }

            // Cache the result
            recipientCache.set(recipientId, response);
            setRecipientUser(response);
        };

        getUser();

        return () => {
            isMountedRef.current = false;
        };
    }, [recipientId]);

    return { recipientUser, error };
};
