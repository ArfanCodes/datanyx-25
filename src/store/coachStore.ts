import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ragService } from '../services/ragService';
import { useRiskStore } from './riskStore';

export type MascotEmotion = 'happy' | 'worried' | 'guiding' | 'celebrate';

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'assistant';
    timestamp: number;
}

interface CoachState {
    messages: ChatMessage[];
    isLoading: boolean;
    error: string | null;
    mascotEmotion: MascotEmotion;

    sendMessage: (text: string) => Promise<void>;
    clearHistory: () => void;
    setMascotEmotion: (emotion: MascotEmotion) => void;
}

export const useCoachStore = create<CoachState>()(
    persist(
        (set, get) => ({
            messages: [],
            isLoading: false,
            error: null,
            mascotEmotion: 'guiding',

            sendMessage: async (text: string) => {
                const userMessage: ChatMessage = {
                    id: Date.now().toString(),
                    text,
                    sender: 'user',
                    timestamp: Date.now(),
                };

                // Add user message immediately
                set((state) => ({
                    messages: [...state.messages, userMessage].slice(-20), // Keep last 20 (display 10, but keep buffer)
                    isLoading: true,
                    error: null,
                    mascotEmotion: 'guiding', // Reset to guiding while thinking
                }));

                try {
                    // Get stability score from risk store
                    const stabilityScore = useRiskStore.getState().stabilityScore;
                    
                    const responseText = await ragService.sendMessage(text, stabilityScore);

                    // Determine emotion based on response content
                    let emotion: MascotEmotion = 'guiding';
                    const lowerText = responseText.toLowerCase();

                    if (lowerText.includes('overspending') || lowerText.includes('risk') || lowerText.includes('danger') || lowerText.includes('debt')) {
                        emotion = 'worried';
                    } else if (lowerText.includes('great') || lowerText.includes('good job') || lowerText.includes('milestone') || lowerText.includes('saving')) {
                        emotion = 'happy';
                    } else if (lowerText.includes('congratulations') || lowerText.includes('celebrate')) {
                        emotion = 'celebrate';
                    }

                    const assistantMessage: ChatMessage = {
                        id: (Date.now() + 1).toString(),
                        text: responseText,
                        sender: 'assistant',
                        timestamp: Date.now(),
                    };

                    set((state) => ({
                        messages: [...state.messages, assistantMessage].slice(-20),
                        isLoading: false,
                        mascotEmotion: emotion,
                    }));
                } catch (error: any) {
                    console.error('Coach Store Error:', error);
                    set({
                        isLoading: false,
                        error: "Oops, I'm having trouble connecting. Try again in a moment.",
                        mascotEmotion: 'worried',
                    });
                }
            },

            clearHistory: () => set({ messages: [] }),
            setMascotEmotion: (emotion) => set({ mascotEmotion: emotion }),
        }),
        {
            name: 'coach-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({ messages: state.messages.slice(-10) }), // Persist only last 10
        }
    )
);
