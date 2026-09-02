"use client";

import React, { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

export default function Header({ allPlayers = [], onSelectPlayer, activePlayerName }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayMap = {
    "V Kohli": "Virat Kohli",
    "RG Sharma": "Rohit Sharma",
    "MS Dhoni": "MS Dhoni",
    "S Dhawan": "Shikhar Dhawan",
    "DA Warner": "David Warner",
    "SK Raina": "Suresh Raina",
    "KL Rahul": "KL Rahul",
    "AM Rahane": "Ajinkya Rahane",
    "AB de Villiers": "AB de Villiers",
    "CH Gayle": "Chris Gayle",
    "SV Samson": "Sanju Samson",
    "JC Buttler": "Jos Buttler",
    "RV Uthappa": "Robin Uthappa",
    "KD Karthik": "Dinesh Karthik",
    "Faf du Plessis": "Faf du Plessis",
  };

  const getDisplayName = (shortName) => displayMap[shortName] || shortName;

  // Filter players based on search query
  const filteredPlayers = searchQuery.trim() === "" 
    ? [] 
    : allPlayers.filter(p => {
        const fullName = getDisplayName(p.name).toLowerCase();
        const shortName = p.name.toLowerCase();
        const query = searchQuery.toLowerCase();
        return fullName.includes(query) || shortName.includes(query);
      }).slice(0, 5);

  const handleSelect = (playerName) => {
    onSelectPlayer(playerName);
    setSearchQuery("");
    setShowDropdown(false);
  };

  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-6 px-8 bg-white border-b border-gray-100 flex-shrink-0">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Player Performance Analysis
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track and analyze cricketer statistics and performance
        </p>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4 self-end md:self-auto">
        {/* Search Bar */}
        <div ref={dropdownRef} className="relative w-64 md:w-80">
          <div className="relative">
            <input
              type="text"
              placeholder="Search cricketer (e.g. Virat Kohli)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full bg-gray-50/70 border border-gray-150 rounded-xl py-2.5 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all"
            />
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
          </div>

          {/* Search Dropdown */}
          {showDropdown && filteredPlayers.length > 0 && (
            <div className="absolute right-0 top-full mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg shadow-gray-100/50 z-50 overflow-hidden py-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 border-b border-gray-50">
                Matches Found
              </div>
              {filteredPlayers.map((player) => (
                <button
                  key={player.name}
                  onClick={() => handleSelect(player.name)}
                  className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-800 flex items-center justify-between transition-colors"
                >
                  <span className="font-medium">{getDisplayName(player.name)}</span>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {player.runs.toLocaleString()} runs
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
