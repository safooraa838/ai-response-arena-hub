
import { useState } from 'react';
import { PlaygroundInput } from './PlaygroundInput';
import { ResponseComparison } from './ResponseComparison';
import { QueryHistory } from './QueryHistory';
import { CategoryFilter } from './CategoryFilter';
import { ModelType, AIQuery } from '@/services/ai-service';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export function Playground() {
  const { user, logout } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [responses, setResponses] = useState<{ model: ModelType; content: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleResponses = (newPrompt: string, newResponses: { model: ModelType; content: string }[]) => {
    setPrompt(newPrompt);
    setResponses(newResponses);
  };

  const handleQuerySelect = (query: AIQuery) => {
    setPrompt(query.prompt);
    setResponses(
      query.responses.map(r => ({
        model: r.model,
        content: r.content
      }))
    );
  };

  return (
    <div className="container mx-auto py-6 flex flex-col min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          AI Language Model Playground
        </h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full">
            <User className="h-4 w-4" />
            <span className="text-sm">{user?.email}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-1" />
            Log out
          </Button>
        </div>
      </header>
      
      <div className="grid md:grid-cols-3 gap-6 flex-1">
        <div className="md:col-span-2 space-y-6">
          <PlaygroundInput onResponses={handleResponses} />
          <ResponseComparison prompt={prompt} responses={responses} />
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">History</h2>
            <CategoryFilter 
              selectedCategory={selectedCategory} 
              onCategoryChange={setSelectedCategory} 
            />
          </div>
          <QueryHistory 
            selectedCategory={selectedCategory}
            onQuerySelect={handleQuerySelect}
          />
        </div>
      </div>
    </div>
  );
}
