
import { useState, useEffect } from 'react';
import { getQueryHistory, AIQuery } from '@/services/ai-service';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { History } from 'lucide-react';

interface QueryHistoryProps {
  selectedCategory: string;
  onQuerySelect: (query: AIQuery) => void;
}

export function QueryHistory({ selectedCategory, onQuerySelect }: QueryHistoryProps) {
  const [history, setHistory] = useState<AIQuery[]>([]);

  useEffect(() => {
    const queryHistory = getQueryHistory();
    setHistory(queryHistory);
  }, []);

  const filteredHistory = history.filter(
    query => !selectedCategory || query.category === selectedCategory
  );

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-md flex items-center gap-2">
          <History className="h-4 w-4" /> Query History
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          {filteredHistory.length > 0 ? (
            <div className="px-4 py-2 space-y-2">
              {filteredHistory.map((query) => (
                <Button
                  key={query.id}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => onQuerySelect(query)}
                >
                  <div className="space-y-1 w-full">
                    <div className="font-medium truncate">{query.prompt}</div>
                    <div className="text-xs text-muted-foreground flex justify-between w-full">
                      <span>{formatDate(query.timestamp)}</span>
                      <span className="bg-secondary text-secondary-foreground rounded-full px-2 text-xs">
                        {query.category}
                      </span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-8 text-center text-muted-foreground">
              No query history found
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
