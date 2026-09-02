"use client";

import React, { useMemo } from "react";
import { Calendar, ChevronDown } from "lucide-react";

const GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-teal-500 to-emerald-600",
  "from-purple-500 to-pink-600",
  "from-rose-500 to-red-600",
  "from-amber-500 to-orange-600",
  "from-violet-500 to-purple-600",
];

export default function PlayersView({
  playersList = [],
  seasonsList = [],
  selectedSeason,
  setSelectedSeason,
  onSelectPlayer,
  getDisplayName,
  formatSeasonDisplay,
  seasonDropdownRef,
  seasonDropdownOpen,
  setSeasonDropdownOpen,
}) {
  const renderedPlayers = useMemo(() => {
    return playersList.slice(0, 40).map((player, index) => {
      const initials = player.name.split(" ").map((n) => n[0]).join("");
      let hash = 0;
      for (let i = 0; i < player.name.length; i++) {
        hash = player.name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const grad = GRADIENTS[Math.abs(hash) % GRADIENTS.length];

      return (
        <div
          key={player.name}
          onClick={() => onSelectPlayer(player.name)}
          className="group bg-white border border-gray-100 hover:border-blue-200 rounded-2xl p-5 hover:shadow-lg hover:shadow-gray-100/50 transition-all duration-305 cursor-pointer flex items-center gap-4"
        >
          <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-white font-extrabold text-sm shadow-sm group-hover:scale-105 transition-transform`}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-600 transition-colors truncate">
              {getDisplayName(player.name)}
            </h4>
            <p className="text-xs font-semibold text-gray-400 mt-0.5">
              {player.runs.toLocaleString()} runs
            </p>
          </div>
          {index < 3 && (
            <span className="text-[10px] font-extrabold uppercase bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md border border-amber-100">
              Top
            </span>
          )}
        </div>
      );
    });
  }, [playersList, getDisplayName, onSelectPlayer]);

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">IPL Player Catalog</h2>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            Select a cricketer from the leaderboard to inspect their full stats
          </p>
        </div>

        {/* Season Selector inside Catalog */}
        <div className="relative inline-block text-left" ref={seasonDropdownRef}>
          <button
            onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
            className="flex items-center gap-3 bg-white px-5 py-3.5 rounded-2xl border border-gray-100 shadow-sm text-sm font-bold text-gray-800 hover:bg-gray-50/70 hover:border-gray-250 transition-all cursor-pointer min-w-[180px]"
          >
            <Calendar className="h-5 w-5 text-gray-400 flex-shrink-0" />
            <span className="flex-1 text-left">
              {formatSeasonDisplay(selectedSeason)}
            </span>
            <ChevronDown className={`h-4.5 w-4.5 text-gray-400 transition-transform duration-200 ${seasonDropdownOpen ? "rotate-180" : ""}`} />
          </button>

          {seasonDropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-56 bg-white border border-gray-150 rounded-2xl shadow-xl shadow-gray-100/50 z-30 py-1.5 max-h-80 overflow-y-auto">
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 border-b border-gray-50 tracking-wider uppercase">
                Select Season
              </div>
              {seasonsList.map((season) => (
                <button
                  key={season}
                  onClick={() => {
                    setSelectedSeason(season);
                    setSeasonDropdownOpen(false);
                  }}
                  className={`w-full text-left px-5 py-3 text-sm flex items-center gap-3 transition-colors ${
                    selectedSeason === season
                      ? "bg-blue-50/50 text-blue-700 font-bold"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
                  }`}
                >
                  <span className={`h-3 w-3 rounded-full flex-shrink-0 ${
                    selectedSeason === season ? "bg-blue-600" : "bg-gray-200"
                  }`} />
                  <span className="flex-1">
                    {formatSeasonDisplay(season)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {playersList.length === 0 ? (
        <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl shadow-sm text-gray-450 font-bold">
          Loading player catalog...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {renderedPlayers}
        </div>
      )}
    </div>
  );
}
