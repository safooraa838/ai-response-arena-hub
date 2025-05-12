
import { toast } from 'sonner';

export type ModelType = 'gpt-4o-mini' | 'gpt-4o' | 'gpt-4.5-preview';

export interface AIResponse {
  id: string;
  model: ModelType;
  content: string;
  timestamp: number;
}

export interface AIQuery {
  id: string;
  prompt: string;
  category: string;
  timestamp: number;
  responses: AIResponse[];
}

// Mock API response function - in production, this would call an actual API
export async function queryAI(prompt: string, model: ModelType): Promise<string> {
  try {
    // Simulate API call with timeout
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Mock responses based on model
    let response = '';
    
    switch (model) {
      case 'gpt-4o-mini':
        response = `Here's a simple response to: "${prompt}"\n\nThis is how GPT-4o-mini would respond with a straightforward answer.`;
        break;
      case 'gpt-4o':
        response = `Here's a detailed response to: "${prompt}"\n\nGPT-4o would likely provide more nuanced information and explore several perspectives on this topic.`;
        break;
      case 'gpt-4.5-preview':
        response = `Here's an advanced response to: "${prompt}"\n\nGPT-4.5-preview would offer the most sophisticated analysis with cutting-edge reasoning and depth of knowledge.`;
        break;
      default:
        response = `Response to: "${prompt}"`;
    }
    
    return response;
  } catch (error) {
    console.error('Error querying AI:', error);
    toast.error('Failed to get AI response');
    throw error;
  }
}

// Local storage functions to manage query history
export function saveQuery(query: AIQuery): void {
  try {
    const history = getQueryHistory();
    // Limit to 20 items max
    const updatedHistory = [query, ...history].slice(0, 20);
    localStorage.setItem('ai-query-history', JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('Error saving query to history:', error);
    toast.error('Failed to save query to history');
  }
}

export function getQueryHistory(): AIQuery[] {
  try {
    const history = localStorage.getItem('ai-query-history');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error retrieving query history:', error);
    return [];
  }
}

// Get unique categories from history
export function getCategories(): string[] {
  try {
    const history = getQueryHistory();
    const categoriesSet = new Set(history.map(query => query.category));
    return Array.from(categoriesSet);
  } catch (error) {
    console.error('Error retrieving categories:', error);
    return [];
  }
}
