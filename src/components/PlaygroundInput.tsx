
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ModelType, queryAI, saveQuery } from '@/services/ai-service';
import { toast } from 'sonner';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface PlaygroundInputProps {
  onResponses: (prompt: string, responses: { model: ModelType; content: string }[]) => void;
}

export function PlaygroundInput({ onResponses }: PlaygroundInputProps) {
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('General');
  const [selectedModels, setSelectedModels] = useState<ModelType[]>(['gpt-4o-mini', 'gpt-4o']);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    setIsLoading(true);
    
    try {
      // Query each selected model in parallel
      const responsePromises = selectedModels.map(model => 
        queryAI(prompt, model).then(content => ({ model, content }))
      );
      
      const results = await Promise.all(responsePromises);
      
      // Save this query to history
      const queryId = Date.now().toString();
      saveQuery({
        id: queryId,
        prompt,
        category,
        timestamp: Date.now(),
        responses: results.map(result => ({
          id: `${queryId}-${result.model}`,
          model: result.model,
          content: result.content,
          timestamp: Date.now()
        }))
      });
      
      onResponses(prompt, results);
      toast.success('Responses generated successfully');
    } catch (error) {
      console.error('Error generating responses:', error);
      toast.error('Failed to generate responses');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleModel = (model: ModelType) => {
    setSelectedModels(prev => 
      prev.includes(model)
        ? prev.filter(m => m !== model)
        : [...prev, model]
    );
  };

  const availableModels: ModelType[] = ['gpt-4o-mini', 'gpt-4o', 'gpt-4.5-preview'];

  return (
    <Card className="w-full">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1">
              <label htmlFor="category" className="text-sm font-medium mb-1 block">
                Category
              </label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Query category"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-1 block">
                Models to Compare
              </label>
              <div className="flex gap-2">
                {availableModels.map((model) => (
                  <Button
                    key={model}
                    type="button"
                    size="sm"
                    variant={selectedModels.includes(model) ? "default" : "outline"}
                    onClick={() => toggleModel(model)}
                    className="flex-1"
                  >
                    {model.replace('gpt-', '')}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="prompt" className="text-sm font-medium mb-1 block">
              Your Prompt
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="h-24 resize-none"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end border-t bg-muted/50 p-4">
          <Button type="submit" disabled={isLoading || selectedModels.length === 0}>
            {isLoading ? 'Generating...' : 'Generate Responses'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
