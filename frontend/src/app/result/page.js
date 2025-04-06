'use client';
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

    const handleContinueToShipping = () => {
    if (parsedResult) {
      // Save the JSON data to localStorage (if needed)
      localStorage.setItem('geminiResponse', JSON.stringify(parsedResult));

      // Navigate to the shipping methods page
      router.push('/shipping');
    } else {
      alert('No data available to transmit. Please try again.');
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

    </div>
  );
}
