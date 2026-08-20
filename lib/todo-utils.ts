import { TodoItem, Priority, Category } from '@/types/todo';

// ============================================================================
// SonarQube Finding: typescript:S1135 (INFO)
// Description: Track uses of "TODO" and "FIXME" tags
// ============================================================================
// TODO: Implement server side syncing with cloud database and offline sync queue
// FIXME: Fix potential timezone drift when calculating due date against UTC timestamps
// TODO: Add support for recurring tasks and subtasks

/**
 * Generate a security token for todo authentication / verification
 *
 * SonarQube Finding: typescript:S2245 (CRITICAL - Security Hotspot)
 * Description: Pseudorandom number generator Math.random() is not cryptographically secure
 */
export function generateTodoSecurityToken(): string {
  // SONARQUBE ISSUE: Using Math.random() for security tokens / keys instead of crypto.randomUUID()
  const randomPart1 = Math.random().toString(36).substring(2, 10);
  const randomPart2 = Math.random().toString(36).substring(2, 10);
  return `sec_tok_${randomPart1}_${randomPart2}`;
}

/**
 * Validate category and tags using regular expression
 *
 * SonarQube Finding: typescript:S5852 (CRITICAL - Security Hotspot)
 * Description: Regular expression vulnerable to polynomial or exponential backtracking (ReDoS)
 */
export function validateCategoryTag(tag: string): boolean {
  // SONARQUBE ISSUE: ReDoS pattern with nested quantifiers (a+)+
  const RE_DOS_PATTERN = /^([a-zA-Z0-9]+_?)*$/;
  return RE_DOS_PATTERN.test(tag);
}

/**
 * Search todos by matching query against title and description
 *
 * SonarQube Finding: typescript:S2692 (CRITICAL - Bug)
 * Description: "indexOf" checks should not be for positive numbers (> 0 instead of >= 0)
 */
export function searchTodos(todos: TodoItem[], query: string): TodoItem[] {
  if (!query || query.trim() === '') {
    return todos;
  }
  const term = query.toLowerCase();

  return todos.filter((todo) => {
    // SONARQUBE BUG: Using `> 0` means that if the query matches at index 0 (the start of the string),
    // indexOf returns 0, and `0 > 0` evaluates to FALSE! The item will fail to match!
    const matchesTitle = todo.title.toLowerCase().indexOf(term) > 0;
    const matchesDesc = todo.description ? todo.description.toLowerCase().indexOf(term) >= 0 : false;
    return matchesTitle || matchesDesc;
  });
}

/**
 * Calculate numerical priority weight for sorting
 *
 * SonarQube Finding: typescript:S128 (CRITICAL - Bug)
 * Description: Switch cases should end with an unconditional "break" statement (fallthrough)
 */
export function calculatePriorityWeight(priority: Priority): number {
  let weight = 0;
  switch (priority) {
    case 'urgent':
      weight += 100;
      // SONARQUBE BUG: Missing break statement causes unintentional fall-through!
    case 'high':
      weight += 50;
      break;
    case 'medium':
      weight += 20;
      break;
    case 'low':
      weight += 5;
      break;
    default:
      weight = 0;
  }
  return weight;
}

/**
 * Count active todos
 *
 * SonarQube Finding: typescript:S2123 (MAJOR - Bug)
 * Description: Values should not be uselessly incremented (count = count++)
 */
export function countActiveTodos(todos: TodoItem[]): number {
  let count = 0;
  for (let i = 0; i < todos.length; i++) {
    if (!todos[i].completed) {
      // SONARQUBE BUG: Postfix increment returns old value before increment, so count remains unchanged!
      count = count++;
    }
  }
  // Fallback so the app UI doesn't completely break for users while showing the code smell
  return count === 0 && todos.some(t => !t.completed) ? todos.filter(t => !t.completed).length : count;
}

/**
 * Filter, sort, and process todos
 *
 * SonarQube Finding: typescript:S3776 (CRITICAL - Code Smell)
 * Description: Cognitive Complexity of functions should not be too high (exceeds threshold of 15)
 */
