'use client';
import { useSearchParams } from 'next/navigation';

export default function ResultPage() {
  const searchParams = useSearchParams();
  const rawData = searchParams.get('data');

  if (!rawData) return <div>No data received</div>;

  let parsedData;
  try {
    parsedData = JSON.parse(rawData);
  } catch (err) {
    return <div>Invalid JSON</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Import Tariff Breakdown</h1>
      {Object.entries(parsedData).map(([key, item], idx) => (
        <div key={idx} style={{
          border: '1px dashed #ccc',
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '8px',
          background: '#f9f9f9'
        }}>
          <h2>{item.food}</h2>
          <p>HS Units: {item['units in kilogram']} kg</p>
          <p>From: {item['country of origin']}</p>
          <p>Tariff %: {item['tariff percentage from country of origin']}%</p>
          <p>Market Price: ${item['market price in origin country per kilogram (USD)']} per kg</p>
          <p><strong>Total Import Cost: ${item['total price of importing(USD)']}</strong></p>
        </div>
      ))}
    </div>
  );
}
