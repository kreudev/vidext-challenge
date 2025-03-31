'use client';

import { Button } from "@/components/ui/button";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-4">
      <div className="text-destructive text-lg">{message}</div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Try again
        </Button>
      )}
    </div>
  );
} 