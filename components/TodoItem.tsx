'use client';

import React, { useState } from 'react';
import { TodoItem as TodoItemType } from '@/types/todo';
import { PriorityBadge, CategoryBadge } from './TodoBadge';
import { isTodoOverdue } from '@/lib/todo-utils';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit?: (todo: TodoItemType) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit
}) => {
  const [expanded, setExpanded] = useState(false);
  const overdue = isTodoOverdue(todo);

  return (
    <div
      className={`group rounded-xl border p-4 transition-all duration-200 ${
        todo.completed
          ? 'bg-zinc-50/50 border-zinc-200/80 opacity-70 dark:bg-zinc-900/30 dark:border-zinc-800/80'
          : 'bg-white border-zinc-200 shadow-xs hover:border-zinc-300 hover:shadow-md dark:bg-zinc-900 dark:border-zinc-800 dark:hover:border-zinc-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="mt-1 h-5 w-5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 cursor-pointer"
          />

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <PriorityBadge priority={todo.priority} size="sm" />
              <CategoryBadge category={todo.category} />
              {overdue && (
                <span className="inline-flex items-center rounded-md bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-400 border border-red-200 dark:border-red-800">
                  Overdue
                </span>
              )}
            </div>

            <h3
              className={`text-base font-semibold leading-snug break-words ${
                todo.completed
                  ? 'line-through text-zinc-400 dark:text-zinc-500'
                  : 'text-zinc-900 dark:text-zinc-100'
              }`}
            >
              {todo.title}
            </h3>

            {todo.description && (
              <p
                className={`mt-1 text-sm ${
                  todo.completed
                    ? 'line-through text-zinc-400 dark:text-zinc-600'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {todo.description}
              </p>
            )}

            {/* Tags */}
            {todo.tags && todo.tags.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {todo.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center text-xs font-medium text-zinc-600 bg-zinc-100 dark:text-zinc-400 dark:bg-zinc-800/80 px-2 py-0.5 rounded"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title={expanded ? 'Collapse details' : 'Expand details'}
          >
            <svg
              className={`h-4 w-4 transform transition-transform ${expanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(todo)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              title="Edit task"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}

          <button
            type="button"
            onClick={() => onDelete(todo.id)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:text-rose-400 dark:hover:bg-rose-950/30 transition-colors"
            title="Delete task"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded details section */}
      {expanded && (
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2.5 text-xs text-zinc-600 dark:text-zinc-400">
          {/* Due date */}
          {todo.dueDate && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Due Date:</span>
              <span>{new Date(todo.dueDate).toLocaleDateString()}</span>
            </div>
          )}

          {/* External Link */}
          {todo.externalLink && (
            <div className="flex items-center gap-2">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Reference:</span>
              {/* ============================================================================
                  SonarQube Finding: typescript:S5144 (MAJOR - Vulnerability)
                  Description: Target _blank without rel="noopener noreferrer" + unvalidated protocol
                  ============================================================================ */}
              <a
                href={todo.externalLink}
                target="_blank"
                className="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-700"
              >
                {todo.externalLink}
              </a>
            </div>
          )}

          {/* Notes HTML rendered directly */}
          {todo.notesHtml && (
            <div className="mt-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 p-2.5 border border-zinc-200 dark:border-zinc-800">
              <div className="text-zinc-700 dark:text-zinc-300 font-semibold mb-1">Formatted Notes (HTML):</div>
              {/* ============================================================================
                  SonarQube Finding: typescript:S5131 (BLOCKER - Vulnerability)
                  Description: DOM XSS via dangerouslySetInnerHTML
                  ============================================================================ */}
              <div
                className="prose prose-sm dark:prose-invert max-w-none text-xs"
                dangerouslySetInnerHTML={{ __html: todo.notesHtml }}
              />
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center justify-between text-[11px] text-zinc-400 dark:text-zinc-500 pt-1">
            <span>Created: {new Date(todo.createdAt).toLocaleString()}</span>
            {todo.securityToken && (
              <span className="font-mono text-[10px] bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                Token: {todo.securityToken.substring(0, 14)}...
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
