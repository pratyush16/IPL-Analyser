"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardView from "../components/views/DashboardView";
import PlayersView from "../components/views/PlayersView";
import PlayerDetailView from "../components/views/PlayerDetailView";
import TeamsView from "../components/views/TeamsView";
import SquadModal from "../components/modals/SquadModal";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ipl-analyser-w6ao.onrender.com/api";

const DISPLAY_MAP = {
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
  "F du Plessis": "Faf du Plessis",
};

const getDisplayName = (shortName) => DISPLAY_MAP[shortName] || shortName;

const formatSeasonDisplay = (name) => {
  if (name === "All Seasons") return name;
  return `IPL ${name}`;
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [seasonsList, setSeasonsList] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState("All Seasons");
  const [playersList, setPlayersList] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerStats, setPlayerStats] = useState(null);
  const [playerMatches, setPlayerMatches] = useState([]);
  const [phaseStats, setPhaseStats] = useState({});
  const [bowlerStats, setBowlerStats] = useState({});
  const [oversStats, setOversStats] = useState([]);
  const [shotMapData, setShotMapData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Teams & Squads states
  const [teamsList, setTeamsList] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [squadList, setSquadList] = useState([]);
  const [squadModalOpen, setSquadModalOpen] = useState(false);
  const [squadSearchQuery, setSquadSearchQuery] = useState("");
  const [teamsLoading, setTeamsLoading] = useState(false);

  const [playerDropdownOpen, setPlayerDropdownOpen] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);

  const playerDropdownRef = useRef(null);
  const seasonDropdownRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (playerDropdownRef.current && !playerDropdownRef.current.contains(event.target)) {
        setPlayerDropdownOpen(false);
      }
      if (seasonDropdownRef.current && !seasonDropdownRef.current.contains(event.target)) {
        setSeasonDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 1. Fetch seasons and teams on mount with AbortController
  useEffect(() => {
    const controller = new AbortController();
    async function fetchSeasonsAndTeams() {
      setTeamsLoading(true);
      try {
        const [seasonsRes, teamsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/seasons`, { signal: controller.signal }),
          fetch(`${API_BASE_URL}/teams`, { signal: controller.signal }),
        ]);

        if (!seasonsRes.ok) throw new Error("Failed to load seasons");
        const seasonsData = await seasonsRes.json();
        setSeasonsList(seasonsData);

        if (teamsRes.ok) {
          const teamsData = await teamsRes.json();
          setTeamsList(teamsData);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Could not connect to Flask backend. Please make sure the backend is running.");
        }
      } finally {
        setTeamsLoading(false);
      }
    }
    fetchSeasonsAndTeams();
    return () => controller.abort();
  }, []);

  const handleViewSquad = useCallback(async (team) => {
    setSelectedTeam(team);
    setSquadSearchQuery("");
    setSquadModalOpen(true);
    try {
      const res = await fetch(`${API_BASE_URL}/teams/${team.code}/squad`);
      if (!res.ok) throw new Error("Failed to load squad");
      const data = await res.json();
      setSquadList(data);
    } catch (err) {
      console.error(err);
      setSquadList([]);
    }
  }, []);

  // 2. Fetch top players list whenever season changes (with AbortController)
  useEffect(() => {
    const controller = new AbortController();
    async function fetchPlayers() {
      try {
        const seasonParam = encodeURIComponent(selectedSeason);
        const res = await fetch(`${API_BASE_URL}/players?season=${seasonParam}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to load players");
        const data = await res.json();
        setPlayersList(data);

        // Keep current selected player if they exist in the new list
        if (data.length > 0 && selectedPlayer !== null) {
          const exists = data.some((p) => p.name === selectedPlayer);
          if (!exists) {
            setSelectedPlayer(null);
          }
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Error loading players list.");
        }
      }
    }
    fetchPlayers();
    return () => controller.abort();
  }, [selectedSeason]);

  // 3. Fetch active player details when player OR season changes (with AbortController)
  useEffect(() => {
    if (!selectedPlayer) return;

    const controller = new AbortController();

    async function fetchPlayerData() {
      setLoading(true);
      try {
        const nameEncoded = encodeURIComponent(selectedPlayer);
        const seasonParam = encodeURIComponent(selectedSeason);

        const fetchOptions = { cache: "no-store", signal: controller.signal };

        const [statsRes, matchesRes, phaseRes, bowlerRes, oversRes, shotMapRes] = await Promise.all([
          fetch(`${API_BASE_URL}/stats/${nameEncoded}?season=${seasonParam}`, fetchOptions),
          fetch(`${API_BASE_URL}/matches/${nameEncoded}?season=${seasonParam}`, fetchOptions),
          fetch(`${API_BASE_URL}/phase-stats/${nameEncoded}?season=${seasonParam}`, fetchOptions),
          fetch(`${API_BASE_URL}/bowler-stats/${nameEncoded}?season=${seasonParam}`, fetchOptions),
          fetch(`${API_BASE_URL}/overs-stats/${nameEncoded}?season=${seasonParam}`, fetchOptions),
          selectedSeason === "2026"
            ? fetch(`${API_BASE_URL}/shot-map/${nameEncoded}?season=${seasonParam}`, fetchOptions)
            : Promise.resolve({ ok: true, json: async () => [] }),
        ]);

        if (!statsRes.ok || !matchesRes.ok || !phaseRes.ok || !bowlerRes.ok || !oversRes.ok || !shotMapRes.ok) {
          throw new Error("Failed to load player details");
        }

        const statsData = await statsRes.json();
        const matchesData = await matchesRes.json();
        const phaseData = await phaseRes.json();
        const bowlerData = await bowlerRes.json();
        const oversData = await oversRes.json();
        const shotMapDataResult = await shotMapRes.json();

        setPlayerStats(statsData);
        setPlayerMatches(matchesData);
        setPhaseStats(phaseData);
        setBowlerStats(bowlerData);
        setOversStats(oversData);
        setShotMapData(shotMapDataResult);
        setError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError("Error loading cricketer details.");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPlayerData();
    return () => controller.abort();
  }, [selectedPlayer, selectedSeason]);

  const renderComingSoon = () => (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white border border-gray-100 rounded-3xl shadow-sm max-w-xl mx-auto space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
        <svg className="h-8 w-8 animate-[pulse_2s_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-gray-900">{activeTab} Section</h3>
        <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
          This module is currently in development and will be released in the next major update. Stay tuned for advanced AI predictions and live matches!
        </p>
      </div>
      <button
        onClick={() => setActiveTab("Dashboard")}
        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
      >
        Return to Dashboard
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <Header
          allPlayers={playersList}
          onSelectPlayer={(name) => {
            setSelectedPlayer(name);
            setActiveTab("Players");
          }}
          activePlayerName={selectedPlayer}
        />

        {/* Dashboard Content Body */}
        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {activeTab === "Dashboard" && (
            <DashboardView
              seasonsList={seasonsList}
              playersList={playersList}
              onSelectPlayer={(name) => {
                setSelectedPlayer(name);
                setSelectedSeason("All Seasons");
                setActiveTab("Players");
              }}
              onViewAllPlayers={() => {
                setSelectedSeason("All Seasons");
                setActiveTab("Players");
              }}
              getDisplayName={getDisplayName}
            />
          )}

          {activeTab === "Players" && !selectedPlayer && (
            <PlayersView
              playersList={playersList}
              seasonsList={seasonsList}
              selectedSeason={selectedSeason}
              setSelectedSeason={setSelectedSeason}
              onSelectPlayer={setSelectedPlayer}
              getDisplayName={getDisplayName}
              formatSeasonDisplay={formatSeasonDisplay}
              seasonDropdownRef={seasonDropdownRef}
              seasonDropdownOpen={seasonDropdownOpen}
              setSeasonDropdownOpen={setSeasonDropdownOpen}
            />
          )}

          {activeTab === "Players" && selectedPlayer && (
            <PlayerDetailView
              selectedPlayer={selectedPlayer}
              setSelectedPlayer={setSelectedPlayer}
              selectedSeason={selectedSeason}
              setSelectedSeason={setSelectedSeason}
              seasonsList={seasonsList}
              playersList={playersList}
              playerStats={playerStats}
              playerMatches={playerMatches}
              phaseStats={phaseStats}
              bowlerStats={bowlerStats}
              oversStats={oversStats}
              shotMapData={shotMapData}
              loading={loading}
              getDisplayName={getDisplayName}
              formatSeasonDisplay={formatSeasonDisplay}
              playerDropdownRef={playerDropdownRef}
              seasonDropdownRef={seasonDropdownRef}
              playerDropdownOpen={playerDropdownOpen}
              setPlayerDropdownOpen={setPlayerDropdownOpen}
              seasonDropdownOpen={seasonDropdownOpen}
              setSeasonDropdownOpen={setSeasonDropdownOpen}
            />
          )}

          {activeTab === "Teams" && (
            <TeamsView
              teamsList={teamsList}
              teamsLoading={teamsLoading}
              onViewSquad={handleViewSquad}
            />
          )}

          {activeTab !== "Dashboard" && activeTab !== "Players" && activeTab !== "Teams" && renderComingSoon()}
        </main>
      </div>

      {/* Squad Viewer Modal */}
      <SquadModal
        selectedTeam={selectedTeam}
        squadList={squadList}
        squadSearchQuery={squadSearchQuery}
        setSquadSearchQuery={setSquadSearchQuery}
        onClose={() => {
          setSquadModalOpen(false);
          setSelectedTeam(null);
          setSquadList([]);
        }}
        onSelectPlayer={(dbName) => {
          setSelectedPlayer(dbName);
          setSelectedSeason("2026");
          setActiveTab("Players");
          setSquadModalOpen(false);
          setSelectedTeam(null);
          setSquadList([]);
        }}
      />
    </div>
  );
}