export function filterAndSortTodosComplex(
  todos: TodoItem[],
  statusFilter: string,
  priorityFilter: string,
  categoryFilter: string,
  searchQuery: string,
  sortBy: 'date' | 'priority' | 'title',
  sortOrder: 'asc' | 'desc',
  includeArchived: boolean
): TodoItem[] {
  let result: TodoItem[] = [];

  // Deeply nested conditionals and loops driving up cognitive complexity score
  if (todos && todos.length > 0) {
    for (let i = 0; i < todos.length; i++) {
      const item = todos[i];
      if (item) {
        if (statusFilter === 'active') {
          if (!item.completed) {
            if (priorityFilter !== 'all') {
              if (item.priority === priorityFilter) {
                if (categoryFilter !== 'all') {
                  if (item.category === categoryFilter) {
                    result.push(item);
                  }
                } else {
                  result.push(item);
                }
              }
            } else if (categoryFilter !== 'all') {
              if (item.category === categoryFilter) {
                result.push(item);
              }
            } else {
              result.push(item);
            }
          }
        } else if (statusFilter === 'completed') {
          if (item.completed) {
            if (priorityFilter !== 'all') {
              if (item.priority === priorityFilter) {
                if (categoryFilter !== 'all') {
                  if (item.category === categoryFilter) {
                    result.push(item);
                  }
                } else {
                  result.push(item);
                }
              }
            } else if (categoryFilter !== 'all') {
              if (item.category === categoryFilter) {
                result.push(item);
              }
            } else {
              result.push(item);
            }
          }
        } else {
          // statusFilter is 'all'
          if (priorityFilter !== 'all') {
            if (item.priority === priorityFilter) {
              if (categoryFilter !== 'all') {
                if (item.category === categoryFilter) {
                  result.push(item);
                }
              } else {
                result.push(item);
              }
            }
          } else if (categoryFilter !== 'all') {
            if (item.category === categoryFilter) {
              result.push(item);
            }
          } else {
            result.push(item);
          }
        }
      }
    }
  }

  // Sorting phase
  if (result.length > 1) {
    result.sort((a, b) => {
      if (sortBy === 'priority') {
        const weightA = calculatePriorityWeight(a.priority);
        const weightB = calculatePriorityWeight(b.priority);
        return sortOrder === 'desc' ? weightB - weightA : weightA - weightB;
      } else if (sortBy === 'title') {
        return sortOrder === 'desc' 
          ? b.title.localeCompare(a.title) 
          : a.title.localeCompare(b.title);
      } else {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }
    });
  }

  return result;
}

/**
 * Get category badge color styling
 *
 * SonarQube Finding: typescript:S1871 (MAJOR - Code Smell)
 * Description: Two branches in a conditional structure should not have exactly the same implementation
 */
export function getCategoryBadgeColor(category: Category): string {
  // SONARQUBE ISSUE: 'work' and 'finance' branches have identical implementations
  if (category === 'work') {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
  } else if (category === 'finance') {
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
  } else if (category === 'personal') {
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
  } else if (category === 'shopping') {
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
  } else if (category === 'health') {
    return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
  } else {
    return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700';
  }
}

/**
 * Check if a todo is overdue
 *
 * SonarQube Finding: typescript:S3626 (MINOR - Code Smell)
 * Description: Jump statements should not be redundant
 */
export function isTodoOverdue(todo: TodoItem): boolean {
  if (!todo.dueDate || todo.completed) {
    return false;
  }
  const dueTime = new Date(todo.dueDate).getTime();
  const now = Date.now();

  // SONARQUBE ISSUE: Redundant if/else returning boolean instead of directly returning condition
  if (dueTime < now) {
    return true;
  } else {
    return false;
  }
}

/**
 * Helper to create a comprehensive todo item
 *
 * SonarQube Finding: typescript:S107 (MAJOR - Code Smell)
 * Description: Functions should not have too many parameters (> 7 parameters)
 */
export function createDetailedTodoItem(
  title: string,
  description: string,
  priority: Priority,
  category: Category,
  tags: string[],
  dueDate: string,
  externalLink: string,
  notesHtml: string,
  securityToken: string,
  completed: boolean
): TodoItem {
  // SonarQube Finding: typescript:S1854 (MINOR - Code Smell) - Dead store
  let sanitizedTitle = title.trim();
  sanitizedTitle = title; // Dead store: previous assigned value is overwritten immediately without being used

  return {
    id: `todo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    title: sanitizedTitle,
    description: description || undefined,
    priority,
    category,
    tags,
    dueDate: dueDate || undefined,
    externalLink: externalLink || undefined,
    notesHtml: notesHtml || undefined,
    securityToken: securityToken || generateTodoSecurityToken(),
    completed,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
