"use client";

import React, { useState } from "react";

export default function OversChart({ data = [], type }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400 bg-gray-50/50 rounded-2xl border border-gray-100">
        No over data available.
      </div>
    );
  }

  const isStrengths = type === "strengths";
  const activeColor = isStrengths ? "#10b981" : "#ef4444"; // Tailwind emerald-500 or red-500
  const activeColorLight = isStrengths ? "#dcfce7" : "#fee2e2";
  const activeColorBg = isStrengths ? "rgba(16, 185, 129, 0.08)" : "rgba(239, 68, 68, 0.08)";

  // Dimensions of SVG
  const width = 600;
  const height = 280;
  
  // Padding for chart axes
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 35;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find max strike rate to scale Y axis (minimum 180 for good visual range)
  const maxSR = Math.max(...data.map(d => d.strike_rate), 180);
  
  // Mapping functions
  const getX = (index) => paddingLeft + (index / 19) * chartWidth;
  const getY = (sr) => height - paddingBottom - (sr / maxSR) * chartHeight;

  // Build the SVG path string
  let linePath = "";
  let areaPath = "";

  data.forEach((d, idx) => {
    const x = getX(idx);
    const y = getY(d.strike_rate);
    
    if (idx === 0) {
      linePath = `M ${x} ${y}`;
      areaPath = `M ${x} ${height - paddingBottom} L ${x} ${y}`;
    } else {
      linePath += ` L ${x} ${y}`;
      areaPath += ` L ${x} ${y}`;
    }

    if (idx === data.length - 1) {
      areaPath += ` L ${x} ${height - paddingBottom} Z`;
    }
  });

  // Find highest and lowest index to highlight
  let highlightIdx = 0;
  if (isStrengths) {
    // Peak strike rate (excluding 0)
    let maxVal = -1;
    data.forEach((d, idx) => {
      if (d.strike_rate > maxVal) {
        maxVal = d.strike_rate;
        highlightIdx = idx;
      }
    });
  } else {
    // Trough strike rate (only overs where they faced balls, i.e., balls > 10)
    let minVal = 9999;
    data.forEach((d, idx) => {
      if (d.balls > 10 && d.strike_rate < minVal && d.strike_rate > 0) {
        minVal = d.strike_rate;
        highlightIdx = idx;
      }
    });
  }

  // Draw some Y-Axis Gridlines (e.g. 50, 100, 150, 200)
  const gridTicks = [50, 100, 150, 200];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
          Strike Rate Deviation (Overs 1-20)
        </h3>
        <span className="text-xs font-bold text-gray-400">
          X: Over | Y: Strike Rate
        </span>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto min-w-[500px]"
        >
          <defs>
            {/* Shaded Area Gradient */}
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={activeColor} stopOpacity={0.2} />
              <stop offset="100%" stopColor={activeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>

          {/* Gridlines & Y-Axis Labels */}
          {gridTicks.map((tick) => {
            if (tick > maxSR) return null;
            const y = getY(tick);
            return (
              <g key={tick} className="opacity-40">
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={width - paddingRight} 
                  y2={y} 
                  stroke="#e2e8f0" 
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <text 
                  x={paddingLeft - 10} 
                  y={y + 4} 
                  textAnchor="end" 
                  className="text-[10px] fill-gray-400 font-bold"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* X-Axis labels (Every 2 overs for spacing) */}
          {data.map((d, idx) => {
            if (idx % 2 !== 0 && idx !== 19) return null; // skip alternate for labels space
            const x = getX(idx);
            return (
              <text
                key={idx}
                x={x}
                y={height - paddingBottom + 18}
                textAnchor="middle"
                className="text-[10px] fill-gray-400 font-bold"
              >
                Ov {d.over}
              </text>
            );
          })}

          {/* Base Axis lines */}
          <line 
            x1={paddingLeft} 
            y1={height - paddingBottom} 
            x2={width - paddingRight} 
            y2={height - paddingBottom} 
            stroke="#e2e8f0" 
            strokeWidth="1.5" 
          />
          <line 
            x1={paddingLeft} 
            y1={paddingTop} 
            x2={paddingLeft} 
            y2={height - paddingBottom} 
            stroke="#e2e8f0" 
            strokeWidth="1.5" 
          />

          {/* Shaded Area Under Line */}
          {data.length > 0 && (
            <path d={areaPath} fill="url(#areaGrad)" />
          )}

          {/* Main Chart Line */}
          {data.length > 0 && (
            <path 
              d={linePath} 
              fill="none" 
              stroke={activeColor} 
              strokeWidth="3.5" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive Invisible Hover Areas for Tooltips */}
          {data.map((d, idx) => {
            const x = getX(idx);
            const y = getY(d.strike_rate);

            return (
              <g key={idx}>
                {/* Visual data dots on hover or if highlighted */}
                {(hoveredPoint === idx || idx === highlightIdx) && (
                  <>
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="7.5" 
                      fill={activeColorLight} 
                      opacity="0.8"
                    />
                    <circle 
                      cx={x} 
                      cy={y} 
                      r="4" 
                      fill={activeColor} 
                    />
                  </>
                )}

                {/* Invisible hover trigger column */}
                <rect
                  x={x - (chartWidth / 38)}
                  y={paddingTop}
                  width={chartWidth / 19}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(idx)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip Description Panel */}
      <div className="mt-4 p-4 rounded-xl border border-gray-50 flex items-center justify-between min-h-[64px]" style={{ backgroundColor: activeColorBg }}>
        {hoveredPoint !== null ? (
          <>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Over {data[hoveredPoint].over} Detail
              </p>
              <h4 className="text-lg font-black text-gray-900 mt-0.5">
                {data[hoveredPoint].strike_rate} <span className="text-xs font-bold text-gray-400">SR</span>
              </h4>
            </div>
            <div className="text-right text-xs font-semibold text-gray-500">
              <p>Runs: <strong className="text-gray-900">{data[hoveredPoint].runs}</strong></p>
              <p>Balls: <strong className="text-gray-900">{data[hoveredPoint].balls}</strong></p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {isStrengths ? "Highlighted Peak" : "Highlighted Trough"} (Over {data[highlightIdx].over})
              </p>
              <h4 className="text-lg font-black text-gray-900 mt-0.5">
                {data[highlightIdx].strike_rate} <span className="text-xs font-bold text-gray-400">SR</span>
              </h4>
            </div>
            <div className="text-right text-xs font-semibold text-gray-500">
              <p>Runs: <strong className="text-gray-900">{data[highlightIdx].runs}</strong></p>
              <p>Balls: <strong className="text-gray-900">{data[highlightIdx].balls}</strong></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
