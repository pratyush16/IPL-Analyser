# 🐍 Python / Flask Backend API

This directory contains the Python REST API server powering the IPL Analyser app.

## 📄 File Overview
- **`app.py`**: Flask server defining API endpoints (`/api/seasons`, `/api/players`, `/api/stats/<name>`, `/api/teams`, `/api/shot-map/<name>`).
- **`data_processor.py`**: High-performance data engine utilizing Pandas and NumPy to aggregate metrics across 19 season CSVs.
- **`teams_squads_2026.json`**: Official 2026 IPL franchise squad rosters.
- **`requirements.txt`**: Package dependencies (`flask`, `flask-cors`, `pandas`, `numpy`).

## 🚀 How to Run Backend
```bash
pip install -r requirements.txt
python app.py
```
Backend will start on `http://127.0.0.1:5000`.
