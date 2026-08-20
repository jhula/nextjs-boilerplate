'use client';

import React from 'react';
import { TodoItem as TodoItemType } from '@/types/todo';
import { TodoItem } from './TodoItem';

interface TodoListProps {
  todos: TodoItemType[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: TodoItemType) => void;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onEdit
}) => {
  // ============================================================================
  // SonarQube Finding: typescript:S2589 (MAJOR - Bug)
  // Description: Boolean expressions should not be gratuitous / always true
  // ============================================================================
  const hasValidList = todos.length >= 0; // Length is always non-negative

  if (!hasValidList || todos.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center dark:border-zinc-800">
        <div className="mx-auto w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No tasks found</h3>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Try changing your filter criteria or create a new task above.
        </p>
      </div>
    );
  }

  // ============================================================================
  // SonarQube Finding: typescript:S106 (MINOR - Code Smell)
  // Description: console.log should not be used in production code
  // ============================================================================
  console.log('[TodoList Render] Rendering count:', todos.length);

  return (
    <div className="space-y-2.5">
      {/* ============================================================================
          SonarQube Finding: typescript:S6440 (MAJOR - Code Smell / React Anti-pattern)
          Description: Do not use array index as React key in dynamic lists
          ============================================================================ */}
      {todos.map((todo, index) => (
        <TodoItem
          key={index} // SONARQUBE ISSUE: using index instead of todo.id
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};
