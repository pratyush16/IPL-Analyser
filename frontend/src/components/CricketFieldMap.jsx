"use client";

import React, { useState, useMemo } from "react";
import { Filter, AlertCircle } from "lucide-react";

// Angle (0 to 360 where 0 is North/Straight down ground) and Radius (0 to 1) offsets for each fielding region
const POSITION_MAP = {
  "Long-Off": { angle: 25, radius: 0.82 },
  "Long-On": { angle: 335, radius: 0.82 },
  "Mid-Off": { angle: 35, radius: 0.52 },
  "Mid-On": { angle: 325, radius: 0.52 },
  "Extra Cover": { angle: 55, radius: 0.72 },
  "Extra-Cover": { angle: 55, radius: 0.72 },
  "Deep Extra Cover": { angle: 55, radius: 0.85 },
  "Deep Extra Covers": { angle: 55, radius: 0.85 },
  "Covers": { angle: 75, radius: 0.65 },
  "Cover": { angle: 75, radius: 0.65 },
  "Deep Cover": { angle: 75, radius: 0.85 },
  "Deep Covers": { angle: 75, radius: 0.85 },
  "Short Cover": { angle: 75, radius: 0.40 },
  "Backward Point": { angle: 100, radius: 0.62 },
  "Point": { angle: 100, radius: 0.62 },
  "Deep Point": { angle: 100, radius: 0.85 },
  "Gully": { angle: 120, radius: 0.42 },
  "Third Man": { angle: 145, radius: 0.78 },
  "Third-Man": { angle: 145, radius: 0.78 },
  "Short Third": { angle: 145, radius: 0.78 },
  "Keeper": { angle: 180, radius: 0.25 },
  "Wicket-Keeper": { angle: 180, radius: 0.25 },
  "Wicketkeeper": { angle: 180, radius: 0.25 },
  "caught-behind": { angle: 180, radius: 0.25 },
  "caught_behind": { angle: 180, radius: 0.25 },
  "caught behind": { angle: 180, radius: 0.25 },
  "Fine Leg": { angle: 215, radius: 0.78 },
  "Short Fine Leg": { angle: 215, radius: 0.48 },
  "Deep Fine Leg": { angle: 215, radius: 0.85 },
  "Long Leg": { angle: 225, radius: 0.85 },
  "Deep Backward Square": { angle: 235, radius: 0.85 },
  "Deep Backward Square Leg": { angle: 235, radius: 0.85 },
  "Short Leg": { angle: 245, radius: 0.35 },
  "Forward Short Leg": { angle: 245, radius: 0.35 },
  "Leg Slip": { angle: 200, radius: 0.35 },
  "Slip": { angle: 165, radius: 0.35 },
  "Square Leg": { angle: 260, radius: 0.65 },
  "Deep Square Leg": { angle: 260, radius: 0.85 },
  "Deep Square": { angle: 260, radius: 0.85 },
  "Mid-Wicket": { angle: 290, radius: 0.60 },
  "Midwicket": { angle: 290, radius: 0.60 },
  "Deep Mid-Wicket": { angle: 290, radius: 0.85 },
  "Deep Midwicket": { angle: 290, radius: 0.85 },
  "Cow Corner": { angle: 310, radius: 0.78 },
  "Off Side": { angle: 75, radius: 0.55 },
  "Leg Side": { angle: 270, radius: 0.55 },
  "Straight": { angle: 0, radius: 0.65 }
};

// Colors associated with each shot result category
const CATEGORY_COLORS = {
  "OUT": { dot: "#ef4444", border: "#fca5a5", bg: "bg-red-500", text: "text-red-700" }, // Red
  "6": { dot: "#8b5cf6", border: "#c4b5fd", bg: "bg-violet-600", text: "text-violet-700" }, // Violet
  "4": { dot: "#3b82f6", border: "#93c5fd", bg: "bg-blue-600", text: "text-blue-700" },   // Blue
  "3": { dot: "#d97706", border: "#fcd34d", bg: "bg-amber-600", text: "text-amber-700" }, // Amber
  "2": { dot: "#f59e0b", border: "#fde68a", bg: "bg-amber-500", text: "text-amber-600" }, // Amber
  "1": { dot: "#14b8a6", border: "#99f6e4", bg: "bg-teal-500", text: "text-teal-600" },   // Teal
};

