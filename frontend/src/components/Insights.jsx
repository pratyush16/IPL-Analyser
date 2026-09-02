"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function Insights({ insights }) {
  const [activeTab, setActiveTab] = useState("strengths"); // "strengths" or "weaknesses"

  const { strengths = [], weaknesses = [] } = insights || {};
  const currentList = activeTab === "strengths" ? strengths : weaknesses;
  const isStrengths = activeTab === "strengths";

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex items-center gap-3">
        {/* Strengths Tab */}
        <button
          onClick={() => setActiveTab("strengths")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all border duration-200 cursor-pointer ${
            isStrengths
              ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-sm shadow-emerald-50"
              : "bg-white text-gray-400 border-gray-150 hover:text-gray-600 hover:bg-gray-50/50"
          }`}
        >
          Strengths
        </button>

        {/* Weaknesses Tab */}
        <button
          onClick={() => setActiveTab("weaknesses")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all border duration-200 cursor-pointer ${
            !isStrengths
              ? "bg-red-50 text-red-700 border-red-200/80 shadow-sm shadow-red-50"
              : "bg-white text-gray-400 border-gray-150 hover:text-gray-600 hover:bg-gray-50/50"
          }`}
        >
          Weaknesses
        </button>
      </div>

      {/* Insights Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {currentList.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-100 rounded-2xl p-8 text-center text-gray-400 font-medium">
            No insights calculated for this player yet.
          </div>
        ) : (
          currentList.map((insight, idx) => (
            <div
              key={idx}
              className={`bg-white border rounded-2xl p-6 shadow-sm flex items-start gap-4 hover:shadow-md transition-all duration-300 ${
                isStrengths 
                  ? "border-emerald-100/30 hover:border-emerald-100" 
                  : "border-red-100/30 hover:border-red-100"
              }`}
            >
              {/* Dynamic Icon */}
              <div className={`mt-0.5 p-2 rounded-xl flex-shrink-0 ${
                isStrengths ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              }`}>
                {isStrengths ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>

              {/* Insight Description */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="font-bold text-gray-900 text-base">
                    {insight.title}
                  </h4>
                  {/* Metric Value Badge */}
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
                    isStrengths 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                      : "bg-red-50 text-red-700 border-red-100"
                  }`}>
                    {insight.value}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {insight.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
