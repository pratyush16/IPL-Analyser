"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import TeamLogo from "../ui/TeamLogo";

export const TEAM_THEMES = {
  CSK: { primary: "#eab308", secondary: "#1d4ed8", shadow: "rgba(234, 179, 8, 0.15)", textDark: true, logoUrl: "https://upload.wikimedia.org/wikipedia/en/2/2b/Chennai_Super_Kings_Logo.svg" },
  DC: { primary: "#2563eb", secondary: "#ef4444", shadow: "rgba(37, 99, 235, 0.15)", textDark: false, logoUrl: "https://upload.wikimedia.org/wikipedia/en/2/2f/Delhi_Capitals.svg" },
  GT: { primary: "#1e293b", secondary: "#d4af37", shadow: "rgba(30, 41, 59, 0.15)", textDark: false, logoUrl: "https://upload.wikimedia.org/wikipedia/en/0/09/Gujarat_Titans_Logo.svg" },
  KKR: { primary: "#7e22ce", secondary: "#f59e0b", shadow: "rgba(126, 34, 206, 0.15)", textDark: false, logoUrl: "https://upload.wikimedia.org/wikipedia/en/4/4c/Kolkata_Knight_Riders_Logo.svg" },
  LSG: { primary: "#1e3a8a", secondary: "#dc2626", shadow: "rgba(30, 58, 138, 0.15)", textDark: false, logoUrl: "https://upload.wikimedia.org/wikipedia/en/3/34/Lucknow_Super_Giants_Logo.svg" },
  MI: { primary: "#2563eb", secondary: "#f59e0b", shadow: "rgba(37, 99, 235, 0.15)", textDark: false, logoUrl: "https://upload.wikimedia.org/wikipedia/en/c/cd/Mumbai_Indians_Logo.svg" },
  PBKS: { primary: "#dc2626", secondary: "#9ca3af", shadow: "rgba(220, 38, 38, 0.15)", textDark: false, logoUrl: "https://upload.wikimedia.org/wikipedia/en/d/d4/Punjab_Kings_Logo.svg" },
  RCB: { primary: "#dc2626", secondary: "#111111", shadow: "rgba(220, 38, 38, 0.15)", textDark: false, logoUrl: "https://upload.wikimedia.org/wikipedia/en/d/d4/Royal_Challengers_Bengaluru_Logo.svg" },
  RR: { primary: "#ec4899", secondary: "#2563eb", shadow: "rgba(236, 72, 153, 0.15)", textDark: false, logoUrl: "https://upload.wikimedia.org/wikipedia/commons/6/69/Rajasthan_Royals_Logo.png" },
  SRH: { primary: "#f97316", secondary: "#111111", shadow: "rgba(249, 115, 22, 0.15)", textDark: false, logoUrl: "https://upload.wikimedia.org/wikipedia/en/5/51/Sunrisers_Hyderabad_Logo.svg" }
};

export default function TeamsView({
  teamsList = [],
  teamsLoading,
  onViewSquad,
}) {
  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">IPL 2026 Teams</h2>
        <p className="text-xs text-gray-550 font-semibold mt-1">
          Browse teams competing in the IPL 2026 season and click to inspect their squad roster
        </p>
      </div>

      {teamsLoading && teamsList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-3xl shadow-sm gap-3">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          <span className="text-sm text-gray-550 font-bold">Loading teams list...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamsList.map((team) => {
            const theme = TEAM_THEMES[team.code] || {
              primary: "#6b7280",
              secondary: "#374151",
              shadow: "rgba(107, 114, 128, 0.15)",
              textDark: false,
            };
            return (
              <div
                key={team.code}
                className="group relative overflow-hidden bg-white border border-gray-100 hover:border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-56"
              >
                {/* Color strip on top */}
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: theme.secondary }}
                />

                {/* Header info */}
                <div className="flex items-start gap-4">
                  <TeamLogo theme={theme} code={team.code} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-950 text-base leading-snug group-hover:text-blue-650 transition-colors mt-0.5 truncate">
                      {team.name}
                    </h3>
                    <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                      IPL Franchise
                    </p>
                  </div>
                </div>

                {/* Stats info */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="bg-gray-50 border border-gray-100 rounded-xl px-3.5 py-2 flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-400">Squad Size:</span>
                    <span className="text-xs font-extrabold text-gray-800">{team.squadSize} Players</span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => onViewSquad(team)}
                  className="w-full mt-4 py-3 rounded-2xl font-extrabold text-xs hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-center"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.textDark ? "#1e293b" : "#ffffff",
                    boxShadow: `0 4px 14px ${theme.shadow}`,
                  }}
                >
                  View Squad
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
