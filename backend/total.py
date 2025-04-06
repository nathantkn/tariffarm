import json
import requests

# Load the results from the BFS JSON file in the bfs_data directory
with open("bfs_data/bfs_results.json", "r") as bfs_file:
    bfs_results = json.load(bfs_file)

# Load the results from the Gemini JSON file in the output directory
try:
    with open("output/gemini_output.json", "r") as gemini_file:
        gemini_results = json.load(gemini_file)
except FileNotFoundError:
    gemini_results = None
    print("Error: Gemini JSON file not found.")
except json.JSONDecodeError as e:
    gemini_results = None
    print(f"Error decoding Gemini JSON file: {e}")

# Ensure both JSON files are loaded
if not bfs_results or not gemini_results:
    print("Error: Missing data from BFS or Gemini JSON files. Cannot proceed with API call.")
    exit()

# Construct the full prompt for the Gemini API
full_prompt = f"""
Below is data regarding agricultural commodities exported to the USA. Calculate the complete transportation cost per unit, including taxes for intermediate countries and transportation mode costs (sea, air, road). Multiply this by the number of units for total expenses. Provide a detailed technical summary, covering total transport duration, extra costs, and the following specifics:

- 📦 Product Cost at Origin  
- FOB Price (Free On Board)  
- Packing/Processing Fees  
- Cold Chain Handling  
- Health and Safety Certification  
- Export Duties  
- Inspection/Quality Testing  
- 🚚 International Transportation Costs  
- 🛃 U.S. Customs and Border Protection (CBP) Charges  
- 🧊 Post-Clearance Costs  
- 📋 Miscellaneous/Operational Costs  

Data:

BFS Results:  
{json.dumps(bfs_results, indent=4)}

Gemini Results:  
{json.dumps(gemini_results, indent=4)}

Include a clear conclusion summarizing total costs and logistics details.
"""

# Gemini API configuration
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
API_KEY = "AIzaSyBi3S6jL-cZPw6YgWHnyZ68jgEKqhMceRs"

headers = {
    "Content-Type": "application/json"
}

payload = {
    "contents": [{
        "parts": [{"text": full_prompt}]
    }]
}

# Make the Gemini API call
response = requests.post(
    f"{GEMINI_URL}?key={API_KEY}",
    headers=headers,
    data=json.dumps(payload)
)

# Handle the API response
if response.status_code == 200:
    gemini_summary = response.json()
    print("=== Gemini API Summary Response ===")
    print(json.dumps(gemini_summary, indent=4))
    # Save the summary to a JSON file
    with open("output/gemini_summary.json", "w") as summary_file:
        json.dump(gemini_summary, summary_file, indent=4)
    print("Gemini summary saved to output/gemini_summary.json")
else:
    print("Error: Gemini API call failed.")
    print("Status Code:", response.status_code)
    print("Response Body:", response.text)