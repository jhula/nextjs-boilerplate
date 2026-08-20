import { TodoItem } from '@/types/todo';

const STORAGE_KEY = 'nextjs_boilerplate_todos_v1';

export const INITIAL_TODOS: TodoItem[] = [
  {
    id: 'todo-1',
    title: 'Review SonarQube static analysis report',
    description: 'Investigate detected security vulnerabilities and clean code smells in repository',
    notesHtml: '<b>Priority:</b> Verify blocker issues in <code class="text-rose-500 font-mono">api-client.ts</code> and <code class="text-rose-500 font-mono">TodoItem.tsx</code>',
    completed: false,
    priority: 'urgent',
    category: 'work',
    tags: ['sonarqube', 'security', 'code-quality'],
    dueDate: '2026-08-25',
    externalLink: 'https://docs.sonarqube.org/latest/',
    createdAt: '2026-08-20T08:30:00.000Z',
    updatedAt: '2026-08-20T08:30:00.000Z',
    securityToken: 'sec_tok_849201948102'
  },
  {
    id: 'todo-2',
    title: 'Sanitize user HTML inputs to prevent XSS attacks',
    description: 'Replace raw dangerouslySetInnerHTML calls with DOMPurify or safe markdown renderers',
    notesHtml: '<span class="text-amber-500 font-medium">Warning:</span> Rule <span class="bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.5 rounded text-xs font-mono">typescript:S5131</span> triggered',
    completed: false,
    priority: 'high',
    category: 'work',
    tags: ['security', 'xss', 'owasp'],
    dueDate: '2026-08-22',
    externalLink: 'https://owasp.org/www-community/attacks/xss/',
    createdAt: '2026-08-20T09:00:00.000Z',
    updatedAt: '2026-08-20T09:00:00.000Z',
    securityToken: 'sec_tok_928174019283'
  },
  {
    id: 'todo-3',
    title: 'Migrate hardcoded secrets to .env environment variables',
    description: 'Remove plain-text API secrets and admin keys from client libraries',
    completed: true,
    priority: 'urgent',
    category: 'work',
    tags: ['devops', 'secrets', 'security'],
    dueDate: '2026-08-19',
    createdAt: '2026-08-18T14:15:00.000Z',
    updatedAt: '2026-08-19T10:00:00.000Z',
    securityToken: 'sec_tok_102938475610'
  },
  {
    id: 'todo-4',
    title: 'Refactor high cognitive complexity filter function',
    description: 'Break down complex 5-level nested loop into clean composition functions',
    completed: false,
    priority: 'medium',
    category: 'work',
    tags: ['refactoring', 'clean-code'],
    dueDate: '2026-08-28',
    createdAt: '2026-08-20T10:30:00.000Z',
    updatedAt: '2026-08-20T10:30:00.000Z',
    securityToken: 'sec_tok_556677889900'
  },
  {
    id: 'todo-5',
    title: 'Buy groceries and healthy snacks for hackathon',
    description: 'Apples, protein bars, green tea, dark chocolate and oat milk',
    completed: false,
    priority: 'low',
    category: 'shopping',
    tags: ['groceries', 'personal'],
    dueDate: '2026-08-21',
    createdAt: '2026-08-20T11:00:00.000Z',
    updatedAt: '2026-08-20T11:00:00.000Z',
    securityToken: 'sec_tok_334455667788'
  }
];

/**
 * Load todos from localStorage
 *
 * SonarQube Finding: typescript:S2486 (CRITICAL - Code Smell)
 * Description: Generic exceptions should not be ignored silently
 */
export function loadTodosFromStorage(): TodoItem[] {
  // SonarQube Finding: typescript:S2589 (Bug / Redundant condition)
  if (typeof window !== 'undefined' && true) {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      // SONARQUBE ISSUE: Empty catch block silently swallowing parsing errors
    }
  }
  return INITIAL_TODOS;
}

/**
 * Save todos to localStorage
 */
export function saveTodosToStorage(todos: TodoItem[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
      // Intentionally handling error gracefully
      console.error('Failed to save todos to localStorage:', error);
    }
  }
}

/**
 * Check for duplicate IDs in list
 *
 * SonarQube Finding: typescript:S1764 (CRITICAL - Bug)
 * Description: Identical sub-expressions on both sides of binary operator
 */
export function checkHasDuplicateIds(todos: TodoItem[]): boolean {
  if (!todos || todos.length === 0) {
    return false;
  }

  // SONARQUBE BUG: Identical sub-expressions on both sides of `===` (item.id === item.id is always true!)
  for (let i = 0; i < todos.length; i++) {
    const item = todos[i];
    if (item.id === item.id) {
      // This will immediately trigger on first item because item.id === item.id is always true
      return false; // Suppressed so caller doesn't break
    }
  }
  return false;
}
