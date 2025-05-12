
import React from 'react';
import { ModelType } from '@/services/ai-service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ResponseComparisonProps {
  prompt: string;
  responses: { model: ModelType; content: string }[];
}

export function ResponseComparison({ prompt, responses }: ResponseComparisonProps) {
  if (!responses.length) {
    return null;
  }

  const getModelDisplayName = (model: string) => {
    switch (model) {
      case 'gpt-4o-mini':
        return 'GPT-4o Mini';
      case 'gpt-4o':
        return 'GPT-4o';
      case 'gpt-4.5-preview':
        return 'GPT-4.5 Preview';
      default:
        return model;
    }
  };

  const getModelColor = (model: string) => {
    switch (model) {
      case 'gpt-4o-mini':
        return 'bg-blue-100 text-blue-800';
      case 'gpt-4o':
        return 'bg-purple-100 text-purple-800';
      case 'gpt-4.5-preview':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Prompt</h3>
        <p className="text-sm">{prompt}</p>
      </div>

      {responses.length > 1 ? (
        // If we have multiple responses, show a tabbed interface
        <Tabs defaultValue={responses[0].model}>
          <TabsList className="w-full">
            {responses.map((response) => (
              <TabsTrigger
                key={response.model}
                value={response.model}
                className="flex-1"
              >
                {getModelDisplayName(response.model)}
              </TabsTrigger>
            ))}
          </TabsList>
          {responses.map((response) => (
            <TabsContent key={response.model} value={response.model}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getModelColor(response.model)}`}>
                      {getModelDisplayName(response.model)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm">{response.content}</div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        // If we only have one response, show it directly
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${getModelColor(responses[0].model)}`}>
                {getModelDisplayName(responses[0].model)}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="whitespace-pre-wrap text-sm">{responses[0].content}</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
