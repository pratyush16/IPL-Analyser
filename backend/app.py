from flask import Flask, jsonify, request
from flask_cors import CORS
from data_processor import DataProcessor, FULL_TO_SHORT
import os
import json

# Trigger reload


app = Flask(__name__)
CORS(app)

base_dir = os.path.dirname(os.path.abspath(__file__))
# Target the 'dataset' directory in root
dataset_dir = os.path.abspath(os.path.join(base_dir, '..', 'dataset'))

processor = DataProcessor(dataset_dir)

# NEW: Route to fetch list of available seasons
@app.route('/api/seasons', methods=['GET'])
def get_seasons():
    try:
        seasons = processor.get_seasons()
        return jsonify(seasons)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/players', methods=['GET'])
def get_players():
    try:
        season = request.args.get('season', 'All Seasons')
        players = processor.get_top_players(season=season)
        return jsonify(players)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/stats/<player_name>', methods=['GET'])
def get_stats(player_name):
    try:
        player_name = FULL_TO_SHORT.get(player_name, player_name)
        season = request.args.get('season', 'All Seasons')
        stats = processor.get_player_stats(player_name, season=season)
        if not stats:
            return jsonify({"error": f"Player '{player_name}' not found in season '{season}'"}), 404
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/matches/<player_name>', methods=['GET'])
def get_matches(player_name):
    try:
        player_name = FULL_TO_SHORT.get(player_name, player_name)
        season = request.args.get('season', 'All Seasons')
        matches = processor.get_recent_matches(player_name, season=season)
        return jsonify(matches)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/phase-stats/<player_name>', methods=['GET'])
