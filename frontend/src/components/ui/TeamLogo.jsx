"use client";

import React, { useState } from "react";

export default function TeamLogo({ theme, code, className = "h-14 w-14" }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`${className} rounded-2xl flex items-center justify-center font-black text-lg overflow-hidden p-1.5 transition-transform duration-300`}
      style={{
        backgroundColor: imgError || !theme?.logoUrl ? theme?.primary || "#6b7280" : "#ffffff",
        borderColor: theme?.secondary || "#374151",
        borderWidth: imgError || !theme?.logoUrl ? "0px" : "1.5px",
        boxShadow: `0 4px 14px ${theme?.shadow || "rgba(0,0,0,0.1)"}`,
      }}
    >
      {theme?.logoUrl && !imgError ? (
        <img
          src={theme.logoUrl}
          alt={code}
          className="h-full w-full object-contain"
          onError={() => setImgError(true)}
        />
      ) : (
        <span
          style={{
            color: theme?.textDark ? "#1e293b" : "#ffffff",
          }}
        >
          {code}
        </span>
      )}
    </div>
  );
}
