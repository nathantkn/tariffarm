'use client';
import { useEffect, useState } from 'react';

export default function Results() {
  const [geminiResponse, setGeminiResponse] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('geminiResponse');
    if (data) {
      setGeminiResponse(JSON.parse(data));
    }
  }, []);


  const { food, "units in kilogram": units, "country of origin": country, "tariff percentage from country of origin": tariff, "market price in origin country per kilogram (USD)": pricePerKg, "total price of importing(USD)": totalPrice } = geminiResponse.query1;

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Shipping Order Ticket</h1>
      <div style={styles.ticket}>
        <p><strong>Food:</strong> {food}</p>
        <p><strong>Units (kg):</strong> {units}</p>
        <p><strong>Country of Origin:</strong> {country}</p>
        <p><strong>Tariff Percentage:</strong> {tariff}%</p>
        <p><strong>Market Price per kg (USD):</strong> ${pricePerKg.toFixed(2)}</p>
        <p><strong>Total Importing Price (USD):</strong> ${totalPrice.toFixed(2)}</p>
      </div>
    </div>
  );
}