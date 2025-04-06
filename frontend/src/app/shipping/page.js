'use client';
import { useEffect, useState } from 'react';
import '../globals.css';
import { useRouter } from 'next/navigation';



export default function Result() {
  const [bfsOutput, setBfsOutput] = useState(null);
  const router = useRouter();
  const [parsedResult, setParsedResult] = useState(null);

  useEffect(() => {
    const rawData = localStorage.getItem('geminiResponse');

    if (rawData) {
      try {
        // Step 1: Parse the outer JSON
        const firstParse = JSON.parse(rawData); // Still a string: "```json\n{...}```"

        // Step 2: Remove backticks and "```json"
        const cleaned = firstParse
          .replace(/```json\n?/, '')
          .replace(/```/, '');

        // Step 3: Parse the cleaned string into an object
        const finalObject = JSON.parse(cleaned);

        setParsedResult(finalObject.query1);
        console.log('Parsed Result:', finalObject.query1); // Debugging line
      } catch (error) {
        console.error('Parsing failed:', error);
      }
    }
  }, []);

  const extractTariffRows = () => {
    if (!parsedResult) return [];

    const countries = parsedResult["country of origin"]?.split(',') || [];
    const tariffs = parsedResult["tariff percentage from all three country"]
      ?.split(',')
      .map(str => str.trim()) || [];

    return countries.map((country, index) => ({
      country: country.trim(),
      tariff: tariffs[index] || 'N/A'
    }));
  };

  const runBFS = async () => {
    try {
      const response = await fetch("http://localhost:5050/api/run-bfs", {
        method: "POST",
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log("✅ BFS Result:", data.stdout);
        localStorage.setItem("bfsOutput", data.stdout); // Optional: pass to next page
        router.push("/loading"); // 🔁 Navigate to animation page
      } else {
        const errorData = await response.json();
        console.error("❌ BFS failed:", errorData);
        setBfsOutput("Error: " + (errorData?.stderr || "Unknown error"));
      }
    } catch (error) {
      console.error("❌ Error calling BFS:", error);
      setBfsOutput("Error: " + error.message);

    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-semibold mb-4 text-center">Tariff Breakdown</h2>
      <table className="w-full table-auto border-collapse border border-gray-300 text-center">
        <thead className="bg-gray-200 text-lg">
          <tr>
            <th className="border border-gray-400 px-4 py-2">Country</th>
            <th className="border border-gray-400 px-4 py-2">Tariff (%)</th>
          </tr>
        </thead>
        <tbody>
          {extractTariffRows().map((item, index) => (
            <tr key={index} className="text-lg">
              <td className="border border-gray-400 px-4 py-2">{item.country}</td>
              <td className="border border-gray-400 px-4 py-2">{item.tariff}</td>
            </tr>
          ))}
        </tbody>
      </table>
  
      <div className="flex justify-center mt-8">
        <button
          onClick={runBFS}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold text-lg"
        >
          Run Optimized Route (BFS)
        </button>
      </div>
  
      {bfsOutput && (
        <div className="mt-6 bg-gray-100 border border-black p-4 rounded text-sm whitespace-pre-wrap">
          <strong>BFS Output:</strong>
          <br />
          {bfsOutput}
        </div>
      )}
    </div>
  );
}