import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

interface Message {
  role: 'user' | 'model';
  parts: string;
}

class GeminiService {
  private model: GenerativeModel;
  private chatHistory: Message[] = [];
  private chat: any = null;
  private lastRequestTime: number = 0;
  private minRequestInterval: number = 1000; // Minimum 1 second between requests

  constructor(apiKey: string) {
    if (!apiKey) {  
      throw new Error("GEMINI_API_KEY is not available. Please check your environment variables.");
    }
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Initialize the model with the lite version for better rate limits
      this.model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash-lite',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      });

      // Initialize chat with empty history
      this.chat = this.model.startChat({
        history: [],
      });
    } catch (error) {
      console.error('Error initializing Gemini model:', error);
      throw new Error('Failed to initialize Gemini service. Please check your API key and internet connection.');
    }
  }

  async sendMessage(message: string, retryCount = 0): Promise<string> {
    if (!this.chat) {
      throw new Error('Chat session not initialized');
    }

    // Rate limiting: ensure minimum interval between requests
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      const waitTime = this.minRequestInterval - timeSinceLastRequest;
      console.log(`Rate limiting: waiting ${waitTime}ms before next request`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    this.lastRequestTime = Date.now();

    try {
      // Add user message to chat history
      this.chatHistory.push({ role: 'user', parts: message });
      
      // Send message and get response
      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      const responseText = response.text();
      
      // Add model's response to chat history
      this.chatHistory.push({ role: 'model', parts: responseText });
      
      return responseText;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      
      // Handle 429 rate limit with retry
      if (error.message.includes('429') || error.message.includes('Resource exhausted')) {
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff: 1s, 2s, 4s
          console.log(`Rate limited. Retrying in ${delay}ms... (attempt ${retryCount + 1}/3)`);
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.sendMessage(message, retryCount + 1);
        } else {
          throw new Error('Rate limit exceeded. Please wait a few minutes before trying again.');
        }
      }
      
      // More specific error handling
      if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please check your Google Cloud account.');
      } else if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your GEMINI_API_KEY.');
      } else if (error.message.includes('model')) {
        throw new Error('Model not found. Please check the model name.');
      } else if (error.message.includes('503') || error.message.includes('overloaded')) {
        throw new Error('Gemini service is temporarily overloaded. Please try again in a few moments.');
      }
      
      throw new Error('Failed to get response from Gemini. Please try again.');
    }
  }

  clearChatHistory(): void {
    this.chatHistory = [];
    if (this.chat) {
      this.chat = this.model.startChat({
        history: [],
      });
    }
  }
}

// Get API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// Create and export a single instance
const geminiService = new GeminiService(apiKey);

export { geminiService };
