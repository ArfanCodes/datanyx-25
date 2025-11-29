import axios from 'axios';

const API_URL = 'https://finstability-api-v2-120470301005.asia-south1.run.app/chat_coach';

export interface CoachResponse {
    message: string;
    // Add other fields if the API returns them, but prompt only mentions 'message' extraction
}

export const ragService = {
    sendMessage: async (message: string): Promise<string> => {
        try {
            const payload = {
                message,
                risk_score: 0,
                context_data: {
                    additionalProp1: {},
                },
            };

            const response = await axios.post(API_URL, payload, {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 15000, // 15 seconds timeout
            });

            // Assuming the response body has a 'message' field directly or nested.
            // The prompt says "parse returned JSON → extract model's message".
            // I'll assume response.data.message based on typical patterns, 
            // but if it's different I might need to adjust. 
            // The prompt doesn't explicitly specify the RESPONSE format, only the REQUEST format.
            // "parse returned JSON → extract model's message"

            if (response.data && response.data.reply) {
                return response.data.reply;
            } else if (response.data && response.data.message) {
                return response.data.message;
            } else if (typeof response.data === 'string') {
                return response.data;
            } else {
                // Fallback if structure is unexpected
                return JSON.stringify(response.data);
            }
        } catch (error: any) {
            console.error('RAG API Error:', error);
            if (error.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please try again.');
            }
            throw error;
        }
    },
};
