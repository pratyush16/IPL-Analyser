# 🏏 IPL Analyser — Full-Stack Cricket Analytics App

An in-depth cricket analytics and performance dashboard built with **Next.js 16**, **React**, and a **Python / Flask** REST API, tracking ball-by-ball datasets across 19 IPL seasons (2007–2026).

---

## 📁 Repository Directory Structure & Purpose

Below is the complete guide explaining what each folder and file in this repository is used for:

### 1. 📁 `frontend/` (Next.js User Interface)
* **Purpose**: Contains the web application user interface built with Next.js 16, React, and Tailwind CSS.
* **Key Components**:
  * `src/app/page.js`: Main dashboard page orchestrating active views and filters.
  * `src/components/views/`: Sub-views for **Dashboard**, **Player Catalog**, **Player Detailed Analytics**, and **Teams**.
  * `src/components/ui/`: UI elements like `TeamLogo.jsx` with fallback image handling.
  * `src/components/modals/`: Interactive squad roster modal (`SquadModal.jsx`).
  * `src/components/`: Charts (`OversChart`, `DismissalsPieChart`), `CricketFieldMap`, `StatsGrid`, `DashboardInsights`, `RecentMatches`.

---

### 2. 📁 `backend/` (Python / Flask REST API)
* **Purpose**: Serves all statistics calculations and dataset endpoints for the frontend.
* **Key Files**:
  * `app.py`: Flask web server routing REST API endpoints (`/api/seasons`, `/api/players`, `/api/stats`, `/api/teams`).
  * `data_processor.py`: Core Pandas & NumPy data engine that processes 19 seasons of raw CSV data.
  * `teams_squads_2026.json`: Roster JSON data for all 10 IPL franchises in the 2026 season.
  * `requirements.txt`: Python package dependencies (`flask`, `flask-cors`, `pandas`, `numpy`).

---

### 3. 📁 `dataset/` (Historical IPL Ball-by-Ball Data)
* **Purpose**: Holds 19 historical IPL season datasets in CSV format.
* **Coverage**: Every IPL season from **2007-08 to 2026** (over 110 MB of match data).
* **Data Fields**: Runs scored, wickets taken, extras, overs, match dates, phase of play, and player matchups.

---

### 4. ⚙️ Root Configuration & Launcher Files
* **`run.bat`**: One-click batch script for Windows to launch both Flask backend (port 5000) and Next.js frontend (port 3000) simultaneously.
* **`netlify.toml`**: Automatic configuration file for deploying the Next.js frontend to Netlify.
* **`Cricket_App_Documentation.pdf`**: Official PDF reference manual detailing app architecture and features.
* **`.gitignore`**: Defines rules to exclude local dependencies (`node_modules/`, `.venv/`, `.next/`, `cricbuzz scraping/`) from Git.

---

## 🚀 How to Run the App Locally

### Method A: One-Click Launcher (Windows)
Double-click `run.bat` in the root folder.

### Method B: Manual Startup

1. **Start Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python app.py
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. Open **[http://localhost:3000](http://localhost:3000)** in your web browser.
