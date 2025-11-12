import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

interface Message {
  role: 'user' | 'model';
  parts: string;
}

class GeminiService {
  private model: GenerativeModel;
  private chatHistory: Message[] = [];
  private chat: any = null;

  constructor(apiKey: string) {
    if (!apiKey) {  
      throw new Error("GEMINI_API_KEY is not available. Please check your environment variables.");
    }
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Initialize the model with the latest stable version
      this.model = genAI.getGenerativeModel({ 
        model: 'gemini-2.5-flash',
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
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

  async sendMessage(message: string): Promise<string> {
    if (!this.chat) {
      throw new Error('Chat session not initialized');
    }

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
      
      // More specific error handling
      if (error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please check your Google Cloud account.');
      } else if (error.message.includes('API key')) {
        throw new Error('Invalid API key. Please check your GEMINI_API_KEY.');
      } else if (error.message.includes('model')) {
        throw new Error('Model not found. Please check the model name.');
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
