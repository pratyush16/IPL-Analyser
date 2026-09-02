"use client";

import React, { useState } from "react";
import { X, Award, ShieldAlert, Zap, Target, TrendingUp, Users } from "lucide-react";

export default function AnalyticsModal({ 
  isOpen, 
  onClose, 
  type, // "strengths" | "weaknesses"
  playerName, 
  phaseStats = {}, 
  bowlerStats = {} 
}) {
  const [activeSubTab, setActiveSubTab] = useState("phase"); // "phase" | "bowlers"

  if (!isOpen) return null;

  const isStrengths = type === "strengths";
  
  // Explicit classes to avoid Tailwind string interpolation compilation bugs
  const themeBg = isStrengths ? "bg-emerald-50" : "bg-red-50";
  const themeText = isStrengths ? "text-emerald-750" : "text-red-750";
  const themeBorder = isStrengths ? "border-emerald-100" : "border-red-100";
  
  const tabActiveClass = isStrengths 
    ? "border-emerald-600 text-emerald-600" 
    : "border-red-600 text-red-600";
    
  const buttonBgClass = isStrengths
    ? "bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500/20"
    : "bg-red-600 hover:bg-red-700 focus:ring-red-500/20";
  
  // Destructure bowler stats
  const { style_stats = {}, favorite_matchup, nemesis_matchup } = bowlerStats;

  // Process Phase stats to identify strength/weakness phase
  const phaseList = Object.entries(phaseStats).map(([name, data]) => ({
    name,
    ...data
  }));

  let highlightPhase = "";
  if (phaseList.length > 0) {
    if (isStrengths) {
      // Best phase = highest strike rate
      const best = [...phaseList].sort((a, b) => b.strike_rate - a.strike_rate)[0];
      highlightPhase = best ? best.name : "";
    } else {
      // Vulnerable phase = highest dismissals (or lowest strike rate)
      const worst = [...phaseList].sort((a, b) => b.dismissals - a.dismissals || a.strike_rate - b.strike_rate)[0];
      highlightPhase = worst ? worst.name : "";
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark backdrop blur */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300"
      />

      {/* Modal Box */}
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-3xl overflow-hidden relative z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className={`p-6 flex items-center justify-between border-b border-gray-50 flex-shrink-0 ${themeBg}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isStrengths ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
              {isStrengths ? <Award className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
            </div>
            <div>
              <h2 className={`text-xl font-extrabold tracking-tight ${isStrengths ? "text-emerald-950" : "text-red-950"}`}>
                {playerName}'s {isStrengths ? "Strengths" : "Weaknesses"} Analysis
              </h2>
              <p className="text-xs text-gray-500 font-semibold mt-0.5 tracking-wide">
                ADVANCED ANALYTICS INTERFACE
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-white border border-gray-150 hover:bg-gray-50 text-gray-400 hover:text-gray-700 transition-colors shadow-sm cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Sub-Tabs Navigation */}
        <div className="px-8 pt-4 border-b border-gray-50 flex items-center gap-6 flex-shrink-0">
          <button
            onClick={() => setActiveSubTab("phase")}
            className={`pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${
              activeSubTab === "phase"
                ? tabActiveClass
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Phase of Match
          </button>
          <button
            onClick={() => setActiveSubTab("bowlers")}
            className={`pb-3 text-sm font-bold border-b-2 cursor-pointer transition-all ${
              activeSubTab === "bowlers"
                ? tabActiveClass
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            Opponent Bowlers
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-8 overflow-y-auto flex-1 space-y-8">
          
          {/* TAB 1: PHASE OF MATCH VIEW */}
          {activeSubTab === "phase" && (
            <div className="space-y-8">
              {/* Context Summary Box */}
              <div className={`p-5 rounded-2xl border ${themeBorder} ${themeBg}/30 text-sm leading-relaxed text-gray-600 font-medium`}>
                {isStrengths ? (
                  <span>
                    Analysis indicates the batter is most dangerous in the <strong>{highlightPhase}</strong> phase, where they sustain maximum acceleration and strike rates, making bowler matchups crucial.
                  </span>
                ) : (
                  <span>
                    Warning metrics indicate vulnerability in the <strong>{highlightPhase}</strong> phase, exhibiting drops in strike rate and higher frequency of dismissals against targeted bowling.
                  </span>
                )}
              </div>

              {/* Chart Grid */}
              <div className="space-y-6">
                {phaseList.map((phase) => {
                  const isHighlighted = phase.name === highlightPhase;
                  // Max strike rate in IPL is around 250 for scaling, let's normalize fill to max 220
                  const percent = Math.min((phase.strike_rate / 220) * 100, 100);
                  
                  return (
                    <div key={phase.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800 text-sm">
                            {phase.name}
                          </span>
                          {isHighlighted && (
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              isStrengths 
                                ? "bg-emerald-100 text-emerald-800" 
                                : "bg-red-100 text-red-800"
                            }`}>
                              {isStrengths ? "Best Phase" : "Vulnerable Phase"}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-extrabold text-gray-900">
                          {phase.strike_rate} SR
                        </span>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="w-full bg-gray-100 h-6 rounded-full overflow-hidden flex shadow-inner">
                        <div 
                          style={{ width: `${percent}%` }}
                          className={`h-full rounded-full transition-all duration-1000 ease-out flex items-center justify-end px-3 ${
                            isHighlighted 
                              ? isStrengths ? "bg-emerald-500 shadow-md shadow-emerald-200" : "bg-red-500 shadow-md shadow-red-200"
                              : "bg-gray-400/80"
                          }`}
                        >
                          <span className="text-[10px] text-white font-extrabold">
                            {phase.runs} runs
                          </span>
                        </div>
                      </div>

                      {/* Phase Micro Metrics */}
                      <div className="flex items-center gap-6 text-xs font-semibold text-gray-400 pl-1">
                        <span>Average: <strong className="text-gray-600">{phase.average}</strong></span>
                        <span>Balls Faced: <strong className="text-gray-600">{phase.balls}</strong></span>
                        <span>Dismissals: <strong className="text-gray-600">{phase.dismissals}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: OPPONENT BOWLERS VIEW */}
          {activeSubTab === "bowlers" && (
            <div className="space-y-8">
              
              {/* Bowler Type Grid */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Performance by Bowler Style
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(style_stats).map(([style, data]) => (
                    <div 
                      key={style} 
                      className={`p-4 border rounded-2xl shadow-sm flex items-center justify-between transition-colors ${
                        style.includes("Spinner") 
                          ? "bg-purple-50/20 border-purple-100/50" 
                          : "bg-blue-50/20 border-blue-100/50"
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                          {style}
                        </p>
                        <h4 className="text-xl font-black text-gray-900 mt-1">
                          {data.strike_rate} <span className="text-xs font-bold text-gray-500">SR</span>
                        </h4>
                        <p className="text-xs font-semibold text-gray-400 mt-0.5">
                          Runs: <strong className="text-gray-600">{data.runs}</strong> | Avg: <strong className="text-gray-600">{data.average}</strong>
                        </p>
                      </div>
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                        style.includes("Spinner") ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                      }`}>
                        {style.includes("Spinner") ? <Zap className="h-4.5 w-4.5" /> : <Target className="h-4.5 w-4.5" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Head-to-Head Bowler Matchup Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Player Matchups
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Strength: Dominated Bowler */}
                  {favorite_matchup && (
                    <div className="bg-emerald-50/30 border border-emerald-100/80 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg">
                          Favorite Target
                        </span>
                        <TrendingUp className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-lg text-emerald-950">
                          {favorite_matchup.bowler}
                        </h4>
                        <p className="text-sm text-gray-600 font-medium mt-1">
                          Smashed for <strong className="text-emerald-700 font-bold">{favorite_matchup.runs} runs</strong> off just <strong>{favorite_matchup.balls} balls</strong>.
                        </p>
                        <p className="text-xs text-gray-400 font-bold mt-2">
                          STRIKE RATE: {favorite_matchup.strike_rate}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Weakness: Nemesis Bowler */}
                  {nemesis_matchup && (
                    <div className="bg-red-50/30 border border-red-100/80 rounded-2xl p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-red-800 uppercase tracking-wider bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-lg">
                          Nemesis Bowler
                        </span>
                        <Users className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-lg text-red-950">
                          {nemesis_matchup.bowler}
                        </h4>
                        <p className="text-sm text-gray-600 font-medium mt-1">
                          Got out <strong className="text-red-750 font-bold">{nemesis_matchup.dismissals} times</strong> while scoring <strong>{nemesis_matchup.runs_conceded} runs</strong> off <strong>{nemesis_matchup.balls_faced} balls</strong>.
                        </p>
                        <p className="text-xs text-gray-400 font-bold mt-2">
                          AVG RUNS PER OUT: {round(nemesis_matchup.runs_conceded / nemesis_matchup.dismissals, 1)}
                        </p>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide text-white transition-all shadow-md cursor-pointer ${buttonBgClass}`}
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}

// Inline helper for rounding to ensure code works independently
function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}
