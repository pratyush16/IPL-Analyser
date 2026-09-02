"use client";

import React from "react";

export default function StatsGrid({ stats }) {
  if (!stats) return null;

  const cards = [
    {
      title: "Batting Average",
      value: stats.avg !== undefined ? stats.avg : "0.0",
      valueColor: "text-gray-950",
    },
    {
      title: "Strike Rate",
      value: stats.sr !== undefined ? stats.sr : "0.0",
      valueColor: "text-gray-950",
    },
    {
      title: "Total Runs",
      value: stats.runs !== undefined ? stats.runs.toLocaleString() : "0",
      valueColor: "text-gray-950",
    },
    {
      title: "Centuries",
      value: stats.centuries !== undefined ? stats.centuries : "0",
      valueColor: "text-gray-950",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        return (
          <div 
            key={idx} 
            className="bg-white border border-gray-100/80 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          >
            {/* Card Content */}
            <div>
              <p className="text-sm font-medium text-gray-500">
                {card.title}
              </p>
              <h3 className={`text-2xl font-bold ${card.valueColor} tracking-tight mt-1`}>
                {card.value}
              </h3>
            </div>
          </div>
        );
      })}
    </div>
  );
}
