"use client";

import React from "react";

export default function RecentMatches({ matches = [] }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="px-8 py-5 border-b border-gray-50">
        <h2 className="text-lg font-bold text-gray-900 tracking-tight">
          Recent Match Performance
        </h2>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/40 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="py-4.5 px-8">Match</th>
              <th className="py-4.5 px-6">Opponent</th>
              <th className="py-4.5 px-6 text-right sm:text-left">Runs</th>
              <th className="py-4.5 px-6 text-right">Strike Rate</th>
              <th className="py-4.5 px-6 text-center">Wickets</th>
              <th className="py-4.5 px-6 text-center">Economy</th>
              <th className="py-4.5 px-8 text-center">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
            {matches.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-400 font-medium">
                  No recent match records found for this player.
                </td>
              </tr>
            ) : (
              matches.map((match, idx) => (
                <tr 
                  key={idx} 
                  className="hover:bg-gray-50/50 transition-colors duration-200"
                >
                  {/* Match Name */}
                  <td className="py-4.5 px-8 font-medium text-gray-900">
                    {match.match}
                  </td>
                  {/* Opponent */}
                  <td className="py-4.5 px-6 text-gray-500 font-medium">
                    {match.opponent}
                  </td>
                  {/* Runs scored */}
                  <td className="py-4.5 px-6 text-right sm:text-left font-bold text-gray-900">
                    {match.runs}
                  </td>
                  {/* Strike Rate */}
                  <td className="py-4.5 px-6 text-right font-medium text-gray-600">
                    {match.strike_rate}
                  </td>
                  {/* Wickets taken */}
                  <td className="py-4.5 px-6 text-center font-medium text-gray-600">
                    {match.wickets}
                  </td>
                  {/* Economy */}
                  <td className="py-4.5 px-6 text-center font-medium text-gray-600">
                    {match.economy}
                  </td>
                  {/* Result Badge */}
                  <td className="py-4.5 px-8 text-center">
                    <span 
                      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide border min-w-[70px] ${
                        match.result === "Won"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                          : match.result === "Lost"
                          ? "bg-red-50 text-red-700 border-red-100"
                          : "bg-gray-50 text-gray-600 border-gray-100"
                      }`}
                    >
                      {match.result}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
