"use client";

import React, { useMemo } from "react";
import { Loader2 } from "lucide-react";
import { TEAM_THEMES } from "../views/TeamsView";

export default function SquadModal({
  selectedTeam,
  squadList = [],
  squadSearchQuery,
  setSquadSearchQuery,
  onClose,
  onSelectPlayer,
}) {
  if (!selectedTeam) return null;

  const selectedTeamTheme = TEAM_THEMES[selectedTeam.code] || {
    primary: "#6b7280",
    secondary: "#374151",
    shadow: "rgba(107, 114, 128, 0.15)",
    textDark: false,
  };
  const headerTextColor = selectedTeamTheme.textDark ? "#1e293b" : "#ffffff";

  const filteredSquad = useMemo(() => {
    if (!squadSearchQuery) return squadList;
    return squadList.filter((p) =>
      p.displayName.toLowerCase().includes(squadSearchQuery.toLowerCase())
    );
  }, [squadList, squadSearchQuery]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-gray-100 animate-[scaleIn_0.25s_ease-out]">
        {/* Modal Header */}
        <div
          className="relative p-6 flex flex-col gap-1"
          style={{
            background: `linear-gradient(to right, ${selectedTeamTheme.primary}, ${selectedTeamTheme.secondary})`,
            color: headerTextColor,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full transition-colors cursor-pointer"
            style={{
              backgroundColor: selectedTeamTheme.textDark ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.2)",
              color: headerTextColor,
            }}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <span
            className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md w-fit"
            style={{
              backgroundColor: selectedTeamTheme.textDark ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.2)",
            }}
          >
            IPL 2026 SEASON
          </span>
          <h3 className="text-2xl font-black tracking-tight mt-1">
            {selectedTeam.name}
          </h3>
          <p
            className="text-xs font-semibold"
            style={{ color: selectedTeamTheme.textDark ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)" }}
          >
            Squad Roster • {selectedTeam.squadSize} Players
          </p>
        </div>

        {/* Search filter in Squad */}
        <div className="p-4 border-b border-gray-50 bg-gray-50/30">
          <input
            type="text"
            placeholder="Search player in squad..."
            value={squadSearchQuery}
            onChange={(e) => setSquadSearchQuery(e.target.value)}
            className="w-full px-5 py-3 rounded-2xl bg-white border border-gray-150 focus:outline-none focus:border-blue-500 transition-all font-medium text-sm text-gray-800 placeholder-gray-400 shadow-sm"
          />
        </div>

        {/* Squad List Roster */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[50vh]">
          {squadList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-7 w-7 text-blue-600 animate-spin" />
              <span className="text-xs text-gray-550 font-bold">Loading squad roster...</span>
            </div>
          ) : filteredSquad.length === 0 ? (
            <div className="text-center py-12 text-gray-400 font-bold text-sm">
              No squad players match "{squadSearchQuery}"
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredSquad.map((player) => {
                const initials = player.displayName.split(" ").map((n) => n[0]).join("");
                return (
                  <div
                    key={player.dbName}
                    onClick={() => onSelectPlayer(player.dbName)}
                    className="group flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center min-w-0">
                      <div
                        className="h-9 w-9 rounded-xl font-extrabold text-xs flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: selectedTeamTheme.primary,
                          color: selectedTeamTheme.textDark ? "#1e293b" : "#ffffff",
                        }}
                      >
                        {initials}
                      </div>
                      <span className="font-bold text-gray-850 text-sm group-hover:text-blue-700 transition-colors ml-3 truncate">
                        {player.displayName}
                      </span>
                    </div>
                    <svg className="h-4 w-4 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
