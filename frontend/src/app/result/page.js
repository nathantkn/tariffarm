import { useEffect, useState } from 'react';

export default function Results() {
  const [geminiResponse, setGeminiResponse] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('geminiResponse');
    if (data) {
      setGeminiResponse(JSON.parse(data));
    }
  }, []);

  if (!geminiResponse || !geminiResponse.query1) {
    return <div>Loading or no data available...</div>;
  }

  const { food, "units in kilogram": units, "country of origin": country, "tariff percentage from country of origin": tariff, "market price in origin country per kilogram (USD)": pricePerKg, "total price of importing(USD)": totalPrice } = geminiResponse.query1;

  return (
    <div>
      <h1>Results</h1>
      <h1>Food: {food}</h1>
      <h1>Units (kg): {units}</h1>
      <h1>Country of Origin: {country}</h1>
      <h1>Tariff Percentage: {tariff}%</h1>
      <h1>Market Price per kg (USD): ${pricePerKg.toFixed(2)}</h1>
      <h1>Total Importing Price (USD): ${totalPrice.toFixed(2)}</h1>
    </div>
  );
}