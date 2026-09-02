"use client";

import React from "react";
import { ChevronDown, Loader2, Calendar } from "lucide-react";
import StatsGrid from "../StatsGrid";
import DashboardInsights from "../DashboardInsights";
import CricketFieldMap from "../CricketFieldMap";
import RecentMatches from "../RecentMatches";

export default function PlayerDetailView({
  selectedPlayer,
  setSelectedPlayer,
  selectedSeason,
  setSelectedSeason,
  seasonsList = [],
  playersList = [],
  playerStats,
  playerMatches = [],
  phaseStats = {},
  bowlerStats = {},
  oversStats = [],
  shotMapData = [],
  loading,
  getDisplayName,
  formatSeasonDisplay,
  playerDropdownRef,
  seasonDropdownRef,
  playerDropdownOpen,
  setPlayerDropdownOpen,
  seasonDropdownOpen,
  setSeasonDropdownOpen,
}) {
  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* Navigation Breadcrumb & Dropdown selectors */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedPlayer(null)}
            className="flex items-center justify-center h-10 px-4 rounded-xl border border-gray-150 text-xs font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-all cursor-pointer shadow-sm gap-2"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Catalog
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <div className="text-sm font-semibold text-gray-500">
            Analyzing <span className="font-bold text-gray-950">{getDisplayName(selectedPlayer)}</span> in {formatSeasonDisplay(selectedSeason)}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Player Dropdown */}
          <div className="relative inline-block text-left" ref={playerDropdownRef}>
            <button
              onClick={() => setPlayerDropdownOpen(!playerDropdownOpen)}
              className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm text-xs font-bold text-gray-800 hover:bg-gray-50/70 hover:border-gray-250 transition-all cursor-pointer min-w-[180px]"
            >
              <span className="h-4 w-4 rounded-full bg-blue-600 shadow-inner flex-shrink-0" />
              <span className="flex-1 text-left truncate">
                {getDisplayName(selectedPlayer)}
              </span>
              <ChevronDown className={`h-4.5 w-4.5 text-gray-400 transition-transform duration-200 ${playerDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {playerDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-72 bg-white border border-gray-150 rounded-2xl shadow-xl shadow-gray-100/50 z-30 py-1.5 max-h-80 overflow-y-auto">
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 border-b border-gray-50 tracking-wider uppercase">
                  Batters ({formatSeasonDisplay(selectedSeason)})
                </div>
                {playersList.length === 0 ? (
                  <div className="px-5 py-3 text-xs text-gray-400 font-medium">No active batters.</div>
                ) : (
                  playersList.slice(0, 20).map((player) => (
                    <button
                      key={player.name}
                      onClick={() => {
                        setSelectedPlayer(player.name);
                        setPlayerDropdownOpen(false);
                      }}
                      className={`w-full text-left px-5 py-3 text-sm flex items-center gap-3 transition-colors ${
                        selectedPlayer === player.name
                          ? "bg-blue-50/50 text-blue-700 font-bold"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium"
                      }`}
                    >
                      <span className={`h-3 w-3 rounded-full flex-shrink-0 ${
                        selectedPlayer === player.name ? "bg-blue-600" : "bg-gray-200"
                      }`} />
                      <span className="flex-1 truncate">
                        {getDisplayName(player.name)}
                      </span>
                      <span className="text-xs text-gray-450 flex-shrink-0 font-bold">
                        {player.runs.toLocaleString()} runs
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Season Dropdown */}
          <div className="relative inline-block text-left" ref={seasonDropdownRef}>
            <button
              onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
              className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl border border-gray-100 shadow-sm text-xs font-bold text-gray-800 hover:bg-gray-50/70 hover:border-gray-250 transition-all cursor-pointer min-w-[150px]"
            >
              <Calendar className="h-4.5 w-4.5 text-gray-400 flex-shrink-0" />
              <span className="flex-1 text-left truncate">
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
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="text-sm text-gray-500 font-semibold tracking-wide">
            Computing player metrics for {formatSeasonDisplay(selectedSeason)}...
          </span>
        </div>
      ) : (
        <>
          {/* Stat Cards Row */}
          <StatsGrid stats={playerStats} />

          {/* Inline Dashboard Insights (Line Chart & Matchups) */}
          <DashboardInsights
            playerName={getDisplayName(selectedPlayer)}
            phaseStats={phaseStats}
            bowlerStats={bowlerStats}
            oversStats={oversStats}
            playerStats={playerStats}
            recentMatches={playerMatches}
            selectedSeason={selectedSeason}
          />

          {/* Interactive Cricket Field Map - Only for 2026 season */}
          {selectedSeason === "2026" && (
            <CricketFieldMap
              data={shotMapData}
              selectedSeason={selectedSeason}
              playerName={selectedPlayer}
            />
          )}

          {/* Match Table */}
          <RecentMatches matches={playerMatches} />
        </>
      )}
    </div>
  );
}
