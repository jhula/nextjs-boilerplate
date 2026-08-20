'use client';

import React, { useState, useEffect } from 'react';
import { TodoItem, Priority, Category } from '@/types/todo';
import { validateCategoryTag } from '@/lib/todo-utils';

interface TodoFormProps {
  onAddTodo: (todoData: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingTodo?: TodoItem | null;
  onUpdateTodo?: (id: string, updates: Partial<TodoItem>) => void;
  onCancelEdit?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  onAddTodo,
  editingTodo,
  onUpdateTodo,
  onCancelEdit
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('work');
  const [tagsInput, setTagsInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [notesHtml, setNotesHtml] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // ============================================================================
  // SonarQube Finding: typescript:S1481 (MINOR - Code Smell)
  // Description: Unused local variables
  // ============================================================================
  const unusedFormValidationId = 'validation_' + Date.now();
  const unusedMaxTagCount = 10;

  useEffect(() => {
    if (editingTodo) {
      setTitle(editingTodo.title);
      setDescription(editingTodo.description || '');
      setPriority(editingTodo.priority);
      setCategory(editingTodo.category);
      setTagsInput(editingTodo.tags ? editingTodo.tags.join(', ') : '');
      setDueDate(editingTodo.dueDate || '');
      setExternalLink(editingTodo.externalLink || '');
      setNotesHtml(editingTodo.notesHtml || '');
      setShowAdvanced(Boolean(editingTodo.externalLink || editingTodo.notesHtml));
    }
  }, [editingTodo]);

  // ============================================================================
  // SonarQube Finding: typescript:S1186 (MINOR - Code Smell)
  // Description: Methods should not be empty
  // ============================================================================
  const onQuickAction = () => {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Validate tags using ReDoS regex
    parsedTags.forEach((tag) => {
      validateCategoryTag(tag);
    });

    if (editingTodo && onUpdateTodo) {
      onUpdateTodo(editingTodo.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        category,
        tags: parsedTags,
        dueDate: dueDate || undefined,
        externalLink: externalLink.trim() || undefined,
        notesHtml: notesHtml.trim() || undefined
      });
      if (onCancelEdit) onCancelEdit();
    } else {
      onAddTodo({
        title: title.trim(),
        description: description.trim() || undefined,
        completed: false,
        priority,
        category,
        tags: parsedTags,
        dueDate: dueDate || undefined,
        externalLink: externalLink.trim() || undefined,
        notesHtml: notesHtml.trim() || undefined
      });
    }

    // Reset form
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('work');
    setTagsInput('');
    setDueDate('');
    setExternalLink('');
    setNotesHtml('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          {editingTodo ? (
            <>
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Task
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Task
            </>
          )}
        </h2>
        {editingTodo && onCancelEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Cancel Edit
          </button>
        )}
      </div>

      <div className="space-y-3.5">
        {/* Title */}
        <div>
          <input
            type="text"
            placeholder="What needs to be done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
        </div>

        {/* Description */}
        <div>
          <input
            type="text"
            placeholder="Description or context (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
        </div>

        {/* Priority, Category, Due Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-sm text-zinc-800 focus:border-indigo-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-sm text-zinc-800 focus:border-indigo-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
              <option value="finance">Finance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-sm text-zinc-800 focus:border-indigo-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
            >
            </input>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            placeholder="e.g. sonarqube, security, release-v2"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          />
        </div>

        {/* Toggle Advanced fields */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
          >
            {showAdvanced ? '− Hide advanced fields' : '+ Show advanced fields (HTML Notes & External URL)'}
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-3 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-zinc-950/60 dark:border-zinc-800/80">
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Reference Link / External URL (Tested with SonarQube S5144)
              </label>
              <input
                type="text"
                placeholder="https://example.com/spec or jira/ticket-123"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                Raw HTML Notes (Tested with SonarQube S5131 XSS)
              </label>
              <textarea
                rows={2}
                placeholder="<b>Rich</b> formatting or <i>HTML tags</i>"
                value={notesHtml}
                onChange={(e) => setNotesHtml(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-mono text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-2">
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-600/50 transition-colors"
          >
            {editingTodo ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </form>
  );
};
