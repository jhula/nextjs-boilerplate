'use client';

import React, { useState } from 'react';
import { SONAR_FINDINGS } from '@/lib/sonar-findings';
import { SonarFinding, SonarSeverity, SonarType } from '@/types/todo';

export const SonarInspector: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Statistics
  const totalFindings = SONAR_FINDINGS.length;
  const vulnerabilitiesCount = SONAR_FINDINGS.filter((f) => f.type === 'VULNERABILITY').length;
  const hotspotsCount = SONAR_FINDINGS.filter((f) => f.type === 'SECURITY_HOTSPOT').length;
  const bugsCount = SONAR_FINDINGS.filter((f) => f.type === 'BUG').length;
  const smellsCount = SONAR_FINDINGS.filter((f) => f.type === 'CODE_SMELL').length;
  const duplicationsCount = SONAR_FINDINGS.filter((f) => f.type === 'DUPLICATION').length;

  const blockerCount = SONAR_FINDINGS.filter((f) => f.severity === 'BLOCKER').length;
  const criticalCount = SONAR_FINDINGS.filter((f) => f.severity === 'CRITICAL').length;
  const majorCount = SONAR_FINDINGS.filter((f) => f.severity === 'MAJOR').length;
  const minorCount = SONAR_FINDINGS.filter((f) => f.severity === 'MINOR').length;

  const filteredFindings = SONAR_FINDINGS.filter((f) => {
    if (selectedType !== 'ALL' && f.type !== selectedType) return false;
    if (selectedSeverity !== 'ALL' && f.severity !== selectedSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.ruleKey.toLowerCase().includes(q) ||
        f.title.toLowerCase().includes(q) ||
        f.filePath.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getSeverityBadge = (severity: SonarSeverity) => {
    switch (severity) {
      case 'BLOCKER':
        return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50';
      case 'CRITICAL':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50';
      case 'MAJOR':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50';
      case 'MINOR':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
      default:
        return 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800';
    }
  };

  const getTypeBadge = (type: SonarType) => {
    switch (type) {
      case 'VULNERABILITY':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300';
      case 'SECURITY_HOTSPOT':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300';
      case 'BUG':
        return 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300';
      case 'DUPLICATION':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/60 dark:text-yellow-300';
      default:
        return 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Metrics Dashboard */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center p-1.5 rounded-lg bg-indigo-600 text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                SonarQube Findings Inspector
              </h2>
            </div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Explore all intentional vulnerabilities, bugs, security hotspots, and code smells embedded in this project.
            </p>
          </div>

          {/* Quality Gate Mock Status */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              Quality Gate: Failed
            </div>
          </div>
        </div>

        {/* Severity & Category Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-800">
            <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Total Issues</div>
            <div className="mt-1 text-2xl font-black text-zinc-900 dark:text-zinc-100">{totalFindings}</div>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-200/80 dark:border-rose-900/30">
            <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">Vulnerabilities</div>
            <div className="mt-1 text-2xl font-black text-rose-600 dark:text-rose-400">{vulnerabilitiesCount}</div>
          </div>

          <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-200/80 dark:border-purple-900/30">
            <div className="text-xs text-purple-600 dark:text-purple-400 font-medium">Hotspots</div>
            <div className="mt-1 text-2xl font-black text-purple-600 dark:text-purple-400">{hotspotsCount}</div>
          </div>

          <div className="p-3 rounded-xl bg-red-500/5 border border-red-200/80 dark:border-red-900/30">
            <div className="text-xs text-red-600 dark:text-red-400 font-medium">Bugs</div>
            <div className="mt-1 text-2xl font-black text-red-600 dark:text-red-400">{bugsCount}</div>
          </div>

          <div className="p-3 rounded-xl bg-sky-500/5 border border-sky-200/80 dark:border-sky-900/30">
            <div className="text-xs text-sky-600 dark:text-sky-400 font-medium">Code Smells</div>
            <div className="mt-1 text-2xl font-black text-sky-600 dark:text-sky-400">{smellsCount}</div>
          </div>

          <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-200/80 dark:border-yellow-900/30">
            <div className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Duplications</div>
            <div className="mt-1 text-2xl font-black text-yellow-600 dark:text-yellow-400">{duplicationsCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search rule ID (e.g. S2068, S5131, S3776), title, or file..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-indigo-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
        >
          <option value="ALL">All Types</option>
          <option value="VULNERABILITY">Vulnerabilities</option>
          <option value="SECURITY_HOTSPOT">Security Hotspots</option>
          <option value="BUG">Bugs</option>
          <option value="CODE_SMELL">Code Smells</option>
          <option value="DUPLICATION">Duplication</option>
        </select>

        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-indigo-500 focus:outline-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
        >
          <option value="ALL">All Severities</option>
          <option value="BLOCKER">Blocker ({blockerCount})</option>
          <option value="CRITICAL">Critical ({criticalCount})</option>
          <option value="MAJOR">Major ({majorCount})</option>
          <option value="MINOR">Minor ({minorCount})</option>
        </select>
      </div>

      {/* Findings List */}
      <div className="space-y-3">
        {filteredFindings.map((finding) => {
          const isExpanded = expandedId === finding.id;

          return (
            <div
              key={finding.id}
              className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs dark:border-zinc-800 dark:bg-zinc-900 transition-all"
            >
              {/* Finding header */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : finding.id)}
                className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full border text-[11px] font-bold uppercase tracking-wider ${getSeverityBadge(finding.severity)}`}>
                      {finding.severity}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${getTypeBadge(finding.type)}`}>
                      {finding.type.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
                      {finding.ruleKey}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {finding.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                    <span>📁 {finding.filePath}</span>
                    <span>:</span>
                    <span>Line {finding.line}</span>
                  </div>
                </div>

                <div className="shrink-0 pt-1 text-zinc-400">
                  <svg
                    className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Finding Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-4">
                  {/* Code snippet */}
                  <div>
                    <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                      Problematic Code Snippet:
                    </div>
                    <pre className="p-3 rounded-xl bg-zinc-950 text-rose-300 font-mono text-xs overflow-x-auto border border-zinc-800">
                      <code>{finding.codeSnippet}</code>
                    </pre>
                  </div>

                  {/* Why SonarQube flags it */}
                  <div>
                    <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Why SonarQube flags this:
                    </div>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {finding.description}
                    </p>
                  </div>

                  {/* Recommended remediation */}
                  <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40">
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-400 mb-1">
                      Recommended Remediation:
                    </div>
                    <p className="text-xs text-emerald-900 dark:text-emerald-300">
                      {finding.remediation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredFindings.length === 0 && (
          <div className="p-8 text-center text-zinc-500 dark:text-zinc-400 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
            No matching SonarQube findings found for your filter.
          </div>
        )}
      </div>
    </div>
  );
};
