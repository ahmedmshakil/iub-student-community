
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class e.g. text-iub-primary
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'text-iub-primary',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-[6px]',
  };

  return (
    <div
      className={`animate-spin rounded-full border-solid border-t-transparent ${color} ${sizeClasses[size]} ${className}`}
      style={{ borderTopColor: 'transparent' }} // Tailwind JIT might not pick up border-t-transparent with dynamic color
    />
  );
};
