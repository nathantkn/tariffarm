'use client';
import { useEffect, useState } from 'react';
import '../globals.css';

export default function Result() {
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
      } catch (error) {
        console.error('Parsing failed:', error);
      }
    }
  }, []);

  return (
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

<div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
  <div className="bg-white border-2 border-black shadow-xl p-6 rounded-md w-full max-w-4xl">
    <h1 className="text-4xl font-bold text-center mb-6 tracking-wide">Results</h1>
    {parsedResult ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-white border border-black shadow-md text-center text-xl font-semibold">
          Food: {parsedResult.food}
        </div>
        <div className="p-4 bg-white border border-black shadow-md text-center text-xl font-semibold">
          Units in kilogram: {parsedResult["units in kilogram"]}
        </div>
        <div className="p-4 bg-white border border-black shadow-md text-center text-xl font-semibold">
          Country of origin: {parsedResult["country of origin"]}
        </div>
        <div className="p-4 bg-white border border-black shadow-md text-center text-xl font-semibold">
          Tariff % from origin: {parsedResult["tariff percentage from country of origin"]}%
        </div>
        <div className="p-4 bg-white border border-black shadow-md text-center text-xl font-semibold">
          Market price/kg (USD): ${parsedResult["market price in origin country per kilogram (USD)"]}
        </div>
        <div className="p-4 bg-white border border-black shadow-md text-center text-xl font-semibold">
          Total import cost (USD): ${parsedResult["total price of importing(USD)"]}
        </div>
      </div>
    ) : (
      <p className="text-center text-lg font-medium">Loading...</p>
    )}
  </div>
</div>




      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
