'use client';
import { useEffect, useState } from 'react';

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
      <h1>Results</h1>
      {parsedResult ? (
        <div>
          <h2>Food: {parsedResult.food}</h2>
          <h2>Units in kilogram: {parsedResult["units in kilogram"]}</h2>
          <h2>Country of origin: {parsedResult["country of origin"]}</h2>
          <h2>Tariff % from origin: {parsedResult["tariff percentage from country of origin"]}%</h2>
          <h2>Market price/kg (USD): ${parsedResult["market price in origin country per kilogram (USD)"]}</h2>
          <h2>Total import cost (USD): ${parsedResult["total price of importing(USD)"]}</h2>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
