# Next.js Todo App (with SonarQube Demonstration Findings)

A modern, responsive Todo application built with Next.js (App Router), React 19, TypeScript, and Tailwind CSS.

This project has been intentionally seeded with **23 classic SonarQube static code analysis findings** (vulnerabilities, security hotspots, reliability bugs, maintainability code smells, and duplications) for testing, educational, and benchmarking purposes.

---

## 🚀 Features

- **Full Todo Management**: Create, edit, toggle completion, delete tasks.
- **Priority & Categorization**: Low, Medium, High, and Urgent priority levels, with categories (Work, Personal, Shopping, Health, Finance, Other) and custom tags.
- **Advanced Metadata**: Due dates, overdue calculations, external reference links, formatted HTML notes.
- **Filtering & Search**: Multi-criteria filtering by completion status, category, priority, and text search.
- **Mock Cloud Sync**: Remote synchronization simulation using background client APIs.
- **Reporting & Export**: Export task metrics as CSV or structured JSON reports.
- **Interactive SonarQube Inspector**: In-app inspector tab providing live breakdown of rule IDs, severity, file locations, code snippets, and remediation steps.

---

## 🔍 SonarQube Findings Catalog

The project contains 23 intentional rule violations categorized below:

### 1. Security Vulnerabilities & Hotspots

| Rule ID | Severity | Category | File | Description |
|---|---|---|---|---|
| `typescript:S2068` / `S5147` | **BLOCKER** | Vulnerability | [`lib/api-client.ts`](lib/api-client.ts) | Hard-coded API secret token credentials |
| `typescript:S5131` | **BLOCKER** | Vulnerability | [`components/TodoItem.tsx`](components/TodoItem.tsx) | DOM XSS via `dangerouslySetInnerHTML` rendering raw HTML |
| `typescript:S2245` | **CRITICAL** | Security Hotspot | [`lib/todo-utils.ts`](lib/todo-utils.ts) | Pseudorandom `Math.random()` used for security token generation |
| `typescript:S5852` | **CRITICAL** | Security Hotspot | [`lib/todo-utils.ts`](lib/todo-utils.ts) | ReDoS-vulnerable regular expression in tag validator |
| `typescript:S5144` | **MAJOR** | Vulnerability | [`components/TodoItem.tsx`](components/TodoItem.tsx) | Target `_blank` link without `rel="noopener noreferrer"` |

### 2. Reliability & Logic Bugs

| Rule ID | Severity | Category | File | Description |
|---|---|---|---|---|
| `typescript:S2692` | **CRITICAL** | Bug | [`lib/todo-utils.ts`](lib/todo-utils.ts) | `indexOf > 0` check ignores matches at string start (index 0) |
| `typescript:S1764` | **CRITICAL** | Bug | [`lib/todo-store.ts`](lib/todo-store.ts) | Identical sub-expressions on both sides of binary operator (`t.id === t.id`) |
| `typescript:S128` | **CRITICAL** | Bug | [`lib/todo-utils.ts`](lib/todo-utils.ts) | Switch case missing `break` (unintended fallthrough) |
| `typescript:S2123` | **MAJOR** | Bug | [`lib/todo-utils.ts`](lib/todo-utils.ts) | Values should not be uselessly incremented (`count = count++`) |
| `typescript:S2589` | **MAJOR** | Bug | [`components/TodoList.tsx`](components/TodoList.tsx) | Boolean expression always true (`todos.length >= 0`) |

### 3. Maintainability & Code Smells

| Rule ID | Severity | Category | File | Description |
|---|---|---|---|---|
| `typescript:S3776` | **CRITICAL** | Code Smell | [`lib/todo-utils.ts`](lib/todo-utils.ts) | Cognitive Complexity exceeds threshold in filter function |
| `typescript:S3358` | **MAJOR** | Code Smell | [`components/TodoBadge.tsx`](components/TodoBadge.tsx) | Deeply nested ternary operator expressions |
| `typescript:S1871` | **MAJOR** | Code Smell | [`lib/todo-utils.ts`](lib/todo-utils.ts) | Duplicate branches in conditional structures (`work` vs `finance`) |
| `typescript:S107` | **MAJOR** | Code Smell | [`lib/todo-utils.ts`](lib/todo-utils.ts) | Function with too many parameters (>7 arguments) |
| `typescript:S6440` | **MAJOR** | Code Smell | [`components/TodoList.tsx`](components/TodoList.tsx) | React anti-pattern: using array index as `key={index}` |
| `typescript:S2486` | **CRITICAL** | Code Smell | [`lib/todo-store.ts`](lib/todo-store.ts) | Empty catch block silently swallowing exceptions |
| `typescript:S106` | **MINOR** | Code Smell | [`lib/api-client.ts`](lib/api-client.ts) | Direct `console.log` statements in production code |
| `typescript:S1186` | **MINOR** | Code Smell | [`components/TodoForm.tsx`](components/TodoForm.tsx) | Empty method without comments (`onQuickAction`) |
| `typescript:S1854` | **MINOR** | Code Smell | [`lib/todo-utils.ts`](lib/todo-utils.ts) | Dead store (overwritten assignment without being read) |
| `typescript:S3626` | **MINOR** | Code Smell | [`lib/todo-utils.ts`](lib/todo-utils.ts) | Redundant jump statements (`if (cond) return true; else return false;`) |
| `typescript:S1481` | **MINOR** | Code Smell | [`lib/api-client.ts`](lib/api-client.ts) | Unused local variables and constants |
| `typescript:S1135` | **INFO** | Code Smell | [`lib/todo-utils.ts`](lib/todo-utils.ts) | Track uses of `TODO` and `FIXME` comments in codebase |
| `DuplicatedBlocks` | **MAJOR** | Duplication | [`lib/export-helpers.ts`](lib/export-helpers.ts) | Identical block of ~30 lines duplicated between CSV and JSON exporters |

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Run SonarQube Scanner
If you have `sonar-scanner` installed locally:
```bash
sonar-scanner
```
Or with SonarCloud:
```bash
sonar-scanner \
  -Dsonar.organization=<your-org> \
  -Dsonar.projectKey=nextjs-todo-boilerplate \
  -Dsonar.sources=. \
  -Dsonar.host.url=https://sonarcloud.io
```