export default function CricketFieldMap({ data = [], selectedSeason = "" , playerName = "" }) {
  const [filterType, setFilterType] = useState("all"); // "all" | "out" | "6" | "4" | "3" | "2" | "1"

  const is2026 = selectedSeason === "2026";

  // Classify player batting hand dynamically
  const isLeftHanded = useMemo(() => {
    if (!playerName) return false;
    const cleanName = playerName.replace(/\./g, "").toLowerCase().trim();
    
    const lhList = [
      "yashasvi jaiswal", "y jaiswal", "travis head", "t head",
      "nicholas pooran", "n pooran", "rishabh pant", "r pant",
      "abhishek sharma", "a sharma", "rinku singh", "r singh",
      "sai sudharsan", "b sai sudharsan", "devdutt padikkal", "d padikkal",
      "quinton de kock", "q de kock", "ishan kishan", "i kishan",
      "shivam dube", "s dube", "ravindra jadeja", "r jadeja",
      "axar patel", "a patel", "sunil narine", "s narine",
      "david miller", "d miller", "shimron hetmyer", "s hetmyer",
      "vaibhav sooryavanshi", "v sooryavanshi", "vaibhav suryavanshi",
      "venkatesh iyer", "v iyer", "nitish rana", "n rana",
      "krunal pandya", "k pandya", "rahul tewatia", "r tewatia",
      "tilak varma", "t varma", "nehal wadhera", "n wadhera",
      "shikhar dhawan", "s dhawan", "sam curran", "s curran",
      "noor ahmad", "n ahmad", "khaleel ahmed", "k ahmed",
      "mitchell starc", "m starc", "trent boult", "t boult"
    ];
    return lhList.includes(cleanName) || lhList.some(name => cleanName.includes(name));
  }, [playerName]);

  // Swapped field label positions for LHB vs RHB (RHB has offside on Left, LHB has offside on Right)
  const labels = useMemo(() => {
    const shouldMirror = !isLeftHanded; // Mirror for Right Hand Batter (to put offside on left)
    return {
      longOff: shouldMirror ? { x: 24, text: "Long-Off" } : { x: 76, text: "Long-Off" },
      longOn: shouldMirror ? { x: 76, text: "Long-On" } : { x: 24, text: "Long-On" },
      covers: shouldMirror ? { x: 17, text: "Covers" } : { x: 83, text: "Covers" },
      midWicket: shouldMirror ? { x: 83, text: "Mid-Wicket" } : { x: 17, text: "Mid-Wicket" },
      point: shouldMirror ? { x: 11, text: "Point" } : { x: 89, text: "Point" },
      squareLeg: shouldMirror ? { x: 89, text: "Square Leg" } : { x: 11, text: "Square Leg" },
      thirdMan: shouldMirror ? { x: 24, text: "Third Man" } : { x: 76, text: "Third Man" },
      fineLeg: shouldMirror ? { x: 76, text: "Fine Leg" } : { x: 24, text: "Fine Leg" }
    };
  }, [isLeftHanded]);

  // Filter and compute positions with deterministic jitter to prevent dot overlap
  const plottedPoints = useMemo(() => {
    if (!is2026 || !data.length) return [];

    const shouldMirror = !isLeftHanded; // Mirror for Right Hand Batter (to put offside on left)

    return data
      .map((item, index) => {
        const direction = item.shot_direction;
        const runs = String(item.runs);
        
        // Find polar coordinates
        const mapping = POSITION_MAP[direction];
        if (!mapping) return null;

        // Apply a stable/deterministic jitter based on index
        const hashAngle = Math.sin(index * 12.9898 + 0.1) * 43758.5453;
        const hashRadius = Math.cos(index * 78.233 + 0.2) * 43758.5453;
        
        const angleJitter = (hashAngle - Math.floor(hashAngle)) * 14 - 7;    // -7 to +7 degrees
        const radiusJitter = (hashRadius - Math.floor(hashRadius)) * 0.08 - 0.04; // -0.04 to +0.04 radius

        const finalAngle = mapping.angle + angleJitter;
        const finalRadius = mapping.radius + radiusJitter;

        // Convert polar coordinates to Cartesian percentages (x, y) relative to SVG viewBox (100x100)
        // WK Top, straight boundary bottom
        const rad = (finalAngle * Math.PI) / 180;
        const rawX = 50 + finalRadius * 40 * Math.sin(rad);
        const rawY = 50 + finalRadius * 40 * Math.cos(rad);

        // Boundary edge coordinates (r = 45 SVG units from center)
        const rawBoundaryX = 50 + 45 * Math.sin(rad);
        const rawBoundaryY = 50 + 45 * Math.cos(rad);

        // Mirror horizontally if shouldMirror is true
        const x = shouldMirror ? (100 - rawX) : rawX;
        const boundaryX = shouldMirror ? (100 - rawBoundaryX) : rawBoundaryX;

        return {
          ...item,
          runs: runs, // Coerce runs to string to prevent Javascript type mismatch with strict comparison
          x: parseFloat(x.toFixed(2)),
          y: parseFloat(rawY.toFixed(2)),
          boundaryX: parseFloat(boundaryX.toFixed(2)),
          boundaryY: parseFloat(rawBoundaryY.toFixed(2)),
          colorGroup: CATEGORY_COLORS[runs] || { dot: "#94a3b8", border: "#cbd5e1" }
        };
      })
      .filter((item) => {
        if (!item) return false;
        
        // Apply category filter
        if (filterType === "all") return true;
        if (filterType === "out") return item.is_dismissal;
        return String(item.runs) === filterType;
      });
  }, [data, filterType, is2026, isLeftHanded]);

  // Aggregated counts for the selected season
  const counts = useMemo(() => {
    const sum = { out: 0, six: 0, four: 0, singles: 0 };
    if (!is2026) return sum;
    
    data.forEach(item => {
      const runs = String(item.runs);
      if (item.is_dismissal) sum.out++;
      else if (runs === "6") sum.six++;
      else if (runs === "4") sum.four++;
      else if (["1", "2", "3"].includes(runs)) sum.singles++;
    });
    return sum;
  }, [data, is2026]);

  // If the season is not 2026, return
  if (!is2026) {
    return 
  }

  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-50 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            Field Wagon Wheel
            <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md uppercase tracking-wider">
              IPL 2026
            </span>
            <span className="text-[10px] font-black bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md uppercase tracking-wider">
              {isLeftHanded ? "LHB (Left Hand Bat)" : "RHB (Right Hand Bat)"}
            </span>
          </h3>
          <p className="text-xs text-gray-450 font-semibold mt-0.5">
            Vector lines displaying scoring shot placements and catches from the crease
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-3">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
            }}
            className="bg-white border border-gray-200 hover:border-gray-300 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer shadow-sm min-w-[170px]"
          >
            <option value="all">All Placed Deliveries</option>
            <option value="out">Caught Dismissals (OUT)</option>
            <option value="6">Sixes (6 Runs)</option>
            <option value="4">Fours (4 Runs)</option>
            <option value="3">Three Runs (3 Runs)</option>
            <option value="2">Two Runs (2 Runs)</option>
            <option value="1">Single Runs (1 Run)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: SVG Map (Cols 1-7) */}
        <div className="lg:col-span-7 relative flex justify-center items-center">
          <div className="w-full max-w-[420px] aspect-square relative bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full drop-shadow-sm select-none"
            >
              {/* Ground Boundary (Outer Green Ring) */}
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="#daf3e0"
                stroke="#2fb35d"
                strokeWidth="1.2"
              />
              
              {/* 30-Yard Circle (Inner Dotted Ring) */}
              <circle
                cx="50"
                cy="50"
                r="26"
                fill="transparent"
                stroke="#2fb35d"
                strokeWidth="0.8"
                strokeDasharray="1.5 1.5"
                strokeOpacity="0.65"
              />

              {/* Pitch (Center Rectangle) */}
              <rect
                x="47.8"
                y="41"
                width="4.4"
                height="18"
                fill="#f8f1e5"
                stroke="#d6c3a8"
                strokeWidth="0.5"
                rx="0.3"
              />
              
              {/* Bowling/Batting Crease Lines */}
              <line x1="47.8" y1="43" x2="52.2" y2="43" stroke="#cbd5e1" strokeWidth="0.3" />
              <line x1="47.8" y1="57" x2="52.2" y2="57" stroke="#cbd5e1" strokeWidth="0.3" />

              {/* Central Pitch Marker */}
              <circle cx="50" cy="50" r="0.6" fill="#94a3b8" />

              {/* Horizontal crease-aligned divider line separating front & back of batsman */}
              <line 
                x1="5" 
                y1="43" 
                x2="95" 
                y2="43" 
                stroke="#e2e8f0" 
                strokeWidth="0.4" 
                strokeDasharray="2 2" 
              />

              {/* Ground Position Text Labels (WK Top, straight boundary bottom, adjusted LHB/RHB) */}
              <g className="text-[2.2px] font-black fill-gray-400 tracking-wider text-center select-none uppercase">
                {/* Top Side (Behind Batsman) */}
                <text x="50" y="26" textAnchor="middle">WK</text>
                <text x={labels.thirdMan.x} y="12" textAnchor="middle">{labels.thirdMan.text}</text>
                <text x={labels.fineLeg.x} y="12" textAnchor="middle">{labels.fineLeg.text}</text>

                {/* Middle Grid (Aligned along the crease line y=43) */}
                <text x={labels.point.x} y="44.2" textAnchor="middle">{labels.point.text}</text>
                <text x={labels.squareLeg.x} y="44.2" textAnchor="middle">{labels.squareLeg.text}</text>
                
                {/* Bottom Side (In Front of Batsman) */}
                <text x={labels.covers.x} y="68" textAnchor="middle">{labels.covers.text}</text>
                <text x={labels.midWicket.x} y="68" textAnchor="middle">{labels.midWicket.text}</text>
                <text x={labels.longOff.x} y="88" textAnchor="middle">{labels.longOff.text}</text>
                <text x={labels.longOn.x} y="88" textAnchor="middle">{labels.longOn.text}</text>
              </g>

              {/* Plotted Shot Lines originating from the Batting Crease (50, 43) */}
              {plottedPoints.map((item, idx) => {
                const isWicket = item.is_dismissal;
                
                if (isWicket) {
                  return (
                    <g key={idx}>
                      {/* Dotted line to catch location from batting crease */}
                      <line
                        x1="50"
                        y1="43"
                        x2={item.x}
                        y2={item.y}
                        stroke="#ef4444"
                        strokeWidth="0.45"
                        strokeDasharray="1.2 1.2"
                        strokeOpacity="0.8"
                      />
                      {/* Red circle representing the catch */}
                      <circle
                        cx={item.x}
                        cy={item.y}
                        r="1.4"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="0.35"
                      />
                    </g>
                  );
                } else if (item.runs === "6" || item.runs === "4") {
                  return (
                    <line
                      key={idx}
                      x1="50"
                      y1="43"
                      x2={item.boundaryX}
                      y2={item.boundaryY}
                      stroke={item.colorGroup.dot}
                      strokeWidth="0.55"
                      strokeOpacity="0.75"
                    />
                  );
                } else {
                  return (
                    <line
                      key={idx}
                      x1="50"
                      y1="43"
                      x2={item.x}
                      y2={item.y}
                      stroke={item.colorGroup.dot}
                      strokeWidth="0.35"
                      strokeOpacity="0.75"
                    />
                  );
                }
              })}
            </svg>
          </div>
        </div>

        {/* Right Column: Legend & Stats Overview (Cols 8-12) */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-6">
            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">
                Wagon Wheel Summary
              </h4>
              <p className="text-[11px] text-slate-500 font-semibold mt-1 leading-relaxed">
                Distribution of scoring events and dismissals plotted on the 2D map.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-xs">
                <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Caught Outs</div>
                <div className="text-2xl font-black text-red-500 mt-1">{counts.out}</div>
              </div>
              <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-xs">
                <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Sixes Hit</div>
                <div className="text-2xl font-black text-violet-500 mt-1">{counts.six}</div>
              </div>
              <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-xs">
                <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Fours Hit</div>
                <div className="text-2xl font-black text-blue-500 mt-1">{counts.four}</div>
              </div>
              <div className="bg-white border border-slate-100 rounded-xl p-3.5 shadow-xs">
                <div className="text-[10px] text-gray-400 font-black uppercase tracking-wider">1s, 2s, 3s</div>
                <div className="text-2xl font-black text-teal-500 mt-1">{counts.singles}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
