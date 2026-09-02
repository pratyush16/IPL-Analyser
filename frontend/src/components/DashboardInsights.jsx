"use client";

import React, { useState } from "react";
import OversChart from "./OversChart";
import DismissalsPieChart from "./DismissalsPieChart";

export default function DashboardInsights({ 
  playerName,
  phaseStats = {}, 
  bowlerStats = {}, 
  oversStats = [],
  playerStats = {},
  recentMatches = [],
  selectedSeason = ""
}) {
  const [activeTab, setActiveTab] = useState("strengths"); // "strengths" | "weaknesses"

  const isStrengths = activeTab === "strengths";
  const themeBg = isStrengths ? "bg-emerald-50" : "bg-red-50";
  const themeText = isStrengths ? "text-emerald-700" : "text-red-700";
  const themeBorder = isStrengths ? "border-emerald-100" : "border-red-100";

  // Destructure bowler stats
  const { style_stats = {}, favorite_matchup, nemesis_matchup } = bowlerStats;

  // Process bowler styles for Strengths / Weaknesses
  const stylesList = Object.entries(style_stats).map(([name, data]) => ({
    name,
    ...data
  }));

  // Filter styles with enough samples (at least 5 balls faced)
  let filteredStyles = stylesList.filter(s => s.balls >= 5);
  if (filteredStyles.length === 0) {
    filteredStyles = stylesList;
  }

  // Sort for weaknesses: Lowest Average (ascending)
  const vulnerableStyles = [...filteredStyles]
    .sort((a, b) => {
      const aAvg = a.average || (a.dismissals === 0 ? 999 : 0);
      const bAvg = b.average || (b.dismissals === 0 ? 999 : 0);
      if (aAvg !== bAvg) return aAvg - bAvg;
      return a.strike_rate - b.strike_rate;
    })
    .slice(0, 3);

  // Extract names of vulnerable styles to filter out of strengths
  const vulnerableStyleNames = vulnerableStyles.map(s => s.name);

  // Sort for strengths: Highest Strike Rate (descending), excluding any vulnerable styles
  const dominantStyles = [...filteredStyles]
    .filter(s => !vulnerableStyleNames.includes(s.name))
    .sort((a, b) => b.strike_rate - a.strike_rate)
    .slice(0, 3);

  // Process Phase stats to find best/worst phase
  const phaseList = Object.entries(phaseStats).map(([name, data]) => ({
    name,
    ...data
  }));

  let highlightPhase = "";
  let highlightPhaseData = null;
  if (phaseList.length > 0) {
    if (isStrengths) {
      // Best phase = highest strike rate
      const best = [...phaseList].sort((a, b) => b.strike_rate - a.strike_rate)[0];
      highlightPhase = best ? best.name : "";
      highlightPhaseData = best;
    } else {
      // Vulnerable phase = highest dismissals or lowest strike rate
      const worst = [...phaseList].sort((a, b) => b.dismissals - a.dismissals || a.strike_rate - b.strike_rate)[0];
      highlightPhase = worst ? worst.name : "";
      highlightPhaseData = worst;
    }
  }

  return (
    <div className="space-y-6">
      {/* Dynamic Toggle Buttons (Side-by-Side inline on Dashboard) */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Strengths Toggle Button */}
        <button
          onClick={() => setActiveTab("strengths")}
          className={`flex items-center font-bold px-6 py-3.5 rounded-2xl text-sm border shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
            isStrengths
              ? "bg-emerald-50 text-emerald-700 border-emerald-250/90 shadow-emerald-50/50"
              : "bg-white text-gray-400 border-gray-150 hover:text-gray-600 hover:bg-gray-50/50"
          }`}
        >
          Strengths
        </button>

        {/* Weaknesses Toggle Button */}
        <button
          onClick={() => setActiveTab("weaknesses")}
          className={`flex items-center font-bold px-6 py-3.5 rounded-2xl text-sm border shadow-sm transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/20 ${
            !isStrengths
              ? "bg-red-50 text-red-700 border-red-250/90 shadow-red-50/50"
              : "bg-white text-gray-400 border-gray-150 hover:text-gray-600 hover:bg-gray-50/50"
          }`}
        >
          Weaknesses
        </button>
      </div>

      {/* Main Inline Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left Column: Line Graph (Overs Chart) & Dismissals Pie Chart */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <OversChart data={oversStats} type={activeTab} />
          <DismissalsPieChart breakdown={playerStats?.dismissals_breakdown || {}} recentMatches={recentMatches} selectedSeason={selectedSeason} />
        </div>

        {/* Right Column: Performance Stats & Specific Matchups */}
        <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
          
          {/* Phase Summary card */}
          {highlightPhaseData && (
            <div className={`p-6 border rounded-2xl shadow-sm space-y-4 flex flex-col justify-between flex-1 ${themeBorder} ${themeBg}/20`}>
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg border uppercase tracking-wider ${
                  isStrengths 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                    : "bg-red-50 text-red-700 border-red-100"
                }`}>
                  {isStrengths ? "Dominant Phase" : "Vulnerable Phase"}
                </span>
              </div>
              
              <div>
                <h4 className="font-extrabold text-lg text-gray-900 leading-tight">
                  {highlightPhase}
                </h4>
                <p className="text-sm text-gray-500 font-medium mt-1">
                  {isStrengths ? (
                    <span>
                      Sustains highest strike rate of <strong className="text-emerald-600">{highlightPhaseData.strike_rate}</strong> scoring {highlightPhaseData.runs} runs.
                    </span>
                  ) : (
                    <span>
                      Vulnerable phase with <strong className="text-red-600">{highlightPhaseData.dismissals} dismissals</strong> and a strike rate of {highlightPhaseData.strike_rate}.
                    </span>
                  )}
                </p>
              </div>

              {/* Grid values */}
              <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-gray-100/50">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Runs</p>
                  <p className="text-sm font-black text-gray-800">{highlightPhaseData.runs}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Average</p>
                  <p className="text-sm font-black text-gray-800">{highlightPhaseData.average}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Outs</p>
                  <p className="text-sm font-black text-gray-800">{highlightPhaseData.dismissals}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bowler Matchup card */}
          {isStrengths && favorite_matchup && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg">
                  Favorite Matchup
                </span>
              </div>
              
              <div>
                <h4 className="font-extrabold text-lg text-gray-900 leading-tight">
                  vs {favorite_matchup.bowler}
                </h4>
                <p className="text-sm text-gray-500 font-medium mt-1 leading-relaxed">
                  Smashed for <strong className="text-emerald-700 font-bold">{favorite_matchup.runs} runs</strong> off just <strong>{favorite_matchup.balls} balls</strong>.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-xs font-bold text-gray-400">STRIKE RATE</span>
                <span className="text-base font-black text-emerald-600">{favorite_matchup.strike_rate}</span>
              </div>
            </div>
          )}

          {!isStrengths && nemesis_matchup && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 flex-1 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-red-800 uppercase tracking-wider bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-lg">
                  Nemesis Matchup
                </span>
              </div>
              
              <div>
                <h4 className="font-extrabold text-lg text-gray-900 leading-tight">
                  vs {nemesis_matchup.bowler}
                </h4>
                <p className="text-sm text-gray-500 font-medium mt-1 leading-relaxed">
                  Dismissed <strong className="text-red-700 font-bold">{nemesis_matchup.dismissals} times</strong> conceding {nemesis_matchup.runs_conceded} runs.
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-xs font-bold text-gray-400">DISMISSAL FREQ</span>
                <span className="text-base font-black text-red-600">{nemesis_matchup.dismissals} outs</span>
              </div>
            </div>
          )}

          {/* Bowler Styles Dominance / Vulnerability card */}
          {isStrengths && dominantStyles.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg">
                    Dominant vs Bowler Types
                  </span>
                </div>
                <h4 className="font-extrabold text-[10px] text-gray-400 mt-2 uppercase tracking-wider">Top 3 Styles</h4>
              </div>

              <div className="space-y-3">
                {dominantStyles.map((style) => (
                  <div key={style.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-750">
                      <span>{style.name}</span>
                      <span className="text-emerald-600 font-extrabold">{style.strike_rate} SR</span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${Math.min(style.strike_rate / 2, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-400 font-semibold">
                      <span>Runs: {style.runs} ({style.balls}b)</span>
                      <span>Outs: {style.dismissals}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isStrengths && vulnerableStyles.length > 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-red-800 uppercase tracking-wider bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-lg">
                    Vulnerable vs Bowler Types
                  </span>
                </div>
                <h4 className="font-extrabold text-[10px] text-gray-400 mt-2 uppercase tracking-wider">Top 3 Vulnerabilities</h4>
              </div>

              <div className="space-y-3">
                {vulnerableStyles.map((style) => (
                  <div key={style.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-gray-750">
                      <span>{style.name}</span>
                      <span className="text-red-600 font-extrabold">
                        {style.average > 900 ? "N/A" : `${style.average} Avg`}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-red-500 transition-all duration-500"
                        style={{ width: `${style.average > 900 ? 100 : Math.min(style.average * 2.5, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-400 font-semibold">
                      <span>Runs: {style.runs} ({style.balls}b)</span>
                      <span>Outs: {style.dismissals}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
