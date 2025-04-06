'use client';
import { useEffect, useState } from 'react';

export default function Shipping() {
  const [parsedResult, setParsedResult] = useState(null);

  useEffect(() => {
    // Retrieve the data from localStorage
    const rawData = localStorage.getItem('geminiResponse');
    if (rawData) {
      try {
        const data = JSON.parse(rawData); // Parse the JSON data
        setParsedResult(data); // Set it to state
      } catch (error) {
        console.error('Error parsing data from localStorage:', error);
      }
    }
  }, []);

  return (
    <div>
      <h1>Shipping Methods</h1>
      {parsedResult ? (
        <pre>{JSON.stringify(parsedResult, null, 2)}</pre> // Display the parsed data
      ) : (
        <p>No data available. Please go back and try again.</p>
      )}
    </div>
  );
}