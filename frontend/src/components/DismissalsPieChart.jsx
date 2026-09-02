"use client";

import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";

export default function DismissalsPieChart({ breakdown = {}, recentMatches = [], selectedSeason = "" }) {
  const [showLogModal, setShowLogModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Convert breakdown dictionary to sorted list of { name, count }
  const data = Object.entries(breakdown)
    .map(([name, count]) => ({ name, count: parseInt(count, 10) }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count);

  const total = data.reduce((sum, item) => sum + item.count, 0);

  // Collect all dismissal log entries across matches
  const allDismissals = recentMatches
    .filter(m => m.dismissal_log && m.dismissal_log.length > 0)
    .map(m => m.dismissal_log.map(d => ({ ...d, match: m.match, opponent: m.opponent })))
    .flat();

  const is2026 = selectedSeason === "2026";

  const openDismissalWindow = useCallback(() => {
    setShowLogModal(true);
  }, []);

  if (total === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col items-center justify-center min-h-[238px]">
        <div className="text-gray-400 font-bold text-sm">No dismissal records found</div>
        <p className="text-xs text-gray-450 mt-1 font-semibold text-center">
          This batsman remained not out or has no dismissal data recorded for this season.
        </p>
      </div>
    );
  }

  // Curated premium HSL-derived color palette matching the existing design system
  const colorMap = {
    "Caught": "#10b981",          // Emerald
    "Bowled": "#6366f1",          // Indigo
    "LBW": "#f59e0b",             // Amber
    "Run Out": "#f43f5e",         // Rose
    "Stumped": "#06b6d4",         // Cyan
    "Caught & Bowled": "#a855f7", // Purple
    "Hit Wicket": "#f97316",      // Orange
    "Other": "#94a3b8"            // Slate
  };

  const colors = data.map(item => colorMap[item.name] || colorMap["Other"]);

  // Circle dimensions for stroke-dasharray calculations
  const radius = 50;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius; // 314.159
  
  let accumulatedPercent = 0;

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5 flex flex-col justify-between flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-gray-900 text-sm tracking-tight">Dismissal Breakdown</h4>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Distribution of Outs</p>
          </div>
          {/* Dismissal Log Button — only for 2026 season */}
          {is2026 && allDismissals.length > 0 && (
            <button
              onClick={openDismissalWindow}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 text-white border border-violet-700 shadow-sm hover:bg-violet-700 hover:shadow-md transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Dismissal Log
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-1">
          {/* SVG Donut Chart */}
          <div className="relative h-32 w-32 flex-shrink-0">
            <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 140 140">
              {/* Background circle track */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke="#f8fafc"
                strokeWidth={strokeWidth}
              />
              {data.map((item, index) => {
                const percent = item.count / total;
                const strokeLength = percent * circumference;
                const strokeOffset = accumulatedPercent * circumference;
                accumulatedPercent += percent;

                return (
                  <circle
                    key={item.name}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="transparent"
                    stroke={colors[index]}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${strokeLength} ${circumference}`}
                    strokeDashoffset={-strokeOffset}
                    className="transition-all duration-300 ease-out hover:scale-105"
                    style={{ transformOrigin: "center" }}
                  />
                );
              })}
            </svg>

            {/* Center text representing total outs */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-gray-800 leading-none">{total}</span>
              <span className="text-[9px] font-black text-gray-400 uppercase mt-0.5 tracking-wider">Outs</span>
            </div>
          </div>

          {/* Legend Panel */}
          <div className="flex-1 w-full space-y-2">
            {data.map((item, index) => {
              const percentVal = Math.round((item.count / total) * 100);
              return (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: colors[index] }}
                    />
                    <span className="font-bold text-gray-600 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2.5 pl-2">
                    <span className="font-black text-gray-800">{item.count}</span>
                    <span className="text-gray-400 font-bold w-8 text-right">{percentVal}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full-Screen Dismissal Log Modal (Rendered via React Portal directly in document.body) */}
      {showLogModal && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl mx-4 max-h-[85vh] flex flex-col overflow-hidden border border-gray-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-violet-600 flex items-center justify-center shadow-sm">
                  <svg className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">Dismissal Log</h3>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">IPL 2026 — Ball-by-ball dismissal details</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="h-9 w-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body — Scrollable Table */}
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10 bg-gray-50/95 backdrop-blur-sm">
                  <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                    <th className="py-3.5 px-6">#</th>
                    <th className="py-3.5 px-4">Match</th>
                    <th className="py-3.5 px-4">Opponent</th>
                    <th className="py-3.5 px-4 text-center">Over</th>
                    <th className="py-3.5 px-4">Bowler</th>
                    <th className="py-3.5 px-4 text-center">Type</th>
                    <th className="py-3.5 px-4 text-center">Length</th>
                    <th className="py-3.5 px-4 text-center">Line</th>
                    <th className="py-3.5 px-4 text-center">Shot</th>
                    <th className="py-3.5 px-4 text-center">Caught At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {allDismissals.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="py-12 text-center text-gray-400 font-medium">
                        No ball-by-ball dismissal data available.
                      </td>
                    </tr>
                  ) : (
                    allDismissals.map((d, idx) => (
                      <tr key={idx} className="hover:bg-violet-50/30 transition-colors duration-150">
                        <td className="py-3.5 px-6 font-black text-gray-300 text-xs">{idx + 1}</td>
                        <td className="py-3.5 px-4 font-bold text-gray-800 text-xs">{d.match}</td>
                        <td className="py-3.5 px-4 font-medium text-gray-500 text-xs">{d.opponent}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-lg bg-violet-50 border border-violet-100 text-[11px] font-black text-violet-700">
                            {d.over}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-bold text-gray-900 text-xs">{d.bowler}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${
                            d.wicket_kind === "bowled" 
                              ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                              : d.wicket_kind === "caught"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                              : d.wicket_kind === "lbw"
                              ? "bg-amber-50 text-amber-700 border-amber-100"
                              : d.wicket_kind === "run out"
                              ? "bg-rose-50 text-rose-700 border-rose-100"
                              : d.wicket_kind === "stumped"
                              ? "bg-cyan-50 text-cyan-700 border-cyan-100"
                              : d.wicket_kind === "hit wicket"
                              ? "bg-orange-50 text-orange-700 border-orange-100"
                              : "bg-gray-50 text-gray-600 border-gray-100"
                          }`}>
                            {d.wicket_kind}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-100 text-[11px] font-bold text-amber-800">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            {d.ball_length}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-blue-50 border border-blue-100 text-[11px] font-bold text-blue-800">
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            {d.ball_line}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${
                            d.shot_played === "NA"
                              ? "bg-gray-50 text-gray-400 border-gray-100"
                              : "bg-teal-50 text-teal-800 border-teal-100"
                          }`}>
                            {d.shot_played}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${
                            d.caught_at === "NA"
                              ? "bg-gray-50 text-gray-400 border-gray-100"
                              : "bg-pink-50 text-pink-800 border-pink-100"
                          }`}>
                            {d.caught_at}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="px-8 py-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                {allDismissals.length} dismissal{allDismissals.length !== 1 ? "s" : ""} recorded
              </span>
              <button
                onClick={() => setShowLogModal(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gray-900 text-white hover:bg-gray-800 transition-colors cursor-pointer shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
