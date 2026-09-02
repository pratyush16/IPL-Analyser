"use client";

import React, { useMemo } from "react";
import { Calendar } from "lucide-react";

const BG_GRADIENTS = [
  "from-amber-500 to-orange-600",
  "from-slate-700 to-slate-900",
  "from-blue-500 to-indigo-600",
  "from-teal-500 to-emerald-600",
  "from-purple-500 to-pink-600",
  "from-rose-500 to-red-600",
  "from-cyan-500 to-blue-600",
  "from-amber-600 to-yellow-600"
];

const DEFAULT_LEGENDS = [
  { name: "V Kohli", runs: 8004 },
  { name: "S Dhawan", runs: 6769 },
  { name: "RG Sharma", runs: 6628 },
  { name: "DA Warner", runs: 6565 },
  { name: "SK Raina", runs: 5528 },
  { name: "MS Dhoni", runs: 5243 },
  { name: "AB de Villiers", runs: 5162 },
  { name: "CH Gayle", runs: 4965 }
];

export default function DashboardView({
  seasonsList = [],
  playersList = [],
  onSelectPlayer,
  onViewAllPlayers,
  getDisplayName,
}) {
  const topScorer = playersList.length > 0 ? playersList[0] : DEFAULT_LEGENDS[0];

  const topEightPlayers = useMemo(() => {
    return playersList.length > 0 ? playersList.slice(0, 8) : DEFAULT_LEGENDS;
  }, [playersList]);

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="max-w-2xl relative z-10">
          <span className="bg-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-400/20">
            Welcome to IPL Analyzer
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-4 tracking-tight leading-tight">
            In-Depth IPL Cricket Stats & Performance Analytics
          </h2>
          <p className="text-blue-100 mt-3 text-base font-medium leading-relaxed">
            Explore batsman records, team performance timelines, strike rate breakdowns by game overs, bowler matchups, and phase-wise scoring analysis.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={onViewAllPlayers}
              className="bg-white text-blue-700 hover:bg-blue-50 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              Browse Player Catalog
            </button>
            <div className="text-xs text-blue-200 flex items-center font-semibold">
              Tip: Use the search bar above to look up any cricketer instantly
            </div>
          </div>
        </div>
      </div>

      {/* Global Overview Grid */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 tracking-tight">System Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 flex-shrink-0">
              <Calendar className="h-7 w-7" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">
                {seasonsList.length > 0 ? seasonsList.length - 1 : 19}
              </div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">Seasons Tracked</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">From 2008 to 2026 IPL</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">500+</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">Players Tracked</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">Batsmen, bowlers & allrounders</div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
            <div className="h-14 w-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 flex-shrink-0">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-gray-900">
                {topScorer ? topScorer.name : "Virat Kohli"}
              </div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">All-Time Top Batter</div>
              <div className="text-xs text-gray-500 mt-1 font-medium">
                {topScorer ? `${topScorer.runs.toLocaleString()} runs` : "8,004 runs"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Time Legends / Top Scorers */}
      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-gray-50 pb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900">IPL All-Time Leaderboard</h3>
            <p className="text-xs text-gray-450 font-semibold">Top 8 run scorers in IPL history</p>
          </div>
          <button
            onClick={onViewAllPlayers}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50/50 hover:bg-blue-55 px-4 py-2 rounded-xl transition-all self-start sm:self-auto cursor-pointer"
          >
            View Full List
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topEightPlayers.map((player, index) => {
            const grad = BG_GRADIENTS[index % BG_GRADIENTS.length];
            const initials = player.name.split(" ").map(n => n[0]).join("");

            return (
              <div
                key={player.name}
                onClick={() => onSelectPlayer(player.name)}
                className="group relative overflow-hidden bg-gray-50/50 border border-gray-100/70 hover:border-blue-100 rounded-2xl p-5 hover:bg-white hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-300 cursor-pointer text-center flex flex-col items-center"
              >
                {/* Rank Badge */}
                <span className="absolute top-3 right-3 h-6 w-6 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-xs font-black text-gray-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {index + 1}
                </span>

                {/* Avatar Sphere */}
                <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform duration-300`}>
                  {initials}
                </div>

                <h4 className="font-bold text-gray-800 mt-4 group-hover:text-blue-600 transition-colors truncate w-full">
                  {getDisplayName(player.name)}
                </h4>
                <p className="text-xs font-semibold text-gray-400 mt-1">
                  {player.runs.toLocaleString()} runs
                </p>

                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs font-bold text-blue-600 flex items-center gap-1.5">
                  Analyze Stats
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
