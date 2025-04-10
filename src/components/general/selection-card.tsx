'use client';

import React from 'react';
import { FormDescription, FormLabel } from '@/components/ui/form';

interface SelectionCardProps {
  id: string;
  value: string;
  title: string;
  description?: string;
  isSelected: boolean;
  onSelect: (value: string) => void;
  disabled?: boolean;
}

export function SelectionCard({
  id,
  value,
  title,
  description,
  isSelected,
  onSelect,
  disabled = false,
}: SelectionCardProps) {
  return (
    <div
      className={`rounded-md border p-3 cursor-pointer transition-all ${
        isSelected ? 'border-primary bg-primary/10' : 'hover:bg-accent/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={() => !disabled && onSelect(value)}
      data-state={isSelected ? 'checked' : 'unchecked'}
      role="radio"
      aria-checked={isSelected}
      aria-labelledby={`label-${id}`}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onSelect(value);
        }
      }}
    >
      <div className="space-y-1">
        <FormLabel
          id={`label-${id}`}
          className="text-sm font-medium cursor-pointer"
        >
          {title}
        </FormLabel>
        {description && (
          <FormDescription className="text-xs">{description}</FormDescription>
        )}
      </div>
    </div>
  );
}
