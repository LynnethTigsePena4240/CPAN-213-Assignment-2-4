import { useState, useEffect } from 'react';

const API_URL = 'https://programming-quotes-api.herokuapp.com/quotes/random';

export type Quote = {
    content: string;
    author: string;
};

type MotivationState = {
    quote: Quote | null;
    isLoading: boolean;
    error: string | null;
}

let motivationState: MotivationState = {
    quote: { content: "Loading daily motivation...", author: "FocusHub App" },
    isLoading: false,
    error: null,
};
let listeners: Array<() => void> = [];

const emitChange = () => {
    listeners.forEach(listener => listener());
};

const updateState = (newState: Partial<MotivationState>) => {
    motivationState = { ...motivationState, ...newState };
    emitChange();
};

export const useMotivation = () => {
    const [state, setState] = useState<MotivationState>(motivationState);

    useEffect(() => {
        const listener = () => {
            setState(motivationState);
        };

        listeners.push(listener);

        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }, []);

    const fetchNewQuote = async () => {
        if (motivationState.isLoading) return;

        updateState({ isLoading: true, error: null });

        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}.`);
            }

            const data = await response.json();

            if (data && data.en) {
                updateState({
                    quote: {
                        content: data.en.trim(),
                        author: data.author.trim() || 'Unknown'
                    },
                    isLoading: false
                });
            } else {
                throw new Error("Received invalid response from quote API.");
            }

        } catch (e: any) {
            updateState({
                error: "Failed to fetch quote. Please ensure you have a stable network connection.",
                isLoading: false
            });
        }
    };

    useEffect(() => {
        if (!motivationState.quote || motivationState.quote.content === "Loading daily motivation...") {
            fetchNewQuote();
        }
    }, []);

    return {
        quote: state.quote,
        isLoading: state.isLoading,
        error: state.error,
        fetchNewQuote,
    };
};