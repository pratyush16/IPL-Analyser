"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Menu
} from "lucide-react";

export default function Sidebar({ activeTab, setActiveTab }) {
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Players", icon: Users },
    { name: "Teams", icon: TrendingUp },
  ];

  return (
    <>
      {/* Mobile Menu Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-gray-100 shadow-md md:hidden hover:bg-gray-50 transition-colors"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-100 flex flex-col z-40 transition-all duration-300 ${isOpen ? "w-64" : "w-0 md:w-20"
          } overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            {/* Custom Cricket Ball Icon/Logo */}
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-200">
              I
            </div>
            <span className={`font-bold text-xl text-gray-900 tracking-tight transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 md:hidden"}`}>
              IPL Analyzer
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;
            return (
              <a
                key={idx}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab(item.name);
                }}
                className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 ${isActive
                  ? "bg-blue-50/70 text-blue-600 border-l-4 border-blue-600 pl-3"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-700"}`} />
                <span className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 md:hidden"}`}>
                  {item.name}
                </span>
              </a>
            );
          })}
        </nav>

      </aside>

      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/10 z-30 md:hidden"
        />
      )}
    </>
  );
}
