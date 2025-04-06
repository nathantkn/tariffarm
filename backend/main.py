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

        headers = {
            "Content-Type": "application/json"
        }

        payload = {
            "contents": [{
                "parts": [{"text": user_query}]
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
        traceback.print_exc()  # Prints full error in your terminal
        return jsonify({'error': 'Server exception', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5050, host='0.0.0.0')


