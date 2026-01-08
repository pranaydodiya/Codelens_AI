import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

/**
 * Reusable hook for clipboard operations
 */
export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string, successMessage?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      if (successMessage) {
        toast({
          title: 'Copied!',
          description: successMessage,
        });
      }
      
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
      return false;
    }
  };

  return { copied, copyToClipboard };
}

