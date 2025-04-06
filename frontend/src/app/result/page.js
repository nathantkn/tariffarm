"use client";
import { useEffect, useState } from 'react';
import '../globals.css';
import { useRouter } from 'next/navigation';
import { Ship } from 'lucide-react';

export default function Result() {
  const [parsedResult, setParsedResult] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const rawData = localStorage.getItem('geminiResponse');
    if (rawData) {
      try {
        const firstParse = JSON.parse(rawData);
        const cleaned = firstParse.replace(/```json\n?/, '').replace(/```/, '');
        const finalObject = JSON.parse(cleaned);
        setParsedResult(finalObject.query1);
      } catch (error) {
        console.error('Parsing failed:', error);
      }
    }
  }, []);

  const runBFS = async () => {
    try {
      const response = await fetch("http://localhost:5050/api/run-bfs", {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ BFS Result:", data.stdout);
        localStorage.setItem("bfsOutput", data.stdout);
        router.push("/loading");
      } else {
        const errorData = await response.json();
        console.error("❌ BFS failed:", errorData);
      }
    } catch (error) {
      console.error("❌ Error calling BFS:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-2xl border border-black p-8 bg-white shadow-xl rounded-lg">
        {parsedResult ? (
          <>
            <h1 className="text-4xl font-extrabold border-b-8 border-black pb-2 mb-4 text-center">Order Facts</h1>

            <div className="mb-4 text-center">
              <p className="text-xl font-semibold">Serving Size: {parsedResult["units in kilogram"]} kg</p>
              <p>Per Shipment</p>
            </div>

            <div className="border-t border-black py-3 flex justify-between font-bold text-lg">
              <span>Produce name</span>
              <span>{parsedResult.food}</span>
            </div>

            <div className="border-t border-black py-3 flex justify-between text-lg">
              <span>Country of origin</span>
              <span>{parsedResult["country of origin"]}</span>
            </div>

            <div className="border-t border-black py-3 flex justify-between text-lg">
              <span>Reciprocal Tariff (as of April 2025)</span>
              <span>{parsedResult["tariff percentage from country of origin"]}%</span>
            </div>

            <div className="border-t border-black py-3 flex justify-between text-lg">
              <span>Market price/kg (USD)</span>
              <span>${parsedResult["market price in origin country per kilogram (USD)"]}</span>
            </div>

            <div className="border-t border-black py-3 flex justify-between font-bold text-xl border-b-8 border-black">
              <span>Total cost before shipping (USD)</span>
              <span>${parsedResult["total price of importing(USD)"]}</span>
            </div>

            <p className="text-sm mt-4 italic text-center">
              Based on current market data. Costs may vary depending on conditions.
            </p>

            <div className="flex justify-center items-center mt-8">
              <button
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200"
                onClick={runBFS}
              >
                Continue to Shipping Methods <Ship size={18} className="inline-block ml-1" />
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-lg font-semibold">Loading...</p>
        )}
      </div>
    </div>
  );
}
