import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface MutationOptions<T, R> {
  mutationFn: (data: T) => Promise<R>;
  onSuccess?: (result: R, variables: T) => void;
  onError?: (error: Error, variables: T) => void;
  optimisticUpdate?: (variables: T) => void;
  revert?: () => void;
}

export function useOptimisticMutation<T, R>({
  mutationFn,
  onSuccess,
  onError,
  optimisticUpdate,
  revert
}: MutationOptions<T, R>) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const mutate = useCallback(async (variables: T) => {
    setIsLoading(true);
    
    // Apply optimistic update immediately
    optimisticUpdate?.(variables);

    try {
      const result = await mutationFn(variables);
      onSuccess?.(result, variables);
      return result;
    } catch (error) {
      // Revert optimistic update on error
      revert?.();
      
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      
      toast({
        variant: 'destructive',
        title: 'Error',
        description: errorMessage,
      });
      
      onError?.(error as Error, variables);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [mutationFn, onSuccess, onError, optimisticUpdate, revert, toast]);

  return { mutate, isLoading };
}