def get_phase_stats(player_name):
    try:
        player_name = FULL_TO_SHORT.get(player_name, player_name)
        season = request.args.get('season', 'All Seasons')
        phase_stats = processor.get_player_phase_stats(player_name, season=season)
        return jsonify(phase_stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/bowler-stats/<player_name>', methods=['GET'])
def get_bowler_stats(player_name):
    try:
        player_name = FULL_TO_SHORT.get(player_name, player_name)
        season = request.args.get('season', 'All Seasons')
        bowler_stats = processor.get_player_bowler_stats(player_name, season=season)
        return jsonify(bowler_stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/overs-stats/<player_name>', methods=['GET'])
def get_overs_stats(player_name):
    try:
        player_name = FULL_TO_SHORT.get(player_name, player_name)
        season = request.args.get('season', 'All Seasons')
        overs_stats = processor.get_player_overs_stats(player_name, season=season)
        return jsonify(overs_stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/shot-map/<player_name>', methods=['GET'])
def get_shot_map(player_name):
    try:
        player_name = FULL_TO_SHORT.get(player_name, player_name)
        season = request.args.get('season', 'All Seasons')
        shot_map_data = processor.get_player_shot_map(player_name, season=season)
        return jsonify(shot_map_data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Load teams squads data
teams_squads_path = os.path.join(base_dir, 'teams_squads_2026.json')
teams_squads = {}
if os.path.exists(teams_squads_path):
    try:
        with open(teams_squads_path, 'r', encoding='utf-8') as f:
            teams_squads = json.load(f)
    except Exception as e:
        print(f"Error loading teams squads: {e}")

TEAM_METADATA = {
    "CSK": {"name": "Chennai Super Kings", "gradient": "from-yellow-400 to-amber-500", "textColor": "text-yellow-950", "shadowColor": "shadow-yellow-500/10", "bgGradient": "from-yellow-400/10 to-amber-500/10", "borderColor": "border-yellow-200/50", "primaryColor": "#eab308", "secondaryColor": "#1d4ed8"},
    "DC": {"name": "Delhi Capitals", "gradient": "from-blue-600 via-indigo-600 to-red-500", "textColor": "text-blue-950", "shadowColor": "shadow-blue-500/10", "bgGradient": "from-blue-600/10 to-red-500/10", "borderColor": "border-blue-200/50", "primaryColor": "#2563eb", "secondaryColor": "#ef4444"},
    "GT": {"name": "Gujarat Titans", "gradient": "from-slate-700 to-slate-900", "textColor": "text-slate-950", "shadowColor": "shadow-slate-500/10", "bgGradient": "from-slate-700/10 to-slate-900/10", "borderColor": "border-slate-200/50", "primaryColor": "#1e293b", "secondaryColor": "#d4af37"},
    "KKR": {"name": "Kolkata Knight Riders", "gradient": "from-purple-700 to-amber-500", "textColor": "text-purple-950", "shadowColor": "shadow-purple-500/10", "bgGradient": "from-purple-700/10 to-amber-500/10", "borderColor": "border-purple-200/50", "primaryColor": "#7e22ce", "secondaryColor": "#f59e0b"},
    "LSG": {"name": "Lucknow Super Giants", "gradient": "from-blue-900 to-red-600", "textColor": "text-blue-950", "shadowColor": "shadow-blue-900/10", "bgGradient": "from-blue-900/10 to-red-600/10", "borderColor": "border-blue-200/50", "primaryColor": "#1e3a8a", "secondaryColor": "#dc2626"},
    "MI": {"name": "Mumbai Indians", "gradient": "from-blue-600 to-amber-400", "textColor": "text-blue-900", "shadowColor": "shadow-blue-600/10", "bgGradient": "from-blue-600/10 to-amber-400/10", "borderColor": "border-blue-200/50", "primaryColor": "#2563eb", "secondaryColor": "#f59e0b"},
    "PBKS": {"name": "Punjab Kings", "gradient": "from-red-600 to-gray-400", "textColor": "text-red-950", "shadowColor": "shadow-red-500/10", "bgGradient": "from-red-600/10 to-gray-400/10", "borderColor": "border-red-200/50", "primaryColor": "#dc2626", "secondaryColor": "#9ca3af"},
    "RCB": {"name": "Royal Challengers Bengaluru", "gradient": "from-red-600 via-stone-800 to-yellow-600", "textColor": "text-red-950", "shadowColor": "shadow-red-600/10", "bgGradient": "from-red-600/10 via-stone-800/10 to-yellow-600/10", "borderColor": "border-red-200/50", "primaryColor": "#dc2626", "secondaryColor": "#111111"},
    "RR": {"name": "Rajasthan Royals", "gradient": "from-pink-500 to-blue-600", "textColor": "text-pink-950", "shadowColor": "shadow-pink-500/10", "bgGradient": "from-pink-500/10 to-blue-600/10", "borderColor": "border-pink-200/50", "primaryColor": "#ec4899", "secondaryColor": "#2563eb"},
    "SRH": {"name": "Sunrisers Hyderabad", "gradient": "from-orange-500 to-stone-900", "textColor": "text-orange-950", "shadowColor": "shadow-orange-500/10", "bgGradient": "from-orange-500/10 to-stone-900/10", "borderColor": "border-orange-200/50", "primaryColor": "#f97316", "secondaryColor": "#111111"}
}

@app.route('/api/teams', methods=['GET'])
def get_teams():
    try:
        result = []
        for team_code in sorted(teams_squads.keys()):
            metadata = TEAM_METADATA.get(team_code, {
                "name": team_code,
                "gradient": "from-gray-500 to-gray-700",
                "textColor": "text-gray-950",
                "shadowColor": "shadow-gray-500/10",
                "bgGradient": "from-gray-500/10 to-gray-700/10",
                "borderColor": "border-gray-200/50",
                "primaryColor": "#6b7280",
                "secondaryColor": "#374151"
            })
            result.append({
                "code": team_code,
                "name": metadata["name"],
                "gradient": metadata["gradient"],
                "textColor": metadata["textColor"],
                "shadowColor": metadata["shadowColor"],
                "bgGradient": metadata["bgGradient"],
                "borderColor": metadata["borderColor"],
                "primaryColor": metadata["primaryColor"],
                "secondaryColor": metadata["secondaryColor"],
                "squadSize": len(teams_squads[team_code])
            })
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/teams/<team_code>/squad', methods=['GET'])
def get_team_squad(team_code):
    try:
        if team_code not in teams_squads:
            return jsonify({"error": f"Team '{team_code}' not found"}), 404
        squad = []
        for player_raw in teams_squads[team_code]:
            db_name = FULL_TO_SHORT.get(player_raw, player_raw)
            squad.append({
                "displayName": player_raw,
                "dbName": db_name
            })
        return jsonify(squad)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
