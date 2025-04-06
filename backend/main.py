from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

API_KEY = "AIzaSyBi3S6jL-cZPw6YgWHnyZ68jgEKqhMceRs"
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

@app.route('/api/gemini', methods=['POST'])
def call_gemini_api():
    print("🚀 Flask: /api/gemini route was called!")

    try:
        data = request.get_json()
        user_query = data.get('query', '')

        if not user_query:
            return jsonify({'error': 'Query is required'}), 400

        # Example static tariff data (replace with dynamic logic later if needed)
        tariff_data = {
            "India": 10.5,
            "Mexico": 5.2,
            "Brazil": 12.8
        }

        # Construct the full prompt
        full_prompt = f"""
Based on the following input: "{user_query}", calculate the total price for importing goods following reciprocal tariffs.
Use the following tariff data for accurate calculations:
{json.dumps(tariff_data, indent=4)}
Use this JSON schema for the output:
{{
    "query1": {{
        "food": str,
        "units in kilogram": int,
        "country of origin": str,
        "tariff percentage from country of origin": float,
        "market price in origin country per kilogram (USD)": float,
        "total price of importing(USD)": float
    }}
}}
The total price is calculated as:
(market price per kilogram * units in kilogram) + (tariff percentage * market price per unit * units / 100).
Return the result in JSON format.
"""

        headers = {
            "Content-Type": "application/json"
        }

        payload = {
            "contents": [{
                "parts": [{"text": full_prompt}]
            }]
        }

        response = requests.post(
            f"{GEMINI_URL}?key={API_KEY}",
            headers=headers,
            data=json.dumps(payload)
        )

        print("=== Gemini API Response ===")
        print("Status:", response.status_code)
        print("Body:", response.text)
        print("===========================")

        if response.status_code == 200:
            output = response.json()
            final_text = output['candidates'][0]['content']['parts'][0]['text']
            return jsonify({'result': final_text})
        else:
            return jsonify({
                'error': 'Gemini API failed',
                'status': response.status_code,
                'body': response.text
            }), response.status_code

    except Exception as e:
        import traceback
        print("SERVER ERROR:", str(e))
        traceback.print_exc()
        return jsonify({'error': 'Server exception', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5050, host='0.0.0.0')


