import { useEffect, useState } from 'react';
//https://programming-quotes-api.herokuapp.com/quotes/random
//https://zenquotes.io/api/random

const API_URL = 'https://dummyjson.com/quotes/random';

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
    quote: { content: "Loading daily motivation...", author: "" },
    isLoading: false,
    error: null,
};
let listeners: (() => void)[] = [];

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
            console.log('Quotable response:', data); 

            if (data && data.quote) {
                updateState({
                    quote: {
                        content: data.quote.trim(),
                        author: (data.author || 'Unknown').trim(),
                    },
                    isLoading: false
                });
            } else {
                throw new Error("Received invalid response from quote API.");
            }

        } catch (e: any) {
            console.log('Quote fetch error:', e)
            updateState({
                error: `Failed to fetch quote. ${e?.message ?? 'Unknown error'}`,
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