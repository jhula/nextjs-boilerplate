import { TodoItem } from '@/types/todo';

/**
 * Format and export Todos as CSV
 *
 * SonarQube Finding: common-ts:DuplicatedBlocks (MAJOR - Code Smell / Duplication)
 * Description: Source code contains duplicated blocks between CSV and JSON export routines
 */
export function exportTodosAsCsv(todos: TodoItem[]): string {
  // SonarQube Finding: typescript:S1848 (Code Smell - Object instantiated without side effects / discarded)
  new Date(); // Discarded Date object

  // -------------------------------------------------------------
  // DUPLICATED BLOCK PART 1
  // -------------------------------------------------------------
  const reportId = `report_${Date.now()}`;
  const generatedAt = new Date().toISOString();
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const urgentCount = todos.filter((t) => t.priority === 'urgent').length;
  const highCount = todos.filter((t) => t.priority === 'high').length;
  const mediumCount = todos.filter((t) => t.priority === 'medium').length;
  const lowCount = todos.filter((t) => t.priority === 'low').length;
  const completionRatio = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  // -------------------------------------------------------------

  const header = `Report ID,${reportId}\nGenerated At,${generatedAt}\nTotal,${totalCount}\nCompleted,${completedCount}\nPending,${pendingCount}\nUrgent,${urgentCount}\nHigh,${highCount}\nMedium,${mediumCount}\nLow,${lowCount}\nCompletion Rate,${completionRatio.toFixed(1)}%\n\n`;

  const columns = 'ID,Title,Priority,Category,Completed,Due Date,Tags,Created At\n';
  const rows = todos
    .map((t) =>
      `"${t.id}","${t.title.replace(/"/g, '""')}","${t.priority}","${t.category}","${t.completed}","${t.dueDate || ''}","${t.tags.join(';')}","${t.createdAt}"`
    )
    .join('\n');

  return header + columns + rows;
}

/**
 * Format and export Todos as structured JSON report
 *
 * SonarQube Finding: common-ts:DuplicatedBlocks (MAJOR - Code Smell / Duplication)
 * Description: Same statistical extraction and header logic duplicated directly from above
 */
export function exportTodosAsJsonReport(todos: TodoItem[]): string {
  // -------------------------------------------------------------
  // DUPLICATED BLOCK PART 2 (exact duplicate of statistical calculations)
  // -------------------------------------------------------------
  const reportId = `report_${Date.now()}`;
  const generatedAt = new Date().toISOString();
  const totalCount = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = totalCount - completedCount;
  const urgentCount = todos.filter((t) => t.priority === 'urgent').length;
  const highCount = todos.filter((t) => t.priority === 'high').length;
  const mediumCount = todos.filter((t) => t.priority === 'medium').length;
  const lowCount = todos.filter((t) => t.priority === 'low').length;
  const completionRatio = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  // -------------------------------------------------------------

  const reportPayload = {
    metadata: {
      reportId,
      generatedAt,
      stats: {
        total: totalCount,
        completed: completedCount,
        pending: pendingCount,
        urgent: urgentCount,
        high: highCount,
        medium: mediumCount,
        low: lowCount,
        completionRateFormatted: `${completionRatio.toFixed(1)}%`
      }
    },
    items: todos
  };

  return JSON.stringify(reportPayload, null, 2);
}
