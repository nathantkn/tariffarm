'use client';
import { useEffect, useState } from 'react';
import '../globals.css';
import { useRouter } from 'next/navigation';
import { Ship } from 'lucide-react';


// export default function Result() {
//   const [parsedResult, setParsedResult] = useState(null);
//   const router = useRouter();


export default function Result() {
  const [parsedResult, setParsedResult] = useState(null);
  const [bfsOutput, setBfsOutput] = useState(null);
  const router = useRouter();

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
        const firstParse = JSON.parse(rawData);
        const cleaned = firstParse.replace(/```json\n?/, '').replace(/```/, '');

        const finalObject = JSON.parse(cleaned);
        setParsedResult(finalObject.query1);
      } catch (error) {
        console.error('Parsing failed:', error);
      }
    }
  }, []);


    const handleContinueToShipping = () => {
    if (parsedResult) {
      // Save the JSON data to localStorage (if needed)
      localStorage.setItem('geminiResponse', JSON.stringify(parsedResult));

      // Navigate to the shipping methods page
      router.push('/shipping');
    } else {
      alert('No data available to transmit. Please try again.');

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
    <div>

      <div>
        {parsedResult ? (

          // <div>
          //   <h2>Food: {parsedResult.food}</h2>
          //   <h2>Units in kilogram: {parsedResult["units in kilogram"]}</h2>
          //   <h2>Country of origin: {parsedResult["country of origin"]}</h2>
          //   <h2>Tariff % from origin: {parsedResult["tariff percentage from country of origin"]}%</h2>
          //   <h2>Market price/kg (USD): ${parsedResult["market price in origin country per kilogram (USD)"]}</h2>
          //   <h2>Total import cost (USD): ${parsedResult["total price of importing(USD)"]}</h2>
          // </div>

          <div className="w-full max-w-md border border-black p-4 bg-white shadow-md middle mx-auto mt-10 rounded-lg">
            <h1 className="text-3xl font-extrabold border-b-8 border-black pb-1 mb-2">Order Facts</h1>

            <div className="mb-2">
              <p>Serving Size (In Kilograms): {parsedResult["units in kilogram"]}</p>
              <p>Per Shipment</p>
            </div>

            <div className="border-t border-black py-2 flex justify-between font-bold">
              <span>Produce name</span>
              <span>{parsedResult.food}</span>
            </div>


            <div className="border-t border-black py-2 flex justify-between">
              <span>Country of origin</span>
              <span>{parsedResult["country of origin"]}</span>
            </div>

            <div className="border-t border-black py-2 flex justify-between">
              <span>Reciprocal Tariff (as of April 2025) %</span>
              <span>{parsedResult["tariff percentage from country of origin"]}%</span>
            </div>

            <div className="border-t border-black py-2 flex justify-between">
              <span>Market price/kg (USD)</span>
              <span>${parsedResult["market price in origin country per kilogram (USD)"]}</span>
            </div>

            <div className="border-t border-black py-2 flex justify-between font-bold border-b-8 border-black">
              <span>Total cost before shipping (USD)</span>
              <span>${parsedResult["total price of importing(USD)"]}</span>
            </div>

            <p className="text-xs mt-2 italic text-center">
              Based on current market data. Costs may vary depending on conditions.
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div className="text-center mt-4">
        <button
          className="bg-green-400 text-white px-4 py-2 rounded hover:bg-green-600"
          onClick={() => handleContinueToShipping()}>
          Continue to Shipping Methods <Ship size={16} className="inline-block ml-1" />
        </button>
      </div>

    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white border-2 border-black shadow-xl p-8 rounded-md w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 tracking-wide">Import Calculation Results</h1>

        {parsedResult ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white border border-black shadow text-lg font-medium">
                <strong>Food:</strong> {parsedResult.food}
              </div>
              <div className="p-4 bg-white border border-black shadow text-lg font-medium">
                <strong>Units:</strong> {parsedResult["units in kilogram"]} kg
              </div>
              <div className="p-4 bg-white border border-black shadow text-lg font-medium">
                <strong>Market price/kg (USD):</strong> ${parsedResult["market price in origin country per kilogram (USD)"]}
              </div>
              <div className="p-4 bg-white border border-black shadow text-lg font-medium">
                <strong>Total import cost (USD):</strong> ${parsedResult["total price of importing(USD)"]}
              </div>
            </div>

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
          </>
        ) : (
          <p className="text-center text-lg font-medium">Loading...</p>
        )}
      </div>
    </div>
  );
}
