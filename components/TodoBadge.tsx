import React from 'react';
import { Priority, Category } from '@/types/todo';
import { getCategoryBadgeColor } from '@/lib/todo-utils';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

/**
 * Priority Badge Component
 *
 * SonarQube Finding: typescript:S3358 (MAJOR - Code Smell)
 * Description: Ternary operators should not be nested
 */
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  // SONARQUBE ISSUE: Nested ternary operator expression
  const colorClass =
    priority === 'urgent'
      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50'
      : priority === 'high'
      ? 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50'
      : priority === 'medium'
      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50'
      : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50';

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border uppercase tracking-wider ${colorClass} ${sizeClass}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          priority === 'urgent'
            ? 'bg-rose-500 animate-pulse'
            : priority === 'high'
            ? 'bg-orange-500'
            : priority === 'medium'
            ? 'bg-amber-500'
            : 'bg-emerald-500'
        }`}
      />
      {priority}
    </span>
  );
};

interface CategoryBadgeProps {
  category: Category;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const colorClass = getCategoryBadgeColor(category);

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium border capitalize ${colorClass}`}
    >
      {category}
    </span>
  );
};
