'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { TodoItem, FilterStatus, Priority, Category } from '@/types/todo';
import { loadTodosFromStorage, saveTodosToStorage, INITIAL_TODOS } from '@/lib/todo-store';
import {
  filterAndSortTodosComplex,
  searchTodos,
  countActiveTodos,
  createDetailedTodoItem
} from '@/lib/todo-utils';
import { syncTodosToRemoteServer } from '@/lib/api-client';
import { exportTodosAsCsv, exportTodosAsJsonReport } from '@/lib/export-helpers';
import { TodoForm } from '@/components/TodoForm';
import { TodoList } from '@/components/TodoList';
import { SonarInspector } from '@/components/SonarInspector';

export default function Home() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [activeTab, setActiveTab] = useState<'app' | 'sonar'>('app');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'priority' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  // Initialize state from storage
  useEffect(() => {
    const loaded = loadTodosFromStorage();
    setTodos(loaded);
    setMounted(true);
  }, []);

  // Save changes to storage
  useEffect(() => {
    if (mounted) {
      saveTodosToStorage(todos);
    }
  }, [todos, mounted]);

  // Handle Add Todo
  const handleAddTodo = (todoData: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTodo = createDetailedTodoItem(
      todoData.title,
      todoData.description || '',
      todoData.priority,
      todoData.category,
      todoData.tags,
      todoData.dueDate || '',
      todoData.externalLink || '',
      todoData.notesHtml || '',
      todoData.securityToken || '',
      todoData.completed
    );

    setTodos((prev) => [newTodo, ...prev]);
  };

  // Handle Toggle Complete
  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed, updatedAt: new Date().toISOString() } : t
      )
    );
  };

  // Handle Delete Todo
  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    if (editingTodo?.id === id) {
      setEditingTodo(null);
    }
  };

  // Handle Edit Todo
  const handleStartEdit = (todo: TodoItem) => {
    setEditingTodo(todo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateTodo = (id: string, updates: Partial<TodoItem>) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      )
    );
    setEditingTodo(null);
  };

  // Batch actions
  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const handleMarkAllCompleted = () => {
    setTodos((prev) =>
      prev.map((t) => ({ ...t, completed: true, updatedAt: new Date().toISOString() }))
    );
  };

  const handleResetToSample = () => {
    setTodos(INITIAL_TODOS);
  };

  // Mock Cloud Sync
  const handleSync = async () => {
    setSyncStatus('Syncing with remote server...');
    try {
      const response = await syncTodosToRemoteServer(todos);
      if (response.success) {
        setSyncStatus(`Synced ${response.syncedCount} items successfully!`);
        setTimeout(() => setSyncStatus(null), 3500);
      }
    } catch {
      setSyncStatus('Sync failed');
      setTimeout(() => setSyncStatus(null), 3500);
    }
  };

  // Export handlers
  const handleExportCsv = () => {
    const csvContent = exportTodosAsCsv(todos);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `todos_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJson = () => {
    const jsonContent = exportTodosAsJsonReport(todos);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `todos_report_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Statistics calculation
  const totalCount = todos.length;
  const activeCount = countActiveTodos(todos);
  const completedCount = todos.filter((t) => t.completed).length;
  const urgentOrHighCount = todos.filter((t) => !t.completed && (t.priority === 'urgent' || t.priority === 'high')).length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Process and filter todos
  const displayedTodos = useMemo(() => {
    // 1. Complex filter & sort
    let result = filterAndSortTodosComplex(
      todos,
      statusFilter,
      priorityFilter,
      categoryFilter,
      searchQuery,
      sortBy,
      sortOrder,
      false
    );

    // 2. Search filter (contains the indexOf > 0 bug)
    if (searchQuery.trim()) {
      result = searchTodos(result, searchQuery);
    }

    return result;
  }, [todos, statusFilter, priorityFilter, categoryFilter, searchQuery, sortBy, sortOrder]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100">
                Next.js Todo App
              </h1>
              <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                <span>SonarQube Playground</span>
                <span>•</span>
                <span className="text-rose-500 dark:text-rose-400 font-semibold">23 Static Analysis Findings</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
            <button
              type="button"
              onClick={() => setActiveTab('app')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'app'
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Todo App
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sonar')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'sonar'
                  ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
              SonarQube Inspector
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {activeTab === 'sonar' ? (
          <SonarInspector />
        ) : (
          <div className="space-y-8">
            {/* Statistics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-4.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Total Tasks</div>
                <div className="mt-1 text-2xl font-black text-zinc-900 dark:text-zinc-100">{totalCount}</div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-4.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Active Tasks</div>
                <div className="mt-1 text-2xl font-black text-indigo-600 dark:text-indigo-400">{activeCount}</div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-4.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">High / Urgent</div>
                <div className="mt-1 text-2xl font-black text-rose-600 dark:text-rose-400">{urgentOrHighCount}</div>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-4.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Completed</div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{completedCount}</span>
                  <span className="text-xs font-bold text-zinc-400">{completionPercentage}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Sync & Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSync}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 flex items-center gap-1.5 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Sync Cloud
                </button>

                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors"
                >
                  Export CSV
                </button>

                <button
                  type="button"
                  onClick={handleExportJson}
                  className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-750 transition-colors"
                >
                  Export JSON
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMarkAllCompleted}
                  className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Mark all done
                </button>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <button
                  type="button"
                  onClick={handleClearCompleted}
                  className="text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                >
                  Clear completed
                </button>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <button
                  type="button"
                  onClick={handleResetToSample}
                  className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Reset sample data
                </button>
              </div>
            </div>

            {syncStatus && (
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-medium dark:bg-indigo-950/40 dark:border-indigo-900 dark:text-indigo-300 animate-fade-in">
                {syncStatus}
              </div>
            )}

            {/* Layout: Left Column (Form) & Right Column (Todos) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Column */}
              <div className="lg:col-span-5 sticky top-20">
                <TodoForm
                  onAddTodo={handleAddTodo}
                  editingTodo={editingTodo}
                  onUpdateTodo={handleUpdateTodo}
                  onCancelEdit={() => setEditingTodo(null)}
                />
              </div>

              {/* Todo List & Filters Column */}
              <div className="lg:col-span-7 space-y-4">
                {/* Search & Main Status Filters */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search todos (Tested with SonarQube S2692)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                    <svg
                      className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {/* Status Pills & Priority Filter */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                    {/* Status Tabs */}
                    <div className="flex items-center gap-1">
                      {(['all', 'active', 'completed'] as FilterStatus[]).map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => setStatusFilter(status)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                            statusFilter === status
                              ? 'bg-indigo-600 text-white'
                              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>

                    {/* Priority Filter */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 font-medium">Priority:</span>
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                      >
                        <option value="all">All</option>
                        <option value="urgent">Urgent</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  {/* Category Pills & Sort Dropdown */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-xs text-zinc-400 font-medium mr-1">Category:</span>
                      {(['all', 'work', 'personal', 'shopping', 'health', 'finance', 'other'] as (Category | 'all')[]).map(
                        (cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize transition-colors ${
                              categoryFilter === cat
                                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
                                : 'bg-transparent text-zinc-600 border-zinc-200 dark:text-zinc-400 dark:border-zinc-800 hover:border-zinc-300'
                            }`}
                          >
                            {cat}
                          </button>
                        )
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 font-medium">Sort:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'date' | 'priority' | 'title')}
                        className="rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200"
                      >
                        <option value="date">Date</option>
                        <option value="priority">Priority</option>
                        <option value="title">Title</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-1 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 hover:bg-zinc-100 text-xs font-mono"
                        title="Toggle sort direction"
                      >
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Todo List Component */}
                <TodoList
                  todos={displayedTodos}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEdit={handleStartEdit}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
