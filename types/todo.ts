export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type Category = 'work' | 'personal' | 'shopping' | 'health' | 'finance' | 'other';

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  notesHtml?: string; // Intentionally used for XSS demonstration in SonarQube
  completed: boolean;
  priority: Priority;
  category: Category;
  tags: string[];
  dueDate?: string;
  externalLink?: string;
  createdAt: string;
  updatedAt: string;
  securityToken?: string;
}

export type FilterStatus = 'all' | 'active' | 'completed';

export interface TodoStats {
  total: number;
  completed: number;
  active: number;
  urgentOrHigh: number;
  overdue: number;
  completionRate: number;
}

export type SonarSeverity = 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';
export type SonarType = 'VULNERABILITY' | 'BUG' | 'CODE_SMELL' | 'SECURITY_HOTSPOT' | 'DUPLICATION';

export interface SonarFinding {
  id: string;
  ruleKey: string;
  title: string;
  type: SonarType;
  severity: SonarSeverity;
  filePath: string;
  line: number;
  codeSnippet: string;
  description: string;
  remediation: string;
}
