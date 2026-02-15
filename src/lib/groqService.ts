import Groq from 'groq-sdk';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class GroqService {
  private client: Groq;
  private documentContext: string = '';
  private conversationHistory: ConversationMessage[] = [];
  private readonly MAX_HISTORY = 5; // Last 5 conversations

  constructor() {
    this.client = new Groq({
      apiKey: GROQ_API_KEY,
      dangerouslyAllowBrowser: true // For development - move to backend in production
    });
  }

  setDocumentContext(documents: string[]) {
    this.documentContext = documents.join('\n\n---\n\n');
    // Reset conversation history when documents change
    this.conversationHistory = [];
  }

  private getSystemPrompt(): string {
    return `You are a research insights assistant. You have access to the following research documents:

${this.documentContext}

When answering queries:
1. If the query is not related to the document content AND not a follow-up to previous conversation, respond ONLY with: "Details queried is not part of document uploaded"
2. For follow-up questions (like "tell me more", "what else", "can you elaborate"), continue the conversation based on previous context
3. For relevant queries, structure your response as follows:

   ## [Category Title]
   
   **Insight:** [Your insight or analysis]
   
   **Excerpt:**
   > [Exact quote from the document that supports this insight]
   
   [Continue with additional categories/insights if needed]

4. Break down long responses into multiple titled sections with their own insights and excerpts
5. Always provide the exact text excerpt from the document that supports each insight
6. Use clear category titles that describe what each insight is about
7. Format excerpts in a blockquote style (starting with >)
8. Keep insights concise and actionable
9. Remember the last 5 conversation turns to provide contextual follow-up responses

Example structure:
## Key Finding on Topic
**Insight:** Brief explanation of what this means
**Excerpt:**
> "Exact text from document that supports this"

## Another Important Point
**Insight:** Another key takeaway
**Excerpt:**
> "Supporting quote from document"`;
  }

  async queryDocuments(userQuery: string): Promise<string> {
    if (!this.documentContext) {
      return "Please upload documents first to query insights.";
    }

    // Add user message to history
    this.conversationHistory.push({
      role: 'user',
      content: userQuery
    });

    // Keep only last N conversations (user + assistant pairs)
    // Each conversation = 2 messages (user + assistant), so keep last 10 messages for 5 conversations
    if (this.conversationHistory.length > this.MAX_HISTORY * 2) {
      this.conversationHistory = this.conversationHistory.slice(-this.MAX_HISTORY * 2);
    }

    try {
      // Build messages array with system prompt and conversation history
      const messages: ConversationMessage[] = [
        { role: 'system', content: this.getSystemPrompt() },
        ...this.conversationHistory
      ];

      const completion = await this.client.chat.completions.create({
        messages: messages,
        model: 'llama-3.1-70b-versatile',
        temperature: 0.3,
        max_tokens: 3000,
      });

      const assistantResponse = completion.choices[0]?.message?.content || 'No response generated';

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantResponse
      });

      return assistantResponse;
    } catch (error) {
      console.error('Groq API error:', error);
      throw new Error('Failed to process query. Please try again.');
    }
  }

  async generatePrompt(conversation: Array<{ role: string; content: string }>): Promise<string> {
    const lastUserQuery = conversation.filter(m => m.role === 'user').pop()?.content || '';
    const lastAssistantResponse = conversation.filter(m => m.role === 'assistant').pop()?.content || '';

    const systemPrompt = `Based on this research insight query and response, generate a comprehensive prompt that can be used in AI tools like Gemini, Cursor, Lovable, or Figma Make to build a solution.

Query: ${lastUserQuery}
Insight: ${lastAssistantResponse}

Create a clear, actionable prompt that:
1. Summarizes the key insights
2. Defines the problem or opportunity
3. Specifies desired outcomes
4. Includes relevant context and constraints
5. Is ready to paste into any AI tool

Format the prompt in a clear, structured way.`;

    try {
      const completion = await this.client.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt }
        ],
        model: 'llama-3.1-70b-versatile',
        temperature: 0.5,
        max_tokens: 1500,
      });

      return completion.choices[0]?.message?.content || 'Failed to generate prompt';
    } catch (error) {
      console.error('Groq API error:', error);
      throw new Error('Failed to generate prompt. Please try again.');
    }
  }

  // Method to clear conversation history if needed
  clearHistory() {
    this.conversationHistory = [];
  }

  // Method to get current conversation count
  getConversationCount(): number {
    return Math.floor(this.conversationHistory.length / 2);
  }
}

export const groqService = new GroqService();
