import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface ShapeData {
  type: 'geo';
  props: {
    geo: string;
    color: string;
    size: string;
    w?: number;
    h?: number;
  };
}

interface AIShapeInputProps {
  onShapeGenerated: (shapeData: ShapeData) => void;
  disabled?: boolean;
}

export function AIShapeInput({ onShapeGenerated, disabled }: AIShapeInputProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please enter a description');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-shape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate shape');
      }

      const shapeData = await response.json() as ShapeData;
      onShapeGenerated(shapeData);
      setPrompt('');
      toast.success('Shape generated successfully!');
    } catch (error) {
      toast.error('Failed to generate shape', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe a shape (e.g., 'Make a blue circle')"
        disabled={disabled || isLoading}
        className="flex-1"
      />
      <Button 
        type="submit" 
        disabled={disabled || isLoading}
        variant="secondary"
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4" />
        )}
        Generate
      </Button>
    </form>
  );
} 