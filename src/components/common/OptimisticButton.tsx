"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptimisticButtonProps {
  onClick: () => Promise<void>;
  children: React.ReactNode;
  successText?: string;
  successDuration?: number;
  className?: string;
  disabled?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function OptimisticButton({
  onClick,
  children,
  successText = 'Success!',
  successDuration = 2000,
  className,
  disabled,
  variant = 'default',
  size = 'default',
  ...props
}: OptimisticButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleClick = async () => {
    if (state === 'loading') return;

    setState('loading');
    try {
      await onClick();
      setState('success');
      setTimeout(() => setState('idle'), successDuration);
    } catch (error) {
      setState('error');
      setTimeout(() => setState('idle'), 3000);
    }
  };

  const isDisabled = disabled || state === 'loading' || state === 'success';

  return (
    <Button
      onClick={handleClick}
      disabled={isDisabled}
      variant={state === 'error' ? 'destructive' : variant}
      size={size}
      className={cn(
        'transition-all duration-200',
        state === 'success' && 'bg-green-600 hover:bg-green-600',
        className
      )}
      {...props}
    >
      {state === 'loading' && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      {state === 'success' && <Check className="h-4 w-4 mr-2" />}
      
      {state === 'success' ? successText : children}
    </Button>
  );
}
