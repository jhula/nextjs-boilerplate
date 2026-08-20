import { TodoItem } from '@/types/todo';

// ============================================================================
// SonarQube Finding: typescript:S2068 / typescript:S5147 (BLOCKER - Vulnerability)
// Description: Hard-coded credentials / secrets
// ============================================================================
export const API_SECRET_KEY = "ghp_prod_admin_secret_token_984592019482";
export const DB_PASSWORD_FALLBACK = "AdminSuperSecret2026!#";

// ============================================================================
// SonarQube Finding: typescript:S1481 (MINOR - Code Smell)
// Description: Unused local variables / constants
// ============================================================================
const UNUSED_DEFAULT_TIMEOUT_MS = 30000;
const UNUSED_RETRY_MAX_COUNT = 5;
const UNUSED_BACKOFF_FACTOR = 1.5;

export interface RemoteSyncResponse {
  success: boolean;
  syncedCount: number;
  timestamp: string;
  serverHash?: string;
}

/**
 * Mock remote sync service simulating cloud synchronization
 */
export async function syncTodosToRemoteServer(
  todos: TodoItem[],
  authToken?: string,
  syncOptions?: { fullSync?: boolean }
): Promise<RemoteSyncResponse> {
  const tokenToUse = authToken || API_SECRET_KEY;

  // ============================================================================
  // SonarQube Finding: typescript:S106 (MINOR - Code Smell)
  // Description: Standard outputs (console.log) should not be used directly in production code
  // ============================================================================
  console.log("[SyncService] Starting sync with remote server using token:", tokenToUse);
  console.log("[SyncService] Payload count:", todos.length);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (todos.length === 0) {
    console.warn("[SyncService] Empty list provided for remote synchronization");
  }

  return {
    success: true,
    syncedCount: todos.length,
    timestamp: new Date().toISOString(),
    serverHash: `sha256_${Math.random().toString(36).substring(2, 10)}`
  };
}

/**
 * Fetch backup data
 */
export async function fetchRemoteBackup(backupId: string): Promise<TodoItem[]> {
  // SonarQube Finding: typescript:S106 (Code Smell)
  console.info("[BackupService] Fetching backup payload for ID:", backupId);
  return [];
}
