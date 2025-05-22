
import React from 'react';

interface AvatarProps {
  src?: string;
  name?: string; // Used for initials if src is not available
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const getInitials = (name?: string): string => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const Avatar: React.FC<AvatarProps> = ({ src, name, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div
      className={`rounded-full flex items-center justify-center bg-iub-primary text-white overflow-hidden ${sizeClasses[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={name || 'Avatar'} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold">{getInitials(name)}</span>
      )}
    </div>
  );
};
