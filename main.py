
import os
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

DISCORD_WEBHOOK_URL = os.environ.get("MUNCHBOT_FEED_WEBHOOK")

def get_xp_tier(xp):
    if xp < 50:
        return "🌱"
    elif xp < 200:
        return "🜨"
    elif xp < 500:
        return "🜨🜨"
    elif xp < 1000:
        return "🧠🜨"
    else:
        return "🌌🜨"

@app.route("/relay_xp", methods=["POST"])
def relay_xp():
    data = request.json
    user_id = data.get("user_id")
    xp_earned = data.get("xp_earned")
    total_xp = data.get("total_xp")

    if not user_id or not isinstance(xp_earned, int) or not isinstance(total_xp, int):
        return jsonify({"error": "Invalid payload"}), 400

    glyph = get_xp_tier(total_xp)
    message = f"{glyph} `{user_id}` gained `{xp_earned} XP` (Total: {total_xp})"

    try:
        requests.post(DISCORD_WEBHOOK_URL, json={"content": message})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"status": "relayed"}), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3001)
